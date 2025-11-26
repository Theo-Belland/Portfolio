import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Champs manquants" });

  if (email !== process.env.ADMIN_EMAIL)
    return res.status(401).json({ message: "Email incorrect" });

  if (password !== process.env.ADMIN_PASSWORD)
    return res.status(401).json({ message: "Mot de passe incorrect" });

  // On ajoute isAdmin: true dans le token
  const token = jwt.sign({ email, isAdmin: true }, process.env.JWT_SECRET, {
    expiresIn: "3h",
  });

  res.json({ token });
});

export default router;
