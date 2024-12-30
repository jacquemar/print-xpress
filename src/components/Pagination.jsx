import React from "react";

const Pagination = ({
  totalProduct,
  productPerPage,
  setCurrentPage,
  currentPage,
}) => {
  const totalPages = Math.ceil(totalProduct / productPerPage);
  
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="flex justify-center items-center mb-20 my-6">
      <div className="flex items-center space-x-2">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`
            p-2 rounded-full transition-all duration-300
            ${currentPage === 1 
              ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
              : "bg-gray-100 hover:bg-gray-200 active:scale-95"}
            dark:bg-gray-700 dark:hover:bg-gray-600
          `}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>

        <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Page <span className="font-bold">{currentPage}</span> sur {totalPages}
          </span>
        </div>

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className={`
            p-2 rounded-full transition-all duration-300
            ${currentPage === totalPages 
              ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
              : "bg-gray-100 hover:bg-gray-200 active:scale-95"}
            dark:bg-gray-700 dark:hover:bg-gray-600
          `}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;