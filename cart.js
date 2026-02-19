// ===== APPLY SHOP STATE ON CART PAGE =====
function applyShopStateCart() {
  const closed = localStorage.getItem("shopStatus") === "closed";

  const buttons = document.querySelectorAll(".checkout-btn");

  buttons.forEach((btn) => {
    btn.disabled = closed;
    btn.style.opacity = closed ? "0.6" : "1";
    btn.style.cursor = closed ? "not-allowed" : "pointer";
  });
}

applyShopStateCart();

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderCart() {
  const container = document.getElementById("cart-items");
  container.innerHTML = "";

  let total = 0;
  let itemCount = 0;

  // EMPTY CART
  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    document.getElementById("total-price").innerText = "0";
    document.getElementById("item-count").innerText = "0";
    return;
  }

  cart.forEach((item, index) => {
    const price = Number(String(item.price).replace("₹", "").trim());
    const qty = Number(item.qty);

    total += price * qty;
    itemCount += qty;

    container.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.alt || item.name}">

        <div class="cart-info">
          <h4>${item.name}</h4>
          <p>₹${price}</p>

          <div class="cart-qty">
            <button onclick="${
              qty === 1 ? `removeItem(${index})` : `changeQty(${index}, -1)`
            }">
              <i class="fa-solid ${qty === 1 ? "fa-trash" : "fa-minus"}"></i>
            </button>

            <span>${qty}</span>

            <button onclick="changeQty(${index}, 1)">+</button>
          </div>
        </div>
      </div>
    `;
  });

  document.getElementById("total-price").innerText = total;
  document.getElementById("item-count").innerText = itemCount;
}

function changeQty(index, change) {
  cart[index].qty = Number(cart[index].qty) + change;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function checkout() {
  const note = document.querySelector(".note-box")?.value || "Not provided";

  let msg = `Room No: ${note}\n\nOrder Details:\n`;
  let total = 0;

  cart.forEach((item) => {
    const price = Number(String(item.price).replace("₹", "").trim());
    msg += `${item.name} x ${item.qty} = ₹${item.qty * price}\n`;
    total += item.qty * price;
  });

  msg += `\nTotal: ₹${total}`;

  // ===== SAVE PENDING ORDER =====
  let pending = JSON.parse(localStorage.getItem("pendingOrders")) || [];

  pending.push({
    room: note,
    items: cart,
    time: new Date().toLocaleString(),
  });

  localStorage.setItem("pendingOrders", JSON.stringify(pending));

  fetch("http://localhost:5000/update-orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cart),
  });

  // --- OPEN WHATSAPP ---
  const url = `whatsapp://send?phone=919519171931&text=${encodeURIComponent(msg)}`;
  window.location.href = url;
}

renderCart();

// THEME SYNC
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
}

function confirmClearCart() {
  if (cart.length === 0) {
    showToast("Cart is already empty");
    return;
  }

  document.getElementById("clearCartModal").style.display = "flex";
}

function closeClearCartModal() {
  document.getElementById("clearCartModal").style.display = "none";
}

function clearCartConfirmed() {
  localStorage.removeItem("cart");
  closeClearCartModal();
  location.reload();
}

// Close modal when clicking outside
document.getElementById("clearCartModal").addEventListener("click", (e) => {
  if (e.target.id === "clearCartModal") closeClearCartModal();
});

// Small toast helper
function showToast(msg) {
  const toast = document.createElement("div");
  toast.innerText = msg;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #111;
    color: #fff;
    padding: 10px 16px;
    border-radius: 10px;
    font-size: 14px;
    z-index: 1000;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

const container = document.getElementById("orders-container");

function addOrder(order) {
  const div = document.createElement("div");
  div.className = "order-card";

  div.innerHTML = `
        <div class="order-info">
            <h3>Room ${order.room}</h3>
            <ul class="items">
                ${order.items.map((i) => `<li>${i.name} × ${i.qty}</li>`).join("")}
            </ul>
            <p class="time">${order.time}</p>
        </div>

        <div class="actions">
            <button class="confirm-btn"
                onclick="confirmOrder(${order.id})">
                Confirm
            </button>
        </div>
    `;

  container.appendChild(div);
}
