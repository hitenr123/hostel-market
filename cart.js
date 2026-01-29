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
            <button onclick="${qty === 1 
              ? `removeItem(${index})`
              : `changeQty(${index}, -1)`}">
              <i class="fa-solid ${qty === 1 ? 'fa-trash' : 'fa-minus'}"></i>
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
  let msg = "Order Details:%0A";
  let total = 0;
  const note = document.querySelector(".note-box")?.value || "Not provided";

  cart.forEach(item => {
    msg += `${item.name} x ${item.qty} = ₹${item.qty * item.price}%0A`;
    total += item.qty * item.price;
  });

  msg += `%0ATotal: ₹${total}`;
  window.open(`https://wa.me/919519171931?text=Room No : ${note}%0A%0A${msg}`, "_blank");
}

renderCart();

// THEME SYNC
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
}
