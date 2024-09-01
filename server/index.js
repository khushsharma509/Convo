const express = require("express");
const session = require("express-session");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const users = {}; // Stores registered users
const sessionMiddleware = session({
  secret: "secret-key",
  resave: false,
  saveUninitialized: true,
});


// Shared session with socket.io
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);

// Shared session with socket.io
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});
// Middleware to protect routes
function isAuthenticated(req, res, next) {
  if (req.session.username) {
    next();
  } else {
    res.redirect("/login");
  }
}

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
app.get("/chat", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/views/chat.html"));
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

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

io.on("connection", (socket) => {
  const session = socket.request.session;
  if (!session.username) {
    socket.disconnect(true);
    return;
  }

  console.log(${session.username} connected);

  socket.on("chat message", (msg) => {
    const message = ${session.username}: ${msg};
    io.emit("chat message", message); 
  });

  socket.on("disconnect", () => {
    console.log(${session.username} disconnected);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
