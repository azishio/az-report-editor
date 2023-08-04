import { EditorBlock } from "draft-js";
import { CustomBlockProps } from "@/components/Page/EditorPage/Editor/Decoration/CustomBlockComponent/commonType";
import { useAppSelector } from "@/rudex/store";
import getBlockValue from "@/components/Page/EditorPage/Editor/Functions/getBlockValue";
import { DIV_CommonBlockStyle } from "@/components/Page/EditorPage/Editor/common.styled";
import { HeaderBlockData } from "@/components/Page/EditorPage/Editor/Functions/contentAnalysis/dataType";
import LineRangeDispatcher from "@/components/Page/EditorPage/Editor/Decoration/CustomBlockComponent/LineRangeDispatcher";

export default function Header(props: CustomBlockProps) {
  const { block } = props;
  const { blockKey, data, depth, text } = getBlockValue<HeaderBlockData>(block);
  const { count } = data;
  const focused = useAppSelector(state => state.selection.blocks.includes(blockKey));
  const editPlain = useAppSelector(state => state.ui.viewAllSign);

  return (
    <DIV_CommonBlockStyle indent={depth}>
      {!(focused || editPlain) && count}
      <LineRangeDispatcher blockKey={blockKey} text={text}>
        <EditorBlock {...props} />
      </LineRangeDispatcher>
    </DIV_CommonBlockStyle>
  );
}
