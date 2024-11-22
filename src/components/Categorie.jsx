import React from "react";
import { Link } from "react-router-dom";
import stickerIcon from "/src/assets/STICKER-ICON.png";
import posterIcon from "/src/assets/POSTER-ICON.png";
import polaroidIcon from "/src/assets/POLAROID-ICON.png";
import skinIcon from "/src/assets/SKIN-ICON.png";
import carteIcon from "/src/assets/CARTE-ICON.png";
const Category = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Catégories</h2>
      <div className="flex justify-center">
        <div className="scrollbar-hide flex max-w-4xl space-x-8 overflow-x-auto pb-4">
          <CategoryLink
            to="/stickers"
            icon={stickerIcon}
            text="Stickers Étiquettes"
          />
          <CategoryLink
            to="/posters"
            icon={posterIcon}
            text="Posters Affiches"
          />
          <CategoryLink to="/photos" icon={polaroidIcon} text="Photos Cadres" />
          <CategoryLink to="/skin" icon={skinIcon} text="Skin Adhésif" />
          <CategoryLink to="" icon={carteIcon} text="Cartes Professionnelles" />
        </div>
      </div>
    </div>
  );
};

const CategoryLink = ({ to, icon, text }) => (
  <Link
    to={to}
    className="flex flex-col items-center transition-transform hover:scale-105"
  >
    <div className="mb-3 h-16 w-16 overflow-hidden rounded-full bg-gray-100 p-2 shadow-md">
      <img src={icon} alt={text} className="h-full w-full object-contain" />
    </div>
    <p className="text-center text-sm font-medium text-gray-700">{text}</p>
  </Link>
);

export default Category;
