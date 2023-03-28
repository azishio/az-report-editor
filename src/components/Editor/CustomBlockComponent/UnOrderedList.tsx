import { DecoratorPropsType } from "@/components/Editor/DecorationComponents/decoratorPropsType";
import { EditorBlock } from "draft-js";
import { useAppDispatch } from "@/rudex/store";
import { setBlockType } from "@/rudex/Block/BlockSlice";

export function UnOrderedList(props: DecoratorPropsType) {
  const { block } = props;
  const blockKey = block.getKey();
  const dispatch = useAppDispatch();

  dispatch(
    setBlockType({
      blockKey,
      decorationName: "unordered-list-item",
    })
  );

  return (
    <div data-im="UnOrderedList">
      <EditorBlock {...props} />
    </div>
  );
}
