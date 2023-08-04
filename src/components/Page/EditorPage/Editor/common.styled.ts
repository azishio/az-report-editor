import { Card } from "@mui/material";
import { styled } from "@mui/system";

export const DIV_CommonBlockStyle = styled("div")<{ indent: number }>(({ indent }) => ({
  display: "flex",
  marginLeft: `${indent}em`,
}));

export const SPAN_Hide = styled("span")<{ hide: boolean }>(({ hide }) => {
  if (hide)
    return {
      display: "inline-block",
      overflow: "hidden",
      whiteSpace: "nowrap",
      width: 0,
    };
  return {};
});

export const DIV_Hide = styled("div")<{ hide: boolean }>(({ hide }) => {
  if (hide)
    return {
      height: 0,
      overflow: "hidden",
    };
  return {};
});

export const CARD_Preview = styled(Card)<{
  contentFocused: boolean;
  top: number;
  zIndex: number;
}>(({ contentFocused, top, zIndex }) => ({
  "&::before": {
    content: '"preview :"',
    fontSize: "0.8em",
    textIndent: 0,
    whiteSpace: "nowrap",
  },
  "*": {
    textIndent: 0,
  },
  display: `${contentFocused ? "flex" : "none"}`,
  flexDirection: "column",
  left: 0,
  padding: "0 10px 10px",
  position: "absolute",

  top: `${top}em`,
  width: "fit-content",
  zIndex: `${zIndex}`,
}));
