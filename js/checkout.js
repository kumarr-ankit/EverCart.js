/* ============================================
   GLOBAL CONFIG
============================================ */
const BASE_URL = window.CONFIG.BASE_URL;

let topay = 0;
let totalGst = 0;
let totalItem = 0;
let sellerUpi = "";
let totalPrice = 0;
let sellerName = "";

/* ============================================
   READ URL PARAMS
============================================ */
const urlParams = new URLSearchParams(window.location.search);
let utm = urlParams.get("utm");

if (utm === "product") {
  sellerUpi = urlParams.get("payment") || "";
  sellerName = urlParams.get("seller") || "";
}

/* ============================================
   DOM READY
============================================ */
document.addEventListener("DOMContentLoaded", () => {
  loadAddress();
  loadCartItems();

  document.getElementById("placeOrderBtn").addEventListener("click", () => {
    if (!sellerUpi && utm != 'cart') return alert("Seller UPI missing!");

    

    // FINAL GO-TO-PAYMENT REDIRECT
    location.href = `./upi_payment.html?total=${totalPrice}&utm=${utm}&payment=${sellerUpi}&gst=${totalGst}&item=${totalItem}&seller=${sellerName}`;
  });
});

/* ============================================
   LOAD CUSTOMER ADDRESS
============================================ */
async function loadAddress() {
  const box = document.getElementById("addressBox");

  try {
    const res = await axios.get(`${BASE_URL}/api/customer/profile`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    const data = res.data.customer;

    box.innerHTML = `
      <p><strong>${data.fullName}</strong></p>
      <p>${data.address || "No address saved"}</p>
      <p>Phone: ${data.phone || "N/A"}</p>
      <button class="edit-btn">
        <i class="fa-solid fa-pen"></i> Change
      </button>
    `;
  } catch (e) {
    box.innerHTML = `<p class="error">Unable to load address.</p>`;
  }
}

/* ============================================
   LOAD CART ITEMS + CALCULATE TOTAL
============================================ */
async function loadCartItems() {
  const container = document.getElementById("orderSummary");

  try {
    const res = await axios.get(`${BASE_URL}/api/customer/profile`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    const cart = res.data.customer.cart;
    container.innerHTML = "";
    let subtotal = 0;

    for (const item of cart) {
      totalItem += item.quantity;

      const prodRes = await axios.get(
        `${BASE_URL}/product?id=${item.productID}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const product = prodRes.data;
      const itemTotal = product.basePrice * item.quantity;
      subtotal += itemTotal;

      container.innerHTML += `
        <div class="summary-item">
          <img src="${product.image}" class="item-img" />
          <div>
            <h4>${product.productName}</h4>
            <p class="price">₹${product.basePrice} × ${item.quantity}</p>
          </div>
        </div>
      `;
    }

    // GST and TOTAL
    const gst = Math.round(subtotal * 0.05);
    const total = subtotal + gst;

    document.getElementById("subtotal").innerText = `₹${subtotal}`;
    document.getElementById("gst").innerText = `₹${gst}`;
    document.getElementById("total").innerText = `₹${total}`;
    document.getElementById("number").innerText = totalItem;

    // FINAL VALUES
    topay = total;
    totalPrice = total;
    totalGst = gst;
  } catch (e) {
    console.log(e);
    container.innerHTML = `<p class="error">Failed to load cart items.</p>`;
  }
}
