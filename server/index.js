const express = require("express");
const session = require("express-session");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);


app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.redirect("/signup");
});

app.get("/signup", (req, res) => {
  if (req.session.username) {
    res.redirect("/chat");
  } else {
    res.sendFile(path.join(__dirname, "../public/views/signup.html"));
  }
});

app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  if (users[username]) {
    res.send(
      '<script>alert("Username already exists!"); window.location.href="/signup";</script>'
    );
  } else {
    users[username] = password;
    req.session.username = username;
    res.redirect("/login");
  }
});

app.get("/login", (req, res) => {
  if (req.session.username) {
    res.redirect("/chat");
  } else {
    res.sendFile(path.join(__dirname, "../public/views/login.html"));
  }
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (users[username] && users[username] === password) {
    req.session.username = username;
    res.redirect("/chat");
  } else {
    res.send(
      '<script>alert("Invalid credentials!"); window.location.href="/login";</script>'
    );
  }
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
