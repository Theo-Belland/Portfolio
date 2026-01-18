import React, { useState, useEffect } from "react";
import profilImg from "../assets/profil.webp";
import "../Styles/presentation.scss";

export default function Hero() {
  const words = ["Front-end", "HTML / CSS / JS", "React", "Node.js"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    let timeout;

    if (!isDeleting) {
      // écrire le mot
      if (displayedText.length < currentWord.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentWord.substring(0, displayedText.length + 1));
        }, 100);
      } else {
        // attendre avant de supprimer
        timeout = setTimeout(() => setIsDeleting(true), 1000);
      }
    } else {
      // supprimer le mot
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(currentWord.substring(0, displayedText.length - 1));
        }, 50);
      } else {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentWordIndex, words]);

  return (
    <section className="hero" id="presentation">
      <div className="hero-box">
        <h1>Théo Belland</h1>
        <p className="animated-text">
          Développeur-Web <span className="dynamic-text">{displayedText}</span>
          <span className="cursor">|</span>
        </p>
        <div className="colonne">
          <div>
            <img
              className="img img-rond"
              src={profilImg}
              alt="photo-profil"
              width="160"
              height="160"
            />
          </div>
          <div className="max-width">
            <h2>Présentation</h2>
            <div className="presentation-wrapper">
              <div className="section">
                <h3>👋 À propos de moi</h3>
                <p>
                  Bonjour, moi c’est Théo. À 25 ans, j’ai choisi de me
                  reconvertir dans le développement web afin de me diriger vers
                  un domaine qui me passionne vraiment.
                </p>
              </div>

              <div className="separator"></div>

              <div className="section">
                <h3>🎓 Parcours & formation</h3>
                <p>
                  Après une formation centrée sur les fondamentaux du front-end
                  (HTML, CSS, JavaScript) et la création d’interfaces modernes,
                  j’ai commencé à développer des projets concrets qui m’ont
                  permis de renforcer mes bases, d’explorer de nouvelles
                  technologies et de structurer ma manière de travailler.
                </p>
              </div>

              <div className="separator"></div>

              <div className="section">
                <h3>🎨 Ce que j’aime faire</h3>
                <p>
                  Je m’intéresse particulièrement au développement front-end
                  orienté design : concevoir des interfaces claires,
                  esthétiques, responsives et agréables à utiliser. J’aime
                  transformer une idée en une expérience digitale fluide,
                  pratique et visuellement soignée.
                </p>
              </div>

              <div className="separator"></div>

              <div className="section">
                <h3>🚀 Objectifs</h3>
                <p>
                  Aujourd’hui, je continue de monter en compétences :
                  organisation du code, animations, logique JavaScript, bonnes
                  pratiques, UX… Mon objectif est d’évoluer dans un
                  environnement où je pourrai contribuer à des projets
                  ambitieux, apprendre au contact d’autres développeurs et
                  progresser chaque jour dans un métier qui me motive
                  réellement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
