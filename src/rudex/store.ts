import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { uiReducer } from "@/rudex/UI/UiSlice";
import { figureReducer } from "@/rudex/Figure/FigureSlice";
import { lineRangeReducer } from "@/rudex/LineRange/LineRangeSlice";
import { formulaPreviewReducer } from "@/rudex/FormulaPreview/FormulaPreviewSlice";
import { selectionReducer } from "@/rudex/Selection/SelectionSlice";
import { aliasReducer } from "@/rudex/Alias/AliasSlice";

export const store = configureStore({
  reducer: {
    alias: aliasReducer,
    figure: figureReducer,
    formulaPreview: formulaPreviewReducer,
    lineRange: lineRangeReducer,
    selection: selectionReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
