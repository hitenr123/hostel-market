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
    animName = form === "register" ? "flipGradientMobile" : "flipGradientMobileReverse";
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