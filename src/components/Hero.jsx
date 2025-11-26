import React, { useState, useEffect } from "react";
import profilImg from "../assets/profil.jpg";
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
    <section className="hero">
      <h1>Théo Belland</h1>
      <p className="animated-text">
        Développeur-Web <span className="dynamic-text">{displayedText}</span>
        <span className="cursor">|</span>
      </p>
      <div className="colonne">
        <div>
          <img className="img img-rond" src={profilImg} alt="photo-profil" />
        </div>
        <div className="max-witdh">
          <h2>Présentation</h2>
          <p className="text">
            Bonjour, moi c’est Théo, j’ai 25 ans et je me suis récemment lancé
            dans une reconversion professionnelle vers le développement web.
            Passionné par le numérique et curieux d’apprendre, j’ai choisi de
            suivre une formation en création de sites web afin d’acquérir des
            bases solides en HTML, CSS, JavaScript et en conception d’interfaces
            modernes. Aujourd’hui, je prends plaisir à créer des projets
            concrets et à développer mes compétences pour construire des sites à
            la fois esthétiques, fonctionnels et accessibles. Cette aventure est
            pour moi une nouvelle étape vers un métier qui me passionne vraiment
            !
          </p>
        </div>
      </div>
    </section>
  );
}
