import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import MaintenancePage from "../pages/MaintenancePage";

export default function ProtectedRoute({ children }) {
  const { user, setUser, maintenanceMode } = useApp();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const API_URL = import.meta.env.VITE_API_URL;

    if (!token) {
      setLoading(false);
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch(`${API_URL}/verifyToken`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          localStorage.removeItem("token");
        } else {
          const data = await res.json();
          if (!user) setUser(data.user);
        }
      } catch {
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  if (loading) return <p>Vérification authentification...</p>;
  if (!localStorage.getItem("token")) return <Navigate to="/login" />;
  if (maintenanceMode && (!user || !user.isAdmin)) return <MaintenancePage />;

  return children;
}
