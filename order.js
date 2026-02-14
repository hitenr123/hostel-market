const container = document.getElementById("ordersContainer");

let orders =
  JSON.parse(localStorage.getItem("pendingOrders")) || [];

// Render orders
orders.forEach((order, index) => {

  const card = document.createElement("div");
  card.className = "order-card";

  // LEFT SIDE
  const info = document.createElement("div");
  info.className = "order-info";

  let itemsHTML = "<ul class='items'>";
  order.items.forEach(i => {
    itemsHTML += `<li>${i.name} x ${i.qty}</li>`;
  });
  itemsHTML += "</ul>";

  info.innerHTML = `
      <h3>Room: ${order.room}</h3>
      ${itemsHTML}
      <div class="time">${new Date().toLocaleString()}</div>
  `;

  // RIGHT SIDE
  const actions = document.createElement("div");
  actions.className = "actions";

  const btn = document.createElement("button");
  btn.className = "confirm-btn";
  btn.innerText = "Confirm";

  // ⭐ Pass card element
  btn.onclick = () => confirmOrder(index, card);

  actions.appendChild(btn);

  card.appendChild(info);
  card.appendChild(actions);
  container.appendChild(card);

});


// ✅ CONFIRM ORDER
async function confirmOrder(index, card){

  let orders =
    JSON.parse(localStorage.getItem("pendingOrders")) || [];

  const order = orders[index];

  // Send to backend
  await fetch("http://localhost:5000/update-orders", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify(order.items)
  });

  // Remove from storage
  orders.splice(index,1);

  localStorage.setItem(
    "pendingOrders",
    JSON.stringify(orders)
  );

  // ⭐ Remove card instantly (NO RELOAD)
  card.remove();
}
