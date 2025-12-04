import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";

const router = express.Router();

// --- Déclarer SITE_URL en haut ---
const SITE_URL =
  process.env.VITE_SITE_URL || `http://localhost:${process.env.PORT || 5000}`;

// --- Chemins corrects ---
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.join(__dirname, ".."); // remonte à /server
const uploadsPath = path.join(serverRoot, "uploads");
const dataPath = path.join(serverRoot, "projects.json");

// crée uploads si besoin
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath);

// --- Multer ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsPath),
  filename: (req, file, cb) => {
    const safeName = Date.now() + "-" + file.originalname.replace(/\s/g, "_");
    cb(null, safeName);
  },
});
const upload = multer({ storage });

// --- Utils ---
function readProjects() {
  if (!fs.existsSync(dataPath)) return [];
  try {
    return JSON.parse(fs.readFileSync(dataPath));
  } catch {
    return [];
  }
}

function saveProjects(projects) {
  fs.writeFileSync(dataPath, JSON.stringify(projects, null, 2));
}

// --- Middleware JWT ---
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

// --- ROUTES ---

// Get all projects
router.get("/", (req, res) => {
  const projects = readProjects();
  res.json(
    projects.map((p) => ({
      ...p,
      images: (p.images || []).map(
        (img) => `${SITE_URL}/uploads/${path.basename(img)}`
      ),
    }))
  );
});

// Ajouter projet
router.post("/", verifyToken, upload.array("images", 10), (req, res) => {
  try {
    const { title, description, technologies } = req.body;

    if (!title || !description)
      return res.status(400).json({ message: "Champs manquants" });

    const projects = readProjects();
    const newProject = {
      id: Date.now(),
      title,
      description,
      images: req.files?.map((f) => `/uploads/${f.filename}`) || [],
      technologies: technologies ? JSON.parse(technologies) : [],
    };

    projects.push(newProject);
    saveProjects(projects);
    res.json(newProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur lors de l'ajout" });
  }
});

// Modifier projet
router.put("/:id", verifyToken, upload.array("images", 10), (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, technologies, oldImages } = req.body;

    const projects = readProjects();
    const index = projects.findIndex((p) => p.id === Number(id));
    if (index === -1)
      return res.status(404).json({ message: "Projet non trouvé" });

    projects[index].title = title ?? projects[index].title;
    projects[index].description = description ?? projects[index].description;
    projects[index].technologies = technologies
      ? JSON.parse(technologies)
      : projects[index].technologies;

    // Images
    let images = oldImages ? JSON.parse(oldImages) : [];

    if (req.files?.length > 0) {
      images = [...images, ...req.files.map((f) => `/uploads/${f.filename}`)];
    }

    projects[index].images = images;

    saveProjects(projects);
    res.json(projects[index]);
  } catch (err) {
    console.error("Erreur mise à jour :", err);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour" });
  }
});

// Supprimer projet
router.delete("/:id", verifyToken, (req, res) => {
  const projects = readProjects();
  const newProjects = projects.filter((p) => p.id !== Number(req.params.id));
  if (projects.length === newProjects.length)
    return res.status(404).json({ message: "Projet introuvable" });

  saveProjects(newProjects);
  res.json({ message: "Projet supprimé" });
});

export default router;
