import { createSelector, createSlice } from "@reduxjs/toolkit";
import * as crypto from "expo-crypto";
import { selectToday } from "./appSlice";
import { selectMedicineHistory } from "./historySlice";

const today = new Date().toISOString().split("T")[0];

const initialState = {
  medicines: [],
  today,
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

export const selectMedicineToTakeToday = createSelector(
  [selectMedicines, selectMedicineHistory, selectToday],

  (medicines, history, today) => {
    const medsToTakeToday = medicines.flatMap((med) =>
      med.times.map((time) => ({
        scheduledTime: time,
        ...med,
      })),
    );

    const todaysHistory = history.filter(
      (h) => h.timestamp.split("T")[0] === today,
    );

    return medsToTakeToday.filter(
      (m) =>
        !todaysHistory.some(
          (h) => h._id === m._id && h.scheduledTime === m.scheduledTime,
        ),
    );
  },
);

export default medicinesSlice.reducer;
export const { addMedicine, updateMedicine, deleteMedicine } =
  medicinesSlice.actions;
