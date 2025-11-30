let BASE_URL = window.CONFIG.BASE_URL;

const container = document.querySelector(".products");
const loginBtn = document.getElementById("isLogged");
const youBtn = document.getElementById("you");

const isLogged = localStorage.getItem("isLogged");


if (isLogged) {
  loginBtn.style.display = "none";
  youBtn.style.display = "block";
} else {
  loginBtn.style.display = "block";
  youBtn.style.display = "none";
}

axios
  .get(`${BASE_URL}/products`, {
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


container.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (!card) return;

  const id = card.dataset.id;


  if (e.target.classList.contains("img-box")) {
    location.href = `../html/product.html?id=${id}`;
  }


  if (e.target.classList.contains("add-cart")) {
    let status = localStorage.getItem("isLogged");

    if (!status) {
      location.href = "./login.html";
    }

    setTimeout(() => {
      e.target.innerText = "added to cart";
      e.target.disabled = true;
    }, 1000);
    axios
      .get(`${BASE_URL}/api/customer/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        let userId = res.data.customer.id;
        axios
          .post(
            `${BASE_URL}/products/add-cart/${id}?q=1&user=${userId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
          .then((res) => {
            let data = res.data;
            console.log(data);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });

    console.log("Product added to cart:", id);
  }
});
