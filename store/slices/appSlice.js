import { createSlice } from "@reduxjs/toolkit";
import { getTodayString } from "../../utils/dateHelpers";

const initialState = {
  today: getTodayString(),
  settings: {
    userName: "",
    reminderSound: "Default Chime",
    snoozeDuration: "10 min",
    headsUpEnabled: true,
  },
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    updateToday: (state) => {
      const today = getTodayString();
      if (state.today !== today) {
        state.today = today;
      }
    },
    updateSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
  },
});

export const selectToday = (state) => state.app.today;
export const selectSettings = (state) => state.app.settings || initialState.settings;
export const selectUserName = (state) =>
  state.app.settings?.userName && state.app.settings.userName.trim()
    ? state.app.settings.userName.trim()
    : "Friend";

export default appSlice.reducer;
export const { updateToday, updateSettings } = appSlice.actions;
