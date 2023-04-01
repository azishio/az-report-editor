import { ContentBlock } from "draft-js";

export const getBlockValue = (block: ContentBlock) => {
  const text = block.getText();
  const blockKey = block.getKey();
  const type = block.getType();
  const depth = block.getDepth() as 0 | 1 | 2 | 3 | 4 | 5;

  return {
    blockKey,
    depth,
    text,
    type,
  };
};
