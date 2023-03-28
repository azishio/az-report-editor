import { ContentBlock, ContentState } from "draft-js";

export type CustomBlockProps = {
  block: ContentBlock;
  blockProps: undefined | { [key: string]: any };
  contentState: ContentState;
  forceSelection: boolean;
};
