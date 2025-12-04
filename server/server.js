import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import contactRouter from "./routes/contact.js";
import projectRouter from "./routes/project.js";
import adminRouter from "./routes/admin.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Corrige __dirname pour ES Modules ---
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- PATHS IMPORTANT ---
const distPath = path.resolve("./dist");
const configPath = path.resolve("./config.json");
const uploadPath = path.join(__dirname, "uploads"); // dossier uploads correct

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());

// Sert correctement les fichiers du dossier /uploads
app.use("/uploads", express.static(uploadPath));

// --- ROUTES API ---
app.use("/api/contact", contactRouter);
app.use("/api/projects", projectRouter);
app.use("/api/admin", adminRouter);

// --- MODE MAINTENANCE ---
app.get("/api/config/maintenance", (req, res) => {
  if (!fs.existsSync(configPath)) {
    return res.status(500).json({ message: "config.json introuvable" });
  }

  try {
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    res.json({ maintenanceMode: config.maintenanceMode });
  } catch (err) {
    res.status(500).json({ message: "Impossible de lire la configuration" });
  }
});

app.patch("/api/config/maintenance", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token manquant" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token invalide" });
    if (!decoded.isAdmin)
      return res.status(403).json({ message: "Accès interdit" });

    const { maintenanceMode } = req.body;
    if (typeof maintenanceMode !== "boolean") {
      return res
        .status(400)
        .json({ message: "Valeur incorrecte, doit être true ou false" });
    }

    try {
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      config.maintenanceMode = maintenanceMode;
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      res.json({ maintenanceMode });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Impossible de modifier la configuration" });
    }
  });
});

// --- Vérification du token ---
app.get("/api/verifyToken", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token manquant" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token invalide" });
    res.json({ valid: true, user: decoded });
  });
});

// --- SERVE FRONTEND (React / Vite) ---
app.use(express.static(distPath));

// Fallback → renvoie index.html pour toutes les routes React
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`Serveur en ligne sur http://localhost:${PORT}`);
  console.log(`Uploads servis depuis : ${uploadPath}`);
});
