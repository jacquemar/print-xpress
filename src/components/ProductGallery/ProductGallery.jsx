import React from 'react';
import { FilterBar } from './FilterBar';
import { ProductGrid } from '../ProductGallery/ProductGrid';
import Pagination from '../Pagination';
import { useProductFiltering } from './useProductFiltering';

export const ProductGallery = ({
  products,
  category,
  onAddToCart,
  productsPerPage = 8,
  CustomCard = null,
  headerComponent = null,
}) => {
  const {
    activeGenre,
    uniqueGenres,
    currentPage,
    setCurrentPage,
    handleGenreClick,
    paginatedProducts,
  } = useProductFiltering(products, category, productsPerPage);

  return (
    <section className="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-12">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
       

        <ProductGrid
          products={paginatedProducts.currentProducts}
          onAddToCart={onAddToCart}
          CustomCard={CustomCard}
        />

{headerComponent}
        
        <FilterBar
          genres={uniqueGenres}
          activeGenre={activeGenre}
          onGenreClick={handleGenreClick}
        />

        {paginatedProducts.totalProducts > 0 && (
          <Pagination
            totalProduct={paginatedProducts.totalProducts}
            productPerPage={productsPerPage}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        )}
      </div>
    </section>
  );
};