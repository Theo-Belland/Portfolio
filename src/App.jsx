import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import AddProject from "./pages/AddProject";
import EditProject from "./pages/EditProject";
import Maintenance from "./pages/MaintenancePage";

import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { useApp } from "./context/AppContext";

import "./Styles/globals.scss";

// ----------------------
// App principal avec Router
// ----------------------
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

// ----------------------
// Composant enfant qui utilise useLocation
// ----------------------
function AppContent() {
  const { maintenanceMode, setMaintenanceMode, user } = useApp();
  const API_URL = import.meta.env.VITE_API_URL;
  const location = useLocation(); // ✅ OK maintenant

  // ⬇️ Récupération du mode maintenance depuis le backend
  useEffect(() => {
    fetch(`${API_URL}/api/config/maintenance`)
      .then((res) => res.json())
      .then((data) => setMaintenanceMode(data.maintenanceMode))
      .catch(() =>
        console.error("Erreur lors du chargement du mode maintenance")
      );
  }, [API_URL, setMaintenanceMode]);

  // 🚧 Page maintenance sauf pour l’admin logué ou sur la page login
  if (
    maintenanceMode &&
    (!user || !user.isAdmin) &&
    location.pathname !== "/login"
  ) {
    return <Maintenance />;
  }

  return (
    <div className="app">
      <div className="content">
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Page maintenance directe */}
          <Route path="/maintenance" element={<Maintenance />} />

          {/* Routes protégées */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-project"
            element={
              <ProtectedRoute>
                <AddProject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <EditProject />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}
