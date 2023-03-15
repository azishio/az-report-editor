import { blockInfoReducer } from "@/rudex/BlockInfo/BlockInfoSlice";
import { selectionReducer } from "@/rudex/Selection/SelectionSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    blockInfo: blockInfoReducer,
    selection: selectionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
