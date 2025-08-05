const express = require("express");
const cors = require("cors");
const path = require("path");
const fetch = require("node-fetch"); // ✅ to call Wikipedia API

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Serve static files from 'public' folder (CSS, JS, HTML)
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// ✅ Serve index.html when root is accessed
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Chatbot Reply Route - now powered by Wikipedia API
app.get("/reply", async (req, res) => {
  const msg = req.query.msg.toLowerCase();
  let reply = "🤔 Let me search that for you...";

  // 🟡 Hardcoded replies (for fun)
  if (msg.includes("cafe") || msg.includes("restaurant")) {
    reply = "☕ Top cafes near you: Blue Tokai, Third Wave, and Starbucks.";
    return res.send({ reply });
  }

  if (msg.includes("movie")) {
    reply = "🎬 Currently trending movies: Inception, Oppenheimer, and Barbie.";
    return res.send({ reply });
  }

  if (msg.includes("weather")) {
    reply = "🌤️ It’s sunny today! Great time to go out.";
    return res.send({ reply });
  }

  // 🌐 Wikipedia API for everything else
  try {
    const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(msg)}`;
    const wikiRes = await fetch(searchUrl);
    const wikiData = await wikiRes.json();

    if (wikiData.extract) {
      reply = wikiData.extract;
    } else {
      reply = "😕 Sorry, I couldn’t find any results for that.";
    }
  } catch (err) {
    console.error("Error fetching from Wikipedia:", err.message);
    reply = "⚠️ Oops! Something went wrong while fetching your answer.";
  }

  res.send({ reply });
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
