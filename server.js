const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Serve static files from 'public' folder (CSS, JS, HTML)
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// ✅ Serve index.html when root is accessed
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Handle chatbot replies
app.get("/reply", (req, res) => {
  const msg = req.query.msg.toLowerCase();
  let reply = "🤔 Let me search that for you...";

  if (msg.includes("cafe") || msg.includes("restaurant")) {
    reply = "☕ Top cafes near you: Blue Tokai, Third Wave, and Starbucks.";
  } else if (msg.includes("movie")) {
    reply = "🎬 Currently trending movies: Inception, Oppenheimer, and Barbie.";
  } else if (msg.includes("weather")) {
    reply = "🌤️ It’s sunny today! Great time to go out.";
  }

  res.send({ reply });
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
