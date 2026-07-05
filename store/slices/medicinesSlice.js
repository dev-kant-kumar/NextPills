import { createSlice } from "@reduxjs/toolkit";
import * as crypto from "expo-crypto";

const initialState = {
  medicines: [],
  history: [],
};

const medicinesSlice = createSlice({
  name: "medicines",
  initialState,

  reducers: {
    addMedicine: (state, action) => {
      console.log("get this med data : ", action.payload);
      const medToAdd = {
        ...action.payload,
        _id: crypto.randomUUID(),
      };

      state.medicines.push(medToAdd);
    },
    updateMedicine: (state, action) => {
      const index = state.medicines.findIndex(
        (m) => m._id === action.payload._id,
      );

      if (index !== -1) {
        state.medicines[index] = action.payload;
      }
    },

    deleteMedicine: (state, action) => {
      state.medicines = state.medicines.filter((m) => m._id !== action.payload);
    },
  },
});

export const selectMedicines = (state) => state.medicines.medicines;
export const selectMedicineById = (id) => (state) =>
  state.medicines.medicines.find((m) => m._id === id);

export default medicinesSlice.reducer;
export const { addMedicine, updateMedicine, deleteMedicine } =
  medicinesSlice.actions;
