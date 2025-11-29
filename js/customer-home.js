const container = document.querySelector(".products");
const loginBtn = document.getElementById("isLogged");
const youBtn = document.getElementById("you");

const isLogged = localStorage.getItem("everCart-isLogged");

// Handle login display
if (isLogged) {
  loginBtn.style.display = "none";
  youBtn.style.display = "block";
} else {
  loginBtn.style.display = "block";
  youBtn.style.display = "none";
}

// Fetch products
axios
  .get("https://evercart.zeabur.app/products", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
  .then((res) => {
    let products = res.data;
    if (!Array.isArray(products)) products = [products];

    renderProducts(products);
  })
  .catch((err) => console.log(err));

// Render products cleanly
function renderProducts(products) {
  container.innerHTML = ""; 

  products.forEach((p) => {
    const cardWrapper = document.createElement("div");

    const card = document.createElement("div");
    card.className = "card";
    card.dataset.id = p.id;

    card.innerHTML = `
      <div class="img-box"
           style="background-image:url('${
             p.image ||
             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYwqMb2UZZAUNdo12xYR7vRGxmYHXXNaPhXg&s"
           }')">
      </div>

      <div class="card-content">
          <h3 class="item-name">${p.productName}</h3>
          <div class="rating">★★★★☆</div>
          <p class="price">₹${p.basePrice}</p>
          <button class="add-cart">Add to Cart</button>
      </div>
    `;

    cardWrapper.appendChild(card);
    container.appendChild(cardWrapper);
  });
}

// EVENT DELEGATION — handles ALL cards efficiently
container.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (!card) return;

  const id = card.dataset.id;

  // 1. Card Image click → open product page
  if (e.target.classList.contains("img-box")) {
    location.href = `../html/product.html?id=${id}`;
  }

  // 2. Add To Cart Button click
  if (e.target.classList.contains("add-cart")) {
    e.target.innerText = "Remove From Cart";
    e.target.disabled = true;

    console.log("Product added to cart:", id);
  }
});
