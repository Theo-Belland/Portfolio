import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProjectSlider from "../components/ProjectSlider";
import { useApp } from "../context/AppContext";
import "../Styles/managementProj.scss";

export default function ManagementProjects() {
  const { user } = useApp();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

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

  // ------------------------------
  // Importer projets depuis GitHub
  // ------------------------------
  const importFromGithub = async () => {
    try {
      const res = await fetch(
        "https://api.github.com/repos/Theo-Belland/portfolio/contents/server/projects.json"
      );
      if (!res.ok) throw new Error("Fichier GitHub introuvable");
      const ghData = await res.json();
      const decoded = JSON.parse(atob(ghData.content));

      // Filtrer pour éviter les doublons (basé sur l'id)
      const newProjects = decoded.filter(
        (p) => !projects.some((existing) => existing.id === p.id)
      );

      if (newProjects.length === 0) {
        alert("Aucun nouveau projet à importer.");
        return;
      }

      setProjects((prev) => [...prev, ...newProjects]);
      alert(`${newProjects.length} projet(s) importé(s) depuis GitHub !`);
    } catch (err) {
      console.error("Erreur import GitHub :", err);
      alert("Impossible d’importer les projets depuis GitHub");
    }
  };

  if (loading) return <p>Chargement des projets...</p>;

  return (
    <div className="projects-admin">
      <div className="sidebar">
        <h2>Admin</h2>
        <ul>
          <li>
            <button onClick={() => navigate("/admin")}>Dashboard</button>
          </li>
          <li>
            <button onClick={() => navigate("/admin/managementProject")}>
              Projets
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/admin/users")}>
              Utilisateurs
            </button>
          </li>
        </ul>
      </div>

      <div className="main-content">
        <h2>Gestion des projets</h2>

        {/* Bouton Import GitHub */}
        <button
          onClick={importFromGithub}
          style={{
            marginBottom: "1rem",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            border: "1px solid #a855f7",
            backgroundColor: "#000",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Importer depuis GitHub
        </button>

        <div className="projects-grid-admin">
          {projects.map((p) => (
            <div key={p.id} className="project-card-admin">
              <ProjectSlider images={p.images} />
              <div className="project-info">
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                {p.technologies.length > 0 && (
                  <div>
                    <strong>Technos :</strong> {p.technologies.join(", ")}
                  </div>
                )}
              </div>
              <div className="project-actions">
                <button onClick={() => navigate(`/admin/edit/${p.id}`)}>
                  Modifier
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
