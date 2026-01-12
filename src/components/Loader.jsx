import React from "react";
import "../Styles/loader.scss";

export default function Loader() {
  return (
    <div className="loader-container">
      <div className="loader-content">
        <div className="spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        <h1 className="loader-title">Théo Belland</h1>
        <p className="loader-subtitle">Développeur Front-End</p>
        <div className="loader-progress">
          <div className="loader-bar"></div>
        </div>
      </div>
    </div>
  );
}
