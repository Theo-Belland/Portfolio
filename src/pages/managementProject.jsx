import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProjectSlider from "../components/ProjectSlider";
import { useApp } from "../context/AppContext";
import "../Styles/admin.scss";

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

  if (loading) return <p>Chargement des projets...</p>;

  return (
    <div className="projects-admin">
      <h2>Gestion des projets</h2>
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
              <button onClick={() => navigate(`/edit/${p.id}`)}>
                Modifier
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
