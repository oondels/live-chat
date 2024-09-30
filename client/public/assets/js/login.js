import { ip } from "../../ip.js";

var socket = io(ip);

const alert = document.querySelector(".alert");
const alertMessage = document.querySelector(".alert-text");
const closeAlertMessage = document.querySelector("close-alert");
closeAlertMessage,
  addEventListener("click", () => {
    alert.classList.remove("show-alert");
  });

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

    fetch(`${ip}/auth/login`, {
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

        socket.emit("loggedUser", data.user);

        setTimeout(() => {
          window.location.href = `${ip}/chat-geral`;
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
