import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProductList } from "../../redux/slices/productSlice";
import {
  addToCart,
  increaseQuantity,
  updateTotalQuantity,
} from "../../redux/slices/cartSlice";
import { ProductCard } from '../ProductCard';
import { FilterButtons } from '../FilterButtons';
import { Button } from '../ui/button';
import { SlidersHorizontal } from 'lucide-react';
import API_URL from "../../config";
import Pagination from "../../components/Pagination";
import bannerMobile from "../../assets/banner-mobile.jpg";
import bannerDesktop from "../../assets/banner2.jpg";
import Header from '../header/Header';



export const AllProduct = () => {
  const [showFilters, setShowFilters] = useState(false);
  
const [currentPage, setCurrentPage] = useState(1);
const [productsPerPage] = useState(9);
  const lastProductIndex = currentPage * productsPerPage;
  const firstProductIndex = lastProductIndex - productsPerPage;
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.product.productList);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalQuantity = useSelector((state) => state.cart.cartItems.length);

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

  useEffect(() => {
    fetch(`${API_URL}/list`)
      .then((res) => res.json())
      .then((data) => {
        dispatch(updateProductList(data));
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [dispatch]);

  const handleAddToCart = (product) => {
    const productIndex = cartItems.findIndex((item) => item.id === product._id);
    if (productIndex !== -1) {
      dispatch(increaseQuantity({ productId: product._id }));
    } else {
      dispatch(addToCart({ ...product, id: product._id, quantity: 1 }));
      dispatch(updateTotalQuantity(totalQuantity + 1));
    }
  };

  const categories = productList.length > 0 
    ? [...new Set(productList.map(p => p.category))] 
    : [];
  const genders = productList.length > 0 
    ? [...new Set(productList.map(p => p.gender))] 
    : [];
    const [filteredProducts, setFilteredProducts] = useState(productList);
    const indexOfLastProduct = currentPage * productsPerPage;
const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
const currentProducts = filteredProducts.slice(
  indexOfFirstProduct, 
  indexOfLastProduct
);

const handleFilterChange = (filters) => {
  let filtered = [...productList];

  if (filters.category) {
    filtered = filtered.filter(p => p.category === filters.category);
  }
  if (filters.gender) {
    filtered = filtered.filter(p => p.gender === filters.gender);
  }
  if (filters.minPrice) {
    filtered = filtered.filter(p => p.price >= filters.minPrice);
  }
  if (filters.maxPrice) {
    filtered = filtered.filter(p => p.price <= filters.maxPrice);
  }

  setFilteredProducts(filtered);
  // Réinitialiser à la première page après filtrage
  setCurrentPage(1);
};

  // Mettre à jour filteredProducts quand productList change
  useEffect(() => {
    setFilteredProducts(productList);
  }, [productList]);

  return (
    <>
    <Header/>
    {/* Bannières conditionnelles */}
    <div className="text-center mt-4 mx-6">
          {isMobile ? (
            <img src={bannerMobile} className="rounded-2xl" alt="Bannière Mobile" />
          ) : (
            <img src={bannerDesktop} className="rounded-2xl" alt="Bannière Desktop" />
          )}
        </div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tous nos Produits
          </h1>
          <Button 
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filtres
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
            <FilterButtons
              categories={categories}
              genders={genders}
              onFilterChange={handleFilterChange}
            />
          </div>

          <div className="lg:col-span-3">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {currentProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={() => handleAddToCart(product)}
                />
              ))}
            </div>
            {productList.length > 0 && (
            <Pagination
              totalProduct={productList.length}
              productPerPage={productsPerPage}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
          )}
          </div>
        </div>
      </div>
     
    </>
  );
};