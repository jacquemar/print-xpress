import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  removeFromCart,
  updateTotalPrice,
  decreaseQuantity,
  increaseQuantity,
} from "../../redux/slices/cartSlice";
import {
  updatePersoItemQuantity,
  removePersoItem,
} from "../../redux/slices/cartPersoSlice";

const Ticket = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const cartItemPerso = useSelector((state) => state.cartPerso.cartItemPerso);
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const persoTotalPrice = useSelector((state) =>
    state.cartPerso.cartItemPerso.reduce(
      (total, item) => total + item.persoPrice * item.quantity,
      0
    )
  );
  const dispatch = useDispatch();

  const total = totalPrice + persoTotalPrice;
  console.log(cartItemPerso);
  useEffect(() => {
    dispatch(updateTotalPrice());
  }, [cartItems, dispatch]);

  const handlePersoItemQuantityChange = (idPerso, newQuantity) => {
    dispatch(updatePersoItemQuantity({ idPerso, quantity: newQuantity }));
  };

  const handleRemovePersoItem = (idPerso) => {
    dispatch(removePersoItem(idPerso));
  };

  const handleAddToCart = (product) => {
    const productIndex = cartItems.findIndex((item) => item.id === product.id);

    if (productIndex !== -1) {
      // Si le produit est déjà présent dans le panier, augmentation de la quantité de 1
      dispatch(increaseQuantity({ productId: product.id }));
    } else {
      // Sinon, ajout du produit au panier avec une quantité de 1
      dispatch(addToCart(product));
    }
  };

  const handleRemoveFromCart = (itemId) => {
    dispatch(removeFromCart(itemId));
    const removedItem = cartItems.find((item) => item.id === itemId);
    dispatch(removeFromCart(itemId || item._id));
    // Mettre à jour le prix total en utilisant une action Redux
    dispatch(updateTotalPrice());
  };

  const handleDecreaseQuantity = (itemId) => {
    dispatch(decreaseQuantity({ productId: itemId }));
  };

  return (
    <div>
      <section className="mb-10 h-screen bg-gray-100  py-12 sm:py-16 lg:py-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              Votre Ticket{" "}
            </h1>
          </div>
          <div className="flex items-center justify-center">
            <p className="text-sm font-light text-cyan-600">
              {cartItemPerso.idPerso}
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-md md:mt-12">
            <div className="rounded-3xl bg-white shadow-lg">
              <div className="px-4 py-6 sm:px-8 sm:py-10">
                <div className="flow-root">
                  <ul className="-my-8">
                    {cartItems.map((item, index) => (
                      <li
                        key={`${item.id || item._id}-${index}`}
                        className="flex flex-col space-y-3 py-6 text-left sm:flex-row sm:space-x-5 sm:space-y-0"
                      >
                        <div className="relative shrink-0">
                          <span className="absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full border bg-red-600 text-sm font-medium text-white shadow sm:-right-2 sm:-top-2">
                            {item.quantity}
                          </span>
                          <img
                            className="h-24 w-24 max-w-full rounded-lg object-cover"
                            src={item.cover}
                            alt={item.name}
                          />
                        </div>

                        <div className="relative flex flex-1 flex-col justify-between">
                          <div className="sm:col-gap-5 sm:grid sm:grid-cols-2">
                            <div className="pr-8 sm:pr-5">
                              <p className="text-base font-semibold text-gray-900">
                                {item.name}
                              </p>
                              <button
                                className="mx-1 mt-2 inline-flex items-center rounded-full border border-gray-300 bg-white p-1 text-sm font-medium text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                                type="button"
                                onClick={() =>
                                  handleDecreaseQuantity(item.id || item._id)
                                }
                              >
                                <span className="sr-only">
                                  Quantity button{" "}
                                </span>
                                <svg
                                  className="h-4 w-4"
                                  aria-hidden="true"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                    clipRule="evenodd"
                                  ></path>
                                </svg>
                              </button>
                              <button
                                className="mx-1 mt-2 inline-flex items-center rounded-full border border-gray-300 bg-white p-1 text-sm font-medium text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                                type="button"
                                onClick={() => handleAddToCart(item)}
                              >
                                <span className="sr-only">Quantity button</span>
                                <svg
                                  className="h-4 w-4"
                                  aria-hidden="true"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                    clipRule="evenodd"
                                  ></path>
                                </svg>
                              </button>
                            </div>

                            <div className="mt-4 flex items-end justify-between sm:mt-0 sm:items-start sm:justify-end">
                              <p className="w-20 shrink-0 text-base font-semibold text-gray-900 sm:order-2 sm:ml-8 sm:text-right">
                                {item.price}XOF
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                    {cartItemPerso.map((item) => (
                      <li
                        key={item.idPerso}
                        className="flex flex-col space-y-3 py-6 text-left sm:flex-row sm:space-x-5 sm:space-y-0"
                      >
                        <div className="relative shrink-0">
                          <span className="absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full border bg-red-600 text-sm font-medium text-white shadow sm:-right-2 sm:-top-2">
                            {item.quantity}
                          </span>
                          <img
                            className="h-24 w-24 max-w-full rounded-lg object-cover"
                            src={item.cover}
                            alt={item.type}
                          />
                        </div>
                        <div className="relative flex flex-1 flex-col justify-between">
                          <div className="sm:col-gap-5 sm:grid sm:grid-cols-2">
                            <div className="pr-8 sm:pr-5">
                              <p className="text-base font-semibold text-gray-900">
                                {item.type}
                              </p>
                              <p className="mx-0 mb-0 mt-1 text-sm text-gray-400">
                                {item.format}
                              </p>
                            </div>
                            <div className="mt-4 flex items-end justify-between sm:mt-0 sm:items-start sm:justify-end">
                              <p className="w-20 shrink-0 text-base font-semibold text-gray-900 sm:order-2 sm:ml-8 sm:text-right">
                                {item.persoPrice * item.quantity} XOF
                              </p>
                            </div>
                          </div>
                          <div className="absolute right-0 top-0 flex sm:bottom-0 sm:top-auto">
                            <button
                              type="button"
                              className="flex rounded p-2 text-center text-gray-500 transition-all duration-200 ease-in-out hover:text-gray-900 focus:shadow"
                              onClick={() =>
                                handlePersoItemQuantityChange(
                                  item.idPerso,
                                  item.quantity - 1
                                )
                              }
                            >
                              <svg
                                className="h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </button>
                            <button
                              type="button"
                              className="flex rounded p-2 text-center text-gray-500 transition-all duration-200 ease-in-out hover:text-gray-900 focus:shadow"
                              onClick={() =>
                                handlePersoItemQuantityChange(
                                  item.idPerso,
                                  item.quantity + 1
                                )
                              }
                            >
                              <svg
                                className="h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </button>
                            <button
                              type="button"
                              className="flex rounded p-2 text-center text-gray-500 transition-all duration-200 ease-in-out hover:text-gray-900 focus:shadow"
                              onClick={() =>
                                handleRemovePersoItem(item.idPerso)
                              }
                            >
                              <svg
                                className="h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <hr className="mx-0 mb-0 mt-6 h-0 border-b-0 border-l-0 border-r-0 border-t border-solid border-gray-300" />

                <div className="mt-6 flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">Total</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {" "}
                    {total}{" "}
                    <span className="text-xs font-normal text-gray-400">
                      FCFA
                    </span>
                  </p>
                </div>

                <div className="mt-6 text-center">
                  <Link to="/checkout">
                    <button
                      type="button"
                      className="group inline-flex w-full items-center justify-center rounded-md bg-pxcolor px-6 py-4 text-lg font-semibold text-white transition-all duration-200 ease-in-out hover:bg-gray-800 focus:shadow"
                    >
                      Créer le ticket
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="ml-4 h-6 w-6 transition-all group-hover:ml-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Ticket;
