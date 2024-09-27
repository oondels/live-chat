const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
const cookieParser = require("cookie-parser");

const ip = require("./ip");

const authMiddleware = require("./auth/authMiddleware");
const authRoutes = require("./auth/authRoutes");
require("dotenv").config();

const app = express();
const port = process.env.PORT;
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, "./client/public")));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/auth", authRoutes);

app.set("views", path.join(__dirname, "./client/public/views"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

server.listen(port, () => {
  console.log("Server listening on port: ", port);
});

const io = require("socket.io")(server, {
  cors: {
    origin: ip,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Authorization"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

const configureSocket = require("./socket/socket");
configureSocket(io);

app.get("/", (req, res) => {
  res.render("home.html");
});

app.get("/chat-geral", authMiddleware.protect, (req, res) => {
  const user = req.user;

  res.render("chat-geral.html", {
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

// app.get("/protected", authMiddleware.protect, (req, res) => {
//   res.json(req.user);
// });

app.get("/login", (req, res) => {
  res.render("login.html");
});

app.get("/register", (req, res) => {
  res.render("register.html");
});

app.get("/teste", (req, res) => {
  res.send("Hello World");
});

app.get("/nav-bar", (req, res) => {
  res.render("./components/navbar.html");
});
