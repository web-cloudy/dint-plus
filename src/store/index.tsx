import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  persistStore,
} from "redux-persist";

import userReducer from "./slices/users";
import eventReducer from "./slices/event";
import chatReducer from "./slices/chat";
import profileReducer from "./slices/profile";
import stripeReducer from "./slices/stripe";
import bankSlice from "./slices/bank";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  // whitelist: ['user', 'event']
  whitelist: ["user"],
};

const reducers = combineReducers({
  user: userReducer,
  event: eventReducer,
  chat: chatReducer,
  profile: profileReducer,
  stripeService: stripeReducer,
  bankService: bankSlice,
});

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
