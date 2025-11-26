import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// POST /contact
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ success: false, message: "Champs manquants" });

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "465"),
      secure: true,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      tls: { rejectUnauthorized: false },
    });

    await transporter.verify();
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: `${process.env.MAIL_PRO}, ${process.env.MAIL_PERSO}`,
      replyTo: email,
      subject: `📩 Nouveau message de ${name}`,
      text: `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    res.json({ success: true, message: "Message envoyé !" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Erreur serveur", error: err.message });
  }
});

export default router;
