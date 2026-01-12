import React, { useState } from "react";
import "../Styles/Navbar.scss";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div
          className={`hamburger ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <ul className={`navbar-links ${isOpen ? "active" : ""}`}>
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
