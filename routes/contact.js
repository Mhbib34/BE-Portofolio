import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
export const router = express.Router();

// Fungsi validasi email sederhana
const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  // ✅ Validasi input
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  // ✅ Transporter SMTP Brevo
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // ✅ Konfigurasi email
  const mailOptions = {
    from: `"${name}" <${process.env.SENDER_EMAIL}>`, // from harus dari email terverifikasi
    to: process.env.TO_EMAIL, // email tujuan kamu sendiri
    replyTo: email, // supaya bisa dibalas ke pengunjung
    subject: `New Message from ${name}`,
    html: `
      <h3>You received a new message from your portfolio website:</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Message sent successfully!" });
  } catch (err) {
    console.error("Email send failed:", err);
    res.status(500).json({ error: "Failed to send message." });
  }
});
