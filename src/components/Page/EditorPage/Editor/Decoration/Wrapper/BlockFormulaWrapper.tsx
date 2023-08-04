import { convertToRaw } from "draft-js";
import { BlockMath } from "react-katex";
import { Box } from "@mui/material";
import { MutableRefObject, useEffect, useRef } from "react";
import { DIV_Hide } from "@/components/Page/EditorPage/Editor/common.styled";
import { useAppDispatch, useAppSelector } from "@/rudex/store";
import { setPreviewFormulaInfo } from "@/rudex/FormulaPreview/FormulaPreviewSlice";

const isHTMLDivElementRef = (
  ref: MutableRefObject<HTMLElement | null>
): ref is MutableRefObject<HTMLElement> => !!ref.current;

export default function BlockFormulaWrapper(props: any) {
  const { children }: { children: any[] } = props;
  const keyArr = children.map(v => v.key as string);
  const blockArr = convertToRaw(children[0].props.children.props.contentState).blocks;

  const contentArr = keyArr
    .map(key => blockArr.find(block => block.key === key)!.text)
    .slice(1, -1);

  const contentText = contentArr.reduce(
    (previousValue, currentValue) => `${previousValue}\n${currentValue}`,
    ""
  );

  const focused = useAppSelector(state =>
    state.selection.blocks.some(v => keyArr.some(V => V === v))
  );

  const ref: MutableRefObject<null | HTMLElement> = useRef(null);

  const showPreview = useAppSelector(
    state =>
      // 最初と最後の行を含まない && キャレットが閉じている
      state.selection.blocks.some(v => keyArr.slice(1, -1).some(V => V === v)) &&
      state.selection.isCollapsed
  );

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (showPreview && isHTMLDivElementRef(ref)) {
      const { bottom, left } = ref.current.getBoundingClientRect();

      dispatch(
        setPreviewFormulaInfo({
          bottom,
          left,
          text: contentText,
        })
      );
    }
  });

  const editPlain = useAppSelector(state => state.ui.viewAllSign);

  return (
    <Box
      ref={ref}
      sx={{
        ".katex": {
          fontSize: "1.2em",
        },
        ".katex-display": {
          margin: 0,
        },
        position: "relative",
      }}
    >
      {(!focused || editPlain) && <BlockMath>{contentText}</BlockMath>}
      <DIV_Hide hide={!focused || editPlain}>{children}</DIV_Hide>
    </Box>
  );
}
