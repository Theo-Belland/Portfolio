import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../Styles/add-project.scss";

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTechnos, setSelectedTechnos] = useState([]);
  const [availableTechnos, setAvailableTechnos] = useState([]);
  const [files, setFiles] = useState([]);
  const [imageMode, setImageMode] = useState("keep"); // "keep" ou "upload"
  const [status, setStatus] = useState("");

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL || "https://theobelland.fr/api";

  // Récupérer la liste des technologies disponibles
  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const res = await fetch(`${API_URL}/technologies`);
        if (res.ok) {
          const data = await res.json();
          setAvailableTechnos(data);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des technologies:", err);
      }
    };
    fetchTechnologies();
  }, [API_URL]);

  // Récupérer le projet par ID
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`${API_URL}/projects/${id}`);
        if (!res.ok) throw new Error("Projet introuvable");
        const data = await res.json();
        setProject(data);
        setTitle(data.title);
        setDescription(data.description);
        setSelectedTechnos(data.technologies || []);
      } catch (err) {
        console.error(err);
        setStatus("❌ Projet introuvable.");
      }
    };
    fetchProject();
  }, [id, API_URL]);

  const handleFilesChange = (e) => setFiles(Array.from(e.target.files));

  const toggleTechno = (tech) => {
    if (selectedTechnos.includes(tech)) {
      setSelectedTechnos(selectedTechnos.filter((t) => t !== tech));
    } else {
      setSelectedTechnos([...selectedTechnos, tech]);
    }
  };

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
      formData.append("technologies", JSON.stringify(selectedTechnos));
      
      if (imageMode === "keep") {
        // Garder les anciennes images
        formData.append("oldImages", JSON.stringify(project.images || []));
      } else if (imageMode === "upload") {
        // Remplacer par des nouvelles images uploadées
        files.forEach((file) => formData.append("images", file));
      }

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
          <div className="technologies-selector">
            {availableTechnos.length === 0 ? (
              <p>
                Aucune technologie disponible. Ajoutez-en dans la gestion des
                technologies.
              </p>
            ) : (
              <div className="tech-checkboxes">
                {availableTechnos.map((tech, i) => (
                  <label key={i} className="tech-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedTechnos.includes(tech)}
                      onChange={() => toggleTechno(tech)}
                    />
                    <span>{tech}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {selectedTechnos.length > 0 && (
            <div className="selected-technos">
              <strong>Sélectionnées :</strong>
              <div className="tech-tags">
                {selectedTechnos.map((tech, i) => (
                  <span key={i} className="tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mode de gestion des images */}
        <div className="image-mode-selector">
          <label>Gestion des images :</label>
          <div className="mode-buttons">
            <button
              type="button"
              className={imageMode === "keep" ? "active" : ""}
              onClick={() => setImageMode("keep")}
            >
              ✅ Garder existantes
            </button>
            <button
              type="button"
              className={imageMode === "upload" ? "active" : ""}
              onClick={() => setImageMode("upload")}
            >
              📤 Remplacer par upload
            </button>
          </div>
        </div>

        {/* Images existantes */}
        {imageMode === "keep" && project.images?.length > 0 && (
          <div style={{ marginTop: "1rem" }}>
            <label>Images actuelles ({project.images.length}) :</label>
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
                      borderRadius: "8px",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(img)}
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      background: "rgba(239, 68, 68, 0.9)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload nouvelles images */}
        {imageMode === "upload" && (
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesChange}
          />
        )}

        <button className="ajoute" type="submit">
          Mettre à jour
        </button>
      </form>

      {status && <p style={{ marginTop: "0.5rem" }}>{status}</p>}
    </div>
  );
}
