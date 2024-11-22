import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import cartReducer from "./slices/cartSlice";
import productReducer from "./slices/productSlice";
import ticketReducer from "./slices/ticketSlice";
import cartPersoReducer from "./slices/cartPersoSlice";

const rootReducer = combineReducers({
  cart: cartReducer,
  product: productReducer,
  ticket: ticketReducer,
  cartPerso: cartPersoReducer,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["cart", "ticket", "cartPerso"], // Ne pas persister 'product'
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

const persistor = persistStore(store);

export { store, persistor };
