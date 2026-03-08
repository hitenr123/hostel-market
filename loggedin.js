// ===== LOGGED IN USER PAGE =====

// Show username and room number
const username = localStorage.getItem("loggedInUser");
const roomno = localStorage.getItem("roomNo");

if (username && roomno) {
  document.getElementById("usernameDisplay").textContent = "Username: " + username;
  document.getElementById("roomnoDisplay").textContent = "Room No: " + roomno;
} else {
  window.location.href = "login.html"; // redirect if not logged in
}

// Logout button
document.getElementById("logoutBtn").onclick = () => {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("roomNo");
  window.location.href = "index.html";
};

// ===== THEME TOGGLE =====
const toggleBtn = document.getElementById("themeToggle");
const icon = toggleBtn.querySelector("i");

// Load saved theme
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
  icon.classList.replace("fa-moon", "fa-sun");
}

// Toggle theme
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

document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("loggedInUser");
  const roomno = localStorage.getItem("roomNo");

  if (!username || !roomno) {
    // If not logged in, go back to login
    window.location.href = "login.html";
    return;
  }

  // Show user details
  document.getElementById("usernameDisplay").textContent = "Username: " + username;
  document.getElementById("roomnoDisplay").textContent = "Room No: " + roomno;
});

// Back button functionality
document.getElementById("backBtn").addEventListener("click", function() {
  if (document.referrer) {
    window.history.back();
  } else {
    window.location.href = "index.html"; // your homepage
  }
});