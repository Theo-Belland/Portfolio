import express from "express";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  increment,
} from "firebase/firestore";
import jwt from "jsonwebtoken";

const router = express.Router();

// --- Firebase setup ---
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const appFirebase = initializeApp(firebaseConfig);
const db = getFirestore(appFirebase);

// --- Route compteur admin ---
router.get("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Token manquant" });

    const token = authHeader.split(" ")[1];

    // Vérifie le JWT
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Token invalide" });
      if (!decoded.isAdmin)
        return res.status(403).json({ message: "Accès interdit" });

      // Référence au document Firestore
      const docRef = doc(db, "stats", "visites");

      // Crée le document s’il n’existe pas
      await setDoc(docRef, { count: increment(0) }, { merge: true });

      // Récupère le compteur
      const snap = await getDoc(docRef);
      const count = snap.exists() ? snap.data().count : 0;

      res.json({ count });
    });
  } catch (error) {
    console.error("Erreur compteur admin :", error);
    res.status(500).json({ message: "Impossible de récupérer le compteur" });
  }
});

export default router;
