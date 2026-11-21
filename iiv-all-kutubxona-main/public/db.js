// Слой работы с базой данных (Supabase / PostgreSQL).
const DB=(()=>{
// Адрес берём без пути, слэшей и пробелов: https://xxxx.supabase.co (лишнее вроде /rest/v1 вызывает ошибку PGRST125)
const clean=u=>{u=String(u||'').trim();try{return new URL(u).origin}catch(x){return u}};
const url=clean(window.SUPABASE_URL),key=String(window.SUPABASE_KEY||'').trim(),domain=window.AUTH_DOMAIN||'gmail.com';
if(!(window.supabase&&url&&key&&!/YOUR[-_]/i.test(url+key)))return{ok:false};
const mk=(o)=>supabase.createClient(url,key,{auth:{detectSessionInUrl:false,...o}});
const sb=mk({persistSession:true,autoRefreshToken:true,storageKey:'iiv-library-auth'});
const email=u=>String(u).trim().toLowerCase()+'@'+domain;
const ok=r=>{if(r.error)throw r.error;return r.data};
const covers=()=>sb.storage.from('library-covers'),files=()=>sb.storage.from('library-files');
const BUILTIN=['fiction','textbooks','foreign'];

// Загружает все строки таблицы (PostgREST отдаёт максимум 1000 за запрос)
async function all(table,order='id'){let out=[],from=0;for(;;){const d=ok(await sb.from(table).select('*').order(order).range(from,from+999));out=out.concat(d);if(d.length<1000)return out;from+=1000}}

async function loadAll(authed){
 const [groups,cats,books,videos,busy]=await Promise.all([authed?all('library_groups'):[],all('book_categories','created_at'),all('books'),all('video_lessons'),all('book_active_loans','book_id')]);
 const [profiles,loans]=authed?await Promise.all([all('profiles','created_at'),all('book_loans')]):[[],[]];
 const out=Object.fromEntries(busy.map(r=>[r.book_id,r.active]));
 return{
  users:profiles.map(p=>({id:p.id,username:p.username,name:p.display_name||p.username,role:p.role,group:p.group_id,active:p.active?1:0,lang:p.language,bio:p.bio||'',avatar:p.avatar_url||''})),
  groups:groups.map(g=>({id:g.id,name:g.name,course:g.course,desc:g.description||''})),
  categories:cats.filter(c=>!BUILTIN.includes(c.id)).map(c=>({id:c.id,name:c.name})),
  books:books.map(b=>({id:b.id,title:b.title,author:b.author,category:b.category,inventory:b.inventory,isbn:b.isbn||'',copies:b.copies,year:b.publication_year,desc:b.description||'',archived:b.archived?1:0,coverPath:b.cover_path,cover:b.cover_path?covers().getPublicUrl(b.cover_path).data.publicUrl:'',out:out[b.id]||0,
   ebook:b.ebook_path?{type:'file',name:b.ebook_name||'book.pdf',path:b.ebook_path}:b.ebook_external_url?{type:'link',url:b.ebook_external_url}:null})),
  loans:loans.map(l=>({id:l.id,book:l.book_id,student:l.student_id,issued:l.issued_on,due:l.due_on,returned:l.returned_on,sn:l.student_name})),
  videos:videos.map(v=>({id:v.id,title:v.title,url:v.url,desc:v.description||''}))};
}

const bookRow=b=>({title:b.title,author:b.author,category:b.category,inventory:b.inventory,isbn:b.isbn,copies:b.copies,publication_year:b.year,description:b.desc,updated_at:new Date().toISOString()});
async function putCover(id,blob,oldPath){const path=id+'-'+Date.now()+'.jpg';ok(await covers().upload(path,blob,{contentType:'image/jpeg'}));if(oldPath)covers().remove([oldPath]);return path}
const rm=(bucket,p)=>p?bucket().remove([p]).catch(()=>{}):0;
const upd=async(table,id,v)=>ok(await sb.from(table).update(v).eq('id',id));
const ins=async(table,v)=>ok(await sb.from(table).insert(v));
const del=async(table,id)=>ok(await sb.from(table).delete().eq('id',id));

return{ok:true,
 session:async()=>(await sb.auth.getSession()).data.session,
 signIn:async(u,p)=>ok(await sb.auth.signInWithPassword({email:email(u),password:p})),
 signUp:async(u,p,name,lang)=>ok(await sb.auth.signUp({email:email(u),password:p,options:{data:{username:u,display_name:name||u,language:lang}}})),
 signOut:()=>sb.auth.signOut().catch(()=>{}),
 loadAll,
 async addBook(b){const r=ok(await sb.from('books').insert(bookRow(b)).select('id').single());if(b.coverBlob)await upd('books',r.id,{cover_path:await putCover(r.id,b.coverBlob)})},
 async updateBook(id,b,old){const v=bookRow(b);if(b.coverBlob)v.cover_path=await putCover(id,b.coverBlob,old.coverPath);await upd('books',id,v)},
 archiveBook:id=>upd('books',id,{archived:true}),
 async deleteBook(b){await del('books',b.id);rm(covers,b.coverPath);rm(files,b.ebook&&b.ebook.path)},
 async setEbookFile(b,file){const path='books/'+b.id+'-'+Date.now()+'.pdf';ok(await files().upload(path,file,{contentType:'application/pdf'}));await upd('books',b.id,{ebook_path:path,ebook_name:file.name,ebook_external_url:null});rm(files,b.ebook&&b.ebook.path)},
 async setEbookLink(b,url){await upd('books',b.id,{ebook_external_url:url,ebook_path:null,ebook_name:null});rm(files,b.ebook&&b.ebook.path)},
 async delEbook(b){await upd('books',b.id,{ebook_external_url:null,ebook_path:null,ebook_name:null});rm(files,b.ebook&&b.ebook.path)},
 async signed(path,name){const[v,d]=await Promise.all([files().createSignedUrl(path,3600),files().createSignedUrl(path,3600,{download:name||true})]);return v.error||d.error?null:{view:v.data.signedUrl,download:d.data.signedUrl}},
 issue:(book,student,due,name,by,today)=>ins('book_loans',{book_id:book,student_id:student,student_name:name,issued_by:by,issued_on:today,due_on:due}),
 returnLoan:(id,today)=>upd('book_loans',id,{returned_on:today}),
 // Админ создаёт пользователя через второй клиент, чтобы не потерять свою сессию
 async createUser(u,adminId){const side=mk({persistSession:false,autoRefreshToken:false,storageKey:'iiv-library-side'});const r=ok(await side.auth.signUp({email:email(u.username),password:u.password,options:{data:{username:u.username,display_name:u.name,language:'ru'}}}));if(!r.user)throw new Error('signup failed');if(u.role!=='student'||u.group)await upd('profiles',r.user.id,{role:u.role,group_id:u.group})},
 setActive:(id,v)=>upd('profiles',id,{active:v}),
 updateProfile:(id,v)=>upd('profiles',id,v),
 async setPassword(id,pw){ok(await sb.rpc('admin_set_password',{target:id,new_password:pw}))},
 async deleteUser(id){ok(await sb.rpc('admin_delete_user',{target:id}))},
 addGroup:(name,course,desc)=>ins('library_groups',{name,course,description:desc}),
 deleteGroup:id=>del('library_groups',id),
 addCategory:(id,name)=>ins('book_categories',{id,name}),
 deleteCategory:id=>del('book_categories',id),
 addVideo:(title,url,desc,by)=>ins('video_lessons',{title,url,description:desc,created_by:by}),
 deleteVideo:id=>del('video_lessons',id),
 // Перенос каталога из старой копии (JSON из версии без базы). Пользователи и выдачи не переносятся.
 async importLegacy(d,existing){
  const n={groups:0,books:0,videos:0,cats:0};
  const gk=new Set(existing.groups.map(g=>g.name+'|'+g.course));
  for(const g of d.groups||[])if(g.name&&!gk.has(g.name+'|'+(g.course===2?2:1))){await ins('library_groups',{name:g.name,course:g.course===2?2:1,description:g.desc||''});n.groups++}
  const ck=new Set(existing.categories.map(c=>c.id));
  for(const c of d.categories||[])if(c.id&&c.name&&!ck.has(c.id)){await ins('book_categories',{id:c.id,name:c.name});n.cats++}
  const ik=new Set(existing.books.map(b=>b.inventory));
  for(const b of d.books||[]){if(!b.title||!b.inventory||ik.has(b.inventory))continue;
   const r=ok(await sb.from('books').insert({title:b.title,author:b.author||'',category:b.category||'fiction',inventory:b.inventory,isbn:b.isbn||'',copies:Math.max(1,+b.copies||1),publication_year:b.year||null,description:b.desc||'',archived:!!b.archived,ebook_external_url:b.ebook&&b.ebook.type==='link'?b.ebook.url:null}).select('id').single());
   if(typeof b.cover==='string'&&b.cover.startsWith('data:image/'))try{await upd('books',r.id,{cover_path:await putCover(r.id,await (await fetch(b.cover)).blob())})}catch(x){}
   n.books++}
  const vk=new Set(existing.videos.map(v=>v.url));
  for(const v of d.videos||[])if(v.title&&v.url&&!vk.has(v.url)){await ins('video_lessons',{title:v.title,url:v.url,description:v.desc||''});n.videos++}
  return n}
};
})();
