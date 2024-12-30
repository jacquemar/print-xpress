import React, { useState, useEffect } from "react";
import bannerMobile from "../assets/banner-mobile.jpg";
import bannerDesktop from "../assets/banner2.jpg";

const Banner = () => {

  const [isMobile, setIsMobile] = useState(false);

  // Détecter la taille de l'écran
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleResize = () => setIsMobile(mediaQuery.matches);

    // Initialiser l'état
    handleResize();

    // Ajouter un écouteur pour gérer les changements de taille
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  return (
    <div>
        {/* Bannières conditionnelles */}
        <div className="text-center mt-4 mx-6">
          {isMobile ? (
            <img src={bannerMobile} className="rounded-2xl" alt="Bannière Mobile" />
          ) : (
            <img src={bannerDesktop} className="rounded-2xl" alt="Bannière Desktop" />
          )}
        </div>
    </div>
  );
};

export default Banner;
