// import ip from "../ip.js";

var form = document.querySelector("#login-form");
form.addEventListener("submit", (event) => {
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

  fetch(`http://live-chat-sand.vercel.app/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userInfo),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fecth");
      }
      return response.json();
    })
    .then((data) => {
      localStorage.setItem("token", data.token);
      alert("Logged succesfully");

      setTimeout(() => {
        window.location.href = `http://live-chat-sand.vercel.app/chat-geral`;
      }, 700);
    })
    .catch((error) => {
      console.error("Server connection failed", error.message);
    });
});

// Register
var form = document.querySelector("#register-form");
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

  fetch(`http://live-chat-sand.vercel.app/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
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
        window.location.href = `http://live-chat-sand.vercel.app/login`;
      }, 700);
    })
    .catch((error) => {
      console.log("Server connection failed: ", error.message);
    });
});
