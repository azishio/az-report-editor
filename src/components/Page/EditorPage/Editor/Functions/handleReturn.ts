import { Dispatch, KeyboardEvent, SetStateAction } from "react";
import { DraftHandleValue, EditorState } from "draft-js";

type SyntheticKeyboardEvent = KeyboardEvent<{}>;
const handleReturn =
  (setEditorState: Dispatch<SetStateAction<EditorState>>) =>
  (e: SyntheticKeyboardEvent, editorState: EditorState): DraftHandleValue => {
    const { shiftKey } = e;
    // 表とか
    return "not-handled";
  };

export default handleReturn;
