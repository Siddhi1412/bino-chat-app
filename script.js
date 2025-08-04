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

  // Fetch from backend
  fetch(`http://localhost:3000/api/reply?msg=${encodeURIComponent(message)}`)
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
