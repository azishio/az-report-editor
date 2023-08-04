import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SelectionState = {
  blocks: string[];
  endOffset: number;
  isCollapsed: boolean;
  startOffset: number;
};

const initialState: SelectionState = {
  blocks: [],
  endOffset: 0,
  isCollapsed: true,
  startOffset: 0,
};

const selectionSlice = createSlice({
  initialState,
  name: "selection",
  reducers: {
    setSelection: (
      state,
      action: PayloadAction<{
        blockArr: string[];
        endKey: string;
        endOffset: number;
        startKey: string;
        startOffset: number;
      }>
    ) => {
      const { blockArr, endKey, endOffset, startKey, startOffset } = action.payload;

      const startBlockIndex = blockArr.indexOf(startKey);
      const endBlockIndex = blockArr.indexOf(endKey);

      const blocks: string[] = [];
      for (let i = startBlockIndex; i <= endBlockIndex; i++) {
        blocks.push(blockArr[i]);
      }

      const isCollapsed = startOffset === endOffset && blocks.length === 1;

      return {
        blocks,
        endOffset,
        isCollapsed,
        startOffset,
      };
    },
  },
});

export const { setSelection } = selectionSlice.actions;
export const selectionReducer = selectionSlice.reducer;
