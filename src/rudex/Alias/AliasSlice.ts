import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Category = "header" | "figure" | "table";
export type Alias = {
  [category in Category]: Map<string, string>;
};

const initialState: Alias = {
  figure: new Map(),
  header: new Map(),
  table: new Map(),
};

export const aliasSlice = createSlice({
  initialState,
  name: "alias",
  reducers: {
    deleteAlias: (
      state,
      action: PayloadAction<{ blockKey: string; category: "header" | "figure" | "table" }>
    ) => {
      const { blockKey, category } = action.payload;
      state[category].delete(blockKey);
    },
    setAlias(
      state,
      action: PayloadAction<{ alias: string; blockKey: string; category: Category }>
    ) {
      const { alias, blockKey, category } = action.payload;
      state[category].set(alias, blockKey);
    },
  },
});

export const { deleteAlias, setAlias } = aliasSlice.actions;

export const aliasReducer = aliasSlice.reducer;
