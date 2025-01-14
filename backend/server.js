const express = require("express");
const mongoose = require("mongoose");
const shortid = require("shortid");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"));

const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortUrl: String,
  customWord: String,
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 30 },
});

const Url = mongoose.model("Url", urlSchema);

app.post("/api/shorten", async (req, res) => {
  const { url, customWord } = req.body;
  
  try {
    if (customWord) {
      // Validate custom word
      if (!/^[a-zA-Z0-9-_]+$/.test(customWord)) {
        return res.status(400).json({ error: "Custom word can only contain letters, numbers, hyphens and underscores" });
      }
      
      // Check if custom word is already in use
      const existingCustomWord = await Url.findOne({ shortUrl: customWord });
      if (existingCustomWord) {
        return res.status(400).json({ error: "Custom word is already in use" });
      }

      // Check if URL exists and update with custom word if it does
      const existingUrl = await Url.findOne({ originalUrl: url });
      if (existingUrl) {
        existingUrl.shortUrl = customWord;
        existingUrl.customWord = customWord;
        await existingUrl.save();
        return res.json({ 
          shortUrl: `${req.protocol}://${req.get("host")}/${customWord}`,
          isExisting: true,
          updated: true
        });
      }
      
      // Create new URL with custom word
      const newUrl = new Url({ originalUrl: url, shortUrl: customWord, customWord });
      await newUrl.save();
      return res.json({ 
        shortUrl: `${req.protocol}://${req.get("host")}/${customWord}`,
        isExisting: false
      });
    }

    // Handle case without custom word
    const existingUrl = await Url.findOne({ originalUrl: url });
    if (existingUrl) {
      return res.json({ 
        shortUrl: `${req.protocol}://${req.get("host")}/${existingUrl.shortUrl}`,
        isExisting: true
      });
    }

    // Create new URL with generated shortId
    const shortUrl = shortid.generate();
    const newUrl = new Url({ originalUrl: url, shortUrl });
    await newUrl.save();
    res.json({ 
      shortUrl: `${req.protocol}://${req.get("host")}/${shortUrl}`,
      isExisting: false 
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/:shortUrl", async (req, res) => {
  const { shortUrl } = req.params;
  const url = await Url.findOne({ shortUrl });
  if (url) return res.redirect(url.originalUrl);
  res.status(404).json({ error: "URL not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
