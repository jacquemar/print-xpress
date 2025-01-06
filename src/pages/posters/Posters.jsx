import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Header, Footer } from "../../components";
import coverstick from "../../assets/cover.png";
import { 
  addToCart, 
  updateTotalQuantity, 
  increaseQuantity 
} from "../../redux/slices/cartSlice";
import { FilterBar } from '../../components/ProductGallery/FilterBar';
import { ProductCard } from '../../components/ProductCard';
import Pagination from "../../components/Pagination";

function Posters() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);
  const [activeGenre, setActiveGenre] = useState('all');
  const totalQuantity = useSelector((state) => state.cart.cartItems.length);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_APP_BASE_URL}/list`)
      .then((res) => res.json())
      .then((data) => {
        const posterProducts = data.filter(
          product => 
            product.category.toLowerCase() === "poster" ||
            product.category.toLowerCase() === "affiche"
        );
        setProducts(posterProducts);
        setFilteredProducts(posterProducts);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const handleAddToCart = (product) => {
    const productIndex = cartItems.findIndex((item) => item.id === product._id);
    if (productIndex !== -1) {
      dispatch(increaseQuantity({ productId: product._id }));
    } else {
      dispatch(addToCart({ ...product, id: product._id, quantity: 1 }));
      dispatch(updateTotalQuantity(totalQuantity + 1));
    }
  };

  const genres = ['all', ...new Set(products.map(p => p.gender))];

  const handleGenreClick = (genre) => {
    setActiveGenre(genre);
    if (genre === 'all') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(p => p.gender === genre);
      setFilteredProducts(filtered);
    }
    setCurrentPage(1);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Titre */}
        <h1 className="mb-6 text-center text-xl font-black sm:text-2xl lg:text-3xl">
          POSTERS / AFFICHES
        </h1>

        {/* Image de couverture */}
        <div className="relative mb-8 h-32 w-full sm:h-40 md:h-48 lg:h-56">
          <img
            src={coverstick}
            alt="stickerimage"
            className="h-full w-full rounded-lg object-cover shadow-md"
          />
        </div>

        {/* Section des filtres */}
        <div className="mb-6 overflow-hidden rounded-lg bg-white p-4 shadow-sm">
          <FilterBar
            genres={genres}
            activeGenre={activeGenre}
            onGenreClick={handleGenreClick}
          />
        </div>

        {/* Personnalisation card */}
        <div className="relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm mb-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex h-full flex-col items-center justify-center">
                <p className="mb-4 text-center font-thin">
                  Personnaliser vos Posters
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="mb-4 h-16 w-16 text-gray-400"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 013.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875zM12.75 12a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V18a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V12z"
                    clipRule="evenodd"
                  />
                  <path d="M14.25 5.25a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963A5.23 5.23 0 0016.5 7.5h-1.875a.375.375 0 01-.375-.375V5.25z" />
                </svg>
                <button
                  type="button"
                  className="cursor-not-allowed rounded-lg bg-gray-300 px-5 py-2.5 text-sm font-medium text-gray-500"
                  disabled
                >
                  Personnaliser (Bientôt disponible)
                </button>
              </div>
              <div className="absolute inset-0 bg-white bg-opacity-60"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-800">
                  Bientôt disponible
                </span>
              </div>
            </div>

        {/* Grille de produits */}
        <div className="mb-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {currentProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </div>
        </div>

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="mt-8">
            <Pagination
              totalProduct={filteredProducts.length}
              productPerPage={productsPerPage}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Posters;