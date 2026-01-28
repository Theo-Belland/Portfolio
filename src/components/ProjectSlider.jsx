import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../Styles/components/_project-slider.scss";

const SITE_URL = import.meta.env.VITE_SITE_URL || "http://localhost:5000";

export default function ProjectSlider({ images = [] }) {
  // --- Memoisation des URLs ---
  const processedImages = useMemo(() => {
    return images.map((src) => {
      if (!src) return "";
      if (src.startsWith("http://") || src.startsWith("https://")) return src;

      let clean = src.replace(/^\/?uploads\//, "uploads/");
      const parts = clean.split("/");
      const filename = encodeURIComponent(parts.pop());
      const path = parts.join("/");

      return `${SITE_URL}/${path}/${filename}`;
    });
  }, [images]);

  // --- Early return ---
  if (!images.length) return <p>Aucune image disponible</p>;

  return (
    <div className="project-slider" style={{ height: "180px" }}>
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        loop={processedImages.length > 1}
        style={{ width: "100%", height: "100%" }}
      >
        {processedImages.map((src, index) => (
          <SwiperSlide key={index}>
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
