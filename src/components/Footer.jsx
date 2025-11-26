import React from "react";
import { FaFacebook, FaLinkedin, FaGithub, FaUserCircle } from "react-icons/fa";
import "../Styles/footer.scss";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    const token = localStorage.getItem("token");

    if(token){
      navigate("/admin");
    }else{
      navigate("/login");
    }
  };

  return (
    <footer className="footer">
      <div className="socials">
        <a href="https://www.facebook.com/profile.php?id=61582568237780" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
        <a href="https://www.linkedin.com/in/theo-belland-94b27a1aa/" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
        <a href="https://github.com/Theo-Belland" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
      </div>

      <div className="legal">
        <a href="#">Mentions légales</a>
        <a href="#">Politique de confidentialité</a>
      </div>

      <div className="admin-icon" onClick={handleProfileClick}>
        <FaUserCircle />
      </div>
    </footer>
  );
}
