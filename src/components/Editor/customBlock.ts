import { ContentBlock, DefaultDraftBlockRenderMap } from "draft-js";
import { Undecorated } from "@/components/Editor/CustomBlockComponent/Undecorated";
import * as Immutable from "immutable";
import { Header } from "@/components/Editor/CustomBlockComponent/Header";
import { OrderedList } from "@/components/Editor/CustomBlockComponent/OrderedList";
import { UnOrderedList } from "@/components/Editor/CustomBlockComponent/UnOrderedList";

const blockRenderMap = Immutable.Map({
  unstyled: {
    element: "div",
  },
});
export const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);
export const myBlockRender = (contentBlock: ContentBlock) => {
  const type = contentBlock.getType();
  switch (type) {
    case "header-one":
    case "header-two":
    case "header-three":
    case "header-four":
    case "header-five":
    case "header-six":
      return {
        component: Header,
        editable: true,
      };
    case "ordered-list-item":
      return {
        component: OrderedList,
        editable: true,
      };
    case "unordered-list-item":
      return {
        component: UnOrderedList,
        editable: true,
      };
    default:
      return {
        component: Undecorated,
        editable: true,
      };
  }
};
