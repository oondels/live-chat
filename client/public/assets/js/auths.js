import ip from "../ip.js";

//Login

var loginForm = document.querySelector("#login-form");
if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    var user = document.querySelector("input[name=login]").value;
    var password = document.querySelector("input[name=password]").value;

    if (!user.length && !password.length) {
      return alet("All fields are requuired");
    }

    let userInfo = {
      user: user,
      password: password,
    };

    fetch(`http://${ip}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
      //Garante que os cookies sejam enviados junto
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fecth");
        }
        return response.json();
      })
      .then((data) => {
        alert("Logged succesfully");
        setTimeout(() => {
          window.location.href = `http://localhost:2699/chat-geral`;
        }, 700);
      })
      .catch((error) => {
        console.error("Server connection failed", error.message);
      });
  });
}

// Register
var registerForm = document.querySelector("#register-form");
if (registerForm) {
  form.addEventListener("submit", (event) => {
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

    fetch(`http://${ip}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fecth");
        }
        return response.json();
      })
      .then((data) => {
        alert("Registered Successfully!");

        setTimeout(() => {
          window.location.href = `http://${ip}/login`;
        }, 700);
      })
      .catch((error) => {
        console.log("Server connection failed: ", error.message);
      });
  });
}
