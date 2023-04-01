import { EditorBlock } from "draft-js";
import { useAppDispatch, useAppSelector } from "@/rudex/store";
import { setBlockType } from "@/rudex/Block/BlockSlice";
import {
  DEFAULT_LIST_INDENT,
  UNORDERED_LIST_BULLET_SIGN,
} from "@/components/Editor/commonEditorValue";
import { CustomBlockProps } from "@/components/Editor/CustomBlockComponent/commonType";
import { getBlockValue } from "@/components/Functions/getBlockValue";
import {
  DIV_CommonBlockStyle,
  SPAN_InFocusPseudoElements,
} from "@/components/Editor/CustomBlockComponent/common.styled";

export function UnOrderedList(props: CustomBlockProps) {
  const { block } = props;
  const { blockKey, depth } = getBlockValue(block);
  const dispatch = useAppDispatch();

  dispatch(
    setBlockType({
      blockKey,
      decorationName: "unordered-list-item",
    })
  );
  const focused = useAppSelector(state => state.selection.isFocusBlock(blockKey));

  const indentByHeader = useAppSelector(state => state.block.indentByHeader.get(blockKey));
  const indentByList = depth + DEFAULT_LIST_INDENT;
  const indent = indentByList + indentByHeader!;

  return (
    <DIV_CommonBlockStyle indent={indent}>
      <SPAN_InFocusPseudoElements focused={focused} unfocusedContent={UNORDERED_LIST_BULLET_SIGN} />
      <EditorBlock {...props} />
    </DIV_CommonBlockStyle>
  );
}
