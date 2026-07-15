import { createSlice } from "@reduxjs/toolkit";

const getToday = () => new Date().toISOString().split("T")[0];

const initialState = {
  today: getToday(),
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    updateToday: (state, action) => {
      const today = getToday();
      if (state.today == !today) {
        state.today = today;
      }
    },
  },
});

export const selectToday = (state) => state.app.today;

export default appSlice.reducer;
export const { updateToday } = appSlice.actions;
