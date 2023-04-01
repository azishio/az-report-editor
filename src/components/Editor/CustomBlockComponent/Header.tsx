import { EditorBlock } from "draft-js";
import { CustomBlockProps } from "@/components/Editor/CustomBlockComponent/commonType";
import { useAppDispatch, useAppSelector } from "@/rudex/store";
import { setBlockType } from "@/rudex/Block/BlockSlice";
import { getBlockValue } from "@/components/Functions/getBlockValue";
import {
  DIV_CommonBlockStyle,
  SPAN_InFocusPseudoElements,
} from "@/components/Editor/CustomBlockComponent/common.styled";

export function Header(props: CustomBlockProps) {
  const { block } = props;
  const { blockKey, type } = getBlockValue(block);
  const dispatch = useAppDispatch();

  dispatch(
    setBlockType({
      blockKey,
      decorationName: type,
    })
  );

  const focused = useAppSelector(state => state.selection.isFocusBlock(blockKey));

  const indentByHeader = useAppSelector(state => state.block.indentByHeader.get(blockKey));
  const indent = indentByHeader!;

  const num = useAppSelector(state => state.block.counter.header.get(blockKey));

  return (
    <DIV_CommonBlockStyle indent={indent}>
      <SPAN_InFocusPseudoElements focused={focused} unfocusedContent={num} />
      <EditorBlock {...props} />
    </DIV_CommonBlockStyle>
  );
}
