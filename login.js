const signupBtn = document.querySelector(".signup-link");
const signinBtn = document.querySelector(".signin-link");
const login = document.querySelector(".login");
const register = document.querySelector(".register");
const welcomeBack = document.querySelector(".welcome-back");
const welcome = document.querySelector(".welcome");
const box = document.querySelector(".login-box");

// --- Function to show a form with animation ---
function showForm(form) {
  // hide everything during animation
  login.style.display = "none";
  register.style.display = "none";
  welcomeBack.style.display = "none";
  welcome.style.display = "none";

  if (form === "register") {
    box.style.animation = "flipGradient 1.2s ease forwards";
    setTimeout(() => {
      box.style.flexDirection = "row-reverse";
      register.style.display = "flex";
      welcome.style.display = "block";
    }, 1200);
  } else if (form === "login") {
    box.style.animation = "flipGradientReverse 1.2s ease forwards";
    setTimeout(() => {
      box.style.flexDirection = "row";
      login.style.display = "flex";
      welcomeBack.style.display = "block";
    }, 1200);
  }

  // save current form in localStorage
  localStorage.setItem("currentForm", form);
}

// --- On page load, show last form with animation ---
const savedForm = localStorage.getItem("currentForm") || "register";
showForm(savedForm);

// --- Event listeners ---
signupBtn.addEventListener("click", () => showForm("register"));
signinBtn.addEventListener("click", () => showForm("login"));
