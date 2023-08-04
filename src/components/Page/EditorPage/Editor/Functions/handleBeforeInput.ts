import { Dispatch, SetStateAction } from "react";
import { DraftHandleValue, EditorState } from "draft-js";

const handleBeforeInput =
  (setEditorState: Dispatch<SetStateAction<EditorState>>) =>
  (chars: string, state: EditorState): DraftHandleValue => {
    console.log("before", chars);
    //
    return "not-handled";
  };

export default handleBeforeInput;
