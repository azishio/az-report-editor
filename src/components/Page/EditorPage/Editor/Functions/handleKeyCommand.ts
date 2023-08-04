import { DraftHandleValue, EditorState } from "draft-js";
import { Dispatch, SetStateAction } from "react";

const handleKeyCommand =
  (setEditorState: Dispatch<SetStateAction<EditorState>>) =>
  (command: string, state: EditorState): DraftHandleValue => {
    console.log("hk", command);

    return "not-handled";
  };

export default handleKeyCommand;
