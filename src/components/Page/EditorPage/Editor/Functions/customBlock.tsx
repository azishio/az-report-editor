import { ContentBlock, DefaultDraftBlockRenderMap } from "draft-js";
import * as Immutable from "immutable";
import Undecorated from "@/components/Page/EditorPage/Editor/Decoration/CustomBlockComponent/Undecorated";
import Header from "@/components/Page/EditorPage/Editor/Decoration/CustomBlockComponent/Header";
import OrderedList from "@/components/Page/EditorPage/Editor/Decoration/CustomBlockComponent/OrderedList";
import UnOrderedList from "@/components/Page/EditorPage/Editor/Decoration/CustomBlockComponent/UnOrderedList";
import BlockFormulaWrapper from "@/components/Page/EditorPage/Editor/Decoration/Wrapper/BlockFormulaWrapper";
import TableWrapper from "@/components/Page/EditorPage/Editor/Decoration/Wrapper/TableWrapper";
import Figure from "@/components/Page/EditorPage/Editor/Decoration/CustomBlockComponent/Figure";

const blockRenderMap = Immutable.Map({
  "block-formula": {
    element: "div",
    wrapper: <BlockFormulaWrapper />,
  },
  table: {
    element: "div",
    wrapper: <TableWrapper />,
  },
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
    case "block-formula":
      return {
        component: Undecorated,
        editable: true,
      };
    case "table":
      return {
        component: Undecorated,
        editable: true,
      };
    case "figure":
      return {
        component: Figure,
        editable: true,
      };
    default:
      return {
        component: Undecorated,
        editable: true,
      };
  }
};
