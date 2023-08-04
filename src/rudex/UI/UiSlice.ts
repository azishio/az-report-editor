import { createSlice } from "@reduxjs/toolkit";

type UIState = {
  viewAllSign: boolean;
};

const initialState: UIState = {
  viewAllSign: false,
};

export const uiSlice = createSlice({
  initialState,
  name: "ui",
  reducers: {
    toggleViewAllSign: state => {
      state.viewAllSign = !state.viewAllSign;
    },
    uiReset: state => {
      state.viewAllSign = false;
    },
  },
});

export const { toggleViewAllSign, uiReset } = uiSlice.actions;

export const uiReducer = uiSlice.reducer;
