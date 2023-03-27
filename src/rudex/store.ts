import { configureStore } from "@reduxjs/toolkit";
import { enableMapSet } from "immer";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { selectionReducer } from "@/rudex/Selection/SelectionSlice";
import { aliasReducer } from "@/rudex/Alias/AliasSlice";
import { blockReducer } from "@/rudex/Block/BlockSlice";

enableMapSet();

export const store = configureStore({
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  reducer: {
    alias: aliasReducer,
    block: blockReducer,
    selection: selectionReducer,
  },
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
