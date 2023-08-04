/*
 * 高速化のため、lineRangeを事前に計算する。
 * ここでの計算が間に合わなかった場合、onArrowKey関数上で独自に計算された値が使用される。
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type LineRangeState = {
  range: {
    [key: string]: [number, number][];
  };
};

const initialState: LineRangeState = {
  range: {},
};

export const lineRangeSlice = createSlice({
  initialState,
  name: "lineRange",
  reducers: {
    deleteLineRange: (state, action: PayloadAction<string>) => {
      delete state.range[action.payload];
    },
    setLineRange: (
      state,
      action: PayloadAction<{
        key: string;
        range: [number, number][];
      }>
    ) => {
      const { key, range } = action.payload;

      state.range[key] = range;
    },
  },
});

export const { deleteLineRange, setLineRange } = lineRangeSlice.actions;
export const lineRangeReducer = lineRangeSlice.reducer;
