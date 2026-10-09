const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();

const PORT = 3000;

// Gemini setup
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// JSON data receive karne ke liye
app.use(express.json());

// Frontend files serve karne ke liye
app.use(express.static(path.join(__dirname, "public")));

// Journal Prompt API
app.post("/journal-prompt", async (req, res) => {
  try {
    const { mood } = req.body;

    if (!mood) {
      return res.status(400).json({
        error: "Mood is required",
      });
    }

    const prompt = `
Write a short, encouraging journal prompt for someone feeling "${mood}".

The prompt should:
- be simple
- be positive
- encourage self-reflection
- be 1-2 sentences only
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const journalPrompt = response.text;

    res.json({
      mood: mood,
      journalPrompt: journalPrompt,
    });

  } catch (error) {
    console.error("Gemini Error:", error);

    res.status(500).json({
      error: "Something went wrong while generating the journal prompt",
    });
  }
});

// Server start
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});