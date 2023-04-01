import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SelectionState } from "draft-js";
import { store } from "@/rudex/store";

type MySelectionState = {
  focusDecorationId: Set<number>;
  isFocusBlock: (key: string) => boolean;
};

const initialState: MySelectionState = {
  focusDecorationId: new Set(),
  isFocusBlock: () => false,
};
export const selectionSlice = createSlice({
  initialState,
  name: "selection",
  reducers: {
    setSelection: (state, action: PayloadAction<SelectionState>) => {
      const selectionState = action.payload;
      const focusKey = selectionState.getFocusKey();

      state.isFocusBlock = (key: string) => focusKey === key;

      const focusOffset = selectionState.getFocusOffset();

      state.focusDecorationId.clear();

      if (false) {
        store
          .getState()
          .block.decorationMap.get(focusKey)!
          .forEach(decorator =>
            decorator.forEach(range => {
              const { end, id, start } = range;

              if (start <= focusOffset && focusOffset <= end) {
                state.focusDecorationId.add(id);
              }
            })
          );
      }
    },
  },
});

export const { setSelection } = selectionSlice.actions;
export const selectionReducer = selectionSlice.reducer;
