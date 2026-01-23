import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Modal from "../components/Modal";
import "../Styles/managementProj.scss";

export default function ManagementProjects() {
  const { user } = useApp();
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [importStatus, setImportStatus] = useState("");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "https://theobelland.fr/api";
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openSubMenu, setOpenSubMenu] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${API_URL}/projects`);
        const data = await res.json();
        setProjects(
          data.map((p) => ({
            ...p,
            images: p.images || [],
            technologies: p.technologies || [],
          }))
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [API_URL]);

  const handleImportGithub = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setImportStatus("❌ Non authentifié");
      return;
    }

    setImportStatus("⏳ Import en cours...");
    try {
      const res = await fetch(`${API_URL}/projects/import-github`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Erreur lors de l'import");
      }

      const data = await res.json();
      setImportStatus(`✅ ${data.message || "Projets importés !"}`);
      
      // Rafraîchir la liste des projets après 1 seconde
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error(err);
      setImportStatus(`❌ ${err.message}`);
    }
  };

  if (loading) return <p className="loading">Chargement des projets...</p>;

  return (
    <div className="projects-admin-page">
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

            <li onClick={() => navigate("/admin/technologies")}>🔧 Technologies</li>

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

      {/* Main Content */}
      <section className="main-content">
        <div className="header-section">
          <h2>Gestion des projets</h2>
          <button className="github-import-btn" onClick={handleImportGithub}>
            🔄 Importer depuis GitHub
          </button>
        </div>
        
        {importStatus && (
          <div className="import-status">
            {importStatus}
          </div>
        )}

        <div className="projects-grid">
          {projects.map((p) => (
            <div key={p.id} className="project-card">
              <div
                className="project-image"
                onClick={() => setActiveProject(p)}
              >
                <img
                  src={
                    p.images?.[0] ||
                    "https://via.placeholder.com/400x250?text=Projet"
                  }
                  alt={p.title}
                />
              </div>
              <div className="project-actions">
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/admin/edit/${p.id}`)}
                >
                  ✏️ Modifier
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {activeProject && (
        <Modal
          project={activeProject}
          closeModal={() => setActiveProject(null)}
        />
      )}
    </div>
  );
}
