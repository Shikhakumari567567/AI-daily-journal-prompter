
import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const PORT = process.env.PORT || 3000;

const currentDir = path.dirname(fileURLToPath(import.meta.url));

// Load the .env file from the project folder
dotenv.config({ path: path.join(currentDir, ".env") });

// Initialize Gemini using the secret API key
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Middleware
app.use(express.json());
app.use(express.static(path.join(currentDir, "public")));

// POST route to generate a journal prompt
app.post("/journal-prompt", async (req, res) => {
  try {
    const { mood } = req.body;

    // Validate the user's mood
    if (typeof mood !== "string" || !mood.trim()) {
      return res.status(400).json({
        error: "Please select your mood first."
      });
    }

    if (mood.trim().length > 50) {
      return res.status(400).json({
        error: "Mood must be 50 characters or fewer."
      });
    }

    // Check the API key
    if (!ai) {
      return res.status(500).json({
        error: "Gemini API key is missing. Check your .env file."
      });
    }

    // Generate a journal prompt using Gemini
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `
        Write one short, encouraging journal prompt
        for someone feeling "${mood.trim()}".

        Ask one thoughtful question that helps them reflect.
        Keep the response between 1 and 3 sentences.
      `
    });

    // Send the AI response to the frontend
    res.json({
      prompt: response.text
    });
  } catch (error) {
    console.error("Gemini error:", error.message);

    res.status(500).json({
      error: "Unable to generate a prompt. Please try again."
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
