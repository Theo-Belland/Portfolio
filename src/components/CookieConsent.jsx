import React, { useState, useEffect } from "react";
import "../Styles/cookie.scss";

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowConsent(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "declined");
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="cookie-consent">
      <div className="cookie-content">
        <div className="cookie-icon">🍪</div>
        <div className="cookie-text">
          <h3>Gestion des cookies</h3>
          <p>
            Ce site utilise des cookies pour améliorer votre expérience de navigation
            et analyser le trafic. En acceptant, vous consentez à l'utilisation de cookies.
          </p>
        </div>
        <div className="cookie-actions">
          <button className="btn-decline" onClick={handleDecline}>
            Refuser
          </button>
          <button className="btn-accept" onClick={handleAccept}>
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
