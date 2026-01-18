import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";

import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

// 1️⃣ Persist config
const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth"], // persist only auth slice
};

// 2️⃣ Root reducer
const rootReducer = combineReducers({
    auth: authReducer,
});

// 3️⃣ Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4️⃣ Store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // required for redux-persist
        }),
});

// 5️⃣ Persistor
export const persistor = persistStore(store);

// 6️⃣ Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
