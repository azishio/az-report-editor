import styles from "src/styles/components/Editor/CustomBlockComponents/OrderedList.module.css";
import { ContentBlock, EditorBlock } from "draft-js";
import { useAppDispatch, useAppSelector } from "@/rudex/store";
import { setBlockType } from "@/rudex/Block/BlockSlice";
import { useEffect } from "react";
import { depthMap } from "@/components/Editor/CustomBlockComponent/commonObj";

export function OrderedList(props: { block: ContentBlock }) {
  const { block } = props;
  const blockKey = block.getKey();
  const depth = block.getDepth() as keyof typeof depthMap;
  const text = block.getText();
  const dispatch = useAppDispatch();

  dispatch(
    setBlockType({
      blockKey,
      decorationName: `ordered-list-${depthMap[depth]}`,
    })
  );

  const focused = false;
  const num = useAppSelector(state => state.block.counter.orderedList.get(blockKey));
  const { content } = /^\d\. +(?<content>.*)/.exec(text)!.groups!;
  const indent = `${depth}em`;

  useEffect(() => {});

  return (
    <div
      className={styles.wrapper}
      data-component-type="OrderedList"
      data-focused={focused}
      style={{ marginLeft: indent }}
    >
      <span className={styles.num} data-count-num={num} />
      <EditorBlock {...props} />
      <span className={styles.content} data-content-text={content} />
    </div>
  );
}
