import express from "express";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";

const router = express.Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.join(__dirname, "..");
const dataPath = path.join(serverRoot, "technologies.json");

function readTechnologies() {
  if (!fs.existsSync(dataPath)) return [];
  try {
    return JSON.parse(fs.readFileSync(dataPath));
  } catch {
    return [];
  }
}

function saveTechnologies(technologies) {
  fs.writeFileSync(dataPath, JSON.stringify(technologies, null, 2));
}

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token manquant" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token invalide" });
    req.user = decoded;
    next();
  });
}

// GET - Récupérer toutes les technos (public)
router.get("/", (req, res) => {
  const technologies = readTechnologies();
  res.json(technologies);
});

// POST - Ajouter une technologie (admin)
router.post("/", verifyToken, (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Nom de technologie requis" });
  }

  const technologies = readTechnologies();

  if (technologies.includes(name.trim())) {
    return res.status(400).json({ message: "Cette technologie existe déjà" });
  }

  technologies.push(name.trim());
  technologies.sort();
  saveTechnologies(technologies);

  res.json({ message: "Technologie ajoutée", technologies });
});

// DELETE - Supprimer une technologie (admin)
router.delete("/", verifyToken, (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Nom de technologie requis" });
  }

  let technologies = readTechnologies();
  const initialLength = technologies.length;

  technologies = technologies.filter((tech) => tech !== name);

  if (technologies.length === initialLength) {
    return res.status(404).json({ message: "Technologie non trouvée" });
  }

  saveTechnologies(technologies);
  res.json({ message: "Technologie supprimée", technologies });
});

export default router;
