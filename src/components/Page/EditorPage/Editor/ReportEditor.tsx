import { ContentState, convertToRaw, Editor, EditorState } from "draft-js";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { styled } from "@mui/system";
import { Paper } from "@mui/material";
import { useRouter } from "next/router";
import {
  extendedBlockRenderMap,
  myBlockRender,
} from "@/components/Page/EditorPage/Editor/Functions/customBlock";
import compoundDecorator from "@/components/Page/EditorPage/Editor/Functions/compoundDecorator";
import { uiReset } from "@/rudex/UI/UiSlice";
import { Project } from "@/Functions/Files/project";
import { setFigureNames } from "@/rudex/Figure/FigureSlice";
import handleReturn from "@/components/Page/EditorPage/Editor/Functions/handleReturn";
import handleKeyCommand from "@/components/Page/EditorPage/Editor/Functions/handleKeyCommand";
import onArrowKey from "@/components/Page/EditorPage/Editor/Functions/onArrowKey";
import FormulaPreview from "@/components/Page/EditorPage/Editor/Decoration/FormulaPreview";
import { clearFormulaPreviewState } from "@/rudex/FormulaPreview/FormulaPreviewSlice";
import ContentAnalyzer from "@/components/Page/EditorPage/Editor/Functions/contentAnalysis/ContentAnalyzer";
import handleBeforeInput from "@/components/Page/EditorPage/Editor/Functions/handleBeforeInput";
import onTab from "@/components/Page/EditorPage/Editor/Functions/onTab";
import { setSelection } from "@/rudex/Selection/SelectionSlice";

const Paper_Wrapper = styled(Paper)({
  ".public-DraftEditorPlaceholder-root": {
    color: "gray",
    fontWeight: "bold",
    height: 0,
    pointerEvents: "none",
    userSelect: "none",
  },
  ".table": {
    margin: "1em 0",
  },
  caption: {
    fontSize: "9pt",
    marginBottom: "1em",
    textAlign: "center",
  },
  fontSize: "10.5pt",
  "h1, h2, h3, h4, h5, h6": {
    "&+:is(h1, h2, h3, h4, h5, h6)": {
      marginTop: "10.5pt",
    },
    "&:first-child": {
      marginTop: "10.5pt",
    },
    fontWeight: "bold",
    lineHeight: "1em",
    marginBottom: "10.5pt",
    marginTop: "21pt",
  },
  margin: 20,
  minHeight: 300,
  padding: "2cm 2cm 1cm 3cm",

  "ul,ol": {
    margin: "1em 0",
  },
  width: "210mm",
});

export default function ReportEditor() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [editorState, setEditorState] = useState(EditorState.createEmpty(compoundDecorator));
  const [readFirstContent, setReadFirstContent] = useState(false);

  const project = new Project(router.query.dirName as string);

  // セーブした内容の読み出し
  useEffect(() => {
    const { createWithContent } = EditorState;
    const { createFromText } = ContentState;

    project.readText().then(v => {
      const state = new ContentAnalyzer(createWithContent(createFromText(v), compoundDecorator));
      setEditorState(state.getNewContent());
    });

    setReadFirstContent(true);

    // 初期化
    dispatch(uiReset());
    (async () => {
      const names = await project.getImageList();
      dispatch(setFigureNames(names));
    })();
  }, []);

  // auto save
  const plainText = editorState.getCurrentContent().getPlainText();
  const onChange = (state: EditorState) => {
    // const newState = updateBlock(state);
    const analyzer = new ContentAnalyzer(state);
    const newState = analyzer.getNewContent();

    const selection = state.getSelection();
    dispatch(
      setSelection({
        blockArr: convertToRaw(state.getCurrentContent()).blocks.map(b => b.key),
        endKey: selection.getEndKey(),
        endOffset: selection.getEndOffset(),
        startKey: selection.getStartKey(),
        startOffset: selection.getStartOffset(),
      })
    );
    dispatch(clearFormulaPreviewState());

    setEditorState(newState);
    if (readFirstContent) {
      project.writeText(plainText);
    }
  };

  return (
    <>
      <Paper_Wrapper elevation={1}>
        <Editor
          spellCheck
          stripPastedStyles
          blockRenderMap={extendedBlockRenderMap}
          blockRendererFn={myBlockRender}
          editorState={editorState}
          handleBeforeInput={handleBeforeInput(setEditorState)}
          handleKeyCommand={handleKeyCommand(setEditorState)}
          handleReturn={handleReturn(setEditorState)}
          onChange={onChange}
          onDownArrow={onArrowKey(setEditorState)}
          onLeftArrow={onArrowKey(setEditorState)}
          onRightArrow={onArrowKey(setEditorState)}
          onTab={onTab(setEditorState)}
          onUpArrow={onArrowKey(setEditorState)}
          placeholder="Your report here!"
        />
      </Paper_Wrapper>
      <FormulaPreview />
    </>
  );
}
