import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectSlider from "../components/ProjectSlider";
import "../Styles/admin.scss";
import { useApp } from "../context/AppContext";

export default function ProjectsAdmin() {
  const { maintenanceMode, setMaintenanceMode, user, setUser } = useApp();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("list");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technos, setTechnos] = useState([]);
  const [newTech, setNewTech] = useState("");
  const [files, setFiles] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL;
  const [authChecked, setAuthChecked] = useState(false);

  // ------------------------------------------------
  // 1️⃣ Vérifier le token et récupérer l'utilisateur
  // ------------------------------------------------
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${API_URL}/verifyToken`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          const data = await res.json();
          setUser(data.user); // On stocke l'utilisateur/admin
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      })
      .finally(() => setAuthChecked(true));
  }, [token, navigate, API_URL, setUser]);

  // ------------------------------------------------
  // 2️⃣ Activer / désactiver maintenance côté serveur
  // ------------------------------------------------
  const toggleMaintenance = async () => {
    const newState = !maintenanceMode;
    setMaintenanceMode(newState);

    try {
      const res = await fetch(`${API_URL}/config/maintenance`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ maintenanceMode: newState }),
      });

      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        throw new Error(`Réponse inattendue du serveur (${res.status})`);
      }

      if (!res.ok) throw new Error(data.message || `Erreur ${res.status}`);
      setMaintenanceMode(data.maintenanceMode);
    } catch (err) {
      console.error("Erreur MAJ maintenance :", err);
      alert("Erreur lors de la mise à jour du mode maintenance.");
      setMaintenanceMode(!newState);
    }
  };

  // ------------------------------------------------
  // 3️⃣ Gestion logout
  // ------------------------------------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ------------------------------------------------
  // 4️⃣ Récupération projets
  // ------------------------------------------------
  useEffect(() => {
    if (!authChecked) return;

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
        console.error("Erreur de récupération :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [authChecked, API_URL]);

  // ------------------------------------------------
  // 5️⃣ Suppression projet
  // ------------------------------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce projet ?")) return;

    try {
      await fetch(`${API_URL}/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
  };

  // ------------------------------------------------
  // 6️⃣ Ajouter un projet
  // ------------------------------------------------
  const handleAddProject = async (e) => {
    e.preventDefault();

    if (!title || !description) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("technologies", JSON.stringify(technos));
    files.forEach((f) => formData.append("images", f));

    try {
      const res = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Erreur lors de l’ajout");

      const newProject = await res.json();
      setProjects((prev) => [...prev, newProject]);

      setTitle("");
      setDescription("");
      setFiles([]);
      setTechnos([]);
      setNewTech("");
      setActiveTab("list");
    } catch (err) {
      console.error(err);
      alert("❌ Échec de l’ajout du projet");
    }
  };

  const addTech = () => {
    if (newTech.trim() && !technos.includes(newTech.trim())) {
      setTechnos([...technos, newTech.trim()]);
      setNewTech("");
    }
  };

  const removeTech = (tech) => setTechnos(technos.filter((t) => t !== tech));

  // ------------------------------------------------
  // 7️⃣ Affichage
  // ------------------------------------------------
  if (!authChecked || loading) return <p>Chargement des projets...</p>;

  return (
    <div className="projects-admin">
      {maintenanceMode && (
        <div className="maintenance-banner">
          🚧 Mode maintenance activé – Les visiteurs voient la page maintenance
        </div>
      )}

      <div className="admin-header">
        <h2>Gestion des projets</h2>

        <div className="button-action">
          <button onClick={toggleMaintenance} className="maintenance-btn">
            {maintenanceMode ? "Désactiver maintenance" : "Activer maintenance"}
          </button>

          <button onClick={handleLogout} className="logout-btn">
            🔒 Déconnexion
          </button>
          <button
            onClick={() => setActiveTab("list")}
            className={activeTab === "list" ? "active" : ""}
          >
            📋 Liste des projets
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={activeTab === "add" ? "active" : ""}
          >
            ➕ Ajouter un projet
          </button>
        </div>
      </div>
      {activeTab === "list" ? (
        <div className="projects-grid-admin">
          {projects.map((project) => (
            <div key={project.id} className="project-card-admin">
              <ProjectSlider images={project.images} />

              <div className="project-info">
                <h3>{project.title}</h3>
                <p className="project-description">{project.description}</p>

                {project.technologies.length > 0 && (
                  <div className="project-tech">
                    <strong>Technologies :</strong>{" "}
                    {project.technologies.join(", ")}
                  </div>
                )}
              </div>

              <div className="project-actions">
                <button onClick={() => navigate(`/edit/${project.id}`)}>
                  Modifier
                </button>
                <button onClick={() => handleDelete(project.id)}>
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <form className="add-project-form" onSubmit={handleAddProject}>
          <input
            type="text"
            placeholder="Titre du projet"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Description du projet"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div className="technologies-form">
            <label>Technologies utilisées :</label>

            <div className="technologies-input">
              <input
                type="text"
                placeholder="ex : React"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
              />
              <button type="button" onClick={addTech}>
                Ajouter
              </button>
            </div>

            <div className="technologies-list">
              {technos.map((tech, i) => (
                <span key={i} className="tech-item">
                  {tech}
                  <button type="button" onClick={() => removeTech(tech)}>
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files))}
          />

          <button type="submit" className="submit-btn">
            ✅ Ajouter le projet
          </button>
        </form>
      )}
    </div>
  );
}
