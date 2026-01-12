import React, { useState } from "react";
import { FaFacebook, FaLinkedin, FaGithub, FaUserCircle } from "react-icons/fa";
import "../Styles/footer.scss";
import { useNavigate } from "react-router-dom";
import LegalModal from "./LegalModal";

export default function Footer() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("mentions");

  const handleProfileClick = () => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/admin");
    } else {
      navigate("/login");
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  return (
    <>
      <footer className="footer">
        <div className="socials">
          <a
            href="https://www.facebook.com/profile.php?id=61582568237780"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook />
          </a>
          <a
            href="https://www.linkedin.com/in/theo-belland-94b27a1aa/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://github.com/Theo-Belland"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
          </a>
        </div>

        <div className="legal">
          <a onClick={() => openModal("mentions")}>Mentions légales</a>
          <a onClick={() => openModal("privacy")}>
            Politique de confidentialité
          </a>
        </div>

        <div className="admin-icon" onClick={handleProfileClick}>
          <FaUserCircle />
        </div>
      </footer>

      <LegalModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
      />
    </>
  );
}
