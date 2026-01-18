import React from "react";
import "../Styles/modal.scss";

export default function LegalModal({ isOpen, onClose, type }) {
  if (!isOpen) return null;

  const content = {
    mentions: {
      title: "Mentions légales",
      body: (
        <>
          <h3>Éditeur du site</h3>
          <p>
            <strong>Nom :</strong> Théo Belland
            <br />
            <strong>Statut :</strong> Développeur web Front-End
            <br />
            <strong>Email :</strong> contact@theobelland.fr
          </p>

          <h3>Hébergement</h3>
          <p>
            Ce site est hébergé par :<br />
            <strong>OVH</strong>
            <br />
            2 rue Kellermann - 59100 Roubaix - France
            <br />
            Tél : 1007
          </p>

          <h3>Propriété intellectuelle</h3>
          <p>
            L'ensemble de ce site relève de la législation française et
            internationale sur le droit d'auteur et la propriété intellectuelle.
            Tous les droits de reproduction sont réservés, y compris pour les
            documents téléchargeables et les représentations iconographiques et
            photographiques.
          </p>

          <h3>Crédits</h3>
          <p>
            Conception et développement : Théo Belland
            <br />
            Toutes les photos et contenus sont la propriété de Théo Belland.
          </p>
        </>
      ),
    },
    privacy: {
      title: "Politique de confidentialité",
      body: (
        <>
          <h3>Collecte des données</h3>
          <p>
            Ce site collecte uniquement les données nécessaires au bon
            fonctionnement du formulaire de contact. Les informations collectées
            sont :
          </p>
          <ul>
            <li>Nom et prénom</li>
            <li>Adresse email</li>
            <li>Message</li>
          </ul>

          <h3>Utilisation des données</h3>
          <p>
            Les données collectées via le formulaire de contact sont utilisées
            exclusivement pour répondre à votre demande. Elles ne sont jamais
            partagées avec des tiers et ne font l'objet d'aucune exploitation
            commerciale.
          </p>

          <h3>Cookies</h3>
          <p>
            Ce site utilise des cookies techniques nécessaires au bon
            fonctionnement du site (authentification admin, préférences). Aucun
            cookie de tracking ou publicitaire n'est utilisé.
          </p>

          <h3>Vos droits</h3>
          <p>
            Conformément au RGPD, vous disposez d'un droit d'accès, de
            rectification et de suppression de vos données personnelles. Pour
            exercer ces droits, contactez-moi à :{" "}
            <strong>contact@theobelland.fr</strong>
          </p>

          <h3>Sécurité</h3>
          <p>
            Toutes les mesures techniques et organisationnelles sont mises en
            œuvre pour assurer la sécurité de vos données personnelles.
          </p>
        </>
      ),
    },
  };

  const { title, body } = content[type] || content.mentions;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content legal-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <h2 className="modal-title">{title}</h2>
        <div className="modal-body legal-content">{body}</div>
      </div>
    </div>
  );
}
