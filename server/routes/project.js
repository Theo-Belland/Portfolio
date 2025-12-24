import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";
import { fileURLToPath } from "url";

const router = express.Router();

const SITE_URL =
  process.env.SITE_URL || `http://localhost:${process.env.PORT || 5000}`;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.join(__dirname, "..");
const uploadsPath = path.join(serverRoot, "uploads");
const dataPath = path.join(serverRoot, "projects.json");

if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsPath),
  filename: (req, file, cb) => {
    const safeName = Date.now() + "-" + file.originalname.replace(/\s/g, "_");
    cb(null, safeName);
  },
});
const upload = multer({ storage });

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
  if (img.startsWith("http://localhost:5000"))
    return img.replace("http://localhost:5000", SITE_URL);
  if (img.startsWith("/uploads")) return `${SITE_URL}${img}`;
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

// PUT project
router.put("/:id", verifyToken, upload.array("images", 10), (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, technologies, oldImages } = req.body;

    const projects = readProjects();
    const index = projects.findIndex((p) => p.id.toString() === id.toString());
    if (index === -1)
      return res.status(404).json({ message: "Projet non trouvé" });

    projects[index].title = title ?? projects[index].title;
    projects[index].description = description ?? projects[index].description;
    projects[index].technologies = technologies
      ? JSON.parse(technologies)
      : projects[index].technologies;

    let images = oldImages ? JSON.parse(oldImages) : [];
    if (req.files?.length > 0)
      images = [...images, ...req.files.map((f) => `/uploads/${f.filename}`)];
    projects[index].images = images;

    saveProjects(projects);
    res.json(projects[index]);
  } catch (err) {
    console.error("Erreur mise à jour :", err);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour" });
  }
});

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
