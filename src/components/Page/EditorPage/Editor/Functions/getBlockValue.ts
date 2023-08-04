import { ContentBlock } from "draft-js";

const getBlockValue = <T = Map<any, any>>(block: ContentBlock) => {
  const text = block.getText();
  const blockKey = block.getKey();
  const type = block.getType();
  const depth = block.getDepth();

  const data: { [key: string]: any } = {};
  block.getData().forEach((v, k) => {
    data[k] = v;
  });

  return {
    blockKey,
    data: data as T,
    depth,
    text,
    type,
  };
};

export default getBlockValue;
