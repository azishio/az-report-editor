import { EditorBlock } from "draft-js";
import { useAppDispatch } from "@/rudex/store";
import { setBlockType } from "@/rudex/Block/BlockSlice";
import { CustomBlockProps } from "@/components/Editor/CustomBlockComponent/commonType";

export function Undecorated(props: CustomBlockProps) {
  const { block } = props;
  const blockKey = block.getKey();

  const dispatch = useAppDispatch();

  dispatch(
    setBlockType({
      blockKey,
      decorationName: "unstyled",
    })
  );
  return <EditorBlock {...props} />;
}
