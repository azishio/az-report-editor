import { DecoratorPropsType } from "@/components/Page/EditorPage/Editor/Decoration/DecorationComponents/decoratorPropsType";
import { useAppSelector } from "@/rudex/store";
import decodeOffsetKey from "@/components/Page/EditorPage/Editor/Functions/decodeOffsetKey";

export default function CustomBlockSigns(props: DecoratorPropsType) {
  const { children, offsetKey } = props;
  const { blockKey } = decodeOffsetKey(offsetKey);

  const focused = useAppSelector(state => state.selection.blocks.includes(blockKey));
  const editPlain = useAppSelector(state => state.ui.viewAllSign);

  return <span>{(focused || editPlain) && children}</span>;
}
