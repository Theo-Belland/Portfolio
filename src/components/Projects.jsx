import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import "../Styles/projects.scss";
import placeholderImg from "../assets/placeholder.webp";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "https://theobelland.fr/api";

  // Fetch projets (locaux + GitHub importés via backend)
  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_URL}/projects`);
      const data = await res.json();

      if (!Array.isArray(data)) return [];

      const fixed = data.map((p) => ({
        ...p,
        images: (p.images || []).map((img) => {
          if (!img) return "";
          // Si c'est déjà une URL complète (screenshot API), la garder telle quelle
          if (img.startsWith("http://") || img.startsWith("https://"))
            return img;
          // Si c'est un chemin /uploads/, ajouter le domaine
          if (img.startsWith("/uploads/"))
            return `${API_URL.replace("/api", "")}${img}`;
          // Sinon, construire le chemin complet
          return `${API_URL.replace("/api", "")}/uploads/${img}`;
        }),
        technologies: p.technologies || [],
      }));

      return fixed;
    } catch (err) {
      console.error("Erreur API projets :", err);
      return [];
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const localAndGitHub = await fetchProjects();
      setProjects(localAndGitHub);
      setLoading(false);
    };
    load();
  }, [API_URL]);

  if (loading) return <p style={{ textAlign: "center" }}>Chargement…</p>;

  if (projects.length === 0)
    return (
      <p style={{ textAlign: "center", marginTop: "40px" }}>Aucun projet.</p>
    );

  return (
    <section className="projects" id="project">
      <h2>Mes Projets</h2>

      <div className="projects-grid">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="project-card"
            onClick={() => setActiveProject(proj)}
          >
            <div className="project-image-wrapper">
              <img
                src={proj.images?.[0] || placeholderImg}
                alt={proj.title}
                loading="lazy"
                width="400"
                height="250"
              />
            </div>
            <h3>{proj.title}</h3>
          </div>
        ))}
      </div>

      {activeProject && (
        <Modal
          project={activeProject}
          closeModal={() => setActiveProject(null)}
        />
      )}
    </section>
  );
}
