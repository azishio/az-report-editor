import { convertToRaw, Editor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";
import { useEffect, useState } from "react";
import styles from "src/styles/components/Editor/ReportEditor.module.css";
import { useDispatch } from "react-redux";
import { compoundDecorator } from "@/components/Editor/compoundDecorator";
import { cleanUp, runningCounters } from "@/rudex/Block/BlockSlice";
import { setSelection } from "@/rudex/Selection/SelectionSlice";
import { blockRenderMap, myBlockRender } from "@/components/Editor/customBlock";

export default function ReportEditor() {
  const dispatch = useDispatch();

  const [editorState, setEditorState] = useState(EditorState.createEmpty(compoundDecorator));

  useEffect(() => {
    const blockArr = convertToRaw(editorState.getCurrentContent()).blocks.map(v => v.key);
    const blockSet = new Set(blockArr);

    dispatch(cleanUp(blockSet));
    dispatch(
      setSelection({
        blockArr,
        selectionState: editorState.getSelection(),
      })
    );
    dispatch(runningCounters(blockSet));
    //  dispatch(clearChanges());
  });

  return (
    <div>
      <div className={styles.commonEditorStyle}>
        <Editor
          stripPastedStyles
          blockRenderMap={blockRenderMap}
          blockRendererFn={myBlockRender}
          editorState={editorState}
          onChange={setEditorState}
          placeholder="Your report here!"
        />
      </div>
    </div>
  );
}
