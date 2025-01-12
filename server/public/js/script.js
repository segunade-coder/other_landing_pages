const passwordInput = document.getElementById("loginPasswordInput");
const togglePassword = document.getElementById("toggleLoginPassword");
const navbar = document.querySelector(".navbar");

togglePassword.addEventListener("click", function (e) {
  e.preventDefault();
  const type =
    passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);
  togglePassword.querySelector("img").src =
    type === "password" ? "images/eye-slash.svg" : "images/eye-slash.svg";
});

document.getElementById("loginForm").addEventListener("submit", login);
function login(event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("loginPasswordInput").value;
  if (email && password && email !== "" && password !== "") {
    const button = document.getElementById("submitLogin");
    button.classList.add("loading");
    button.innerText = "Loading...";
    fetch("login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        button.innerText = "Login";
        button.classList.remove("loading");
        // button.innerText("")
        if (data.status) {
          alert(data.message);
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        button.innerText = "Login";
        button.classList.remove("loading");
        console.log(error);
        alert("something went wrong");
      });
  } else {
    alert("Fill in the required field(s)");
  }
}
// Get the necessary elements
const signUpButton = document.getElementById("signUp");
const signUpWrapper = document.querySelector(".signup-wrapper");
const closeButton = document.getElementById("closeButton");
const popup = document.getElementById("popUp");
const form = document.querySelector("form");

function showPopup() {
  signUpWrapper.style.display = "none";
  popup.classList.remove("d-none");
}

// function hidePopup() {
//   signUpWrapper.style.display = 'block';
//   popup.classList.add('d-none');
// }
// signUpButton.addEventListener('click', function(event) {
//   event.preventDefault();
//   showPopup();
// });

// closeButton.addEventListener('click', function() {
//   hidePopup();
// });

const loginButton = document.getElementById("loginButton");
const signUpPage = document.querySelector(".signup-wrapper");
const optPage = document.getElementById("popUp");
const loginPage = document.getElementById("loginPage");

function showLoginPage() {
  signUpPage.style.display = "none";
  optPage.style.display = "none";
  loginPage.classList.remove("d-none");
}
loginButton.addEventListener("click", showLoginPage);

const loginPasswordInput = document.getElementById("loginPasswordInput");
const toggleLoginPassword = document.getElementById("toggleLoginPassword");

// toggleLoginPassword.addEventListener('click', function () {
//   const type = loginPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
//   loginPasswordInput.setAttribute('type', type);
//   toggleLoginPassword.querySelector('img').src = type === 'password' ? 'images/eye-slash.svg' : 'images/eye-slash.svg';
// });

// loginPasswordInput.addEventListener('input', function () {
//   const passwordValue = loginPasswordInput.value;
//   const pattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
//   const isValidPassword = pattern.test(passwordValue);

//   if (!isValidPassword) {
//     passwordInput.setCustomValidity('Password must contain at least 8 characters, including one letter, one number, and one special character.');
//   } else {
//     loginPasswordInput.setCustomValidity('');
//   }
// });

// const closeLoginButton = document.getElementById('closeLoginButton');

// closeLoginButton.addEventListener('click', function() {
//   loginPage.classList.add('d-none');
//   signUpWrapper.style.display = 'block';
// });

// positionSelect.addEventListener("change", function () {
//   if (positionSelect.value === "teacher") {
//     schoolAccountContainer.style.display = "block";
//   } else {
//     schoolAccountContainer.style.display = "none";
//   }
// });

// document.addEventListener("scroll", () => {
//   const scrollPos = window.scrollY;
//   const navbarHeight = navbar.offsetHeight;
//   const maxScroll = 200;

//   const opacity = Math.min(scrollPos / maxScroll, 1);

//   navbar.style.backgroundColor = `rgba(1, 27, 51, ${0.29 + 0.71 * opacity})`;
// });

function move() {
  window.location.href = "https://rapidsuite.ng";
}

// function otp() {
//   window.location.href = "OTP.html";
// }
