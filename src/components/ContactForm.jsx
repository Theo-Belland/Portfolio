import React, { useState } from "react";
import "../Styles/form.scss";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  // URL de l'API depuis le .env client (ex: VITE_API_URL=http://localhost:3000)
  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("⏳ Envoi en cours...");

    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Erreur réseau");
      }

      const data = await res.json();

      if (data.success) {
        setStatus("✅ Message envoyé !");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("❌ Erreur lors de l’envoi : " + (data.message || ""));
      }
    } catch (err) {
      setStatus("⚠️ Impossible de contacter le serveur.");
      console.error("Erreur contact form:", err);
    }
  };

  return (
    <form className="form-contact" onSubmit={handleSubmit} id="contact">
      <h3>Contact</h3>

      <input
        name="name"
        placeholder="Nom"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <textarea
        name="message"
        placeholder="Message"
        value={form.message}
        onChange={handleChange}
        required
      />

      <button className="envoi" type="submit">
        Envoyer
      </button>

      {status && <p>{status}</p>}
    </form>
  );
}
