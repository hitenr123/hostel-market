document.addEventListener("DOMContentLoaded", () => {
  // ===== CHECK LOGIN =====
  const username = localStorage.getItem("loggedInUser");
  const roomno = localStorage.getItem("roomNo");

  if (!username || !roomno) {
    window.location.href = "login.html";
    return;
  }

  // ===== SHOW USER INFO =====
  const usernameDisplay = document.getElementById("usernameDisplay");
  const roomnoDisplay = document.getElementById("roomnoDisplay");

  if (usernameDisplay) usernameDisplay.textContent = "Username: " + username;
  if (roomnoDisplay) roomnoDisplay.textContent = "Room No: " + roomno;

  // ===== LOGOUT =====
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.onclick = () => {
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("roomNo");
      window.location.href = "login.html";
    };
  }

  // ===== THEME TOGGLE =====
  const toggleBtn = document.getElementById("themeToggle");

  if (toggleBtn) {
    const icon = toggleBtn.querySelector("i");

    if (localStorage.getItem("theme") === "light") {
      document.body.classList.add("light");
      icon.classList.replace("fa-moon", "fa-sun");
    }

    toggleBtn.addEventListener("click", () => {
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
  }

  // ===== BACK BUTTON =====
  const backBtn = document.getElementById("backBtn");

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  // ===== FETCH ORDERS =====
  fetch(
    `https://hostel-market-production.up.railway.app/orders/${encodeURIComponent(username)}`,
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error("Server error");
      }
      return res.json();
    })
    .then((data) => {
      const orderList = document.getElementById("orderList");

      if (!orderList) return;

      if (!data || data.length === 0) {
        orderList.innerHTML = "<p>No orders yet.</p>";
        return;
      }

      data.forEach((order) => {
        const div = document.createElement("div");
        div.classList.add("order-item");

        div.innerHTML = `
          <strong>${order.product_name}</strong><br>
          Qty: ${order.quantity}<br>
          Total: ₹${order.total_price}<br>
          <small>${order.order_date}</small>
        `;

        orderList.appendChild(div);
      });
    })
    .catch((error) => {
      console.error("Error fetching orders:", error);
    });
});
