const API = "http://localhost:5000/products";

document.getElementById("backBtn").onclick = () => {
  window.location.href = "index.html";
};

async function loadAnalytics() {

  const res = await fetch(`${API}?t=${Date.now()}`, { cache:"no-store" });
  const products = await res.json();

  // ---------- BASIC ----------
  document.getElementById("totalProducts").textContent = products.length;

  let totalOrders = 0;
  let revenue = 0;

  products.forEach(p => {
    totalOrders += p.orders;
    revenue += p.orders * p.price;
  });

  document.getElementById("totalOrders").textContent = totalOrders;
  document.getElementById("revenue").textContent = "₹" + revenue;

  // ---------- MOST ORDERED ----------
  const most = [...products].sort((a,b)=>b.orders-a.orders)[0];
  document.getElementById("mostOrdered").textContent = most.name;

  // ---------- PEAK TIME ----------
  let hours = {};
  products.forEach(p=>{
    if(p.last_order_time){
      const h = new Date(p.last_order_time).getHours();
      hours[h] = (hours[h]||0)+1;
    }
  });

  let peak = Object.entries(hours).sort((a,b)=>b[1]-a[1])[0];
  document.getElementById("peakTime").textContent =
      peak ? peak[0]+":00" : "N/A";

  // ---------- TABLE ----------
  const table = document.getElementById("productTable");
  table.innerHTML = "";

  products.sort((a,b)=>b.orders-a.orders);

  products.forEach(p=>{
    const row=document.createElement("tr");
    row.innerHTML=`<td>${p.name}</td><td>${p.orders}</td>`;
    table.appendChild(row);
  });

}

loadAnalytics();
setInterval(loadAnalytics,3000);
