import { ContentBlock } from "draft-js";
import { Indenter } from "@/components/Editor/CustomBlockComponent/Indenter";
import * as Immutable from "immutable";

export const blockRenderMap = Immutable.Map({
  unstyled: {
    element: "div",
  },
});

export const myBlockRender = (contentBlock: ContentBlock) => {
  const type = contentBlock.getType();
  return {
    component: Indenter,
    editable: true,
  };
};
