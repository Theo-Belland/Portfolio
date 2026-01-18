import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";
import https from "https";
import sharp from "sharp";
import { fileURLToPath } from "url";

const router = express.Router();

const SITE_URL =
  process.env.SITE_URL || `http://localhost:${process.env.PORT || 5000}`;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.join(__dirname, "..");
const uploadsPath = path.join(serverRoot, "uploads");
const dataPath = path.join(serverRoot, "projects.json");

if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath);
// Configuration multer pour accepter tous types d'images
const storage = multer.memoryStorage(); // Stockage en mémoire pour traitement
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/bmp",
      "image/tiff",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Type de fichier non supporté. Utilisez JPG, PNG, GIF, WebP, BMP ou TIFF"
        )
      );
    }
  },
});

// Fonction pour redimensionner et optimiser les images
async function processImage(buffer, originalName) {
  try {
    const timestamp = Date.now();
    const safeName =
      timestamp +
      "-" +
      originalName.replace(/\s/g, "_").replace(/\.[^.]+$/, ".webp");
    const outputPath = path.join(uploadsPath, safeName);

    // Redimensionner l'image en gardant les proportions (max 1920x1080)
    await sharp(buffer)
      .resize(1920, 1080, {
        fit: "inside", // Garde les proportions, ne rogne pas
        withoutEnlargement: true, // Ne pas agrandir les petites images
      })
      .webp({ quality: 85 }) // Convertir en WebP pour optimiser
      .toFile(outputPath);

    return `/uploads/${safeName}`;
  } catch (err) {
    console.error("Erreur traitement image:", err);
    throw err;
  }
}

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

// --- Helpers pour corriger les URLs d'images ---
function fixImageUrl(img) {
  if (!img) return "";
  // Si c'est déjà une URL complète (http ou https), la retourner telle quelle
  if (img.startsWith("http://") || img.startsWith("https://")) {
    // Sauf si c'est localhost, le remplacer par SITE_URL
    if (img.startsWith("http://localhost:5000")) {
      return img.replace("http://localhost:5000", SITE_URL);
    }
    return img;
  }
  // Si c'est un chemin /uploads
  if (img.startsWith("/uploads")) return `${SITE_URL}${img}`;
  // Sinon, construire le chemin complet
  return `${SITE_URL}/uploads/${path.basename(img)}`;
}

// GET all projects
router.get("/", (req, res) => {
  const projects = readProjects();
  res.json(
    projects.map((p) => ({
      ...p,
      images: (p.images || []).map(fixImageUrl),
    }))
  );
});

// GET project by ID
router.get("/:id", (req, res) => {
  const projects = readProjects();
  const project = projects.find(
    (p) => p.id.toString() === req.params.id.toString()
  );
  if (!project) return res.status(404).json({ message: "Projet introuvable" });

  res.json({
    ...project,
    images: (project.images || []).map(fixImageUrl),
  });
});

// POST project
router.post("/", verifyToken, upload.array("images", 10), async (req, res) => {
  try {
    const { title, description, technologies } = req.body;
    if (!title || !description)
      return res.status(400).json({ message: "Champs manquants" });

    const projects = readProjects();

    // Traiter les images (redimensionner + optimiser)
    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const imagePath = await processImage(file.buffer, file.originalname);
          images.push(imagePath);
        } catch (err) {
          console.error("Erreur traitement image:", err);
          return res
            .status(400)
            .json({ message: "Erreur lors du traitement d'une image" });
        }
      }
    }

    const newProject = {
      id: Date.now(),
      title,
      description,
      images,
      technologies: technologies ? JSON.parse(technologies) : [],
    };

    projects.push(newProject);
    saveProjects(projects);
    res.json(newProject);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: err.message || "Erreur serveur lors de l'ajout" });
  }
});

// PUT project
router.put(
  "/:id",
  verifyToken,
  upload.array("images", 10),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, technologies, oldImages } = req.body;

      const projects = readProjects();
      const index = projects.findIndex(
        (p) => p.id.toString() === id.toString()
      );
      if (index === -1)
        return res.status(404).json({ message: "Projet non trouvé" });

      projects[index].title = title ?? projects[index].title;
      projects[index].description = description ?? projects[index].description;
      projects[index].technologies = technologies
        ? JSON.parse(technologies)
        : projects[index].technologies;

      let images = projects[index].images || [];

      // Si oldImages existe, on garde les anciennes
      if (oldImages) {
        images = JSON.parse(oldImages);
      }
      // Si on upload de nouvelles images
      else if (req.files?.length > 0) {
        images = [];
        for (const file of req.files) {
          try {
            const imagePath = await processImage(
              file.buffer,
              file.originalname
            );
            images.push(imagePath);
          } catch (err) {
            console.error("Erreur traitement image:", err);
            return res
              .status(400)
              .json({ message: "Erreur lors du traitement d'une image" });
          }
        }
      }

      projects[index].images = images;

      saveProjects(projects);
      res.json(projects[index]);
    } catch (err) {
      console.error("Erreur mise à jour :", err);
      res
        .status(500)
        .json({ message: "Erreur serveur lors de la mise à jour" });
    }
  }
);

// DELETE project
router.delete("/:id", verifyToken, (req, res) => {
  const projects = readProjects();
  const newProjects = projects.filter(
    (p) => p.id.toString() !== req.params.id.toString()
  );
  if (projects.length === newProjects.length)
    return res.status(404).json({ message: "Projet introuvable" });

  saveProjects(newProjects);
  res.json({ message: "Projet supprimé" });
});

// IMPORT GitHub
router.post("/import-github", verifyToken, async (req, res) => {
  try {
    const username = process.env.GITHUB_USERNAME || "Theo-Belland";
    const githubRes = await fetch(
      `https://api.github.com/users/${username}/repos`
    );
    if (!githubRes.ok)
      return res.status(500).json({ message: "Erreur GitHub API" });

    const repos = await githubRes.json();
    let projects = readProjects();

    const newProjects = repos.map((repo) => ({
      id: `gh_${repo.id}`,
      title: repo.name,
      description: repo.description || "Aucune description",
      github_url: repo.html_url,
      technologies: [],
      images: [],
      imported: true,
      updated_at: repo.updated_at,
      pushed_at: repo.pushed_at,
    }));

    projects = [
      ...projects.filter((p) => !p.id.toString().startsWith("gh_")),
      ...newProjects,
    ];

    saveProjects(projects);
    res.json({
      message: "Projets GitHub importés avec succès",
      count: newProjects.length,
      projects: newProjects,
    });
  } catch (err) {
    console.error("Erreur import GitHub :", err);
    res.status(500).json({ message: "Erreur lors de l'import GitHub" });
  }
});

export default router;
