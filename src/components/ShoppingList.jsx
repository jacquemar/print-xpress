import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProductList } from "../redux/slices/productSlice";
import {
  addToCart,
  increaseQuantity,
  updateTotalQuantity,
} from "../redux/slices/cartSlice";
import { ProductCard } from './ProductCard';
import { FilterButtons } from './FilterButtons';
import { Button } from './ui/button';
import { Eye, } from 'lucide-react';
import API_URL from "../config";
import Pagination from "../components/Pagination";



export const ShoppingList = () => {
  const [showFilters, setShowFilters] = useState(false);
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.product.productList);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalQuantity = useSelector((state) => state.cart.cartItems.length);

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
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(9);
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
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Nos Produits
          </h1> <a href="/productGrid">
          <Button 
            variant="outline"
            className=""
          >
            
            <Eye className="mr-2 h-4 w-4" />
            Voir tout
            
          </Button></a>
        </div>

        <div className="flex flex-col items-center">
          

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
          <Button className='bg-pxcolor text-white mt-10 mb-11'>
            <a href="/productGrid">
            Voir tout les produits
            </a>
          </Button>
        </div>
      </div>
     
    </>
  );
};