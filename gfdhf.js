// =====================================
// PRODUCTS
// =====================================

const products = [

  {
    id: 1,
    name: "Беспроводные наушники AirBeat Pro",
    category: "Электроника",
    price: 349000,
    oldPrice: 429000,
    rating: "★★★★★ 4.9",
    discount: "-19%",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",
    description:
      "Современные беспроводные наушники с качественным звуком, шумоподавлением и удобной посадкой."
  },

  {
    id: 2,
    name: "Смарт-часы Nova Watch X",
    category: "Электроника",
    price: 599000,
    oldPrice: 699000,
    rating: "★★★★★ 4.8",
    discount: "-14%",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80",
    description:
      "Стильные смарт-часы с мониторингом активности, уведомлениями и ярким дисплеем."
  },

  {
    id: 3,
    name: "Классическая белая футболка",
    category: "Одежда",
    price: 99000,
    oldPrice: 129000,
    rating: "★★★★★ 4.7",
    discount: "-23%",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80",
    description:
      "Базовая хлопковая футболка свободного кроя для повседневного образа."
  },

  {
    id: 4,
    name: "Минималистичный рюкзак Urban",
    category: "Одежда",
    price: 249000,
    oldPrice: 299000,
    rating: "★★★★★ 4.8",
    discount: "-17%",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80",
    description:
      "Практичный городской рюкзак с большим отделением для ноутбука и аксессуаров."
  },

  {
    id: 5,
    name: "Настольная LED-лампа",
    category: "Дом",
    price: 159000,
    oldPrice: 199000,
    rating: "★★★★★ 4.6",
    discount: "-20%",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80",
    description:
      "Стильная LED-лампа с регулируемой яркостью для рабочего стола."
  },

  {
    id: 6,
    name: "Кофейная кружка Ceramic",
    category: "Дом",
    price: 79000,
    oldPrice: 99000,
    rating: "★★★★★ 4.9",
    discount: "-20%",
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?auto=format&fit=crop&w=700&q=80",
    description:
      "Керамическая кружка в минималистичном стиле."
  },

  {
    id: 7,
    name: "Увлажняющий крем Skin Care",
    category: "Красота",
    price: 129000,
    oldPrice: 169000,
    rating: "★★★★★ 4.8",
    discount: "-24%",
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=700&q=80",
    description:
      "Лёгкий увлажняющий крем для ежедневного ухода за кожей."
  },

  {
    id: 8,
    name: "Спортивные кроссовки Run",
    category: "Спорт",
    price: 489000,
    oldPrice: 579000,
    rating: "★★★★★ 4.9",
    discount: "-16%",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
    description:
      "Лёгкие спортивные кроссовки с амортизирующей подошвой."
  },

  {
    id: 9,
    name: "Портативная Bluetooth колонка",
    category: "Электроника",
    price: 279000,
    oldPrice: 329000,
    rating: "★★★★★ 4.7",
    discount: "-15%",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=80",
    description:
      "Компактная Bluetooth-колонка с насыщенным звуком."
  },

  {
    id: 10,
    name: "Ароматическая свеча Home",
    category: "Дом",
    price: 89000,
    oldPrice: 119000,
    rating: "★★★★★ 4.8",
    discount: "-25%",
    image:
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=700&q=80",
    description:
      "Ароматическая свеча для создания уютной атмосферы дома."
  }

];


// =====================================
// CART
// =====================================

let cart = [];


// =====================================
// FORMAT PRICE
// =====================================

function formatPrice(price) {

  return new Intl.NumberFormat("ru-RU")
    .format(price) + " сум";

}


// =====================================
// RENDER PRODUCTS
// =====================================

function renderProducts(list = products) {

  const container =
    document.getElementById("productList");


  if (!list.length) {

    container.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-icon">🔎</div>

        <h3>Товары не найдены</h3>

        <p>
          Попробуйте изменить запрос
        </p>
      </div>
    `;

    return;
  }


  container.innerHTML = list.map(product => `

    <article class="product">

      <div
        class="product-image"
        onclick="openProduct(${product.id})"
      >

        <img
          src="${product.image}"
          alt="${product.name}"
        >

        <button
          class="favorite"
          onclick="toggleFavorite(event, this)"
        >
          ♡
        </button>

        <span class="discount">
          ${product.discount}
        </span>

      </div>


      <div class="product-info">

        <div class="rating">
          ${product.rating}
        </div>


        <div
          class="product-name"
          onclick="openProduct(${product.id})"
        >
          ${product.name}
        </div>


        <div class="price-row">

          <span class="price">
            ${formatPrice(product.price)}
          </span>

          <span class="old-price">
            ${formatPrice(product.oldPrice)}
          </span>

        </div>


        <button
          class="buy-button"
          onclick="addToCart(${product.id})"
        >
          В корзину
        </button>

      </div>

    </article>

  `).join("");

}


// =====================================
// ADD TO CART
// =====================================

function addToCart(id) {

  const product =
    products.find(product => product.id === id);


  if (!product) return;


  const existing =
    cart.find(item => item.id === id);


  if (existing) {

    existing.quantity++;

  } else {

    cart.push({
      ...product,
      quantity: 1
    });

  }


  updateCart();

  openCart();

}


// =====================================
// CHANGE QUANTITY
// =====================================

function changeQuantity(id, amount) {

  const item =
    cart.find(item => item.id === id);


  if (!item) return;


  item.quantity += amount;


  if (item.quantity <= 0) {

    cart =
      cart.filter(item => item.id !== id);

  }


  updateCart();

}


// =====================================
// UPDATE CART
// =====================================

function updateCart() {

  const cartCount =
    cart.reduce(
      (sum, item) =>
        sum + item.quantity,
      0
    );


  document
    .getElementById("cartCount")
    .textContent = cartCount;


  const container =
    document.getElementById("cartItems");


  if (!cart.length) {

    container.innerHTML = `

      <div class="empty-cart">

        <div class="empty-cart-icon">
          🛒
        </div>

        <h3>
          Корзина пуста
        </h3>

        <p>
          Добавьте понравившиеся товары
        </p>

      </div>

    `;

  } else {

    container.innerHTML =
      cart.map(item => `

        <div class="cart-item">

          <img
            src="${item.image}"
            alt="${item.name}"
          >


          <div class="cart-item-info">

            <div class="cart-item-name">
              ${item.name}
            </div>


            <div class="cart-item-price">
              ${formatPrice(item.price)}
            </div>


            <div class="quantity">

              <button
                onclick="changeQuantity(${item.id}, -1)"
              >
                −
              </button>

              <span>
                ${item.quantity}
              </span>

              <button
                onclick="changeQuantity(${item.id}, 1)"
              >
                +
              </button>

            </div>

          </div>

        </div>

      `).join("");

  }


  const total =
    cart.reduce(
      (sum, item) =>
        sum +
        item.price *
        item.quantity,
      0
    );


  document
    .getElementById("totalPrice")
    .textContent =
      formatPrice(total);

}


// =====================================
// OPEN CART
// =====================================

function openCart() {

  document
    .getElementById("overlay")
    .classList.add("active");


  document
    .getElementById("cart")
    .classList.add("active");

}


// =====================================
// CLOSE CART
// =====================================

function closeCart() {

  document
    .getElementById("cart")
    .classList.remove("active");


  document
    .getElementById("overlay")
    .classList.remove("active");

}


// =====================================
// PRODUCT MODAL
// =====================================

function openProduct(id) {

  const product =
    products.find(
      product => product.id === id
    );


  if (!product) return;


  document
    .getElementById("modalImage")
    .src = product.image;


  document
    .getElementById("modalName")
    .textContent = product.name;


  document
    .getElementById("modalRating")
    .textContent = product.rating;


  document
    .getElementById("modalDescription")
    .textContent =
      product.description;


  document
    .getElementById("modalPrice")
    .textContent =
      formatPrice(product.price);


  document
    .getElementById("modalBuy")
    .onclick = () => {

      addToCart(product.id);

      closeModal();

    };


  document
    .getElementById("overlay")
    .classList.add("active");


  document
    .getElementById("productModal")
    .classList.add("active");

}


// =====================================
// CLOSE MODAL
// =====================================

function closeModal() {

  document
    .getElementById("productModal")
    .classList.remove("active");


  document
    .getElementById("overlay")
    .classList.remove("active");

}


// =====================================
// CLOSE EVERYTHING
// =====================================

function closeAll() {

  closeCart();

  closeModal();

}


// =====================================
// FAVORITE
// =====================================

function toggleFavorite(event, button) {

  event.stopPropagation();


  button.classList.toggle("active");


  button.textContent =
    button.classList.contains("active")
      ? "♥"
      : "♡";

}


// =====================================
// CATEGORY FILTER
// =====================================

function filterCategory(category) {

  const filtered =
    products.filter(
      product =>
        product.category === category
    );


  document
    .getElementById("productsTitle")
    .textContent = category;


  renderProducts(filtered);


  scrollToProducts();

}


// =====================================
// SEARCH
// =====================================

document
  .getElementById("searchInput")
  .addEventListener(
    "input",
    function() {

      const query =
        this.value
          .toLowerCase()
          .trim();


      if (!query) {

        document
          .getElementById("productsTitle")
          .textContent =
            "Популярные товары";


        renderProducts(products);

        return;
      }


      const result =
        products.filter(product =>

          product.name
            .toLowerCase()
            .includes(query)

          ||

          product.category
            .toLowerCase()
            .includes(query)

        );


      document
        .getElementById("productsTitle")
        .textContent =
          "Результаты поиска";


      renderProducts(result);

    }
  );


// =====================================
// SCROLL TO PRODUCTS
// =====================================

function scrollToProducts() {

  document
    .getElementById("productsSection")
    .scrollIntoView({
      behavior: "smooth"
    });

}


// =====================================
// CHECKOUT
// =====================================

function checkout() {

  if (!cart.length) {

    alert(
      "Корзина пуста!"
    );

    return;
  }


  alert(
    "Спасибо за заказ! 🛍️\n\n" +
    "Здесь можно подключить " +
    "настоящую систему оформления заказа."
  );

}


// =====================================
// START
// =====================================

renderProducts();

updateCart();
