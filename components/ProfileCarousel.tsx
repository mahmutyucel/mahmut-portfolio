"use client";

import { useState, useEffect } from "react";

export default function ProfileCarousel() {
  const [currentImage, setCurrentImage] = useState(0);
  const images = ["/images/profil.jpeg", "/images/profil2.jpeg"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div style={{ 
      width: "100%", 
      height: "400px", 
      background: "var(--bg-alt)", 
      border: "1px solid var(--line)", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      overflow: "hidden", 
      borderRadius: "4px",
      position: "relative"
    }}>
      {images.map((img, index) => (
        <img
          key={img}
          src={img}
          alt="Mahmut Yücel"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            /* Grileşme efekti (grayscale) buradan kaldırıldı */
            transition: "all 0.4s ease, opacity 1s ease-in-out",
            opacity: currentImage === index ? 1 : 0,
            zIndex: currentImage === index ? 1 : 0,
          }}
        />
      ))}
    </div>
  );
}