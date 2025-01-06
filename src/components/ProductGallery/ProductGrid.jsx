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
import Pagination from "../Pagination";
import Footer from "../footer/Footer";

export const ProductGrid = () => {
  const [showFilters, setShowFilters] = useState(false);
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.product.productList);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalQuantity = useSelector((state) => state.cart.cartItems.length);

  // État pour les produits filtrés (uniquement les stickers)
  const [stickerProducts, setStickerProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(9);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_APP_BASE_URL}/list`)
      .then((res) => res.json())
      .then((data) => {
        dispatch(updateProductList(data));
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [dispatch]);

  // Filtrer les stickers dès que la liste des produits change
  useEffect(() => {
    const stickers = productList.filter(
      product => 
        product.category.toLowerCase() === "sticker" ||
        product.category.toLowerCase() === "étiquette"
    );
    setStickerProducts(stickers);
    setFilteredProducts(stickers);
  }, [productList]);

  const handleAddToCart = (product) => {
    const productIndex = cartItems.findIndex((item) => item.id === product._id);
    if (productIndex !== -1) {
      dispatch(increaseQuantity({ productId: product._id }));
    } else {
      dispatch(addToCart({ ...product, id: product._id, quantity: 1 }));
      dispatch(updateTotalQuantity(totalQuantity + 1));
    }
  };

  // Obtenir uniquement les genres des stickers
  const genders = stickerProducts.length > 0 
    ? [...new Set(stickerProducts.map(p => p.gender))]
    : [];

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct, 
    indexOfLastProduct
  );

  const handleFilterChange = (filters) => {
    let filtered = [...stickerProducts];
    
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
    setCurrentPage(1);
  };

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Stickers / Étiquettes
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
              // Ne pas passer categories car nous sommes déjà dans la section stickers
              genders={genders}
              onFilterChange={handleFilterChange}
              // Indiquer qu'on est dans la section stickers
              isStickersSection={true}
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
          </div>
        </div>
        
        <div className='text-center mb-16'>
          {filteredProducts.length > 0 && (
            <Pagination
              totalProduct={filteredProducts.length}
              productPerPage={productsPerPage}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
          )}
        </div>
      </div>
      <Footer/>
    </>
  );
};