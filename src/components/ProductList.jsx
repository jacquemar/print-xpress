import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProductList } from "../redux/slices/productSlice";
import {
  addToCart,
  increaseQuantity,
  updateTotalQuantity,
} from "../redux/slices/cartSlice";
import Pagination from "../components/Pagination";
import { Link } from "react-router-dom";

function ProductList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [productPerPage] = useState(8);
  const lastProductIndex = currentPage * productPerPage;
  const firstProductIndex = lastProductIndex - productPerPage;

  const dispatch = useDispatch();
  const productList = useSelector((state) => state.product.productList);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalQuantity = useSelector((state) => state.cart.cartItems.length);

  useEffect(() => {
    fetch("http://localhost:2000/list")
      .then((res) => res.json())
      .then((data) => {
        dispatch(updateProductList(data));
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [dispatch]);

  const currentProducts = productList.slice(
    firstProductIndex,
    lastProductIndex
  );

  const handleAddToCart = (product) => {
    const productIndex = cartItems.findIndex((item) => item.id === product._id);
    if (productIndex !== -1) {
      dispatch(increaseQuantity({ productId: product._id }));
    } else {
      dispatch(addToCart({ ...product, id: product._id, quantity: 1 }));
      dispatch(updateTotalQuantity(totalQuantity + 1));
    }
  };

  return (
    <div>
      <section class="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
        <div class="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
            Track the delivery of order #957684673
          </h2>

          <div class="mt-6 sm:mt-8 lg:flex lg:gap-8">
            <div class="w-full divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 dark:divide-gray-700 dark:border-gray-700 lg:max-w-xl xl:max-w-2xl">
              <div class="space-y-4 p-6">
                <div class="flex items-center gap-6">
                  <a href="#" class="h-14 w-14 shrink-0">
                    <img
                      class="h-full w-full dark:hidden"
                      src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg"
                      alt="imac image"
                    />
                    <img
                      class="hidden h-full w-full dark:block"
                      src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg"
                      alt="imac image"
                    />
                  </a>

                  <a
                    href="#"
                    class="min-w-0 flex-1 font-medium text-gray-900 hover:underline dark:text-white"
                  >
                    {" "}
                    PC system All in One APPLE iMac (2023) mqrq3ro/a, Apple M3,
                    24" Retina 4.5K, 8GB, SSD 256GB, 10-core GPU, macOS Sonoma,
                    Blue, Keyboard layout INT{" "}
                  </a>
                </div>

                <div class="flex items-center justify-between gap-4">
                  <p class="text-sm font-normal text-gray-500 dark:text-gray-400">
                    <span class="font-medium text-gray-900 dark:text-white">
                      Product ID:
                    </span>{" "}
                    BJ8364850
                  </p>

                  <div class="flex items-center justify-end gap-4">
                    <p class="text-base font-normal text-gray-900 dark:text-white">
                      x1
                    </p>

                    <p class="text-xl font-bold leading-tight text-gray-900 dark:text-white">
                      $1,499
                    </p>
                  </div>
                </div>
              </div>

              <div class="space-y-4 p-6">
                <div class="flex items-center gap-6">
                  <a href="#" class="h-14 w-14 shrink-0">
                    <img
                      class="h-full w-full dark:hidden"
                      src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/apple-watch-light.svg"
                      alt="phone image"
                    />
                    <img
                      class="hidden h-full w-full dark:block"
                      src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/apple-watch-dark.svg"
                      alt="phone image"
                    />
                  </a>

                  <a
                    href="#"
                    class="min-w-0 flex-1 font-medium text-gray-900 hover:underline dark:text-white"
                  >
                    {" "}
                    Restored Apple Watch Series 8 (GPS) 41mm Midnight Aluminum
                    Case with Midnight Sport Band{" "}
                  </a>
                </div>

                <div class="flex items-center justify-between gap-4">
                  <p class="text-sm font-normal text-gray-500 dark:text-gray-400">
                    <span class="font-medium text-gray-900 dark:text-white">
                      Product ID:
                    </span>{" "}
                    BJ8364850
                  </p>

                  <div class="flex items-center justify-end gap-4">
                    <p class="text-base font-normal text-gray-900 dark:text-white">
                      x2
                    </p>

                    <p class="text-xl font-bold leading-tight text-gray-900 dark:text-white">
                      $598
                    </p>
                  </div>
                </div>
              </div>

              <div class="space-y-4 p-6">
                <div class="flex items-center gap-6">
                  <a href="#" class="h-14 w-14 shrink-0">
                    <img
                      class="h-full w-full dark:hidden"
                      src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/ps5-light.svg"
                      alt="console image"
                    />
                    <img
                      class="hidden h-full w-full dark:block"
                      src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/ps5-dark.svg"
                      alt="console image"
                    />
                  </a>

                  <a
                    href="#"
                    class="min-w-0 flex-1 font-medium text-gray-900 hover:underline dark:text-white"
                  >
                    {" "}
                    Sony Playstation 5 Digital Edition Console with Extra Blue
                    Controller, White PULSE 3D Headset and Surge Dual Controller{" "}
                  </a>
                </div>

                <div class="flex items-center justify-between gap-4">
                  <p class="text-sm font-normal text-gray-500 dark:text-gray-400">
                    <span class="font-medium text-gray-900 dark:text-white">
                      Product ID:
                    </span>{" "}
                    BJ8364850
                  </p>

                  <div class="flex items-center justify-end gap-4">
                    <p class="text-base font-normal text-gray-900 dark:text-white">
                      x1
                    </p>

                    <p class="text-xl font-bold leading-tight text-gray-900 dark:text-white">
                      $799
                    </p>
                  </div>
                </div>
              </div>

              <div class="space-y-4 p-6">
                <div class="flex items-center gap-6">
                  <a href="#" class="h-14 w-14 shrink-0">
                    <img
                      class="h-full w-full dark:hidden"
                      src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/xbox-light.svg"
                      alt="xbox image"
                    />
                    <img
                      class="hidden h-full w-full dark:block"
                      src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/xbox-dark.svg"
                      alt="xbox image"
                    />
                  </a>

                  <a
                    href="#"
                    class="min-w-0 flex-1 font-medium text-gray-900 hover:underline dark:text-white"
                  >
                    {" "}
                    Xbox Series X Diablo IV Bundle + 2 Xbox Wireless Controller
                    Carbon Black + Controller Charger{" "}
                  </a>
                </div>

                <div class="flex items-center justify-between gap-4">
                  <p class="text-sm font-normal text-gray-500 dark:text-gray-400">
                    <span class="font-medium text-gray-900 dark:text-white">
                      Product ID:
                    </span>{" "}
                    BJ8364850
                  </p>

                  <div class="flex items-center justify-end gap-4">
                    <p class="text-base font-normal text-gray-900 dark:text-white">
                      x1
                    </p>

                    <p class="text-xl font-bold leading-tight text-gray-900 dark:text-white">
                      $699
                    </p>
                  </div>
                </div>
              </div>

              <div class="space-y-4 p-6">
                <div class="flex items-center gap-6">
                  <a href="#" class="h-14 w-14 shrink-0">
                    <img
                      class="h-full w-full dark:hidden"
                      src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/iphone-light.svg"
                      alt="phone image"
                    />
                    <img
                      class="hidden h-full w-full dark:block"
                      src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/iphone-dark.svg"
                      alt="phone image"
                    />
                  </a>

                  <a
                    href="#"
                    class="min-w-0 flex-1 font-medium text-gray-900 hover:underline dark:text-white"
                  >
                    {" "}
                    APPLE iPhone 15 5G phone, 256GB, Gold{" "}
                  </a>
                </div>

                <div class="flex items-center justify-between gap-4">
                  <p class="text-sm font-normal text-gray-500 dark:text-gray-400">
                    <span class="font-medium text-gray-900 dark:text-white">
                      Product ID:
                    </span>{" "}
                    BJ8364850
                  </p>

                  <div class="flex items-center justify-end gap-4">
                    <p class="text-base font-normal text-gray-900 dark:text-white">
                      x3
                    </p>

                    <p class="text-xl font-bold leading-tight text-gray-900 dark:text-white">
                      $2,997
                    </p>
                  </div>
                </div>
              </div>

              <div class="space-y-4 bg-gray-50 p-6 dark:bg-gray-800">
                <div class="space-y-2">
                  <dl class="flex items-center justify-between gap-4">
                    <dt class="font-normal text-gray-500 dark:text-gray-400">
                      Original price
                    </dt>
                    <dd class="font-medium text-gray-900 dark:text-white">
                      $6,592.00
                    </dd>
                  </dl>

                  <dl class="flex items-center justify-between gap-4">
                    <dt class="font-normal text-gray-500 dark:text-gray-400">
                      Savings
                    </dt>
                    <dd class="text-base font-medium text-green-500">
                      -$299.00
                    </dd>
                  </dl>

                  <dl class="flex items-center justify-between gap-4">
                    <dt class="font-normal text-gray-500 dark:text-gray-400">
                      Store Pickup
                    </dt>
                    <dd class="font-medium text-gray-900 dark:text-white">
                      $99
                    </dd>
                  </dl>

                  <dl class="flex items-center justify-between gap-4">
                    <dt class="font-normal text-gray-500 dark:text-gray-400">
                      Tax
                    </dt>
                    <dd class="font-medium text-gray-900 dark:text-white">
                      $799
                    </dd>
                  </dl>
                </div>

                <dl class="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                  <dt class="text-lg font-bold text-gray-900 dark:text-white">
                    Total
                  </dt>
                  <dd class="text-lg font-bold text-gray-900 dark:text-white">
                    $7,191.00
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductList;
