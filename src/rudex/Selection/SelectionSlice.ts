import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SelectionState } from "draft-js";

type MySelectionState = {
  startKey: string;
  startOffset: number;
  endKey: string;
  endOffset: number;
  focusBlockKey: Set<string>;
};

const initialState: MySelectionState = {
  endKey: "",
  endOffset: 0,
  focusBlockKey: new Set(),
  startKey: "",
  startOffset: 0,
};
export const selectionSlice = createSlice({
  initialState,
  name: "selection",
  reducers: {
    setSelection: (
      state,
      action: PayloadAction<{ selectionState: SelectionState; blockArr: string[] }>
    ) => {
      const { selectionState, blockArr } = action.payload;
      state.startKey = selectionState.getStartKey();
      state.startOffset = selectionState.getStartOffset();
      state.endKey = selectionState.getEndKey();
      state.endOffset = selectionState.getEndOffset();

      state.focusBlockKey.clear();
      for (let i = blockArr.indexOf(state.startKey); i <= blockArr.indexOf(state.endKey); i++) {
        state.focusBlockKey.add(blockArr[i]);
      }
    },
  },
});

export const { setSelection } = selectionSlice.actions;
export const selectionReducer = selectionSlice.reducer;
