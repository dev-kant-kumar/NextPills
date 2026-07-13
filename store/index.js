import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";

import medicinesReducer from "./slices/medicinesSlice";
import onboardingReducer from "./slices/onboardingSlice";

const rootReducer = combineReducers({
  medicines: medicinesReducer,
  onboarding: onboardingReducer,
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["medicines", "onboarding"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (gDM) => gDM({ serializableCheck: false }),
});

export default store;
export const persistor = persistStore(store);
