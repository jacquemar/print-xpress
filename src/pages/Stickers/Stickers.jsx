import React, { useState, useEffect } from "react";
import { Header, Footer, Categorie } from "../../components";
import coverstick from "../../assets/stcover.png";
import { Link } from "react-router-dom";
import Pagination from "../../components/Pagination";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  updateTotalQuantity,
  increaseQuantity,
} from "../../redux/slices/cartSlice";
import API_URL from "../../config";

function Stickers() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [productList, setProductList] = useState([]);
  const totalQuantity = useSelector((state) => state.cart.cartItems.length);

  const [currentPage, setCurrentPage] = useState(1);
  const [productPerPage] = useState(8);
  const lastProductIndex = currentPage * productPerPage;
  const firstProductIndex = lastProductIndex - productPerPage;
  const [uniqueGenres, setUniqueGenres] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/list`)
      .then((res) => res.json())
      .then((data) => {
        setProductList(data);
        // Extraire les genres uniques des produits de type "Poster"
        const stickerProducts = data.filter(
          (product) =>
            product.category.toLowerCase() === "sticker" ||
            product.category.toLowerCase() === "étiquette"
        );
        const genres = [
          ...new Set(stickerProducts.map((product) => product.gender)),
        ];
        setUniqueGenres(genres);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const handleAddToCart = (product) => {
    const productIndex = cartItems.findIndex((item) => item.id === product.id);
    if (productIndex !== -1) {
      dispatch(increaseQuantity({ productId: product.id }));
    } else {
      dispatch(addToCart({ ...product, quantity: 1 }));
      dispatch(updateTotalQuantity(totalQuantity + 1));
    }
  };

  const filterProduct = productList.filter(
    (product) =>
      product.category.toLowerCase() === "sticker" ||
      product.category.toLowerCase() === "étiquette"
  );

  const currentProducts = filterProduct.slice(
    firstProductIndex,
    lastProductIndex
  );

  return (
    <div>
      <Header />
      <h1 className="my-6 text-center text-2xl font-black">
        STICKERS / ÉTIQUETTES
      </h1>
      <div className="mx-12 mt-4 h-40 rounded-lg md:mx-60">
        <img
          src={coverstick}
          alt="stickerimage"
          className="h-40 w-full rounded-lg object-cover"
        />
      </div>

      {/* Ajout de la liste glissante des genres */}
      <div className="mx-12 my-4 overflow-x-auto whitespace-nowrap md:mx-60">
        {uniqueGenres.map((genre, index) => (
          <button
            key={index}
            className="mx-2 inline-block rounded-full bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
          >
            {genre}
          </button>
        ))}
      </div>

      <section className="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-12">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <div className="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
            {/* Personnalisation card */}
            <div className="relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="flex h-full flex-col items-center justify-center">
                <p className="mb-4 text-center font-thin">
                  Personnaliser vos Stickers / Étiquettes
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

            {currentProducts.map((product) => (
              <div
                key={product._id}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="h-56 w-full">
                  <Link to={`/product/${product._id}`}>
                    <img
                      className="mx-auto h-full object-cover dark:hidden"
                      src={product.cover}
                      alt={product.name}
                    />
                    <img
                      className="mx-auto hidden h-full object-cover dark:block"
                      src={product.cover}
                      alt={product.name}
                    />
                  </Link>
                </div>

                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300 rounded px-2.5 py-0.5 text-xs font-medium">
                      {product.category}
                    </span>
                    <div class="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        data-tooltip-target="tooltip-quick-look"
                        class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        <span class="sr-only"> Quick look </span>
                        <svg
                          class="h-5 w-5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            stroke-width="2"
                            d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                          />
                          <path
                            stroke="currentColor"
                            stroke-width="2"
                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                        </svg>
                      </button>
                      <div
                        id="tooltip-quick-look"
                        role="tooltip"
                        class="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
                        data-popper-placement="top"
                      >
                        Quick look
                        <div class="tooltip-arrow" data-popper-arrow=""></div>
                      </div>

                      <button
                        type="button"
                        data-tooltip-target="tooltip-add-to-favorites"
                        class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        <span class="sr-only"> Add to Favorites </span>
                        <svg
                          class="h-5 w-5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 6C6.5 1 1 8 5.8 13l6.2 7 6.2-7C23 8 17.5 1 12 6Z"
                          />
                        </svg>
                      </button>
                      <div
                        id="tooltip-add-to-favorites"
                        role="tooltip"
                        class="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
                        data-popper-placement="top"
                      >
                        Add to favorites
                        <div class="tooltip-arrow" data-popper-arrow=""></div>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/product/${product._id}`}
                    className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white"
                  >
                    {product.name}
                  </Link>
                  <ul className="mt-2 flex items-center gap-4">
                    <li className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                        />
                      </svg>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Livraison rapide
                      </p>
                    </li>

                    <li className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeWidth="2"
                          d="M8 7V6c0-.6.4-1 1-1h11c.6 0 1 .4 1 1v7c0 .6-.4 1-1 1h-1M3 18v-7c0-.6.4-1 1-1h11c.6 0 1 .4 1 1v7c0 .6-.4 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                        />
                      </svg>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {product.gender}
                      </p>
                    </li>
                  </ul>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-2xl font-extrabold leading-tight text-gray-900 dark:text-white">
                      {product.price} F CFA
                    </p>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 inline-flex items-center rounded-lg bg-pxcolor px-5 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-4"
                    >
                      <svg
                        className="-ms-1 me-1 h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                      </svg>
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filterProduct.length > 0 && (
            <Pagination
              totalProduct={filterProduct.length}
              productPerPage={productPerPage}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Stickers;
