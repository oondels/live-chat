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

    fetch(`${ip}/auth/register`, {
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
        alertMessage.innerText = data.message;
        alert.classList.add("show-alert");

        setTimeout(() => {
          window.location.href = `${ip}/login`;
        }, 700);
      })
      .catch((error) => {
        console.log("Server connection failed: ", error.message);
      });
  });
}
