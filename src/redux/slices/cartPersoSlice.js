import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItemPerso: [],
  filePaths: [],
  cover: "",
  idPerso: "",
  format: "",
  type: "",
  finition: "",
  materiau: "",
  dimensions: {},
  quantity: 0,
  persoPrice: 0,
  persoTotalQuantity: 0,
};

const cartPersoSlice = createSlice({
  name: "cartPerso",
  initialState,
  reducers: {
    resetCartPerso: (state) => {
      return { ...initialState };
    },
    addToCartPerso: (state, action) => {
      const newItem = action.payload;
      const existingItemIndex = state.cartItemPerso.findIndex(
        (item) => item.idPerso === newItem.idPerso
      );

      if (existingItemIndex !== -1) {
        // Mettre à jour l'élément existant
        state.cartItemPerso[existingItemIndex] = {
          ...state.cartItemPerso[existingItemIndex],
          ...newItem,
          quantity: state.cartItemPerso[existingItemIndex].quantity + 1,
        };
      } else {
        // Ajouter un nouvel élément
        state.cartItemPerso.push({ ...newItem, quantity: 1 });
      }
    },
    updateQuantity: (state, action) => {
      if (typeof action.payload === "object" && action.payload.idPerso) {
        // Mise à jour pour un élément spécifique
        const { idPerso, quantity } = action.payload;
        const item = state.cartItemPerso.find(
          (item) => item.idPerso === idPerso
        );
        if (item) {
          item.quantity = quantity;
        }
      } else {
        // Mise à jour générale de la quantité
        state.quantity = action.payload;
      }
    },
    updateCartItemPerso: (state, action) => {
      const { idPerso, updates } = action.payload;
      const itemIndex = state.cartItemPerso.findIndex(
        (item) => item.idPerso === idPerso
      );
      if (itemIndex !== -1) {
        state.cartItemPerso[itemIndex] = {
          ...state.cartItemPerso[itemIndex],
          ...updates,
        };
      }
    },
    updateFinition: (state, action) => {
      state.finition = action.payload;
    },
    updateMaterial: (state, action) => {
      state.materiau = action.payload;
    },
    removeFromCartPerso: (state, action) => {
      const idPerso = action.payload;
      state.cartItemPerso = state.cartItemPerso.filter(
        (item) => item.idPerso !== idPerso
      );
    },
    clearCartPerso: (state) => {
      state.cartItemPerso = [];
    },
    // ... autres reducers existants ...
    updatePersoItemQuantity: (state, action) => {
      const { idPerso, quantity } = action.payload;
      const itemIndex = state.cartItemPerso.findIndex(
        (item) => item.idPerso === idPerso
      );
      if (itemIndex !== -1) {
        state.cartItemPerso[itemIndex].quantity = quantity;
        state.persoTotalQuantity = state.cartItemPerso.reduce(
          (total, item) => total + item.quantity,
          0
        );
      }
    },
    updatePersoPrice: (state) => {
      state.persoPrice = state.cartItemPerso.reduce(
        (total, item) => total + item.persoPrice * item.quantity,
        0
      );
    },
    removePersoItem: (state, action) => {
      const idPerso = action.payload;
      state.cartItemPerso = state.cartItemPerso.filter(
        (item) => item.idPerso !== idPerso
      );
      state.persoTotalQuantity = state.cartItemPerso.reduce(
        (total, item) => total + item.quantity,
        0
      );
    },
  },
});

export const {
  addToCartPerso,
  updateCartItemPerso,
  removeFromCartPerso,
  clearCartPerso,
  updatePersoPrice,
  updateQuantity,
  updateType,
  updateId,
  updateCover,
  updateMaterial,
  resetType,
  updateFinition,
  saveFilePaths,
  resetCartPerso,
  getCartItemPersoCount,
  updateFormat,
  updateDimensions,
  updatePersoItemQuantity,
  removePersoItem,
} = cartPersoSlice.actions;

export default cartPersoSlice.reducer;
