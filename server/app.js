const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
const pool = require("./database/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authMiddleware = require("./auth/authMiddleware");
const authRoutes = require("./auth/authRoutes");
require("dotenv").config();

const app = express();
const port = process.env.PORT;
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: `https://live-chat-woad.vercel.app`,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Authorization"],
    credentials: true,
  },
});

app.use(express.static(path.join(__dirname, "../client/public")));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: `https://live-chat-woad.vercel.app`,
    credentials: true,
  })
);
app.use("/auth", authRoutes);

app.set("views", path.join(__dirname, "../client/public/views"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

server.listen(port, () => {
  console.log("Server listening on port: ", port);
});

let users = {};

io.on("connection", async (socket) => {
  // Mensagens em salas privadas
  socket.on("joinRoom", async (data) => {
    console.log(
      `Recebido joinRoom do cliente ${socket.id} para a sala:`,
      data.room
    );
    socket.join(data.room);

    const queryPreviousPrivateMessages = await pool.query(
      `
      SELECT 
        pm.id,
        pm.message as "messageContent",
        pm.created_at,
        u_from.username AS "senderName", 
        u_to.username AS to_username     
      FROM 
        chat.private_messages pm
      INNER JOIN 
        chat."user" u_from ON pm.from_user_id = u_from.id
      INNER JOIN 
        chat."user" u_to ON pm.to_user_id = u_to.id
      WHERE 
        (pm.from_user_id = $1 AND pm.to_user_id = $2)
        OR (pm.from_user_id = $2 AND pm.to_user_id = $1)
      ORDER BY 
        pm.created_at ASC;
    `,
      [data.senderUserId, data.receiverUserId]
    );
    socket.emit("previousPrivateMessages", queryPreviousPrivateMessages.rows);
  });

  const previousMessages = await pool.query(`
    SELECT 
      m.id AS message_id,
      m.message,
      u.id as userid,
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
    try {
      const query = await pool.query(
        `
          INSERT INTO chat.messages (message, user_id, created_at)
          VALUES ($1, $2, NOW()) RETURNING *;
        `,
        [data.message, data.author_id]
      );

      let message = {
        message: data.message,
        username: data.author,
        userId: data.author_id,
      };

      io.emit("newMessage", message);
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  });

  socket.on("individualMessage", async (data) => {
    try {
      const postIndividualMessage = await pool.query(
        `
        INSERT INTO 
          chat.private_messages (message, created_at, from_user_id, to_user_id)
        VALUES
         ($1, NOW(), $2, $3)
        RETURNING id;
        `,
        [data.messageContent, data.senderUserId, data.receiverUserId]
      );

      const newMessageId = postIndividualMessage.rows[0].id;

      io.to(data.room).emit("newIndividualMessage", data);
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  });

  // socket.on("disconnect", (user) => {
  //   console.log(user);
  // });
});

app.get("/api/user-info", authMiddleware.protect, (req, res) => {
  const user = req.user;

  res.json(user);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});
