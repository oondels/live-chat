document.addEventListener("DOMContentLoaded", () => {
  const authButtons = document.querySelector(".login-register");
  const logoutButton = document.querySelector(".logout-btn");

  const navBar = document.querySelector(".navbar");
  const menuButton = document.querySelector(".menu-icon");
  menuButton.addEventListener("click", () => {
    navBar.classList.toggle("show");
  });

  const alert = document.querySelector(".alert");
  const alertMessage = document.querySelector(".alert-text");
  const closeAlertMessage = document.querySelector("close-alert");
  closeAlertMessage,
    addEventListener("click", () => {
      alert.classList.remove("show-alert");
    });

  let user;
  //Getting user data
  fetch("https://live-chat-b304260d434c.herokuapp.com/api/user-info", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        console.error("Failed to get user data");
      }
      return response.json();
    })
    .then((data) => {
      authButtons.style.display = "none";
      logoutButton.style.display = "block";
      user = data;
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
    });

  //Logout
  logoutButton.addEventListener("click", () => {
    fetch("https://live-chat-b304260d434c.herokuapp.com/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          alertMessage.innerText = data.message;
          alert.classList.add("show-alert");
          throw new Error(data.message);
        }
        return response.json();
      })
      .then((data) => {
        alertMessage.innerText = data.message;
        alert.classList.add("show-alert");

        setTimeout(() => {
          window.location.href =
            "https://live-chat-b304260d434c.herokuapp.com/chat-geral";
          alert.classList.remove("show-alert");
        }, 1700);
      });
  });

  //Slides
  const slides = document.querySelectorAll("span");
  let currentSlide = 0;

  slides[currentSlide].classList.add("show");
  const showSlide = () => {
    slides.forEach((slide) => {
      slide.classList.remove("show");
    });

    slides[currentSlide].classList.add("show");
    currentSlide = (currentSlide + 1) % slides.length;
  };

  setInterval(showSlide, 3000);

  const warningIcon = document.getElementById("warning-icon");
  warningIcon.addEventListener("click", () => {
    const warningContainer = document.getElementById("warning-message");
    warningContainer.classList.add("show-warning");
  });

  // Fechar o aviso
  document.getElementById("close-warning").addEventListener("click", () => {
    document.getElementById("warning-message").classList.remove("show-warning");
  });
});
