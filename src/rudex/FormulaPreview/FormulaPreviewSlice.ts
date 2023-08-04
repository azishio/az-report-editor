import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type FormulaPreviewState = {
  formula: {
    bottom: number;
    left: number;
    show: boolean;
    text: string;
  };
};

const initialState: FormulaPreviewState = {
  formula: {
    bottom: 0,
    left: 0,
    show: false,
    text: "",
  },
};

const formulaPreviewSlice = createSlice({
  initialState,
  name: "formulaPreview",
  reducers: {
    clearFormulaPreviewState: state => {
      state.formula.show = false;
    },
    setPreviewFormulaInfo: (
      state,
      action: PayloadAction<{
        bottom: number;
        left: number;
        text: string;
      }>
    ) => {
      state.formula = {
        ...action.payload,
        show: true,
      };
    },
  },
});

export const { clearFormulaPreviewState, setPreviewFormulaInfo } = formulaPreviewSlice.actions;
export const formulaPreviewReducer = formulaPreviewSlice.reducer;
