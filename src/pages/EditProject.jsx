import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technos, setTechnos] = useState([]);
  const [newTech, setNewTech] = useState("");
  const [newFiles, setNewFiles] = useState([]); // nouvelles images
  const [status, setStatus] = useState("");
  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL; // ex: https://theobelland.fr/api
  const SITE_URL = import.meta.env.VITE_SITE_URL || "https://theobelland.fr";

  // Récupérer le projet
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`${API_URL}/projects`);
        const data = await res.json();
        const proj = data.find((p) => p.id === Number(id));
        if (!proj) setStatus("❌ Projet introuvable.");
        else {
          setProject(proj);
          setTitle(proj.title);
          setDescription(proj.description);
          setTechnos(proj.technologies || []);
          setNewFiles([]); // aucune nouvelle image pour le moment
        }
      } catch (err) {
        console.error(err);
        setStatus("⚠️ Impossible de charger le projet.");
      }
    };
    fetchProject();
  }, [id, API_URL]);

  // Prévisualisation des nouvelles images
  const handleFilesChange = (e) => {
    const filesArray = Array.from(e.target.files);
    setNewFiles((prev) => [...prev, ...filesArray]);
  };

  // Supprimer une image existante (frontend seulement)
  const removeOldImage = (index) => {
    if (!project) return;
    const updatedImages = [...project.images];
    updatedImages.splice(index, 1);
    setProject({ ...project, images: updatedImages });
  };

  // Supprimer une nouvelle image avant upload
  const removeNewFile = (index) => {
    const updatedFiles = [...newFiles];
    updatedFiles.splice(index, 1);
    setNewFiles(updatedFiles);
  };

  // Ajouter une techno
  const addTech = () => {
    if (newTech.trim() && !technos.includes(newTech.trim())) {
      setTechnos([...technos, newTech.trim()]);
      setNewTech("");
    }
  };

  // Supprimer une techno
  const removeTech = (tech) => setTechnos(technos.filter((t) => t !== tech));

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("⏳ Mise à jour en cours...");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("technologies", JSON.stringify(technos));

      // Ajouter les nouvelles images
      newFiles.forEach((file) => formData.append("images", file));

      const res = await fetch(`${API_URL}/projects/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }, // PAS de Content-Type !
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

  // Fonction pour corriger les URL d'images
  const fixImageUrl = (src) => {
    if (!src) return "";
    return src.startsWith("http") ? src : `${SITE_URL}${encodeURI(src)}`;
  };

  return (
    <div className="edit-project">
      <h2>Modifier le projet</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: "600px",
        }}
      >
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
          <label>Technologies utilisées :</label>
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
              <span
                key={i}
                style={{
                  background: "#eee",
                  borderRadius: "15px",
                  padding: "0.3rem 0.8rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                {tech}
                <button
                  type="button"
                  onClick={() => removeTech(tech)}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "#888",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Images existantes */}
        {project.images && project.images.length > 0 && (
          <div>
            <p>Images existantes :</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {project.images.map((img, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img
                    src={fixImageUrl(img)}
                    alt={`Project ${i}`}
                    style={{
                      width: "120px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeOldImage(i)}
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      background: "#f00",
                      color: "#fff",
                      border: "none",
                      borderRadius: "50%",
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

        {/* Nouvelles images */}
        {newFiles.length > 0 && (
          <div>
            <p>Nouvelles images :</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {newFiles.map((file, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`New ${i}`}
                    style={{
                      width: "120px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeNewFile(i)}
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      background: "#f00",
                      color: "#fff",
                      border: "none",
                      borderRadius: "50%",
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

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFilesChange}
        />

        <button
          type="submit"
          style={{
            background: "#333",
            color: "#fff",
            padding: "0.5rem",
            borderRadius: "8px",
          }}
        >
          ✅ Enregistrer
        </button>
      </form>

      {status && <p>{status}</p>}
    </div>
  );
}
