import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../Styles/projectSlider.scss";

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://theobelland.fr";

export default function ProjectSlider({ images = [] }) {
  if (!images.length) return <p>Aucune image disponible</p>;

  const fixImageUrl = (src) => {
    if (!src) return "";
    const cleanSrc = src.replace(/^\/?api/, "");
    return `${SITE_URL}${encodeURI(cleanSrc)}`;
  };

  return (
    <div className="project-slider" style={{ height: "180px" }}>
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        loop={images.length > 1}
        style={{ width: "100%", height: "100%" }}
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <img
              src={fixImageUrl(src)}
              alt={`Slide ${index + 1}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
