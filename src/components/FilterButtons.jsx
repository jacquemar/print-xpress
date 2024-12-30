import React, { useState } from 'react';
import { Button } from './ui/button';

export const FilterButtons = ({ categories, genders, onFilterChange }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const handleCategorySelect = (category) => {
    const newCategory = selectedCategory === category ? null : category;
    setSelectedCategory(newCategory);
    onFilterChange({
      category: newCategory,
      gender: selectedGender,
      minPrice: priceRange.min ? Number(priceRange.min) : undefined,
      maxPrice: priceRange.max ? Number(priceRange.max) : undefined
    });
  };

  const handleGenderSelect = (gender) => {
    const newGender = selectedGender === gender ? null : gender;
    setSelectedGender(newGender);
    onFilterChange({
      category: selectedCategory,
      gender: newGender,
      minPrice: priceRange.min ? Number(priceRange.min) : undefined,
      maxPrice: priceRange.max ? Number(priceRange.max) : undefined
    });
  };

  const handlePriceChange = (min, max) => {
    setPriceRange({ min, max });
    onFilterChange({
      category: selectedCategory,
      gender: selectedGender,
      minPrice: min ? Number(min) : undefined,
      maxPrice: max ? Number(max) : undefined
    });
  };

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedGender(null);
    setPriceRange({ min: '', max: '' });
    onFilterChange({});
  };

  return (
    <div className="space-y-6 rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-800">
      {/* Catégories */}
      <div>
        <h3 className="mb-3 text-lg font-semibold">Catégories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`px-4 py-2 rounded-md text-sm font-medium border transition 
                ${
                  selectedCategory === category
                    ? 'bg-pxcolor text-white border-transparent'
                    : 'bg-gray-200 text-gray-800 border-gray-300 hover:bg-gray-300'
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Genres */}
      <div>
        <h3 className="mb-3 text-lg font-semibold">Genres</h3>
        <div className="flex flex-wrap gap-2">
          {genders.map(gender => (
            <button
              key={gender}
              onClick={() => handleGenderSelect(gender)}
              className={`px-4 py-2 rounded-md text-sm font-medium border transition 
                ${
                  selectedGender === gender
                    ? 'bg-pxcolor text-white border-transparent'
                    : 'bg-gray-200 text-gray-800 border-gray-300 hover:bg-gray-300'
                }`}
            >
              {gender}
            </button>
          ))}
        </div>
      </div>

      {/* Prix */}
      <div>
        <h3 className="mb-3 text-lg font-semibold">Prix</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => handlePriceChange(e.target.value, priceRange.max)}
            className="w-full rounded-md border px-3 py-2"
            min="0"
          />
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => handlePriceChange(priceRange.min, e.target.value)}
            className="w-full rounded-md border px-3 py-2"
            min="0"
          />
        </div>
      </div>

      {/* Bouton de réinitialisation */}
      <button
        onClick={resetFilters}
        className="w-full px-4 py-2 rounded-md text-sm font-medium border bg-gray-200 text-gray-800 hover:bg-gray-300"
      >
        Réinitialiser les filtres
      </button>
    </div>
  );
};
