import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOnBoarded: false,
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    onBoarded: (state, action) => {
      state.isOnBoarded = true;
    },
  },
});

export const selectOnboardingStatus = (state) => state.onboarding.isOnBoarded;

export default onboardingSlice.reducer;
export const { onBoarded } = onboardingSlice.actions;
