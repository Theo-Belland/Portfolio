import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import "../Styles/projects.scss";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${API_URL}/projects`);
        const data = await res.json();

        if (Array.isArray(data)) {
          const fixed = data.map((p) => ({
            ...p,
            images: (p.images || []).map((img) => {
              if (img.startsWith("http://") || img.startsWith("https://"))
                return img;

              if (img.startsWith("/uploads/")) return `${API_URL}${img}`;

              return `${API_URL}/uploads/${img}`;
            }),
            technologies: p.technologies || [],
          }));

          setProjects(fixed);
        }
      } catch (err) {
        console.error("Erreur de récupération :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center" }}>Chargement des projets...</p>;
  }

  return (
    <section className="projects">
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
                src={
                  proj.images?.[0] ||
                  "https://via.placeholder.com/400x250?text=Projet"
                }
                alt={proj.title}
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
