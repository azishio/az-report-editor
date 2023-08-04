import { EditorBlock } from "draft-js";
import { useAppSelector } from "@/rudex/store";
import { UNORDERED_LIST_BULLET_SIGN } from "@/components/Page/EditorPage/Editor/commonEditorValue";
import { CustomBlockProps } from "@/components/Page/EditorPage/Editor/Decoration/CustomBlockComponent/commonType";
import getBlockValue from "@/components/Page/EditorPage/Editor/Functions/getBlockValue";
import { DIV_CommonBlockStyle } from "@/components/Page/EditorPage/Editor/common.styled";
import LineRangeDispatcher from "@/components/Page/EditorPage/Editor/Decoration/CustomBlockComponent/LineRangeDispatcher";

export default function UnOrderedList(props: CustomBlockProps) {
  const { block } = props;
  const { blockKey, depth, text } = getBlockValue(block);

  const focused = useAppSelector(state => state.selection.blocks.includes(blockKey));
  const editPlain = useAppSelector(state => state.ui.viewAllSign);

  return (
    <DIV_CommonBlockStyle indent={depth}>
      {!(focused || editPlain) && UNORDERED_LIST_BULLET_SIGN}
      <LineRangeDispatcher blockKey={blockKey} text={text}>
        <EditorBlock {...props} />
      </LineRangeDispatcher>
    </DIV_CommonBlockStyle>
  );
}
