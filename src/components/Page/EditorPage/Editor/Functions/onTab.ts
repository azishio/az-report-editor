import { Dispatch, KeyboardEvent, SetStateAction } from "react";
import { EditorState, Modifier } from "draft-js";

type SyntheticKeyboardEvent = KeyboardEvent<{}>;

const onTab =
  (setEditorState: Dispatch<SetStateAction<EditorState>>) => (e: SyntheticKeyboardEvent) => {
    const { shiftKey } = e;
    const { replaceText } = Modifier;
    const { push } = EditorState;
    setEditorState(state => {
      const selection = state.getSelection();
      const content = state.getCurrentContent();

      const newContent = replaceText(content, selection, "\t");

      return push(state, newContent, "insert-characters");
    });
  };
export default onTab;
