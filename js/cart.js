let BASE_URL = window.CONFIG.BASE_URL;
const cartContainer = document.querySelector(".cart-items");
let placeOrder = document.getElementById("placeOrder");
let totalPrice = 0;
let gst = 0;



function renderCartItem(product, quantity) {
  return `
    <div class="item-card" data-id="${product.id}">
      <img src="${product.image}" class="item-img">

      <div class="item-info">
        <h2 class="item-title">${product.productName}</h2>
        <p class="seller">Seller: ${product.sellerId ?? "EverCart Seller"}</p>

        <div class="price-row">
          <span class="price">₹${product.basePrice}</span>
          <select class="qty" data-id="${product.id}">
            ${[1, 2, 3, 4, 5]
              .map(
                (n) =>
                  `<option value="${n}" ${
                    n == quantity ? "selected" : ""
                  }>${n}</option>`
              )
              .join("")}
          </select>
        </div>

        <div class="actions">
          <button class="link-btn">Save for later</button>
          <button class="link-btn remove-btn" data-id="${
            product.id
          }">Remove</button>
        </div>
      </div>
    </div>
  `;
}

function updatePricing() {
  let total = 0;
  const prices = document.querySelectorAll(".price");

  prices.forEach((priceEl) => {
    const val = Number(priceEl.textContent.replace("₹", ""));
    total += val;
  });

  const mrp = document.getElementById("totalMrp");
  const totalAmt = document.getElementById("totalAmount");

  if (mrp) mrp.textContent = "₹" + total;
  if (totalAmt) totalAmt.textContent = "₹" + total;
  totalPrice = total;
}

function attachCardClick() {
  const cards = document.querySelectorAll(".item-card");

  cards.forEach((card) => {
    card.onclick = () => {
      const id = card.getAttribute("data-id");
      goProduct(id);
    };
  });
}

axios
  .get(`${BASE_URL}/api/customer/profile`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
  .then((res) => {
    console.log(res)
    let cart = res.data.customer.cart;
    console.log(cart);
   if(cart){
     cart.forEach((item) => {

      axios
        .get(`${BASE_URL}/product?id=${item.productID}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          let product = res.data;

          // Inject UI
          cartContainer.innerHTML += renderCartItem(product, item.quantity);

          // Attach click handler
          attachCardClick();

          // Update price box
          updatePricing();
        })
        .catch((err) => console.log(err));
    });
   }else{
    
    

   }
  })
  .catch((err) => console.log(err));

function goProduct(id) {
  // Redirect to your product page
  location.href = `../html/product.html?id=${id}`;
}
placeOrder.addEventListener("click", () => {
  location.href = `./checkout.html?totat=${totalPrice}`;
});
