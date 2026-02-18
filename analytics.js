const API = "http://0.0.0.0:5000/products";

let revenueLineChart;
let revenuePieChart;
let firstLineRender = true;
let firstPieRender = true;


async function loadAnalytics() {
  const res = await fetch(`${API}?t=${Date.now()}`, { cache: "no-store" });
  const products = await res.json();

  // ---------- BASIC ----------
  document.getElementById("totalProducts").textContent = products.length;

  let totalOrders = 0;
  let revenue = 0;
  let productRevenue = {};

  products.forEach((p) => {
    totalOrders += p.orders;
    revenue += p.revenue;
    productRevenue[p.name] = p.revenue;
  });

  document.getElementById("totalOrders").textContent = totalOrders;
  document.getElementById("revenue").textContent = "₹" + revenue;

  // ---------- MOST ORDERED ----------
  const most = [...products].sort((a, b) => b.orders - a.orders)[0];
  document.getElementById("mostOrdered").textContent = most.name;

  // ---------- PEAK TIME ----------
  let hours = {};
  products.forEach((p) => {
    if (p.last_order_time) {
      const h = new Date(p.last_order_time).getHours();
      hours[h] = (hours[h] || 0) + 1;
    }
  });

  let peak = Object.entries(hours).sort((a, b) => b[1] - a[1])[0];
  document.getElementById("peakTime").textContent = peak
    ? peak[0] + ":00"
    : "N/A";

  // ---------- TABLE ----------
  const table = document.getElementById("productTable");
  table.innerHTML = "";
  products.sort((a, b) => b.orders - a.orders);
  products.forEach((p) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${p.name}</td><td>${p.orders}</td>`;
    table.appendChild(row);
  });

  // ---------- CHARTS ----------

  // Revenue Line Chart (per day)
  // Aggregate revenue by last_order_date
  const revenueByDate = {};
  products.forEach((p) => {
    if (p.last_order_date) {
      revenueByDate[p.last_order_date] =
        (revenueByDate[p.last_order_date] || 0) + p.revenue;
    }
  });
  const dates = Object.keys(revenueByDate).sort();
  const revenues = dates.map((d) => revenueByDate[d]);

  if (revenueLineChart) revenueLineChart.destroy();
  const ctxLine = document.getElementById("revenueLine").getContext("2d");
  const gradient = ctxLine.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, "rgba(54,162,235,0.4)");
  gradient.addColorStop(1, "rgba(54,162,235,0)");

  revenueLineChart = new Chart(ctxLine, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          label: "Revenue",
          data: revenues,
          borderWidth: 3,
          borderColor: "#369eff",
          backgroundColor: gradient,
          fill: true,
          tension: 0.35,
          pointRadius: 5,
          pointHoverRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: firstLineRender ? { duration: 1600 } : false,

      animations: {
        x: {
          type: "number",
          easing: "linear",
          duration: 1600,
          from: 0,
        },
        y: {
          type: "number",
          easing: "easeOutQuart",
          duration: 1600,
          from: (ctx) => {
            if (ctx.type === "data") {
              return ctx.chart.scales.y.getPixelForValue(0);
            }
          },
        },
      },

      transitions: {
        show: {
          animations: {
            x: { from: 0 },
            y: { from: 0 },
          },
        },
      },

      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          ticks: {
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 5,
          },
          grid: { display: true },
        },
        y: {
          beginAtZero: true,
        },
      },
    },
  });
  firstLineRender = false;

  // Revenue Pie Chart (per product)
  // Revenue Pie Chart (per product)
  // ---------- Revenue Pie Chart ----------

const productNames = Object.keys(productRevenue);
const productValues = Object.values(productRevenue);

if (revenuePieChart) revenuePieChart.destroy();

const ctxPie = document.getElementById("revenuePie").getContext("2d");

revenuePieChart = new Chart(ctxPie, {
  type: "pie",
  data: {
    labels: productNames,
    datasets: [{
      data: productValues,
      backgroundColor: [
        "#4e79ff",
        "#ff6384",
        "#ffcd56",
        "#2ecc71",
        "#8e44ad",
        "#f39c12",
      ],
      borderWidth: 2,
    }]
  },

  options: {
    responsive: true,
    maintainAspectRatio: false,

    // ⭐ EXACT SAME BEHAVIOR AS LINE GRAPH
    animation: firstPieRender
      ? {
          animateRotate: true,
          animateScale: true,
          duration: 1400
        }
      : false,

    plugins: {
      legend: { position: "bottom" },

      // ⭐ Hover tooltip (automatic info popup)
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(context) {
            const value = context.raw;
            const total = context.dataset.data.reduce((a,b)=>a+b,0);
            const percent = ((value/total)*100).toFixed(1);
            return `₹${value} (${percent}%)`;
          }
        }
      }
    }
  }
});

// Disable animation after first render
firstPieRender = false;
}
loadAnalytics();
setInterval(loadAnalytics, 5000);
