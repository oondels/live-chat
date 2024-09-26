var socket = io("https://live-chat-b304260d434c.herokuapp.com/");
const params = new URLSearchParams(window.location.search);
const chatUserId = params.get("id");
const chatUsername = params.get("username");

let user;
document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:2399/api/user-info", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.message);
      }
      return response.json();
    })
    .then((data) => {
      user = data;

      privateMessages();
    })
    .catch((error) => {
      console.error("Error fetching user data: ", error);
    });
});

const privateMessages = () => {
  var socket = io("https://live-chat-b304260d434c.herokuapp.com/");

  const chatUserTitle = document.getElementById("private-chat");
  chatUserTitle.innerHTML = `Chating with ${chatUsername}`;

  // Gerenciamento de Mensagens
  const scrollToBottom = () => {
    const messagesDiv = document.querySelector(".messages");
    setTimeout(() => {
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }, 0);
  };

  const renderMessages = (message) => {
    if (message.senderName === user.user) {
      $(".messages").append(
        "<div class='message sent'><strong>" +
          message.senderName +
          "</strong>: " +
          message.messageContent +
          "</div>"
      );
    } else {
      $(".messages").append(
        "<div class='message'><strong>" +
          message.senderName +
          "</strong>: " +
          message.messageContent +
          "</div>"
      );
    }
    setTimeout(() => {
      scrollToBottom();
    }, 0);
  };

  // Sala privada para os usuários
  socket.emit("joinRoom", {
    room: `chat_${Math.min(user.id, chatUserId)}_${Math.max(
      user.id,
      chatUserId
    )}`,
    receiverUserId: chatUserId,
    senderUserId: user.id,
  });

  socket.on("previousPrivateMessages", (messages) => {
    messages.forEach((message) => {
      renderMessages(message);
    });
  });

  $("#individual-chat").submit((event) => {
    event.preventDefault();
    var message = $("input[name=message]").val();

    if (message.length) {
      var messageObject = {
        senderName: user.user,
        senderUserId: user.id,
        receiverUserId: chatUserId,
        receiverName: chatUsername,
        messageContent: message,
        room: `chat_${Math.min(user.id, chatUserId)}_${Math.max(
          user.id,
          chatUserId
        )}`,
      };

      socket.emit("individualMessage", messageObject);
      $("input[name=message]").val("");
    }
  });

  socket.on("newIndividualMessage", (message) => {
    renderMessages(message);
  });
};
