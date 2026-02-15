const API = "http://localhost:5000/products";

document.getElementById("backBtn").onclick = () => {
  window.location.href = "index.html";
};

async function loadAnalytics() {
  const res = await fetch(`${API}?t=${Date.now()}`, {
    cache: "no-store",
  });

  const products = await res.json();

  // TOTAL PRODUCTS
  document.getElementById("totalProducts").textContent = products.length;

  // TOTAL ORDERS
  let totalOrders = 0;
  products.forEach((p) => (totalOrders += p.orders));

  document.getElementById("totalOrders").textContent = totalOrders;

  // SORT PRODUCTS BY ORDERS
  products.sort((a, b) => b.orders - a.orders);

  const table = document.getElementById("productTable");
  table.innerHTML = "";

  products.forEach((p) => {
    const row = document.createElement("tr");

    row.innerHTML = `
            <td>${p.name}</td>
            <td>${p.orders}</td>
        `;

    table.appendChild(row);
  });
}

loadAnalytics();
setInterval(loadAnalytics, 3000);