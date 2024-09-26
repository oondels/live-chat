const alert = document.querySelector(".alert");
const alertMessage = document.querySelector(".alert-text");
const closeAlertMessage = document.querySelector("close-alert");
closeAlertMessage,
  addEventListener("click", () => {
    alert.classList.remove("show-alert");
  });

// Login
var loginForm = document.querySelector("#login-form");
if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    var user = document.querySelector("input[name=login]").value;
    var password = document.querySelector("input[name=password]").value;

    if (!user.length || !password.length) {
      return alert("All fields are required");
    }

    let userInfo = {
      user: user,
      password: password,
    };

    fetch("http://localhost:2399/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          alertMessage.innerText = data.message;
          alert.classList.add("show-alert");
          throw new Error(data.message);
        }
        return data;
      })
      .then((data) => {
        alertMessage.innerText = data.message;
        alert.classList.add("show-alert");

        setTimeout(() => {
          window.location.href = "http://localhost:2399/chat-geral";
          alert.classList.remove("show-alert");
        }, 1000);
      })
      .catch((error) => {
        console.error(error);
        alertMessage.innerText = error.message;
        alert.classList.add("show-alert");
      });
  });
}

// Register
var registerForm = document.querySelector("#register-form");
if (registerForm) {
  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    var user = document.querySelector("input[name=username]").value;
    var email = document.querySelector("input[name=email]").value;
    var password = document.querySelector("input[name=password]").value;

    if (!user.length || !email.length || !password.length) {
      return alert("All fields are required!");
    }

    let userData = {
      user: user,
      email: email,
      password: password,
    };

    fetch("http://localhost:2399/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          alertMessage.innerText = data.message;
          alert.classList.add("show-alert");
          throw new Error(data.message);
        }
        return data;
      })
      .then((data) => {
        alert("Registered Successfully!");

        setTimeout(() => {
          window.location.href = "http://localhost:2399/login";
        }, 700);
      })
      .catch((error) => {
        console.log("Server connection failed: ", error.message);
      });
  });
}
