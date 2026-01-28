import React, { useState } from "react";
import "../Styles/layout/_navbar.scss";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-content">

        {/* Bouton menu (mobile uniquement) */}
        <button
          className="menu-toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          Menu {isOpen ? "▴" : "▾"}
        </button>

        {/* Liens */}
        <ul className={`navbar-links ${isOpen ? "active" : ""}`}>
          <li><a href="#accueil" onClick={() => setIsOpen(false)}>Accueil</a></li>
          <li><a href="#presentation" onClick={() => setIsOpen(false)}>Présentation</a></li>
          <li><a href="#competences" onClick={() => setIsOpen(false)}>Compétences</a></li>
          <li><a href="#project" onClick={() => setIsOpen(false)}>Projets</a></li>
          <li><a href="#contact" onClick={() => setIsOpen(false)}>Contact</a></li>
        </ul>

      </div>
    </nav>
  );
}
