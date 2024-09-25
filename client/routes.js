const express = require("express");
const path = require("path");
const http = require("http");

const app = express();
const server = http.createServer(app);
const port = 2699;

server.listen(port, () => {
  console.log(`Client listening on port: ${port}`);
});

app.use(express.static(path.join(__dirname, "./public")));
app.set("views", path.join(__dirname, "../client/public/views"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.get("/", (req, res) => {
  res.render("home.html");
});

app.get("/login", (req, res) => {
  res.render("login.html");
});

app.get("/register", (req, res) => {
  res.render("register.html");
});

app.get("/chat-geral", (req, res) => {
  res.render("chat-geral.html");
});

app.get("/individual-chat", (req, res) => {
  res.render("individual-chating.html");
});
