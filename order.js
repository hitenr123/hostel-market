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

  // CONFIRM BUTTON
  const confirmBtn = document.createElement("button");
  confirmBtn.className = "confirm-btn";
  confirmBtn.innerText = "Confirm";
  confirmBtn.onclick = () => confirmOrder(index, card);

  // ❌ REMOVE BUTTON (NEW)
  const removeBtn = document.createElement("button");
  removeBtn.className = "remove-btn";
  removeBtn.innerText = "Remove";
  removeBtn.onclick = () => removeOrder(index, card);

  actions.appendChild(confirmBtn);
  actions.appendChild(removeBtn);

  card.appendChild(info);
  card.appendChild(actions);
  container.appendChild(card);

});


// ✅ CONFIRM ORDER
async function confirmOrder(index, card){

  let orders =
    JSON.parse(localStorage.getItem("pendingOrders"));

  const order = orders[index];

  await fetch("http://localhost:5000/update-orders?t=", {
    cache: "no-store",
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify(order.items)
  });

  // remove from storage
  orders.splice(index,1);
  localStorage.setItem("pendingOrders", JSON.stringify(orders));

  // remove visually (NO reload)
  card.remove();
}


// ❌ REMOVE WITHOUT CONFIRMING (NEW)
function removeOrder(index, card){

  let orders =
    JSON.parse(localStorage.getItem("pendingOrders"));

  orders.splice(index,1);
  localStorage.setItem("pendingOrders", JSON.stringify(orders));

  card.remove();
}
