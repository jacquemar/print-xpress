import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Search, Unplug } from "lucide-react"; // Utilisation d'icônes Lucide

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const navigate = useNavigate();

  const handleResultClick = (result) => {
    if (result.isCategory) {
      navigate(`/category/${result.name}`);
    } else {
      navigate(`/product/${result._id}`);
    }
    setIsSearchVisible(false);
  };

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      axios
        .get(`${import.meta.env.VITE_APP_BASE_URL}/search?q=${searchTerm}`)
        .then((response) => {
          setSearchResults(response.data);
        })
        .catch((error) => {
          console.error("Erreur lors de la recherche :", error);
        });
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  return (
    <div className="relative w-full">
      {/* Bande de texte défilante */}
      <div className="w-full bg-pxcolor text-white py-2 overflow-hidden">
        <div className="whitespace-nowrap animate-marquee">
          🌟 Bienvenue chez PrintXpress ! Profitez de nos offres spéciales sur les impressions et fournitures de bureau ! 🌟
        </div>
      </div>

      {/* Header */}
      <div className="relative w-full px-4 mt-3 py-4 md:px-8">
        <div className="flex items-center justify-between space-x-4">
          {/* Logo */}
          <div className="h-12 w-12 shrink-0">
            <a href="/">
            <img 
              src="/logo512.png" 
              alt="logo" 
              className="h-full w-full object-contain"
            /></a>
          </div>

          {/* Conteneur de recherche */}
          <div className="relative flex-grow max-w-xl mx-auto">
            <div className="flex items-center">
              <input
                className="w-full rounded-full border border-cyan-700 bg-neutral-100 px-4 py-2 
                           text-center placeholder-gray-500 focus:outline-none 
                           focus:ring-2 focus:ring-cyan-500 
                           md:text-left md:pl-6"
                type="text"
                name="searchBar"
                id="searchBar"
                placeholder="Trouvez un produit"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsSearchVisible(true);
                }}
                onFocus={() => setIsSearchVisible(true)}
              />
              <button 
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => {/* Logique optionnelle de soumission de recherche */}}
              >
                <Search className="h-6 w-6 text-cyan-700" />
              </button>
            </div>

            {/* Liste déroulante des résultats de recherche */}
            {isSearchVisible && searchResults.length > 0 && (
              <div className="absolute z-20 mt-2 w-full rounded-md border border-gray-300 bg-white shadow-lg">
                <ul className="max-h-60 overflow-y-auto">
                  {searchResults.map((result) => (
                    <li
                      key={result._id}
                      className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      onClick={() => handleResultClick(result)}
                    >
                      {result.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Bouton de contact pour desktop */}
          <Link 
            to="https://connect2card.com/profile/printXpress" 
            className="hidden md:block rounded-full bg-cyan-700 text-white p-2 hover:bg-cyan-600 transition-colors"
          >
            <Unplug className="h-10 w-10" />
          </Link>

          {/* Bouton de contact pour mobile */}
          <Link 
            to="https://connect2card.com/profile/printXpress" 
            className="md:hidden rounded-full bg-pxcolor text-white p-2 hover:bg-cyan-600 transition-colors"
          >
            <Unplug className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
