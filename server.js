const express = require("express");
const cors = require("cors");
const path = require("path");
const fetch = require("node-fetch"); // node-fetch@2

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/reply", async (req, res) => {
  const msg = req.query.msg?.toLowerCase().trim();
  let reply = "🤔 Let me search that for you...";

  if (!msg) {
    return res.send({ reply: "❗Please enter a question." });
  }

  // 🔸 Hardcoded Replies
  if (msg.includes("cafe") || msg.includes("restaurant")) {
    return res.send({
      reply: "☕ Top cafes near you: Blue Tokai, Third Wave, and Starbucks.",
    });
  }

  if (msg.includes("movie")) {
    return res.send({
      reply: "🎬 Trending movies: Inception, Oppenheimer, Barbie.",
    });
  }

  if (msg.includes("weather")) {
    return res.send({
      reply: "🌤️ It’s sunny today!",
    });
  }

  // 🔸 Joke API
  if (msg.includes("joke") || msg.includes("funny")) {
    try {
      const jokeRes = await fetch("https://v2.jokeapi.dev/joke/Any");
      const jokeData = await jokeRes.json();

      if (jokeData.type === "twopart") {
        reply = `${jokeData.setup} 😄 ${jokeData.delivery}`;
      } else {
        reply = jokeData.joke;
      }
    } catch (err) {
      console.error("Joke API error:", err.message);
      reply = "😅 I tried getting a joke, but even the API couldn't laugh.";
    }
    return res.send({ reply });
  }

  // 🔸 News API (GNews)
  if (msg.includes("news") || msg.includes("headline")) {
    try {
      const apiKey = "980e62759fa5e1c5cd5b8a95bd5fa229"; // Your GNews API key
      const newsURL = `https://gnews.io/api/v4/top-headlines?lang=en&country=in&max=1&apikey=${apiKey}`;
      console.log("🔍 News API URL:", newsURL);

      const newsRes = await fetch(newsURL);
      const rawNews = await newsRes.text(); // Fetch raw text for debugging
      console.log("📰 News API Raw:", rawNews);

      const newsData = JSON.parse(rawNews); // Safely parse JSON

      if (newsData.articles && newsData.articles.length > 0) {
        const article = newsData.articles[0];
        reply = `📰 ${article.title}\n\n${article.description}\n\nRead more: ${article.url}`;
      } else {
        reply = "📭 No news found right now. Try again later.";
      }
    } catch (err) {
      console.error("News API error:", err.message);
      reply = "⚠️ News API didn't respond. Try again later.";
    }
    return res.send({ reply });
  }

  // 🔸 Wikipedia API (Fallback)
  try {
    const wikiURL = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(msg)}`;
    console.log("🌐 Wikipedia API URL:", wikiURL);

    const wikiRes = await fetch(wikiURL);
    if (!wikiRes.ok) {
      throw new Error(`Wikipedia API error: ${wikiRes.status}`);
    }

    const wikiData = await wikiRes.json();
    if (wikiData.extract) {
      reply = wikiData.extract;
    } else {
      reply = "😕 Sorry, I couldn't find any info on that.";
    }
  } catch (err) {
    console.error("Wiki fetch error:", err.message);
    reply = "⚠️ Something went wrong while fetching your answer.";
  }

  res.send({ reply });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
