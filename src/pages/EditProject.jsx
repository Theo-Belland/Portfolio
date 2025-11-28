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
  const API_URL = import.meta.env.VITE_API_URL;

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

  const handleFilesChange = (e) => setFiles(Array.from(e.target.files));

  const addTech = () => {
    if (newTech.trim() && !technos.includes(newTech.trim())) {
      setTechnos([...technos, newTech.trim()]);
      setNewTech("");
    }
  };

  const removeTech = (tech) => setTechnos(technos.filter((t) => t !== tech));

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

        <div>
          <label>Technologies :</label>
          <div>
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
          <div>
            {technos.map((tech, i) => (
              <span key={i}>
                {tech}{" "}
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
          onChange={handleFilesChange}
        />

        <button type="submit">✅ Enregistrer</button>
      </form>

      {status && <p>{status}</p>}
    </div>
  );
}
