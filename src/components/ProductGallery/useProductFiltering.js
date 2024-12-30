import { useState, useEffect } from 'react';

export const useProductFiltering = (initialProducts, category, productsPerPage = 8) => {
  const [products, setProducts] = useState(initialProducts);
  const [activeGenre, setActiveGenre] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [uniqueGenres, setUniqueGenres] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const categoryProducts = products.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );
      const genres = [...new Set(categoryProducts.map((product) => product.gender))];
      setUniqueGenres(genres);
    }
  }, [products, category]);

  const handleGenreClick = (genre) => {
    setActiveGenre(activeGenre === genre ? null : genre);
    setCurrentPage(1);
  };

  const filteredProducts = activeGenre
    ? products.filter(
        (product) =>
          product.category.toLowerCase() === category.toLowerCase() &&
          product.gender === activeGenre
      )
    : products.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );

  const paginatedProducts = {
    currentProducts: filteredProducts.slice(
      (currentPage - 1) * productsPerPage,
      currentPage * productsPerPage
    ),
    totalProducts: filteredProducts.length
  };

  return {
    activeGenre,
    uniqueGenres,
    currentPage,
    setCurrentPage,
    handleGenreClick,
    paginatedProducts,
    setProducts
  };
};