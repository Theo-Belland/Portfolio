import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TechBadge from "../components/TechBadge.jsx";
import "../Styles/add-project.scss";

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technos, setTechnos] = useState([]);
  const [newTech, setNewTech] = useState("");
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("");

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL;

  // ------------------------------
  // Récupérer le projet par ID
  // ------------------------------
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`${API_URL}/projects/${id}`);
        if (!res.ok) throw new Error("Projet introuvable");
        const data = await res.json();
        setProject(data);
        setTitle(data.title);
        setDescription(data.description);
        setTechnos(data.technologies || []);
      } catch (err) {
        console.error(err);
        setStatus("❌ Projet introuvable.");
      }
    };
    fetchProject();
  }, [id, API_URL]);

  const handleFilesChange = (e) => setFiles(Array.from(e.target.files));

  const addTech = () => {
    if (newTech.trim() && !technos.includes(newTech.trim())) {
      setTechnos([...technos, newTech.trim()]);
      setNewTech("");
    }
  };

  const removeTech = (tech) => setTechnos(technos.filter((t) => t !== tech));

  const removeImage = (img) => {
    setProject({
      ...project,
      images: project.images.filter((i) => i !== img),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("⏳ Mise à jour en cours...");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("technologies", JSON.stringify(technos));
      formData.append("oldImages", JSON.stringify(project.images || []));
      files.forEach((file) => formData.append("images", file));

      const res = await fetch(`${API_URL}/projects/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Erreur lors de la mise à jour");
      }

      setStatus("✅ Projet mis à jour !");
      setTimeout(() => navigate("/admin"), 1200);
    } catch (err) {
      console.error(err);
      setStatus(`❌ ${err.message}`);
    }
  };

  if (!project) return <p>{status || "Chargement..."}</p>;

  return (
    <div className="edit-project">
      <h2>Modifier le projet</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre du projet"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description du projet"
          required
        />

        {/* Technologies */}
        <div>
          <label>Technologies :</label>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            <input
              type="text"
              placeholder="ex: React"
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
            />
            <button type="button" onClick={addTech}>
              Ajouter
            </button>
          </div>
          <div
            style={{
              marginTop: "0.5rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            {technos.map((tech, i) => (
              <TechBadge key={i} tech={tech} onRemove={removeTech} />
            ))}
          </div>
        </div>

        {/* Images existantes */}
        {project.images?.length > 0 && (
          <div style={{ marginTop: "1rem" }}>
            <label>Images existantes :</label>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {project.images.map((img, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img
                    src={img}
                    alt={`Projet ${i}`}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(img)}
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      background: "red",
                      color: "#fff",
                      border: "none",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      cursor: "pointer",
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ajouter nouvelles images */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFilesChange}
          style={{ marginTop: "1rem" }}
        />

        <button type="submit" style={{ marginTop: "1rem" }}>
          ✅ Enregistrer
        </button>
      </form>

      {status && <p style={{ marginTop: "0.5rem" }}>{status}</p>}
    </div>
  );
}
