import express from "express";
import axios from "axios";

export const chat = express.Router();

const API_KEY = process.env.API_KEY;

// Template keyword dan jawaban
const templates = [
  {
    keywords: ["siapa", "kamu"],
    answer: "Perkenalkan saya adalah MHAssist, seorang asisten virtual.",
  },
  {
    keywords: ["ada", "dimana", "sekarang", "saya"],
    answer: "Waduhh!!😅,Kita sekarang ada di websitenya Muhammad Habib nih!",
  },
  {
    keywords: ["who", "you"],
    answer: "Let me introduce myself, I am MHAssist, a virtual assistant.",
  },
  {
    keywords: ["bagaimana", "menghubungi"],
    answer:
      "Kamu bisa menghubungi saya melalui email: @mhabib34official@gmail.com",
  },
  {
    keywords: ["how", "contact", "you"],
    answer: "You can contact me via email: @mhabib34official@gmail.com",
  },
  { keywords: ["tinggal", "dimana"], answer: "Saya tinggal di dunia digital." },
];

chat.post("/", async (req, res) => {
  const message = req.body.message.toLowerCase();

  // Cek apakah ada keyword yang cocok
  const matchedTemplate = templates.find((template) =>
    template.keywords.every((keyword) => message.includes(keyword))
  );

  if (matchedTemplate) {
    return res.json({ reply: matchedTemplate.answer });
  }

  // Jika tidak cocok, panggil API Gemini
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
        headers: { "Content-Type": "application/json" },
      }
    );

    const reply =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Maaf, saya tidak mengerti.";
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: "AI service error" });
  }
});
