import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import stckCover from "../../../src/assets/stckDetail3.jpg";
import {
  resetType,
  addToCartPerso,
  updateMaterial,
  updatePersoPrice,
  updateType,
  updateId,
  updateCover,
  saveFilePaths,
  updateFinition,
  updateFormat,
  updateQuantity,
} from "../../redux/slices/cartPersoSlice";
import { ToastContainer, toast } from "react-toastify";
import FormatSelection from "./FormatSelection";

function StickerDetailsCheckout() {
  const cartPerso = useSelector((state) => state.cartPerso);
  const format = useSelector((state) => state.cartPerso.selectedFormat);
  const dimensions = useSelector((state) => state.cartPerso.dimensions);
  const quantity = useSelector((state) => state.cartPerso.quantity);
  const price = useSelector((state) => state.cartPerso.persoPrice);
  const basePrice = useSelector((state) => state.cartPerso.persoPrice);
  const filePaths = useSelector((state) => state.cartPerso.filePaths);
  const materiau = useSelector((state) => state.cartPerso.materiau);
  const finition = useSelector((state) => state.cartPerso.finition);
  const type = useSelector((state) => state.cartPerso.type);
  const idPerso = useSelector((state) => state.cartPerso.idPerso);
  const persoTotalPrice = useSelector((state) => state.cartPerso.persoPrice);
  const cover = useSelector((state) => state.cartPerso.cover);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("papier");
  const [showFormat, setShowFormat] = useState(false);
  const [diametreValue, setDiametreValue] = useState("");
  const [largeurValue, setLargeurValue] = useState("");
  const [hauteurValue, setHauteurValue] = useState("");
  const [fichiers, setFichiers] = useState([]);
  const [selectedFilesNames, setSelectedFilesNames] = useState([]);
  const [quantityError, setQuantityError] = useState(false);
  const [coteValue, setCoteValue] = useState("");
  const [finalPrice, setFinalPrice] = useState(0);

  const handleQuantityChange = (event) => {
    const selectedQuantity = parseInt(event.target.value, 10);
    if (!Number.isNaN(selectedQuantity) && selectedQuantity > 0) {
      dispatch(updateQuantity(selectedQuantity));
      setQuantityError(false);
    } else {
      console.error("La quantité sélectionnée n'est pas valide.");
      setQuantityError(true);
    }
  };

  const handleTypeChange = (event) => {
    const selectedTypeValue = event.target.value;
    dispatch(updateType(selectedTypeValue));
    dispatch(updateCover(stckCover));
    console.log("Selected Type:", type);
  };

  const id = "StkPerso1";

  const handleMethodChange = (event) => {
    const selectedMethodValue = event.target.value;
    setSelectedMethod(selectedMethodValue);
    setShowFormat(selectedMethodValue === "Etiquette Autocollante Perso");

    if (selectedMethodValue === "Etiquette Autocollante Perso") {
      dispatch(updateQuantity(100)); // Fixer la quantité à 100 pour les étiquettes
    } else {
      dispatch(updateQuantity("")); // Réinitialiser la quantité pour les autres options
    }

    if (selectedMethodValue !== "Etiquette Autocollante Perso") {
      dispatch(resetType());
    }
  };

  const calculateFinalPrice = useCallback(() => {
    let totalPrice = 0;

    // Prix de base
    if (selectedMethod === "Sticker Décoratif Perso") {
      totalPrice = 300 * (quantity || 1);
    } else if (selectedMethod === "Etiquette Autocollante Perso") {
      if (format === "rond") {
        // Prix fixe de 100 XOF par étiquette ronde
        totalPrice = 100 * 100; // 100 XOF * 100 étiquettes
      } else {
        // Calcul pour les autres formats d'étiquettes
        totalPrice = (basePrice || 0) * (quantity || 1);
      }
    }

    // Ajout du coût du matériau (une seule fois, pas multiplié par la quantité)
    if (materiau === "Vinyle Blanc") {
      totalPrice += 1000;
    } else if (materiau === "Vinyle Transparent") {
      totalPrice += 1500;
    }

    // Ajout du coût de la finition (uniquement pour le papier)
    if (materiau === "Papier" && finition !== "normal") {
      let finitionCost = 0;
      if (quantity === 10) finitionCost = 1000;
      else if (quantity === 20) finitionCost = 1500;
      else if (quantity === 50) finitionCost = 2000;
      else if (quantity === 100) finitionCost = 3000;

      // Ajouter le coût de la finition une seule fois
      totalPrice += finitionCost;
    }

    // Arrondir le prix total de 5 en 5 francs
    return Math.ceil(totalPrice / 5) * 5;
  }, [selectedMethod, basePrice, quantity, materiau, finition]);

  const validateForm = useCallback(() => {
    const isTypeSelected = type !== "";
    const isFinitionSelected = finition !== "";
    const isSelectedMaterial = materiau !== "";
    const isQuantitySelected = quantity !== "" && quantity > 0;
    const isFichierSelected = fichiers.length > 0;
    const isFormatValid =
      selectedMethod !== "Etiquette Autocollante Perso" || format !== "";

    const isValid =
      isTypeSelected &&
      isFinitionSelected &&
      isSelectedMaterial &&
      isQuantitySelected &&
      isFichierSelected &&
      isFormatValid;

    setIsFormValid(isValid);
  }, [type, finition, materiau, quantity, fichiers, selectedMethod, format]);

  useEffect(() => {
    const newFinalPrice = calculateFinalPrice();
    setFinalPrice(newFinalPrice);
    validateForm();
  }, [
    calculateFinalPrice,
    validateForm,
    type,
    finition,
    materiau,
    quantity,
    fichiers,
    selectedMethod,
    format,
  ]);

  const handleMaterialChange = (event) => {
    const selectedMaterialValue = event.target.value;
    dispatch(updateMaterial(selectedMaterialValue));
    // Réinitialiser la finition à "normal" pour tous les matériaux
    dispatch(updateFinition("normal"));
  };

  const handleFormatChange = (event) => {
    const selectedFormatValue = event.target.value;
    dispatch(updateFormat(selectedFormatValue));
    setDiametreValue("");
    setLargeurValue("");
    setHauteurValue("");
    setCoteValue("");
  };

  const handleFinitionChange = (event) => {
    dispatch(updateFinition(event.target.value));
  };

  console.log("Base Price:", basePrice);
  console.log("Final Price:", finalPrice);
  console.log(materiau, finition);

  const handleDeleteFile = (index) => {
    const updatedFichiers = [...fichiers];
    const removedFileName = selectedFilesNames[index];

    updatedFichiers.splice(index, 1);

    setFichiers(updatedFichiers);
    setSelectedFilesNames(updatedFichiers.map((file) => file.name));

    toast.success(`Le fichier "${removedFileName}" a été supprimé.`);
  };

  const handleChangementFichier = async (event) => {
    const nouveauxFichiers = [...event.target.files];

    // Vérifier si la quantité est sélectionnée
    if (quantity === "" || quantity === 0) {
      toast.error("Veuillez d'abord sélectionner une quantité valide.");
      return;
    }

    // Vérifier si le nombre de fichiers sélectionnés est suffisant
    if (nouveauxFichiers.length < quantity) {
      toast.error(
        `Veuillez sélectionner au moins ${quantity} fichier(s). Vous en avez sélectionné ${nouveauxFichiers.length}.`
      );
      return;
    }

    // Si le nombre de fichiers est correct ou supérieur, on les accepte tous
    setFichiers(nouveauxFichiers);

    const fileNames = Array.from(nouveauxFichiers, (file) => file.name);
    setSelectedFilesNames(fileNames);

    if (nouveauxFichiers.length > quantity) {
      toast.warning(
        `Vous avez sélectionné ${nouveauxFichiers.length} fichiers. Seuls les ${quantity} premiers seront utilisés pour cette commande.`
      );
    } else {
      toast.success(
        `Vous avez sélectionné ${nouveauxFichiers.length} fichier(s).`
      );
    }
  };

  const handleAddToCart = async () => {
    if (!isFormValid) {
      toast.error("Veuillez remplir tous les champs requis.");
      return;
    }

    try {
      const formData = new FormData();
      fichiers.forEach((file) => {
        formData.append("files", file);
      });

      const response = await axios.post(
        "http://localhost:2000/upload-temp",
        formData
      );

      if (response.status === 200) {
        const tempFilePaths = response.data.tempFilePaths;
        const uniqueId = `${type}-${format}-${Date.now()}`;

        const newItem = {
          idPerso: uniqueId,
          filePaths: tempFilePaths,
          cover: cover,
          format: format,
          type: type,
          finition: finition,
          materiau: materiau,
          dimensions: dimensions,
          quantity: quantity,
          persoPrice: finalPrice,
        };

        dispatch(addToCartPerso(newItem));

        toast.success("Commande personnalisée ajoutée au panier avec succès !");

        // Naviguation vers la page ticket après un certain délai
        setTimeout(() => {
          navigate("/ticket");
        }, 3000);
      } else {
        toast.error("Échec de l'enregistrement temporaire des fichiers");
      }
    } catch (error) {
      // Affichage du toast d'erreur
      toast.error("Échec de l'enregistrement de la commande!");
      console.error(error);
    }
  };

  return (
    <div>
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <nav className="flex">
            <ol role="list" className="flex items-center">
              <li className="text-left">
                <div className="-m-1">
                  <a
                    href="#"
                    className="rounded-md p-1 text-sm font-medium text-gray-600 hover:text-gray-800 focus:text-gray-900 focus:shadow"
                  >
                    Accueil
                  </a>
                </div>
              </li>

              <li className="text-left">
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <div className="-m-1">
                    <a
                      href="#"
                      className="rounded-md p-1 text-sm font-medium text-gray-600 hover:text-gray-800 focus:text-gray-900 focus:shadow"
                    >
                      Stickers
                    </a>
                  </div>
                </div>
              </li>

              <li className="text-left">
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <div className="-m-1">
                    <a
                      href="#"
                      className="rounded-md p-1 text-sm font-medium text-gray-600 hover:text-gray-800 focus:text-gray-900 focus:shadow"
                      aria-current="page"
                    >
                      Personnalisation
                    </a>
                  </div>
                </div>
              </li>
            </ol>
          </nav>
          <ToastContainer />
          <div className="lg:col-gap-12 xl:col-gap-16 mt-8 grid grid-cols-1 gap-12 lg:mt-12 lg:grid-cols-5 lg:gap-16">
            <div className="lg:col-span-3 lg:row-end-1">
              <div className="lg:flex lg:items-start">
                <div className="lg:order-2 lg:ml-5">
                  <div className="max-w-xl overflow-hidden rounded-lg">
                    <img
                      className="h-full w-full max-w-full object-cover"
                      src="../../../src/assets/stckDetail3.jpg"
                      alt=""
                    />
                  </div>
                </div>

                <div className="mt-2 w-full lg:order-1 lg:w-32 lg:flex-shrink-0">
                  <div className="flex flex-row items-start lg:flex-col">
                    <button
                      type="button"
                      className="flex-0 aspect-square mb-3 h-20 overflow-hidden rounded-lg border-2 border-gray-900 text-center"
                    >
                      <img
                        className="h-full w-full object-cover"
                        src="../../../src/assets/stckDetail2.jpg"
                        alt=""
                      />
                    </button>
                    <button
                      type="button"
                      className="flex-0 aspect-square mb-3 h-20 overflow-hidden rounded-lg border-2 border-transparent text-center"
                    >
                      <img
                        className="h-full w-full object-cover"
                        src="../../../src/assets/stckDetail1.jpg"
                        alt=""
                      />
                    </button>
                    <button
                      type="button"
                      className="flex-0 aspect-square mb-3 h-20 overflow-hidden rounded-lg border-2 border-transparent text-center"
                    >
                      <img
                        className="h-full w-full object-cover"
                        src="../../../src/assets/stckDetail4.jpg"
                        alt=""
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 lg:row-span-2 lg:row-end-2">
              <h1 className="sm: text-2xl font-bold text-gray-900 sm:text-3xl">
                Personnalisation Sticker/Étiquette
              </h1>

              <div className="mt-5 flex items-center">
                <div className="flex items-center">
                  <svg
                    className="block h-4 w-4 align-middle text-yellow-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      className=""
                    ></path>
                  </svg>
                  <svg
                    className="block h-4 w-4 align-middle text-yellow-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      className=""
                    ></path>
                  </svg>
                  <svg
                    className="block h-4 w-4 align-middle text-yellow-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      className=""
                    ></path>
                  </svg>
                  <svg
                    className="block h-4 w-4 align-middle text-yellow-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      className=""
                    ></path>
                  </svg>
                  <svg
                    className="block h-4 w-4 align-middle text-yellow-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      className=""
                    ></path>
                  </svg>
                </div>
                <p className="ml-2 text-sm font-medium text-gray-500">
                  1,209 Commandes
                </p>
              </div>

              <form className="">
                <div className="mt-8 flex flex-row gap-2">
                  <div className="relative basis-1/2">
                    <input
                      className="peer hidden"
                      id="radio_1"
                      type="radio"
                      name="selectedType"
                      value="Sticker Décoratif Perso"
                      checked={selectedMethod === "Sticker Décoratif Perso"}
                      onChange={(e) => {
                        handleMethodChange(e);
                        handleTypeChange(e);
                      }}
                    />
                    <span className="absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white peer-checked:border-gray-700"></span>
                    <label
                      className="flex cursor-pointer select-none rounded-lg border border-gray-300 p-4 peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50"
                      htmlFor="radio_1"
                    >
                      <div className="ml-1">
                        <span className="mt-2 font-semibold">
                          Sticker Décoratif
                        </span>
                      </div>
                    </label>
                  </div>

                  <div className="relative basis-1/2">
                    <input
                      className="peer hidden"
                      id="radio_2"
                      type="radio"
                      name="selectedType"
                      value="Etiquette Autocollante Perso"
                      checked={
                        selectedMethod === "Etiquette Autocollante Perso"
                      }
                      onChange={(e) => {
                        handleMethodChange(e);
                        handleTypeChange(e);
                      }}
                    />
                    <span className="absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white peer-checked:border-gray-700"></span>
                    <label
                      className="flex cursor-pointer select-none rounded-lg border border-gray-300 p-4 peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50"
                      htmlFor="radio_2"
                    >
                      <div className="">
                        <span className="mt-2 font-semibold">
                          Étiquettes Autocollante
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                <h2 className="mt-8 text-base font-semibold text-gray-900">
                  Matériau
                </h2>
                <div className="mt-3 flex select-none flex-wrap items-center gap-1">
                  <label>
                    <input
                      type="radio"
                      name="materiau"
                      value="Papier"
                      onChange={handleMaterialChange}
                      checked={materiau === "Papier"}
                      className="peer sr-only"
                    />
                    <p className="rounded-lg border border-pxcolor px-6 py-2 font-bold peer-checked:bg-pxcolor peer-checked:text-white">
                      Papier
                    </p>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="materiau"
                      value="Vinyle Blanc"
                      onChange={handleMaterialChange}
                      checked={materiau === "Vinyle Blanc"}
                      className="peer sr-only"
                    />
                    <p className="rounded-lg border border-pxcolor px-6 py-2 font-bold peer-checked:bg-pxcolor peer-checked:text-white">
                      Vinyle Blanc (+1000 XOF)
                    </p>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="materiau"
                      value="Vinyle Transparent"
                      onChange={handleMaterialChange}
                      checked={materiau === "Vinyle Transparent"}
                      className="peer sr-only"
                    />
                    <p className="rounded-lg border border-pxcolor px-6 py-2 font-bold peer-checked:bg-pxcolor peer-checked:text-white">
                      Vinyle Transparent (+1500 XOF)
                    </p>
                  </label>
                </div>

                <h2 className="mt-8 text-base font-semibold text-gray-900">
                  Quantité
                </h2>

                <div className=" mt-3 flex select-none items-center gap-1">
                  <div className="text-center">
                    <div className="relative w-56">
                      {selectedMethod === "Etiquette Autocollante Perso" ? (
                        <p className="text-sm text-gray-600">
                          Quantité fixe : 100 pour les étiquettes autocollantes
                        </p>
                      ) : (
                        <select
                          id="quantity"
                          onChange={handleQuantityChange}
                          value={quantity}
                          className="mb-6 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="">Choisissez la Quantité</option>
                          <option value="10">10</option>
                          <option value="20">20</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>

                {selectedMethod === "Etiquette Autocollante Perso" && (
                  <FormatSelection />
                )}

                {materiau === "Papier" && (
                  <>
                    <h3 className="mb-4 mt-8 font-semibold text-gray-900 dark:text-white">
                      Finitions
                    </h3>
                    <ul
                      onChange={handleFinitionChange}
                      className="w-full items-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:flex"
                    >
                      <li className="w-full border-b border-gray-200 dark:border-gray-600 sm:border-b-0 sm:border-r">
                        <div className="flex items-center ps-3">
                          <input
                            id="finition-vernis-uv"
                            type="radio"
                            value="Vernis UV"
                            name="finition"
                            checked={finition === "Vernis UV"}
                            className="h-4 w-4 border-gray-300 bg-gray-100 text-pxcolor focus:ring-2 focus:ring-pxcolor dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-pxcolor dark:focus:ring-offset-gray-700"
                          />
                          <label
                            htmlFor="finition-vernis-uv"
                            className="ms-2 w-full py-3 text-sm font-medium dark:text-gray-300"
                          >
                            Vernis UV
                          </label>
                        </div>
                      </li>
                      <li className="w-full border-b border-gray-200 dark:border-gray-600 sm:border-b-0 sm:border-r">
                        <div className="flex items-center ps-3">
                          <input
                            id="finition-pelliculage-brillant"
                            type="radio"
                            value="Pelliculage Brillant"
                            name="finition"
                            checked={finition === "Pelliculage Brillant"}
                            className="h-4 w-4 border-gray-300 bg-gray-100 text-pxcolor focus:ring-2 focus:ring-pxcolor dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-pxcolor dark:focus:ring-offset-gray-700"
                          />
                          <label
                            htmlFor="finition-pelliculage-brillant"
                            className="ms-2 w-full py-3 text-sm font-medium dark:text-gray-300"
                          >
                            Pelliculage Brillant
                          </label>
                        </div>
                      </li>
                      <li className="w-full border-b border-gray-200 dark:border-gray-600 sm:border-b-0 sm:border-r">
                        <div className="flex items-center ps-3">
                          <input
                            id="finition-pelliculage-mate"
                            type="radio"
                            value="Pelliculage Mate"
                            name="finition"
                            checked={finition === "Pelliculage Mate"}
                            className="h-4 w-4 border-gray-300 bg-gray-100 text-pxcolor focus:ring-2 focus:ring-pxcolor dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-pxcolor dark:focus:ring-offset-gray-700"
                          />
                          <label
                            htmlFor="finition-pelliculage-mate"
                            className="ms-2 w-full py-3 text-sm font-medium dark:text-gray-300"
                          >
                            Pelliculage Mate
                          </label>
                        </div>
                      </li>
                      <li className="w-full dark:border-gray-600">
                        <div className="flex items-center ps-3">
                          <input
                            id="finition-normal"
                            type="radio"
                            value="normal"
                            name="finition"
                            checked={finition === "normal"}
                            className="h-4 w-4 border-gray-300 bg-gray-100 text-pxcolor focus:ring-2 focus:ring-pxcolor dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-pxcolor dark:focus:ring-offset-gray-700"
                          />
                          <label
                            htmlFor="finition-normal"
                            className="ms-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                          >
                            Normal
                          </label>
                        </div>
                      </li>
                    </ul>
                  </>
                )}
                {quantityError && (
                  <p className="mt-2 text-red-500">
                    Veuillez sélectionner une quantité valide.
                  </p>
                )}
                <div className="mt-6">
                  <label
                    class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    htmlFor="file_input"
                  >
                    Selectionnez vos fichiers
                  </label>
                  <input
                    className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400"
                    aria-describedby="file_input_help"
                    id="file_input"
                    multiple
                    onChange={handleChangementFichier}
                    accept=".jpg, .jpeg, .png, .pdf" // Limiter les types de fichiers autorisés
                    type="file"
                  ></input>
                  <p
                    className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                    id="file_input_help"
                  >
                    PNG, JPG ou PDF. Sélectionnez au moins {quantity}{" "}
                    fichier(s).
                  </p>
                </div>
              </form>
              {selectedFilesNames.length > 0 && (
                <div className="mt-4">
                  <h2 className="text-base font-semibold text-gray-900">
                    Fichiers sélectionnés :
                  </h2>
                  <div className="relative mb-4 mt-2 grid grid-cols-2 gap-4 md:grid-cols-3">
                    {selectedFilesNames.map((fileName, index) => (
                      <div key={index} className="relative">
                        <div className="">
                          <img
                            className="static h-auto max-w-full rounded-lg"
                            src={URL.createObjectURL(fichiers[index])}
                            alt={fileName}
                          />
                        </div>

                        <div className="left- absolute bottom-2">
                          <button
                            className="cursor-pointer rounded-full bg-gray-200 p-1 text-white "
                            onClick={() => handleDeleteFile(index)}
                          >
                            <svg
                              class="h-6 w-6 text-gray-800 dark:text-white"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 14 14"
                              className="h-3 w-3"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-10 flex flex-col items-center justify-between space-y-4 border-b border-t py-4 sm:flex-row sm:space-y-0">
                <div className="flex items-end">
                  <h1 className="text-3xl font-bold">{finalPrice} XOF</h1>
                  <span className="text-base">/TTC</span>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md border-2 border-transparent bg-gray-900 bg-none px-12 py-3 text-center text-base font-bold text-white transition-all duration-200 ease-in-out hover:bg-gray-800 focus:shadow"
                  onClick={() => {
                    if (isFormValid) {
                      handleAddToCart();
                    } else {
                      toast.error("Veuillez remplir tous les champs requis.");
                    }
                  }}
                  disabled={!isFormValid}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-3 h-5 w-5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  Commander
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default StickerDetailsCheckout;
