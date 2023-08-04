import { InlineMath } from "react-katex";
import { Box } from "@mui/material";
import { MutableRefObject, useEffect, useRef } from "react";
import { DecoratorPropsType } from "@/components/Page/EditorPage/Editor/Decoration/DecorationComponents/decoratorPropsType";
import decodeOffsetKey from "@/components/Page/EditorPage/Editor/Functions/decodeOffsetKey";
import { useAppDispatch, useAppSelector } from "@/rudex/store";
import beFocused from "@/components/Page/EditorPage/Editor/Functions/beFocused";
import { SPAN_Hide } from "@/components/Page/EditorPage/Editor/common.styled";
import { setPreviewFormulaInfo } from "@/rudex/FormulaPreview/FormulaPreviewSlice";

const isHTMLDivElementRef = (
  ref: MutableRefObject<HTMLElement | null>
): ref is MutableRefObject<HTMLElement> => !!ref.current;

export default function Formula(props: DecoratorPropsType) {
  const { children, decoratedText, decoratorInfo, offsetKey } = props;
  const { end, start } = decoratorInfo;
  const { blockKey } = decodeOffsetKey(offsetKey);

  const focused = useAppSelector(state =>
    beFocused({
      blockKey,
      end,
      start,
      state,
    })
  );

  const ref: MutableRefObject<null | HTMLElement> = useRef(null);

  const showPreview = useAppSelector(
    state =>
      // 最初と最後の文字を含まない && キャレットが閉じている
      beFocused({
        blockKey,
        end,
        includeEdge: false,
        start,
        state,
      }) && state.selection.isCollapsed
  );

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (showPreview && isHTMLDivElementRef(ref)) {
      const { bottom, left } = ref.current.getBoundingClientRect();

      dispatch(
        setPreviewFormulaInfo({
          bottom,
          left,
          text: decoratedText.slice(1, -1),
        })
      );
    }
  }, [showPreview]);

  const editPlain = useAppSelector(state => state.ui.viewAllSign);

  return (
    <Box
      ref={ref}
      sx={{
        ".katex": {
          fontSize: "12pt",
        },
        ".katex-mathml": {
          display: "none",
        },
        display: "inline",
        lineHeight: "11pt",
        margin: "0 0.1em",
        position: "relative",
        whiteSpace: "nowrap",
      }}
    >
      {!(focused || editPlain) && <InlineMath>{decoratedText.slice(1, -1)}</InlineMath>}
      <SPAN_Hide hide={!(focused || editPlain)}>
        <span ref={ref}>{children}</span>
      </SPAN_Hide>
      <SPAN_Hide hide>
        {/* 文字数カウント用 */}
        {[...decoratedText].map(c => (
          <span className="characterCounter">{c}</span>
        ))}
      </SPAN_Hide>
    </Box>
  );
}
