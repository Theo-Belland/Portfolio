// Import Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDaAo3nf1yIToFGdvYuB6XWEbmtSjSUOHM",
  authDomain: "theobelland-ab85d.firebaseapp.com",
  projectId: "theobelland-ab85d",
  storageBucket: "theobelland-ab85d.firebasestorage.app",
  messagingSenderId: "138871699604",
  appId: "1:138871699604:web:f81bee52bf4e43f1bd1c81",
  measurementId: "G-MF4S8NJHRD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore
export const db = getFirestore(app);

// Analytics (optionnel)
export const analytics = getAnalytics(app);
