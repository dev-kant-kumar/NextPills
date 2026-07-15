import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  history: [],
};

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    recordMedicineAction: (state, action) => {
      console.log("received action for history : ", action.payload);

      const { _id, scheduledTime, action } = action.payload;
      const medHistory = {
        _id,
        action,
        scheduledTime,
        timestamp: new Date().toISOString(),
      };

      state.history.push(medHistory);
    },
  },
});

export const selectMedicineHistory = (state) => state.history.history;
export const selectMedicineHistoryById = (id) => (state) =>
  state.history.history.filter((med) => med._id === id);

export default historySlice.reducer;
export const { recordMedicineAction } = historySlice.actions;
