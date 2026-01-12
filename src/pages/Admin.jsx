import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "../Styles/admin.scss";
import axios from "axios";

export default function DashboardAdmin() {
  const { maintenanceMode, setMaintenanceMode } = useApp();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visites, setVisites] = useState(null); // <- compteur

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleMaintenance = () => setMaintenanceMode(!maintenanceMode);

  const API_URL = import.meta.env.VITE_API_URL || "https://theobelland.fr/api";
  const token = localStorage.getItem("token"); // ton JWT admin

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${API_URL}/projects`);
        const data = await res.json();
        setProjects(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [API_URL]);

  useEffect(() => {
    const fetchVisites = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${API_URL}/visites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVisites(res.data.count);
      } catch (err) {
        console.error("Erreur fetch compteur admin :", err);
      }
    };
    fetchVisites();
  }, [API_URL, token]);

  const onlineProjects = projects.length;

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <h2>Admin</h2>
        <nav>
          <ul className="menu-list">
            <li onClick={() => navigate("/admin")}>📊 Dashboard</li>
            <li>
              <div
                className="menu-item"
                onClick={() =>
                  setOpenSubMenu(openSubMenu === "projects" ? null : "projects")
                }
              >
                📁 Projets
              </div>
              {openSubMenu === "projects" && (
                <ul className="submenu">
                  <li onClick={() => navigate("/admin/managementProject")}>
                    Tous les projets
                  </li>
                  <li onClick={() => navigate("/admin/addProject")}>
                    Ajouter un projet
                  </li>
                </ul>
              )}
            </li>
            <li onClick={() => navigate("/admin/technologies")}>
              🔧 Technologies
            </li>
            <li>
              <div
                className="menu-item"
                onClick={() =>
                  setOpenSubMenu(openSubMenu === "users" ? null : "users")
                }
              >
                👥 Utilisateurs
              </div>
              {openSubMenu === "users" && (
                <ul className="submenu">
                  <li onClick={() => navigate("/admin/users")}>Liste</li>
                  <li onClick={() => navigate("/admin/addUser")}>Ajouter</li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {/* MOBILE HAMBURGER */}
      <button
        className="hamburger"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      {/* CONTENT */}
      <section className="admin-content">
        {/* TOPBAR */}
        <header className="admin-topbar">
          <button onClick={toggleMaintenance}>
            {maintenanceMode ? "🚧 Maintenance ON" : "✅ Maintenance OFF"}
          </button>
          <button onClick={handleLogout}>🔒 Déconnexion</button>
        </header>

        {/* STAT CARDS */}
        <div className="admin-cards">
          <div className="admin-card">
            <h3>Visites totales</h3>
            {visites === null ? <p>Chargement…</p> : <p>{visites}</p>}
          </div>
          <div className="admin-card">Visites du mois</div>
          <div className="admin-card">
            <h3>Projets en ligne</h3>
            {loading ? <p>Chargement…</p> : <p>{onlineProjects}</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
