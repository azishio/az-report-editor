import { Editor, EditorState, RichUtils } from "draft-js";
import "draft-js/dist/Draft.css";
import { useState } from "react";
import styles from "src/styles/components/Editor/ReportEditor.module.css";
import { compoundDecorator } from "@/components/Editor/compositeDecorator";

export default function ReportEditor() {
  console.log("hello");

  const [editorState, setEditorState] = useState(EditorState.createEmpty(compoundDecorator));
  // const [editorState, setEditorState] = useState(EditorState.createEmpty(compoundDecorator));

  const onChange = (editorState: EditorState) => {
    setEditorState(editorState);
  };

  const toggleBold = e => {
    e.preventDefault();
    setEditorState(RichUtils.toggleInlineStyle(editorState, "STRIKETHROUGH"));
  };
  //
  return (
    <div>
      <button onClick={toggleBold}>斜体</button>
      <div className={styles.commonEditorStyle}>
        <Editor
          editorState={editorState}
          onChange={onChange}
          stripPastedStyles
          placeholder="Your report here!"
        />
      </div>
    </div>
  );
}
