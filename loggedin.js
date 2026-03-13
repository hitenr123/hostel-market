document.addEventListener("DOMContentLoaded", () => {

  // ===== CHECK LOGIN =====
  const username = localStorage.getItem("loggedInUser");
  const roomno = localStorage.getItem("roomNo");

  if (!username || !roomno) {
    window.location.href = "login.html";
    return;
  }

  // Show user info
  document.getElementById("usernameDisplay").textContent =
    "Username: " + username;

  document.getElementById("roomnoDisplay").textContent =
    "Room No: " + roomno;


  // ===== LOGOUT =====
  document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("roomNo");
    window.location.href = "login.html";
  };


  // ===== THEME TOGGLE =====
  const toggleBtn = document.getElementById("themeToggle");
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


  // ===== BACK BUTTON =====
  document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "index.html";
  });

});