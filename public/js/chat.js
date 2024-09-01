const socket = io();

const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const logoutButton = document.getElementById("logout-button");

sendButton.addEventListener("click", () => {
  const message = messageInput.value;
  if (message) {
    socket.emit("chat message", message);
    messageInput.value = ""; // Clear the input field after sending
  }
});
