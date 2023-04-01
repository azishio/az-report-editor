import { EditorBlock } from "draft-js";
import { useAppDispatch, useAppSelector } from "@/rudex/store";
import { setBlockType } from "@/rudex/Block/BlockSlice";
import { depthMap } from "@/components/Editor/CustomBlockComponent/commonObj";
import { CustomBlockProps } from "@/components/Editor/CustomBlockComponent/commonType";
import {
  DEFAULT_LIST_INDENT,
  ORDERED_LIST_COUNTER_END,
} from "@/components/Editor/commonEditorValue";
import { getBlockValue } from "@/components/Functions/getBlockValue";
import {
  DIV_CommonBlockStyle,
  SPAN_InFocusPseudoElements,
} from "@/components/Editor/CustomBlockComponent/common.styled";

export function OrderedList(props: CustomBlockProps) {
  const { block } = props;
  const { blockKey, depth } = getBlockValue(block);
  const dispatch = useAppDispatch();

  dispatch(
    setBlockType({
      blockKey,
      decorationName: `ordered-list-${depthMap[depth]}`,
    })
  );

  const focused = useAppSelector(state => state.selection.isFocusBlock(blockKey));
  const indentByHeader = useAppSelector(state => state.block.indentByHeader.get(blockKey));

  const indentByList = depth + DEFAULT_LIST_INDENT;
  const indent = indentByList + indentByHeader!;

  const num = `${useAppSelector(state =>
    state.block.counter.orderedList.get(blockKey)
  )}${ORDERED_LIST_COUNTER_END}`;

  return (
    <DIV_CommonBlockStyle indent={indent}>
      <SPAN_InFocusPseudoElements focused={focused} unfocusedContent={num} />
      <EditorBlock {...props} />
    </DIV_CommonBlockStyle>
  );
}
