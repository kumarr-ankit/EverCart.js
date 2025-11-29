/* ===========================
      CONFIG (global)
=========================== */
let BASE_URL = window.CONFIG.BASE_URL;

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

      if (current === 0) return alert("Please give a rating (1-5 stars).");
      if (!text) return alert("Please write a short review.");

      alert("Thanks! Your review is submitted (demo only).");

      if (clearBtn) clearBtn.click();
    });
  }
}

/* ===========================
      1) Read ?id= from URL
=========================== */
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

/* ===========================
      2) Fetch product details
=========================== */
axios
  .get(`${BASE_URL}/product?id=${productId}`, {
    auth: {
      username: "user",
      password: "327f1964-7575-4a71-b6c4-55807f50f105",
    },
  })
  .then((res) => {
    let p = res.data;

    if (Array.isArray(p)) p = p[0];

    updateUI(p);
  })
  .catch((err) => console.error(err));

/* ===========================
      3) Update the DOM
=========================== */
function updateUI(p) {
  console.log(p);

  let sellerId = p.sellerId || "1";
  loadSeller(sellerId);

  // Image
  const mainImg = document.querySelector("#main-img");
  if (mainImg) {
    mainImg.src =
      p.image && p.image !== ""
        ? p.image
        : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYwqMb2UZZAUNdo12xYR7vRGxmYHXXNaPhXg&s";
  }

  // Title
  const titleEl = document.querySelector(".title");
  if (titleEl) titleEl.textContent = p.productName;

  // Description
  const descEl = document.querySelector(".desc");
  if (descEl) descEl.textContent = p.desc;

  // Base Price
  const priceEl = document.querySelector(".price");
  if (priceEl) priceEl.textContent = "₹" + p.basePrice;

  // GST %
  const gstText = document.querySelector(".gst-value");
  if (gstText) gstText.innerText = p.gst + "%";

  // GST amount
  const gst = ((p.basePrice * p.gst) / 100).toFixed(2);

  const priceList = document.querySelectorAll(".price");
  if (priceList[1]) priceList[1].textContent = "₹" + gst;

  // Total
  const total = (p.basePrice + Number(gst)).toFixed(2);
  const totalEl = document.querySelector(".total-value");
  if (totalEl) totalEl.textContent = "₹" + total;
}

function loadSeller(sellerId) {
  console.log(sellerId);
  axios
    .get(`${BASE_URL}/api/details/${sellerId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((res) => {
      console.log(res.data);

      let details = res.data;

      let sellerName = document.getElementById("sellerName");
      let sellerAddress = document.getElementById("sellerAdd");

      let email = document.getElementById("selllerEmail");
      let soldOn = document.getElementById("soldOn");
      //let soldBy = document.getElementById("soldBy");
      sellerName.innerText = details.storeName || "John Doe General Store";
      sellerAddress.innerText = details.businessAddress || "123, Colony , Usa";
      email.innerText = details.email || "xyz@email.com";
   soldOn.innerText = details.soldOn|| "12-12-2025";
    })
    .catch((error) => {
      console.log(error);
    });
}
