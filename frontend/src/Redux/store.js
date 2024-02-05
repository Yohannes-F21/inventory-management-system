// import {
//   legacy_createStore as createStore,
//   applyMiddleware,
//   compose,
// } from "redux";
// import thunk from "redux-thunk";
// import { rootReducer } from "./index.js";

// function saveToLocalStorage(store) {
//   try {
//     const serializedStore = JSON.stringify(store);
//     window.localStorage.setItem("store", serializedStore);
//   } catch (e) {
//     console.log(e);
//   }
// }

// function loadFromLocalStorage() {
//   try {
//     const serializedStore = window.localStorage.getItem("store");
//     if (serializedStore === null) return undefined;
//     return JSON.parse(serializedStore);
//   } catch (e) {
//     console.log(e);
//     return undefined;
//   }
// }
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// const persistedState = loadFromLocalStorage();

// export const store = createStore(
//   rootReducer,
//   persistedState,
//   composeEnhancers(applyMiddleware(thunk))
// );

// store.subscribe(() => saveToLocalStorage(store.getState()));

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from "redux-thunk";

import authReducer from "./features/authSlice";
import dataReducer from "./features/dataSlice";

const persistConfig = {
  key: 'root',
  storage,
}

const rootReducer = combineReducers({
  auth: authReducer,
  data: dataReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer
})

export const persistor = persistStore(store)


