import { EditorBlock } from "draft-js";
import { useAppDispatch, useAppSelector } from "@/rudex/store";
import { setBlockType } from "@/rudex/Block/BlockSlice";
import { CustomBlockProps } from "@/components/Editor/CustomBlockComponent/commonType";
import { DIV_CommonBlockStyle } from "@/components/Editor/CustomBlockComponent/common.styled";
import styled from "styled-components";
import { getBlockValue } from "@/components/Functions/getBlockValue";

const DIV_UndecoratedStyle = styled(DIV_CommonBlockStyle).attrs<{ content: string }>(props => ({
  isEmpty: !props.content,
}))<{ content: string; isEmpty?: boolean }>`
  ${({ isEmpty }) => (isEmpty ? "" : "text-indent: 1em")};
`;

export function Undecorated(props: CustomBlockProps) {
  const { block } = props;
  const { blockKey, text } = getBlockValue(block);
  const dispatch = useAppDispatch();

  dispatch(
    setBlockType({
      blockKey,
      decorationName: "unstyled",
    })
  );

  const indent = useAppSelector(state => state.block.indentByHeader.get(blockKey))!;

  return (
    <DIV_UndecoratedStyle content={text} indent={indent}>
      <EditorBlock {...props} />
    </DIV_UndecoratedStyle>
  );
}
