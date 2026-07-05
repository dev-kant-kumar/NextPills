import { configureStore } from "@reduxjs/toolkit";
import medicinesReducer from "./slices/medicinesSlice";

const store = configureStore({
  reducer: {
    medicines: medicinesReducer,
  },
});

export default store;
