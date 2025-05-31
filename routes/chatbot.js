// server.js
import express from "express";
import axios from "axios";
export const chat = express.Router();

const API_KEY = process.env.API_KEY;

chat.post("/", async (req, res) => {
  const { message } = req.body;
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: message }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: "AI service error" });
  }
});
