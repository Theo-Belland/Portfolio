import React, { useState } from "react";
import "../Styles/form.scss";
import { MapPin, Phone, Mail } from "lucide-react"; // Icônes propres

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

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

      const data = await res.json();

      if (data.success) {
        setStatus("✅ Message envoyé !");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("❌ Erreur lors de l’envoi.");
      }
    } catch {
      setStatus("⚠️ Impossible de contacter le serveur.");
    }
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">
        {/* ================= COLONNE GAUCHE ================= */}
        <div className="contact-left">
          {/* Infos */}
          <div className="contact-info">
            <h3>Informations</h3>

            <div className="info-line">
              <MapPin className="icon" />
              <p>2188 Route de la Jardinière, 61100 Landisacq</p>
            </div>

            <div className="info-line">
              <Phone className="icon" />
              <p>06 06 58 38 19</p>
            </div>

            <div className="info-line">
              <Mail className="icon" />
              <p>contact@theobelland.fr</p>
            </div>
          </div>

          {/* Carte */}
          <div className="contact-map">
            <h3>Localisation</h3>
            <div className="map-wrapper">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2630.93502923981!2d-0.6834766558486455!3d48.74493785847217!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x480a2acd03834d39%3A0xf73a6e80dfbc55eb!2s2188%20Rte%20de%20la%20Jardini%C3%A8re%2C%2061100%20Landisacq!5e0!3m2!1sfr!2sfr!4v1765367979617!5m2!1sfr!2sfr"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        {/* ================= FORMULAIRE ================= */}
        <div className="contact-form">
          <h3>Contactez-moi</h3>

          <form className="form-contact" onSubmit={handleSubmit}>
            <label>Nom</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <label>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label>Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
            />

            <button type="submit" className="envoi">
              Envoyer
            </button>

            {status && <p className="status">{status}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
