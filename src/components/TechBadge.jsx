// src/components/TechBadge.jsx
import React from "react";
import "../Styles/techBadge.scss";

export default function TechBadge({ tech, onRemove }) {
  return (
    <span className="tech-badge">
      {tech}
      {onRemove && (
        <button
          type="button"
          className="remove-btn"
          onClick={() => onRemove(tech)}
        >
          ✕
        </button>
      )}
    </span>
  );
}
