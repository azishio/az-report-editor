import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SelectionState } from "draft-js";

type MySelectionState = {
  startKey: string;
  startOffset: number;
  endKey: string;
  endOffset: number;
  focusBlockKey: string;
};

const initialState: MySelectionState = {
  startKey: "",
  startOffset: 0,
  endKey: "",
  endOffset: 0,
  focusBlockKey: "",
};
export const selectionSlice = createSlice({
  name: "selection",
  initialState,
  reducers: {
    setSelection: (state, action: PayloadAction<SelectionState>) => {
      state.startKey = action.payload.getStartKey();
      state.startOffset = action.payload.getStartOffset();
      state.endKey = action.payload.getEndKey();
      state.endOffset = action.payload.getEndOffset();

      if (state.startKey === state.endKey) {
        state.focusBlockKey = state.startKey;
      } else {
        state.focusBlockKey = "";
      }
    },
  },
});

export const { setSelection } = selectionSlice.actions;
export const selectionReducer = selectionSlice.reducer;
