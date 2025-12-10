import React from "react";
import "../Styles/Navbar.scss";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Logo si tu veux en ajouter un */}
        <div className="navbar-logo">
          <img src="/logo.png" alt="Logo" />
        </div>

        {/* Menu */}
        <ul className="navbar-links">
          <li>
            <a href="#accueil">Accueil</a>
          </li>
          <li>
            <a href="#presentation">Présentation</a>
          </li>
          <li>
            <a href="#competences">Compétences</a>
          </li>
          <li>
            <a href="#project">Projets</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
