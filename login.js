const signupBtn = document.querySelector(".signup-link");
const signinBtn = document.querySelector(".signin-link");
const login = document.querySelector(".login");
const register = document.querySelector(".register");
const welcomeBack = document.querySelector(".welcome-back");
const welcome = document.querySelector(".welcome");
const box = document.querySelector(".login-box");

// Function to detect mobile
function isMobile() {
  return window.innerWidth <= 900;
}

// Function to show a form with animation
function showForm(form) {
  // hide everything during animation
  login.style.display = "none";
  register.style.display = "none";
  welcomeBack.style.display = "none";
  welcome.style.display = "none";

  // Determine animation
  let animName;
  if (isMobile()) {
    animName =
      form === "register" ? "flipGradientMobile" : "flipGradientMobileReverse";
  } else {
    animName = form === "register" ? "flipGradient" : "flipGradientReverse";
  }

  // Apply animation
  box.style.animation = `${animName} 1.2s ease forwards`;

  // Flip layout after animation
  setTimeout(() => {
    if (form === "register") {
      box.style.flexDirection = isMobile() ? "column-reverse" : "row-reverse"; // flipped
      register.style.display = "flex";
      welcome.style.display = "block";
    } else {
      box.style.flexDirection = isMobile() ? "column" : "row"; // normal
      login.style.display = "flex";
      welcomeBack.style.display = "block";
    }
  }, 1200);

  // Save current form
  localStorage.setItem("currentForm", form);
}

// On page load, show last form
const savedForm = localStorage.getItem("currentForm") || "register";
showForm(savedForm);

// Event listeners
signupBtn.addEventListener("click", () => showForm("register"));
signinBtn.addEventListener("click", () => showForm("login"));

let lastWidth = window.innerWidth;

window.addEventListener("resize", () => {
  if (window.innerWidth > 900 && window.innerWidth !== lastWidth) {
    const currentForm = localStorage.getItem("currentForm") || "register";
    showForm(currentForm);
    lastWidth = window.innerWidth;
  }
});

// ===== POPUP FUNCTION =====
function showPopup(title, name = "", type = "success") {
  let popup = document.getElementById("popup");
  if (!popup) {
    popup = document.createElement("div");
    popup.id = "popup";
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%) scale(0)";
    popup.style.padding = "20px 30px";
    popup.style.borderRadius = "10px";
    popup.style.fontFamily = "Segoe UI, sans-serif";
    popup.style.textAlign = "center";
    popup.style.zIndex = "10000";
    popup.style.transition = "0.3s ease";
    document.body.appendChild(popup);
  }

  popup.innerHTML =
    `<h2 style="color:${type === "success" ? "green" : "red"}">${title}</h2>` +
    (name ? `<p style="color:cyan">${name}</p>` : "");

  popup.style.transform = "translate(-50%, -50%) scale(1)";
  setTimeout(() => {
    popup.style.transform = "translate(-50%, -50%) scale(0)";
  }, 3000);
}

// ===== REGISTER FORM SUBMIT =====
register.querySelector("form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const registerUsername = register.querySelector("#register-username").value;
  const registerPassword = register.querySelector("#register-password").value;
  try {
    const res = await fetch(
      "https://hostel-market-production.up.railway.app/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registerUsername: registerUsername,
          registerPassword: registerPassword,
        }),
      },
    );
    const data = await res.json();

    if (data.status === "REGISTER_SUCCESS") {
      showPopup("WELCOME", data.registerUsername, "success");
    } else if (data.status === "ALREADY_REGISTERED") {
      showPopup("ALREADY REGISTERED", "", "error");
    } else if (data.status === "ERROR") {
      showPopup(data.message, "", "error");
    }
  } catch (err) {
    showPopup("NETWORK ERROR", "", "error");
  }
});

// ===== LOGIN FORM SUBMIT =====
login.querySelector("form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const loginUsername = login.querySelector("#login-username").value;
  const loginPassword = login.querySelector("#login-password").value;

  try {
    const res = await fetch(
      "https://hostel-market-production.up.railway.app/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loginUsername: loginUsername,
          loginPassword: loginPassword,
        }),
      },
    );

    const data = await res.json();

    if (data.status === "LOGIN_SUCCESS") {
      showPopup("WELCOME BACK !!", data.loginUsername, "success");
    } else if (data.status === "INVALID_LOGIN") {
      document.getElementById("login-error").textContent = "Invalid Login";
    } else if (data.status === "ERROR") {
      showPopup(data.message, "", "error");
    }
    document.getElementById("login-error").textContent = "";
  } catch (err) {
    showPopup("NETWORK ERROR", "", "error");
  }
});
