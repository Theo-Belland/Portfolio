import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/admin.scss";
import "../Styles/managementProj.scss";
import "../Styles/technologies.scss";
import axios from "axios";

export default function ManageTechnologies() {
  const navigate = useNavigate();
  const [technologies, setTechnologies] = useState([]);
  const [newTech, setNewTech] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openSubMenu, setOpenSubMenu] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const fetchTechnologies = async () => {
    try {
      const res = await axios.get(`${API_URL}/technologies`);
      setTechnologies(res.data || []);
    } catch (err) {
      console.error(err);
      setMessage("❌ Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnologies();
  }, []);
  useEffect(() => {
    fetchTechnologies();
  }, []);
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTech.trim()) return;

    try {
      const res = await axios.post(
        `${API_URL}/technologies`,
        { name: newTech.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTechnologies(res.data.technologies);
      setNewTech("");
      setMessage("✅ Technologie ajoutée");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Erreur lors de l'ajout");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDelete = async (name) => {
    if (!confirm(`Supprimer "${name}" ?`)) return;

    try {
      const res = await axios.delete(`${API_URL}/technologies`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { name }
      });
      setTechnologies(res.data.technologies);
      setMessage("✅ Technologie supprimée");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Erreur lors de la suppression");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="projects-admin-page">
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
            <li onClick={() => navigate("/admin/technologies")}>🔧 Technologies</li>
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
          <h1>Gestion des Technologies</h1>
          <button onClick={handleLogout}>🔒 Déconnexion</button>
        </header>

        {message && <div className="message">{message}</div>}

        {/* Formulaire d'ajout */}
        <div className="tech-add-form">
          <form onSubmit={handleAdd}>
            <input
              type="text"
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              placeholder="Nom de la technologie..."
              required
            />
            <button type="submit">➕ Ajouter</button>
          </form>
        </div>

        {/* Liste des technos */}
        <div className="tech-list">
          {loading ? (
            <p>Chargement...</p>
          ) : technologies.length === 0 ? (
            <p>Aucune technologie disponible</p>
          ) : (
            <ul>
              {technologies.map((tech) => (
                <li key={tech}>
                  <span>{tech}</span>
                  <button onClick={() => handleDelete(tech)}>🗑️</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
