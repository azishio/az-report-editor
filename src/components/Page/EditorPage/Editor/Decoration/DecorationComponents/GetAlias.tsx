import { Box } from "@mui/material";
import { DecoratorPropsType } from "@/components/Page/EditorPage/Editor/Decoration/DecorationComponents/decoratorPropsType";
import { useAppSelector } from "@/rudex/store";
import decodeOffsetKey from "@/components/Page/EditorPage/Editor/Functions/decodeOffsetKey";
import beFocused from "@/components/Page/EditorPage/Editor/Functions/beFocused";
import { SPAN_Hide } from "@/components/Page/EditorPage/Editor/common.styled";

const aliasType = {
  "get-figure-alias": "figure",
  "get-header-alias": "header",
  "get-table-alias": "table",
} as const;
const textType = {
  "get-figure-alias": "図 - ",
  "get-header-alias": "",
  "get-table-alias": "表 - ",
} as const;

export default function GetAlias(props: DecoratorPropsType) {
  const { children, decoratedText, decoratorInfo, decoratorProps, offsetKey } = props;
  const { end, start } = decoratorInfo;
  const { decorationName } = decoratorProps;
  const { blockKey } = decodeOffsetKey(offsetKey);

  const alias = decoratedText.slice(5, -1);

  const aliasedNum: string | null = useAppSelector(state => {
    const type = aliasType[decorationName as keyof typeof aliasType];
    return state.alias[type][alias] || null;
  });

  const focused = useAppSelector(state =>
    beFocused({
      blockKey,
      end,
      start,
      state,
    })
  );

  return (
    <>
      {!focused && (
        <span>
          {textType[decorationName as keyof typeof textType]}
          {aliasedNum ? (
            <span>{aliasedNum}</span>
          ) : (
            <Box color="red" sx={{ display: "inline" }}>
              undefined alias
            </Box>
          )}
        </span>
      )}
      <SPAN_Hide hide={!focused}>{children}</SPAN_Hide>
    </>
  );
}
