import { styled } from "@mui/system";
import { Box } from "@mui/material";
import { useEffect } from "react";
import { DecoratorPropsType } from "@/components/Page/EditorPage/Editor/Decoration/DecorationComponents/decoratorPropsType";
import { useAppSelector } from "@/rudex/store";
import decodeOffsetKey from "@/components/Page/EditorPage/Editor/Functions/decodeOffsetKey";
import beFocused from "@/components/Page/EditorPage/Editor/Functions/beFocused";

const SPAN_InlineDecoration = styled("span")<{
  focused: boolean;
  isEdge: boolean;
  type: "bold" | "italic" | "superscript" | "subscript";
}>(({ focused, isEdge, type }) => {
  if (isEdge && !focused)
    return {
      display: "inline-block",
      overflow: "hidden",
      whiteSpace: "nowrap",
      width: 0,
    };

  switch (type) {
    case "bold":
      return { fontWeight: "bold" };
    case "italic":
      return { fontStyle: "italic" };
    case "superscript":
      return {
        fontSize: "10pt",
        verticalAlign: "super",
      };
    case "subscript":
      return {
        fontSize: "10pt",
        verticalAlign: "sub",
      };
    default:
      return {};
  }
});

export default function InlineDecoration(props: DecoratorPropsType) {
  const { children, decoratorInfo, decoratorProps, offsetKey } = props;
  const { end, isEdge, start } = decoratorInfo;
  const { decorationName } = decoratorProps;
  const { blockKey } = decodeOffsetKey(offsetKey);
  const focused = useAppSelector(state =>
    beFocused({
      blockKey,
      end,
      start,
      state,
    })
  );

  const editPlain = useAppSelector(state => state.ui.viewAllSign);

  useEffect(() => {
    console.log("makeInlineDecoration", blockKey);
    return () => {
      console.log("daleteInlineDecoration", blockKey);
    };
  }, []);

  return (
    <SPAN_InlineDecoration focused={focused || editPlain} isEdge={isEdge} type={decorationName}>
      <Box
        sx={{
          display: "inline",
          verticalAlign: "baseline",
        }}
      >
        {children}
      </Box>
    </SPAN_InlineDecoration>
  );
}
