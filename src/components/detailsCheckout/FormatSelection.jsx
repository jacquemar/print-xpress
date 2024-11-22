import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateFormat,
  updateDimensions,
} from "../../redux/slices/cartPersoSlice";

function FormatSelection() {
  const dispatch = useDispatch();
  const [localFormat, setLocalFormat] = useState("");
  const [diametreValue, setDiametreValue] = useState("");
  const [largeurValue, setLargeurValue] = useState("");
  const [hauteurValue, setHauteurValue] = useState("");
  const [coteValue, setCoteValue] = useState("");

  const handleFormatChange = (event) => {
    const selectedFormat = event.target.value;
    setLocalFormat(selectedFormat);
    dispatch(updateFormat(selectedFormat));
    // Réinitialiser les valeurs
    setDiametreValue("");
    setLargeurValue("");
    setHauteurValue("");
    setCoteValue("");
  };

  useEffect(() => {
    let dimensions = {};
    switch (localFormat) {
      case "rond":
        dimensions = { diametre: Number(diametreValue) || 0 };
        break;
      case "rectangle":
        dimensions = {
          largeur: Number(largeurValue) || 0,
          hauteur: Number(hauteurValue) || 0,
        };
        break;
      case "carré":
        dimensions = { cote: Number(coteValue) || 0 };
        break;
    }
    dispatch(updateDimensions(dimensions));
  }, [
    localFormat,
    diametreValue,
    largeurValue,
    hauteurValue,
    coteValue,
    dispatch,
  ]);

  return (
    <>
      <h2 className="mt-8 text-base font-semibold text-gray-900">Format</h2>
      <div className="mt-3 flex select-none flex-wrap items-center gap-1">
        <select
          id="format"
          value={localFormat}
          onChange={handleFormatChange}
          className="mb-1 w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Choisissez un format</option>
          <option value="rond">Rond</option>
          <option value="rectangle">Rectangle</option>
          <option value="carré">Carré</option>
        </select>
      </div>

      {localFormat === "rond" && (
        <div className="mt-3">
          <label
            htmlFor="diametre"
            className="block text-sm font-medium text-gray-700"
          >
            Diamètre
          </label>
          <select
            id="diametre"
            value={diametreValue}
            onChange={(e) => setDiametreValue(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">Choisissez le diamètre</option>
            <option value="5">5 cm</option>
            <option value="7">7 cm</option>
          </select>
        </div>
      )}

      {localFormat === "rectangle" && (
        <div className="mt-3 grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="largeur"
              className="block text-sm font-medium text-gray-700"
            >
              Largeur (cm)
            </label>
            <input
              type="number"
              id="largeur"
              value={largeurValue}
              onChange={(e) => setLargeurValue(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              min="1"
              max="48"
            />
          </div>
          <div>
            <label
              htmlFor="hauteur"
              className="block text-sm font-medium text-gray-700"
            >
              Hauteur (cm)
            </label>
            <input
              type="number"
              id="hauteur"
              value={hauteurValue}
              onChange={(e) => setHauteurValue(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              min="1"
              max="32"
            />
          </div>
        </div>
      )}

      {localFormat === "carré" && (
        <div className="mt-3">
          <label
            htmlFor="cote"
            className="block text-sm font-medium text-gray-700"
          >
            Côté (cm)
          </label>
          <input
            type="number"
            id="cote"
            value={coteValue}
            onChange={(e) => setCoteValue(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            min="1"
            max="32"
          />
        </div>
      )}
    </>
  );
}

export default FormatSelection;
