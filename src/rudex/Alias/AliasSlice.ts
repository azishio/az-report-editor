import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Category = "header" | "figure" | "table";

type AliasState = {
  [category in Category]: { [alias: string]: string };
};

const initialState: AliasState = {
  figure: {},
  header: {},
  table: {},
};

const AliasSlice = createSlice({
  initialState,
  name: "alias",
  reducers: {
    deleteAlias: (state, action: PayloadAction<{ alias: string; category: Category }>) => {
      const { alias, category } = action.payload;
      delete state[category][alias];
    },

    setAlias: (
      state,
      action: PayloadAction<{ alias: string; category: Category; count: string }>
    ) => {
      const { alias, category, count } = action.payload;
      state[category][alias] = count;
    },
  },
});

export const { deleteAlias, setAlias } = AliasSlice.actions;
export const aliasReducer = AliasSlice.reducer;
