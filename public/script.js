function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (message === "") return;

  const chatbox = document.getElementById("chatbox");

  // Show user's message
  const userMsg = document.createElement("div");
  userMsg.className = "message user";
  userMsg.innerText = message;
  chatbox.appendChild(userMsg);

  // ✅ Corrected backend fetch URL
  fetch(`/reply?msg=${encodeURIComponent(message)}`)
    .then((res) => res.json())
    .then((data) => {
      const botMsg = document.createElement("div");
      botMsg.className = "message bot";
      botMsg.innerText = data.reply;
      chatbox.appendChild(botMsg);
      chatbox.scrollTop = chatbox.scrollHeight;
    })
    .catch(() => {
      const botMsg = document.createElement("div");
      botMsg.className = "message bot";
      botMsg.innerText = "⚠️ Error connecting to server.";
      chatbox.appendChild(botMsg);
    });

  input.value = "";
}

// 🔥 Add this to support sending message with Enter key
document.getElementById("userInput").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});
