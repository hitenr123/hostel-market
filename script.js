function changeQty(button, change) {
  const product = button.closest(".product");
  const qtySpan = product.querySelector(".qty");
  let qty = parseInt(qtySpan.innerText);

  qty += change;
  if (qty < 1) qty = 1;

  qtySpan.innerText = qty;
}

function orderProduct(button) {
  if (localStorage.getItem("shopStatus") === "closed") {
    alert("Shop is currently CLOSED");
    return;
  }

  const product = button.closest(".product");
  const productName = product.querySelector("h2").innerText;
  const qty = parseInt(product.querySelector(".qty").innerText);
  const note = product.querySelector(".note-box")?.value || "Not provided";

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

  cartDropAnimation();

  // Check if item already exists
  const existing = cart.find((item) => item.name === name);
  if (existing) {
    existing.qty = Number(existing.qty) + qty;
  } else {
    cart.push({ name, price, qty, image, alt });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();

  const originalHTML = btn.innerHTML;

  btn.innerHTML = "Added ✓";
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = originalHTML;
    btn.disabled = false;
  }, 3000);
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

// ================= SHOP OPEN / CLOSE SYSTEM =================

// Load saved status (default OPEN)
let shopStatus = localStorage.getItem("shopStatus") || "open";
localStorage.setItem("shopStatus", shopStatus);

// Update UI text
function updateShopLabel() {
  const label = document.getElementById("shopStatus");
  const toggle = document.getElementById("shopToggle");
  if (!label || !toggle) return;

  // Update text
  label.innerText = shopStatus.toUpperCase();

  // Update colors
  if (shopStatus === "open") {
    toggle.style.background = "#22c55e";
    toggle.style.color = "black";
  } else {
    toggle.style.background = "red";
    toggle.style.color = "white";
  }
}

// Disable/Enable ordering
function applyShopState() {
  const closed = shopStatus === "closed";

  // Buttons affected
  const buttons = document.querySelectorAll(".btn, .order-btn");

  buttons.forEach((btn) => {
    btn.disabled = closed;
    btn.style.opacity = closed ? "0.5" : "1";
    btn.style.cursor = closed ? "not-allowed" : "pointer";
  });
}

// Toggle button click
const toggle = document.getElementById("shopToggle");

if (toggle) {
  toggle.addEventListener("click", () => {
    shopStatus = shopStatus === "open" ? "closed" : "open";
    localStorage.setItem("shopStatus", shopStatus);

    updateShopLabel();
    applyShopState();
  });
}

// Run on load
document.addEventListener("DOMContentLoaded", () => {
  updateShopLabel();
  applyShopState();
});


function cartDropAnimation() {
  const cart = document.querySelector(".cart-header");
  const icon = cart.querySelector("i");
  if (!cart || !icon) return;

  const cartRect = cart.getBoundingClientRect();
  const iconRect = icon.getBoundingClientRect();

  // Create ball
  const ball = document.createElement("div");
  ball.className = "cart-drop-ball";
  cart.appendChild(ball);

  // Target relative to cart header
  const targetX = iconRect.left - cartRect.left + iconRect.width / 2;
  const targetY = iconRect.top - cartRect.top + iconRect.height / 2;

  // ⭐ YOUR initial values kept
  let x = targetX - 20;
  let y = 10;

  ball.style.left = "0px";
  ball.style.top = "0px";
  ball.style.transform = `translate(${x}px, ${y}px)`; // FIXED

  let vx = (targetX - x) / 30;
  let vy = -4;
  const gravity = 0.35;

  function step() {
    vy += gravity;
    x += vx;
    y += vy;

    // ---- KEEP BALL INSIDE BUTTON ----
    const maxX = cart.clientWidth - ball.offsetWidth;
    const maxY = cart.clientHeight - ball.offsetHeight;

    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));
    // ---------------------------------

    ball.style.transform = `translate(${x}px, ${y}px)`;

    // ---- LOCAL TOUCH CHECK ----
    const iconX = icon.offsetLeft;
    const iconY = icon.offsetTop;

    const touching =
      x + ball.offsetWidth >= iconX &&
      x <= iconX + icon.offsetWidth &&
      y + ball.offsetHeight >= iconY &&
      y <= iconY + icon.offsetHeight;
    // ---------------------------

    if (touching) {
      ball.remove();
      return;
    }

    requestAnimationFrame(step);
  }

  step();
}

fetch("http://127.0.0.1:5000/products")
  .then(res => res.json())
  .then(data => {
    console.log(data);
  });
