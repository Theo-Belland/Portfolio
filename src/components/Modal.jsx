import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "../Styles/layout/_modal.scss";

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://theobelland.fr";

export default function Modal({ project, closeModal }) {
  if (!project) return null;

  const fixImageUrl = (src) => {
    if (!src) return "";
    if (src.startsWith("http://") || src.startsWith("https://")) return src;

    let clean = src.replace(/^\/?api\//, "");
    const parts = clean.split("/");
    const filename = parts.pop();
    const path = parts.join("/");
    const encoded = encodeURIComponent(filename);

    return `${SITE_URL}/${path}/${encoded}`;
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* CLOSE BUTTON */}
        <button className="modal-close" onClick={closeModal}>
          ✕
        </button>

        {/* TITLE */}
        <h2 className="modal-title">{project.title}</h2>

        {/* SLIDER */}
        <div className="modal-slider">
          {project.images?.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              loop={project.images.length > 1}
              className="swiper-container"
            >
              {project.images.map((src, i) => (
                <SwiperSlide key={i}>
                  <img
                    src={fixImageUrl(src)}
                    alt={`Slide ${i}`}
                    loading="lazy"
                    width="600"
                    height="400"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="modal-image placeholder">Pas d’image</div>
          )}
        </div>

        {/* BODY */}
        <div className="modal-body">
          <p className="project-description">{project.description}</p>

          {/* TECHNO SECTION */}
          <div className="modal-section">
            <h3>Technologies</h3>
            <div className="tech-bar">
              {project.technologies?.length > 0
                ? project.technologies.join(" • ")
                : "Non spécifiées"}
            </div>
          </div>

          {/* FEATURES */}
          {project.tasks?.length > 0 && (
            <div className="modal-section">
              <h3>Fonctionnalités</h3>
              <ul className="features-list">
                {project.tasks.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          )}

          {/* GITHUB LAST UPDATE */}
          {project.github_url && project.pushed_at && (
            <p className="github-date">
              🕒 Dernière modification :{" "}
              {new Date(project.pushed_at).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}

          {/* LINKS */}
          <div className="modal-links">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-link"
              >
                🔗 GitHub
              </a>
            )}

            {project.site_url && (
              <a
                href={project.site_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-link"
              >
                🌍 Voir le site
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
