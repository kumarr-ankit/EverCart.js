/* ===========================
      GLOBAL CONFIG
=========================== */
let BASE_URL = window.CONFIG.BASE_URL;
let soldOn = "";
let totalPrice = 0;
let partnerUpi = "";
let sellerNameGlobal = "";   // <-- fixed (global reference)


/* ===========================
      STAR RATING UI
=========================== */
function loadUI() {
  const stars = document.querySelectorAll(".star-btn");
  const valSpan = document.querySelector(".selected-value");
  let current = 0;

  stars.forEach((s) => {
    s.addEventListener("click", () => {
      current = Number(s.dataset.value);

      stars.forEach((x) =>
        x.classList.toggle("active", Number(x.dataset.value) <= current)
      );

      if (valSpan) valSpan.textContent = current + " / 5";
    });
  });

  const clearBtn = document.querySelector(".clear-review");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      stars.forEach((x) => x.classList.remove("active"));
      current = 0;

      if (valSpan) valSpan.textContent = "0";

      const ta = document.querySelector(".review-input");
      if (ta) ta.value = "";
    });
  }

  const submit = document.querySelector(".submit-review");
  if (submit) {
    submit.addEventListener("click", () => {
      const ta = document.querySelector(".review-input");
      const text = ta ? ta.value.trim() : "";

      if (current === 0) return alert("Please give a rating.");
      if (!text) return alert("Please write a review.");

      alert("Thanks! (Demo)");

      if (clearBtn) clearBtn.click();
    });
  }
}


/* ===========================
      READ product id
=========================== */
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");


/* ===========================
      FETCH PRODUCT DETAILS
=========================== */
axios
  .get(`${BASE_URL}/product?id=${productId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  })
  .then((res) => {
    let p = Array.isArray(res.data) ? res.data[0] : res.data;
    updateUI(p);
  })
  .catch((err) => console.error(err));


/* ===========================
      UPDATE DOM
=========================== */
function updateUI(p) {
  if (!p) return;

  let sellerId = p.sellerId || "1";
  loadSeller(sellerId);

  /* --- Image --- */
  const mainImg = document.querySelector("#main-img");
  if (mainImg) {
    mainImg.src =
      p.image && p.image !== ""
        ? p.image
        : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYwqMb2UZZAUNdo12xYR7vRGxmYHXXNaPhXg&s";
  }

  soldOn = p.soldOn;

  if (document.querySelector(".title")) {
    document.querySelector(".title").textContent = p.productName;
  }

  if (document.querySelector(".desc")) {
    document.querySelector(".desc").textContent = p.desc;
  }

  /* --- Base Price --- */
  if (document.querySelector(".price")) {
    document.querySelector(".price").textContent = "₹" + p.basePrice;
  }

  /* --- GST % --- */
  const gstText = document.querySelector(".gst-value");
  if (gstText) gstText.innerText = p.gst + "%";

  /* --- GST Amount --- */
  const gstAmount = ((p.basePrice * p.gst) / 100).toFixed(2);

  const priceList = document.querySelectorAll(".price");
  if (priceList[1]) priceList[1].textContent = "₹" + gstAmount;

  /* --- TOTAL PRICE --- */
  totalPrice = (p.basePrice + Number(gstAmount)).toFixed(2);

  const totalEl = document.querySelector(".total-value");
  if (totalEl) totalEl.textContent = "₹" + totalPrice;
}


/* ===========================
      LOAD SELLER DETAILS
=========================== */
function loadSeller(sellerId) {
  axios
    .get(`${BASE_URL}/api/details/${sellerId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((res) => {
      let d = res.data;

      /* DOM elements */
      let nm = document.getElementById("sellerName");
      let addr = document.getElementById("sellerAdd");
      let email = document.getElementById("selllerEmail");
      let soldOnText = document.getElementById("soldOn");

      nm.innerText = d.storeName || "General Store";
      addr.innerText = d.businessAddress || "Unknown Address";
      email.innerText = d.email || "contact@email.com";
      soldOnText.innerText = soldOn || "—";

      partnerUpi = d.upi || null;

      // FIX: Save global seller name for checkout
      sellerNameGlobal = d.ownerName || d.storeName || "Seller";
    })
    .catch((error) => console.error(error));
}


/* ===========================
      ADD TO CART
=========================== */
let addCart = document.getElementById("add-cart");

addCart.addEventListener("click", () => {
  let status = localStorage.getItem("isLogged");
  if (!status) return (location.href = "./login.html");

  axios
    .get(`${BASE_URL}/api/customer/profile`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((res) => {
      let userId = res.data.customer.id;

      axios
        .post(
          `${BASE_URL}/products/add-cart/${productId}?q=1&user=${userId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then(() => {
          addCart.innerText = "Added to Cart";
          addCart.style.backgroundColor = "#00ae06ff";
        })
        .catch(console.error);
    })
    .catch(console.error);
});


/* ===========================
      BUY NOW
=========================== */
let buyNow = document.getElementById("buy-now");

buyNow.addEventListener("click", () => {
  let status = localStorage.getItem("isLogged");
  if (!status) return (location.href = "./login.html");

  axios
    .get(`${BASE_URL}/api/customer/profile`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((res) => {
      let userId = res.data.customer.id;

      axios
        .post(
          `${BASE_URL}/products/buy/${productId}?q=1&user=${userId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then(() => {
          buyNow.innerText = "...";
          buyNow.style.backgroundColor = "#ffee00ff";

          let utm = "product";

          // ⬇ FIX: use global seller name
          location.href = `./checkout.html?total=${totalPrice}&utm=${utm}&payment=${partnerUpi}&seller=${sellerNameGlobal}`;
        })
        .catch(console.error);
    })
    .catch(console.error);
});
