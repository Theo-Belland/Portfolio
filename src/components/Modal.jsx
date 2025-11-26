import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../Styles/modal.scss";

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://theobelland.fr";

export default function Modal({ project, closeModal }) {
  if (!project) return null;

  const fixImageUrl = (src) => {
    if (!src) return "";
    const cleanSrc = src.replace(/^\/?api/, "");
    return `${SITE_URL}${encodeURI(cleanSrc)}`;
  };

  return (
    <div
      className="modal-overlay"
      onClick={closeModal}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close"
          onClick={closeModal}
          aria-label="Fermer la fenêtre"
          type="button"
        >
          ✕
        </button>

        <h2 className="modal-title">{project.title}</h2>

        {project.images && project.images.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            loop={project.images.length > 1}
            style={{ width: "100%", height: "300px" }}
          >
            {project.images.map((src, i) => (
              <SwiperSlide key={i}>
                <img
                  src={fixImageUrl(src)}
                  alt={`Slide ${i + 1}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="modal-image placeholder" style={{ height: "300px" }}>
            Pas d'image
          </div>
        )}

        <div className="modal-body">
          <p className="project-description">{project.description}</p>
          <p>
            <strong>Technologies :</strong>{" "}
            {Array.isArray(project.techs) && project.techs.length > 0
              ? project.techs.join(", ")
              : "Non spécifiées"}
          </p>

          {Array.isArray(project.tasks) && project.tasks.length > 0 && (
            <>
              <h3>Fonctionnalités</h3>
              <ul>
                {project.tasks.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
