import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/add-project.scss";

export default function AddProject() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTechnos, setSelectedTechnos] = useState([]);
  const [availableTechnos, setAvailableTechnos] = useState([]);
  const [files, setFiles] = useState([]);
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

  const handleFilesChange = (e) => setFiles(Array.from(e.target.files));

  const toggleTechno = (tech) => {
    if (selectedTechnos.includes(tech)) {
      setSelectedTechnos(selectedTechnos.filter((t) => t !== tech));
    } else {
      setSelectedTechnos([...selectedTechnos, tech]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("⏳ Création en cours...");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("technologies", JSON.stringify(selectedTechnos));
      files.forEach((file) => formData.append("images", file));

      const res = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Erreur lors de la création");
      }

      setStatus("✅ Projet créé !");
      setTimeout(() => navigate("/admin/managementProject"), 1200);
    } catch (err) {
      console.error(err);
      setStatus(`❌ ${err.message}`);
    }
  };

  return (
    <div className="edit-project">
      <h2>Ajouter un projet</h2>
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

        {/* Sélection des technologies */}
        <div>
          <label>Technologies utilisées :</label>
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

        {/* Upload fichiers */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFilesChange}
        />

        <button className="ajoute" type="submit">
          Créer le projet
        </button>
      </form>

      {status && <p style={{ marginTop: "0.5rem" }}>{status}</p>}
    </div>
  );
}
