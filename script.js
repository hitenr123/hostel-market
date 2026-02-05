let shopStatus = "loading";

function updateShopUI() {
  if (shopStatus === "loading") {
    shopStatusText.innerText = "CHECKING...";
    shopToggleBtn.style.background = "#64748b";
    return;
  }

  if (shopStatus === "open") {
    shopStatusText.innerText = "OPEN";
    shopToggleBtn.style.background = "#22c55e";
  } else {
    shopStatusText.innerText = "CLOSED";
    shopToggleBtn.style.background = "#ef4444";
  }
}

const SHOP_API = "https://script.google.com/macros/s/AKfycbySrYZ3NZOveS79TmLHHvNA6Ew1YGIrV5REFZZIJbVgQI7qZxhGlRO3Aa6HGjbd5d-j/exec";

async function fetchShopStatus() {
  const res = await fetch(SHOP_API, { cache: "no-store" });
  const data = await res.json();
  shopStatus = data.status;
  updateShopUI(); // ✅ ADD THIS
}


fetchShopStatus();
setInterval(fetchShopStatus, 5000);

function changeQty(button, change) {
  const product = button.closest(".product");
  const qtySpan = product.querySelector(".qty");
  let qty = parseInt(qtySpan.innerText);

  qty += change;
  if (qty < 1) qty = 1;

  qtySpan.innerText = qty;

}

function orderProduct(button) {
  const product = button.closest(".product");
  const productName = product.querySelector("h2").innerText;
  const qty = parseInt(product.querySelector(".qty").innerText);
  const note = document.querySelector(".note-box")?.value || "Not provided";

  if (shopStatus !== "open") {
    alert("🚫 Shop is CLOSED. Please try later.");
    return;
  }

  orderOnWhatsApp(productName, qty, note);
}


function orderOnWhatsApp(productName, qty, note) {
  const message = `Order :\n${productName}\nQty : ${qty}\nRoom No : ${note}`;

  const url = `whatsapp://send?phone=919519171931&text=${encodeURIComponent(message)}`;

  window.location.href = url;
}


let cart = JSON.parse(localStorage.getItem("cart")) || []; // reset cart on every reload

updateCartCount();

function addToCart(btn) {
  const product = btn.closest(".product");
  const name = product.querySelector("h2").innerText;
  const price = product.querySelector(".new-price").innerText;
  const qty = Number(product.querySelector(".qty").innerText);
  const image = product.querySelector("img").src;
  const alt = product.querySelector("img").alt;

  // Check if item already exists
  const existing = cart.find((item) => item.name === name);
  if (existing) {
    existing.qty = Number(existing.qty) + qty;
  } else {
    cart.push({ name, price, qty, image, alt });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();

  btn.style.display = "none";
}

function updateCartCount() {
  const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
  let count = 0;

  storedCart.forEach((item) => {
    if (item && item.qty) {
      count += Number(item.qty);
    }
  });

  document.getElementById("cart-count").innerText = count;
}

function searchItems() {
  const input = document.getElementById("searchBox").value.toLowerCase();
  const items = document.querySelectorAll(".product");
  let found = false;

  items.forEach((item) => {
    const name = item.querySelector("h2").innerText.toLowerCase();

    if (name.includes(input)) {
      item.style.display = "flex";
      found = true;
    } else {
      item.style.display = "none";
    }
  });

  document.getElementById("noResult").style.display =
    found || input === "" ? "none" : "block";
}

const toggleBtn = document.getElementById("themeToggle");
const icon = toggleBtn.querySelector("i");

// 🌑 Default DARK
document.body.classList.remove("light");

// Load saved theme
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
  icon.classList.replace("fa-moon", "fa-sun");
}

toggleBtn.addEventListener("click", () => {
  // rotate animation
  toggleBtn.classList.add("rotate");

  setTimeout(() => {
    const isLight = document.body.classList.toggle("light");

    if (isLight) {
      icon.classList.replace("fa-moon", "fa-sun");
      localStorage.setItem("theme", "light");
    } else {
      icon.classList.replace("fa-sun", "fa-moon");
      localStorage.setItem("theme", "dark");
    }

    toggleBtn.classList.remove("rotate");
  }, 200);
});

// ===== SHOP OPEN / CLOSE =====

// Admin login
document.getElementById("adminLogin").addEventListener("click", () => {
  const code = prompt("Enter admin code:");
  if (code === "1234") {
    // 🔐 change this
    document.getElementById("adminPanel").style.display = "block";
    alert("Admin mode enabled");
  } else {
    alert("Wrong code");
  }
});

const shopToggleBtn = document.getElementById("shopToggle");
const shopStatusText = document.getElementById("shopStatus");


// Toggle open/close
shopToggleBtn.addEventListener("click", async () => {
  const newStatus = shopStatus === "open" ? "closed" : "open";

  await fetch(`${SHOP_API}?set=${newStatus}`);
  shopStatus = newStatus;
  updateShopUI();
});
