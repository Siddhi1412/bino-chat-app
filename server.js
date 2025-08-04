const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());

app.get("/api/reply", (req, res) => {
  const msg = (req.query.msg || "").toLowerCase();
  let reply = "🤔 Let me search that for you...";

  if (msg.includes("cafe") || msg.includes("restaurant")) {
    reply = "☕ Top cafes near you: Blue Tokai, Third Wave, Starbucks.";
  } else if (msg.includes("weather")) {
    reply = "🌤️ Weather today: 29°C, partly cloudy.";
  } else if (msg.includes("job") || msg.includes("intern")) {
    reply = "💼 Job alert: Backend Intern @ Boni, UI Intern @ PixelEdge.";
  } else if (msg.includes("news")) {
    reply = "📰 Latest: India launches new satellite mission!";
  } else if (msg.includes("hello") || msg.includes("hi")) {
    reply = "👋 Hello! Ask me anything you want to search.";
  }

  res.json({ reply });
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
