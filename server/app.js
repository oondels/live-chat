const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
const pool = require("./database/db");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const authMiddleware = require("./auth/authMiddleware");
const authRoutes = require("./auth/authRoutes");
require("dotenv").config();

const app = express();
const port = process.env.PORT;
const server = http.createServer(app);
const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "../client/public")));
app.use(bodyParser.json());
app.use(cookieParser());
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
    console.log(queryPreviousPrivateMessages.rows);
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
    console.log(data);
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
    console.log(data);

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

app.get("/", (req, res) => {
  res.render("home.html");
});

app.get("/chat-geral", authMiddleware.protect, (req, res) => {
  const user = req.user;

  res.render("index.html", {
    userId: user.id,
    user: user.user,
    userEmail: user.email,
  });
});

app.get("/individual-chat", authMiddleware.protect, (req, res) => {
  const user = req.user;
  res.render("individual-chating.html", {
    userId: user.id,
    user: user.user,
    userEmail: user.email,
  });
});

app.get("/api/user-info", authMiddleware.protect, (req, res) => {
  const user = req.user;

  res.json(user);
});

app.get("/protected", authMiddleware.protect, (req, res) => {
  res.json(req.user);
});

app.get("/login", (req, res) => {
  if (req.cookies.token) {
    // Tenta verificar o token
    try {
      jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          // Se o token for inválido ou expirado, renderiza a página de login
          return res.render("login.html");
        }
        // Se o token for válido, redireciona para a página apropriada (por exemplo, /dashboard)
        return res.redirect("/"); // Redirecione para a página após login
      });
    } catch (err) {
      // Se houver um erro na verificação do token, renderiza a página de login
      return res.render("login.html");
    }
  } else {
    // Se não houver token, exibe a página de login
    res.render("login.html");
  }
});

app.get("/register", (req, res) => {
  if (req.cookies.token) {
    try {
      jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.render("register.html");
        }

        return res.redirect("/");
      });
    } catch (err) {
      return res.render("register.html");
    }
  } else {
    res.render("register.html");
  }
});

app.get("/teste", (req, res) => {
  res.send("Heelo World!");
});
