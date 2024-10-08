var socket = io(`https://live-chat-bach.vercel.app`, {
  transports: ["websocket"],
  withCredentials: true,
});

let user;
document.addEventListener("DOMContentLoaded", () => {
  fetch(`https://live-chat-bach.vercel.app/api/user-info`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Garantir que os cookies sejam enviado junto coma  requisição
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.message);
      }
      return response.json();
    })
    .then((data) => {
      user = data;
      messages();
    })
    .catch((error) => {
      console.error("Error fetching user data: ", error);
    });
});

const messages = () => {
  // Mostrar Usuários Online
  const userButton = document.querySelector("#button-users-online");
  userButton.addEventListener("click", () => {
    const userOnlineContent = document.querySelector("#users-online-content");

    if (userOnlineContent.classList.contains("show")) {
      userOnlineContent.classList.remove("show");
    } else {
      userOnlineContent.classList.add("show");
    }
  });

  const scrollToBottom = () => {
    const messagesDiv = document.querySelector(".messages");
    setTimeout(() => {
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }, 0);
  };

  const renderMessages = (message) => {
    if (message.username === user.user) {
      $(".messages").append(
        "<div class='message sent'><strong>" +
          message.username +
          "</strong>: " +
          message.message +
          "</div>"
      );
    } else {
      $(".messages").append(
        "<div class='message'><strong>" +
          `<a href='/individual-chat/?id=${message.userid}&username=${message.username}'>${message.username}</a>` +
          "</strong>: " +
          message.message +
          "</div>"
      );
    }
    setTimeout(() => {
      scrollToBottom();
    }, 0);
  };

  socket.on("onlineUsers", (users) => {
    const usersContainer = document.getElementById("users-online");
    usersContainer.innerHTML = "";

    users.forEach((userOn) => {
      const userItem = document.createElement("li");
      userItem.textContent = userOn.user;
      userItem.classList.add("user-item");
      usersContainer.appendChild(userItem);
    });
  });

  socket.on("previousMessage", (messages) => {
    for (let message of messages) {
      renderMessages(message);
    }
  });

  socket.on("newMessage", (message) => {
    renderMessages(message);
  });

  $("#chat").submit((event) => {
    event.preventDefault();
    var message = $("input[name=message]").val();

    if (message.length) {
      var messageObject = {
        author: user.user,
        author_id: user.id,
        message: message,
      };

      socket.emit("messageSend", messageObject);
      $("input[name=message]").val("");
    }
  });
};
