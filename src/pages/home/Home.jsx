import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Header, Footer, Categorie } from "../../components";
import { ShoppingList } from "@/components/ShoppingList";
import { addToCart } from "../../redux/actions";

import bannerMobile from "../../assets/banner-mobile.jpg";
import bannerDesktop from "../../assets/banner2.jpg";

const Home = () => {
  const dispatch = useDispatch();
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

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  return (
    <div>
      <div className="bg-gray-25">
        <Header />
        <Categorie />

        {/* Bannières conditionnelles */}
        <div className="text-center mx-6">
          {isMobile ? (
            <img src={bannerMobile} className="rounded-2xl" alt="Bannière Mobile" />
          ) : (
            <img src={bannerDesktop} className="rounded-2xl" alt="Bannière Desktop" />
          )}
        </div>

        <ShoppingList addToCart={handleAddToCart} />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
