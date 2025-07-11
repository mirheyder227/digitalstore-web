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
import storage from "redux-persist/lib/storage"; // localStorage üçün default storage
import authReducer from "./reducer/authSlice.js"; // Assuming this path is correct
import cartReducer from "./reducer/cartSlice.js"; // Import the cart reducer

// Bütün reducer-ləri birləşdirir
const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer, // Add the cart reducer here
});

// Redux Persist konfiqurasiyası
const persistConfig = {
  key: "root", // localStorage-da saxlanılacaq əsas açar
  version: 1,
  storage, // İstifadə olunacaq saxlama mexanizmi (localStorage)
  whitelist: ["auth", "cart"], // Yalnız 'auth' və 'cart' state-lərini persist et
};

// Persisted reducer yaradır
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Redux Store-u konfiqurasiya edir
export const store = configureStore({
  reducer: persistedReducer, // Persisted reducer istifadə olunur
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Redux Persist tərəfindən dispatch olunan action-ların serializability yoxlamasını keçmək üçün
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Persisted store-u yaradır
export const persistor = persistStore(store);
