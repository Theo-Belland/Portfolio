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
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("");
  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL; // ex: https://theobelland.fr/api

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
        }
      } catch (err) {
        console.error(err);
        setStatus("⚠️ Impossible de charger le projet.");
      }
    };
    fetchProject();
  }, [id, API_URL]);

  // Gestion des fichiers
  const handleFilesChange = (e) => setFiles(Array.from(e.target.files));

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
      files.forEach((file) => formData.append("images", file));

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

  return (
    <div className="edit-project">
      <h2>Modifier le projet</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "500px" }}
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

        {/* Gestion des technologies */}
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
          <div style={{ marginTop: "0.5rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
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
                  style={{ border: "none", background: "transparent", color: "#888", cursor: "pointer" }}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        <input type="file" accept="image/*" multiple onChange={handleFilesChange} />

        <button
          type="submit"
          style={{ background: "#333", color: "#fff", padding: "0.5rem", borderRadius: "8px" }}
        >
          ✅ Enregistrer
        </button>
      </form>

      {status && <p>{status}</p>}
    </div>
  );
}
