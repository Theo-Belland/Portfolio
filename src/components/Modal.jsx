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

    // URL absolue → ne rien toucher
    if (src.startsWith("http://") || src.startsWith("https://")) {
      return src;
    }

    // Supprime /api au début
    let clean = src.replace(/^\/?api\//, "");

    // Sépare dossier + fichier
    const parts = clean.split("/");
    const filename = parts.pop();
    const path = parts.join("/");

    // Encode seulement le nom du fichier
    const encoded = encodeURIComponent(filename);

    return `${SITE_URL}/${path}/${encoded}`;
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={closeModal}>
          ✕
        </button>

        <h2 className="modal-title">{project.title}</h2>

        {project.images?.length > 0 ? (
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
            {project.technologies?.length > 0
              ? project.technologies.join(", ")
              : "Non spécifiées"}
          </p>

          {project.tasks?.length > 0 && (
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
