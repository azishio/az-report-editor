import { EditorBlock } from "draft-js";
import { useAppSelector } from "@/rudex/store";
import { CustomBlockProps } from "@/components/Page/EditorPage/Editor/Decoration/CustomBlockComponent/commonType";
import getBlockValue from "@/components/Page/EditorPage/Editor/Functions/getBlockValue";
import { DIV_CommonBlockStyle } from "@/components/Page/EditorPage/Editor/common.styled";
import { OrderedListBlockData } from "@/components/Page/EditorPage/Editor/Functions/contentAnalysis/dataType";
import LineRangeDispatcher from "@/components/Page/EditorPage/Editor/Decoration/CustomBlockComponent/LineRangeDispatcher";

export default function OrderedList(props: CustomBlockProps) {
  const { block } = props;
  const { blockKey, data, depth, text } = getBlockValue<OrderedListBlockData>(block);
  const { count } = data;

  const focused = useAppSelector(state => state.selection.blocks.includes(blockKey));
  const editPlain = useAppSelector(state => state.ui.viewAllSign);

  return (
    <DIV_CommonBlockStyle indent={depth}>
      {!focused && count}
      <LineRangeDispatcher blockKey={blockKey} text={text}>
        <EditorBlock {...props} />
      </LineRangeDispatcher>
    </DIV_CommonBlockStyle>
  );
}
