import { EditorBlock } from "draft-js";
import { decodeOffsetKey } from "@/components/Functions/decodeOffsetKey";
import { useAppSelector } from "@/rudex/store";
import { useEffect } from "react";

export function Indenter(props) {
  const { offsetKey } = props;
  const { blockKey } = decodeOffsetKey(offsetKey);

  const indentByHeader = useAppSelector(state => state.block.indentByHeader.get(blockKey)) || 0;
  const indentByList = useAppSelector(state => state.block.indentByList.get(blockKey)) || 0;
  console.log("indentC", indentByList, indentByHeader);
  console.log(blockKey);

  const indent = `${(indentByHeader + indentByList).toString()}em`;

  useEffect(() => {
    console.log("mount", blockKey);
    return () => {
      console.log("unmount", blockKey);
    };
  });

  console.log(props);
  return (
    <div style={{ marginLeft: indent }}>
      <EditorBlock {...props} />
    </div>
  );
}
