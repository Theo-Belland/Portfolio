import React from "react";
import { Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext"; // ← à ajouter
import MaintenancePage from "../pages/MaintenancePage"; // ← à ajouter

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const { maintenanceMode, user } = useApp();

  // 1. ❌ Si pas connecté → redirection login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // 2. 🚧 Si maintenance activée ET utilisateur non admin
  if (maintenanceMode && (!user || !user.isAdmin)) {
    return <MaintenancePage />;
  }

  // 3. ✔ Sinon → accès autorisé
  return children;
}
