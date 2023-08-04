import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type FigureState = {
  names: string[];
};

const initialState: FigureState = {
  names: [],
};

const figureSlice = createSlice({
  initialState,
  name: "figure",
  reducers: {
    deleteFigureName: (state, action: PayloadAction<string>) => {
      state.names.splice(state.names.indexOf(action.payload), 1);
    },
    pushFigureNames: (state, action: PayloadAction<string[]>) => {
      state.names.push(...action.payload);
    },
    setFigureNames: (state, action: PayloadAction<string[]>) => {
      state.names = action.payload;
    },
  },
});

export const { deleteFigureName, pushFigureNames, setFigureNames } = figureSlice.actions;

export const figureReducer = figureSlice.reducer;
