const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
const pool = require("./database/db");

const authMiddleware = require("./auth/authMiddleware");
const authRoutes = require("./auth/authRoutes");
require("dotenv").config();

const app = express();
const port = process.env.PORT;
const server = http.createServer(app);
const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "../client/public")));
app.use(bodyParser.json());
app.use("/auth", authRoutes);

app.set("views", path.join(__dirname, "../client/public/views"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

server.listen(port, () => {
  console.log("Server listening on port: ", port);
});

let users = {};

io.on("connection", async (socket) => {
  socket.on("userLogged", (user) => {
    if (!users[user.id]) {
      users[user.id] = user;
    }
    console.log(users);
    console.log(`${user.user} has logged.`);

    io.emit("onlineUsers", Object.values(users));
  });

  const previousMessages = await pool.query(`
    SELECT 
      m.id AS message_id,
      m.message,
      u.username,
      m.created_at
    FROM
      chat.messages m
    INNER JOIN
      chat."user" u
    ON
      m.user_id = u.id
    ORDER BY
      m.created_at ASC;
    `);

  socket.emit("previousMessage", previousMessages.rows, users);

  socket.on("messageSend", async (data) => {
    console.log(data);
    try {
      const query = await pool.query(
        `
          INSERT INTO chat.messages (message, user_id, created_at)
          VALUES ($1, $2, NOW()) RETURNING *;
        `,
        [data.message, data.author.id]
      );

      let message = {
        message: data.message,
        username: data.author.user,
      };

      io.emit("newMessage", message);
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  });

  socket.on("disconnect", (user) => {
    console.log(user);
  });
});

app.get("/", (req, res) => {
  res.render("home.html");
});

app.get("/chat-geral", (req, res) => {
  const user = req.user;
  res.render("index.html");
});

app.get("/protected", authMiddleware.protect, (req, res) => {
  res.json(req.user);
});

app.get("/login", (req, res) => {
  res.render("login.html");
});

app.get("/register", (req, res) => {
  res.render("register.html");
});
