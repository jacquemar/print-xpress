import React, { useState, useEffect } from "react";
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

function PosterDetailsCheckout() {
  const cartPerso = useSelector((state) => state.cartPerso);
  const format = useSelector((state) => state.cartPerso.selectedFormat);
  const dimensions = useSelector((state) => state.cartPerso.dimensions);
  const quantity = useSelector((state) => state.cartPerso.quantity);
  const price = useSelector((state) => state.cartPerso.persoPrice);
  const filePaths = useSelector((state) => state.cartPerso.filePaths);
  const materiau = useSelector((state) => state.cartPerso.materiau);
  const finition = useSelector((state) => state.cartPerso.finition);
  const type = useSelector((state) => state.cartPerso.type);
  const idPerso = useSelector((state) => state.cartPerso.idPerso);
  const persoTotalPrice = useSelector((state) => state.cartPerso.persoPrice);
  const cover = useSelector((state) => state.cartPerso.cover);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("papier");
  // const [totalPrice, setTotalPrice] = useState("");
  const [showFormat, setShowFormat] = useState(false);
  const [diametreValue, setDiametreValue] = useState("");
  const [largeurValue, setLargeurValue] = useState("");
  const [hauteurValue, setHauteurValue] = useState("");
  const [fichiers, setFichiers] = useState([]);
  const [selectedFilesNames, setSelectedFilesNames] = useState([]);
  const [quantityError, setQuantityError] = useState(false);

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
    setShowFormat(selectedMethodValue === "etiquette");

    if (selectedMethodValue !== "etiquette") {
      // Si la méthode n'est pas une étiquette, on réinitialise le type sélectionné
      dispatch(resetType());
    }
  };

  const basePrice = "300";
  const handleQuantityChange = (event) => {
    const selectedQuantity = parseInt(event.target.value, 10);
    // Vérifier si la quantité sélectionnée est valide
    if (!Number.isNaN(selectedQuantity) && selectedQuantity > 0) {
      dispatch(updateQuantity(selectedQuantity));

      const totalnet = parseInt(basePrice) * selectedQuantity;
      dispatch(updatePersoPrice(totalnet));
      setQuantityError(false); // Réinitialiser l'erreur si une quantité valide est sélectionnée
    } else {
      // Afficher un message d'erreur ou prendre toute autre action nécessaire
      console.error("La quantité sélectionnée n'est pas valide.");
      setQuantityError(true); // Activer l'erreur si la quantité n'est pas valide
    }
  };

  const handleMaterialChange = (event) => {
    const selectedMaterialValue = event.target.value;
    dispatch(updateMaterial(selectedMaterialValue));
    dispatch(updateId(id));
  };

  const handleFormatChange = (event) => {
    const selectedFormatValue = event.target.value;
    dispatch(updateFormat(selectedFormatValue));
    console.log(selectedFormatValue);
  };

  const handleFinitionChange = (event) => {
    dispatch(updateFinition(event.target.value));
  };
  const validateForm = () => {
    // Vérification de toutes les conditions de validation

    const isTypeSelected = type !== "";
    const isFinitionSelected = finition !== "";
    const isSelectedMaterial = materiau !== "";
    const isQuantitySelected = quantity !== "";
    const isFichierSelected = fichiers !== "";

    // Mise à jour l'état isFormValid en fonction de la validation
    setIsFormValid(
      isTypeSelected &&
        isFinitionSelected &&
        isSelectedMaterial &&
        isQuantitySelected &&
        isFichierSelected
    );
  };

  useEffect(() => {
    validateForm();
  }, [type, finition, materiau, quantity, fichiers]);

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
    if (quantity === "") {
      toast.error("Veuillez d'abord sélectionner la quantité.");
      return;
    }
    // Vérifier la logique pour limiter le nombre de fichiers
    if (nouveauxFichiers.length <= quantity) {
      setFichiers(nouveauxFichiers);

      const fileNames = Array.from(nouveauxFichiers, (file) => file.name);
      setSelectedFilesNames(fileNames);
      toast.success(
        `Vous avez sélectionné ${nouveauxFichiers.length} fichier(s).`
      );
    } else {
      toast.error(
        `Vous ne pouvez sélectionner que jusqu'à ${quantity} fichiers.`
      );
      // Réinitialiser l'entrée de fichier
      event.target.value = null;
    }
  };

  const handleAddToCart = async () => {
    try {
      const formData = new FormData();
      fichiers.forEach((file) => {
        formData.append("files", file);
      });

      // Attendre la réponse de la requête POST
      const response = await axios.post(
        "http://localhost:2000/upload-temp",
        formData
      );

      if (response.status === 200) {
        const tempFilePaths = response.data.tempFilePaths;

        // Ajout des chemins dans le panier
        dispatch(saveFilePaths(tempFilePaths));
        dispatch(
          addToCartPerso({
            filePaths: tempFilePaths,
            cover: cover,
            idPerso: idPerso,
            format: format,
            type: type,
            finition: finition,
            materiau: materiau,
            dimensions: dimensions,
            quantity: quantity,

            persoTotalPrice: persoTotalPrice,
          })
        );

        // Affichage du message de succès
        toast.success("Commande passée avec succès ! ");

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
      <section class="py-12 sm:py-16">
        <div class="container mx-auto px-4">
          <nav class="flex">
            <ol role="list" class="flex items-center">
              <li class="text-left">
                <div class="-m-1">
                  <a
                    href="#"
                    class="rounded-md p-1 text-sm font-medium text-gray-600 hover:text-gray-800 focus:text-gray-900 focus:shadow"
                  >
                    Accueil
                  </a>
                </div>
              </li>

              <li class="text-left">
                <div class="flex items-center">
                  <span class="mx-2 text-gray-400">/</span>
                  <div class="-m-1">
                    <a
                      href="#"
                      class="rounded-md p-1 text-sm font-medium text-gray-600 hover:text-gray-800 focus:text-gray-900 focus:shadow"
                    >
                      Stickers
                    </a>
                  </div>
                </div>
              </li>

              <li class="text-left">
                <div class="flex items-center">
                  <span class="mx-2 text-gray-400">/</span>
                  <div class="-m-1">
                    <a
                      href="#"
                      class="rounded-md p-1 text-sm font-medium text-gray-600 hover:text-gray-800 focus:text-gray-900 focus:shadow"
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
          <div class="lg:col-gap-12 xl:col-gap-16 mt-8 grid grid-cols-1 gap-12 lg:mt-12 lg:grid-cols-5 lg:gap-16">
            <div class="lg:col-span-3 lg:row-end-1">
              <div class="lg:flex lg:items-start">
                <div class="lg:order-2 lg:ml-5">
                  <div class="max-w-xl overflow-hidden rounded-lg">
                    <img
                      class="h-full w-full max-w-full object-cover"
                      src="../../../src/assets/stckDetail3.jpg"
                      alt=""
                    />
                  </div>
                </div>

                <div class="mt-2 w-full lg:order-1 lg:w-32 lg:flex-shrink-0">
                  <div class="flex flex-row items-start lg:flex-col">
                    <button
                      type="button"
                      class="flex-0 aspect-square mb-3 h-20 overflow-hidden rounded-lg border-2 border-gray-900 text-center"
                    >
                      <img
                        class="h-full w-full object-cover"
                        src="../../../src/assets/stckDetail2.jpg"
                        alt=""
                      />
                    </button>
                    <button
                      type="button"
                      class="flex-0 aspect-square mb-3 h-20 overflow-hidden rounded-lg border-2 border-transparent text-center"
                    >
                      <img
                        class="h-full w-full object-cover"
                        src="../../../src/assets/stckDetail1.jpg"
                        alt=""
                      />
                    </button>
                    <button
                      type="button"
                      class="flex-0 aspect-square mb-3 h-20 overflow-hidden rounded-lg border-2 border-transparent text-center"
                    >
                      <img
                        class="h-full w-full object-cover"
                        src="../../../src/assets/stckDetail4.jpg"
                        alt=""
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="lg:col-span-2 lg:row-span-2 lg:row-end-2">
              <h1 class="sm: text-2xl font-bold text-gray-900 sm:text-3xl">
                Personnalistaion Sticker/Étiquette
              </h1>

              <div class="mt-5 flex items-center">
                <div class="flex items-center">
                  <svg
                    class="block h-4 w-4 align-middle text-yellow-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      class=""
                    ></path>
                  </svg>
                  <svg
                    class="block h-4 w-4 align-middle text-yellow-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      class=""
                    ></path>
                  </svg>
                  <svg
                    class="block h-4 w-4 align-middle text-yellow-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      class=""
                    ></path>
                  </svg>
                  <svg
                    class="block h-4 w-4 align-middle text-yellow-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      class=""
                    ></path>
                  </svg>
                  <svg
                    class="block h-4 w-4 align-middle text-yellow-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      class=""
                    ></path>
                  </svg>
                </div>
                <p class="ml-2 text-sm font-medium text-gray-500">
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
                      for="radio_1"
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
                      for="radio_2"
                    >
                      <div className="">
                        <span className="mt-2 font-semibold">
                          Étiquettes Autocollante
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                <h2 class="mt-8 text-base font-semibold text-gray-900">
                  Matériau
                </h2>
                <div class="mt-3 flex select-none flex-wrap items-center gap-1">
                  <label class="">
                    <input
                      type="radio"
                      name="materiau"
                      value="Papier"
                      onChange={(e) => {
                        handleMaterialChange(e);
                      }}
                      class="peer sr-only"
                    />
                    <p class="rounded-lg border border-pxcolor px-6 py-2 font-bold peer-checked:bg-pxcolor peer-checked:text-white">
                      Papier
                    </p>
                  </label>
                  <label class="">
                    <input
                      type="radio"
                      name="materiau"
                      value="Vinyle Blanc"
                      onChange={(e) => {
                        handleMaterialChange(e);
                      }}
                      class="peer sr-only"
                    />
                    <p class="rounded-lg border border-pxcolor px-6 py-2 font-bold peer-checked:bg-pxcolor peer-checked:text-white">
                      Vinyle Blanc
                    </p>
                  </label>
                  <label class="">
                    <input
                      type="radio"
                      name="materiau"
                      onChange={(e) => {
                        handleMaterialChange(e);
                      }}
                      value="Vinyle Transparent"
                      class="peer sr-only"
                    />
                    <p class="rounded-lg border border-pxcolor px-6 py-2 font-bold peer-checked:bg-pxcolor peer-checked:text-white">
                      Vinyle Transparent
                    </p>
                  </label>
                </div>

                <h2 class="mt-8 text-base font-semibold text-gray-900">
                  Quantité
                </h2>

                <div class=" mt-3 flex select-none items-center gap-1">
                  <div class="text-center">
                    <div class="relative w-56">
                      <select
                        id="quantity"
                        onChange={handleQuantityChange}
                        class="mb-6 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      >
                        <option title="">Choisissez la Quantité</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                      </select>
                    </div>
                  </div>
                </div>

                {selectedMethod === "Etiquette Autocollante Perso" && (
                  <>
                    <h2 class="mt-8 text-base font-semibold text-gray-900">
                      Format
                    </h2>
                    <div class="mt-3 flex select-none flex-wrap items-center gap-1">
                      <select
                        id="format"
                        onChange={handleFormatChange}
                        class="mb-1  w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      >
                        <option value="rond">Rond</option>
                        <option value="rectangle">Rectangle</option>
                        <option value="carré">Carré</option>
                      </select>
                    </div>
                    {format === "rond" && (
                      <div>
                        <select
                          id="diametre"
                          class="mt-3 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        >
                          <title>Choisissez la taille</title>
                          <option
                            value="7"
                            onChange={(e) => setDiametreValue(e.target.value)}
                          >
                            7 cm
                          </option>
                        </select>
                        <div className="mt-3 text-center italic text-gray-500">
                          <p className="w-f">
                            le format choisi est :{diametreValue}
                            cm
                          </p>
                        </div>
                      </div>
                    )}

                    {format === "rectangle" && (
                      <div>
                        <form class="mx-auto mt-8 inline-flex max-w-sm gap-4 text-center">
                          <div className="flex-row">
                            <label
                              for="number-input"
                              class="mb-2 block text-base font-semibold  text-gray-900 dark:text-white"
                            >
                              Largeur
                            </label>
                            <p className="mb-2 text-sm italic text-gray-500">
                              La valeur est en centimètre
                            </p>
                            <input
                              type="number"
                              id="number-input"
                              aria-describedby="helper-text-explanation"
                              class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                              placeholder="4"
                              value={largeurValue}
                              onChange={(e) => setLargeurValue(e.target.value)}
                              required
                            ></input>
                          </div>
                          <div className="flex-row">
                            <label
                              for="number-input"
                              class="mb-2 mt-8 block text-base font-semibold  text-gray-900 dark:text-white"
                            >
                              Hauteur
                            </label>
                            <p className="mb-2 text-sm italic text-gray-500">
                              La valeur est en centimètre
                            </p>
                            <input
                              type="number"
                              id="number-input"
                              aria-describedby="helper-text-explanation"
                              class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                              placeholder="6"
                              value={hauteurValue}
                              onChange={(e) => setHauteurValue(e.target.value)}
                              required
                            ></input>
                          </div>
                        </form>
                        {quantity !=
                          0(
                            <div className="mt-3 text-center italic text-gray-500">
                              <p className="w-f">
                                le format choisi est : {largeurValue} X
                                {hauteurValue}
                                cm
                              </p>
                            </div>
                          )}
                      </div>
                    )}
                  </>
                )}

                <h3 class="mb-4 mt-8 font-semibold text-gray-900 dark:text-white">
                  Finitions
                </h3>
                <ul
                  onChange={handleFinitionChange}
                  class="w-full items-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:flex"
                >
                  <li class="w-full border-b border-gray-200 dark:border-gray-600 sm:border-b-0 sm:border-r">
                    <div class="flex items-center ps-3">
                      <input
                        id="horizontal-list-radio-license"
                        type="radio"
                        value="Vernis UV"
                        name="list-radio"
                        class="h-4 w-4 border-gray-300 bg-gray-100 text-pxcolor focus:ring-2 focus:ring-pxcolor dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-pxcolor dark:focus:ring-offset-gray-700"
                      ></input>
                      <label
                        for="horizontal-list-radio-license"
                        class="ms-2 w-full py-3 text-sm font-medium dark:text-gray-300"
                      >
                        Vernis UV
                      </label>
                    </div>
                  </li>
                  <li class="w-full border-b border-gray-200 dark:border-gray-600 sm:border-b-0 sm:border-r">
                    <div class="flex items-center ps-3">
                      <input
                        id="horizontal-list-radio-id"
                        type="radio"
                        value="Pelliculage Brillant"
                        name="list-radio"
                        class="h-4 w-4 border-gray-300 bg-gray-100 text-pxcolor focus:ring-2 focus:ring-pxcolor dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-pxcolor dark:focus:ring-offset-gray-700"
                      ></input>
                      <label
                        for="horizontal-list-radio-id"
                        class="ms-2 w-full py-3 text-sm font-medium dark:text-gray-300"
                      >
                        Pelliculage Brillant
                      </label>
                    </div>
                  </li>
                  <li class="w-full border-b border-gray-200 dark:border-gray-600 sm:border-b-0 sm:border-r">
                    <div class="flex items-center ps-3">
                      <input
                        id="horizontal-list-radio-military"
                        type="radio"
                        value="Pelliculage Mate"
                        name="list-radio"
                        class="h-4 w-4 border-gray-300 bg-gray-100 text-pxcolor focus:ring-2 focus:ring-pxcolor dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-pxcolor dark:focus:ring-offset-gray-700"
                      ></input>
                      <label
                        for="horizontal-list-radio-military"
                        class="ms-2 w-full py-3 text-sm font-medium dark:text-gray-300"
                      >
                        Pelliculage Mate
                      </label>
                    </div>
                  </li>
                  <li class="w-full dark:border-gray-600">
                    <div class="flex items-center ps-3">
                      <input
                        id="horizontal-list-radio-passport"
                        type="radio"
                        value="normal"
                        name="list-radio"
                        class="h-4 w-4 border-gray-300 bg-gray-100 text-pxcolor focus:ring-2 focus:ring-pxcolor dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-pxcolor dark:focus:ring-offset-gray-700"
                      ></input>
                      <label
                        for="horizontal-list-radio-passport"
                        class="ms-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Normal
                      </label>
                    </div>
                  </li>
                </ul>
                {quantityError && (
                  <p className="mt-2 text-red-500">
                    Veuillez sélectionner une quantité valide.
                  </p>
                )}
                <div className="mt-6">
                  <label
                    class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    for="file_input"
                  >
                    Selectionnez vos fichiers
                  </label>
                  <input
                    class="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400"
                    aria-describedby="file_input_help"
                    id="file_input"
                    multiple
                    onChange={handleChangementFichier}
                    accept=".jpg, .jpeg, .png, .pdf" // Limiter les types de fichiers autorisés
                    type="file"
                  ></input>
                  <p
                    class="mt-1 text-sm text-gray-500 dark:text-gray-300"
                    id="file_input_help"
                  >
                    PNG, JPG or JFIF (MAX. 800x400px).
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
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
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

              <div class="mt-10 flex flex-col items-center justify-between space-y-4 border-b border-t py-4 sm:flex-row sm:space-y-0">
                <div class="flex items-end">
                  <h1 class="text-3xl font-bold"> {price} XOF</h1>
                  <span class="text-base">/TTC</span>
                </div>

                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-md border-2 border-transparent bg-gray-900 bg-none px-12 py-3 text-center text-base font-bold text-white transition-all duration-200 ease-in-out hover:bg-gray-800 focus:shadow"
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
                    class="mr-3 h-5 w-5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
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

export default PosterDetailsCheckout;
