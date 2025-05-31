import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router } from "./routes/contact.js";
import { chat } from "./routes/chatbot.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/contact", router);
app.use("/api/chat", chat);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
