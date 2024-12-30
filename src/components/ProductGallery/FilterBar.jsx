import React from 'react';

export const FilterBar = ({ genres, activeGenre, onGenreClick }) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 px-2 py-3 sm:gap-3 sm:px-4">
      {genres.map((genre, index) => (
        <button
          key={index}
          onClick={() => onGenreClick(genre)}
          className={`
            rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200 ease-in-out
            sm:px-4 sm:py-2 sm:text-base
            ${
              activeGenre === genre
                ? "bg-pxcolor text-white shadow-md hover:bg-blue-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          `}
        >
          {genre === 'all' ? 'Tous' : genre}
        </button>
      ))}
    </div>
  );
};