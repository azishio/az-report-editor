import { ContentBlock } from "draft-js";
import {
  AzDecorator,
  AzDecoratorOption,
  DecoratorRange,
} from "@azishio/draft-compound-decorator/dist/types";
import CompoundDecorator from "@azishio/draft-compound-decorator";
import { InlineDecoration } from "@/components/Editor/DecorationComponents/InlineDecoration";
import { SetAlias } from "@/components/Editor/DecorationComponents/SetAlias";
import { store } from "@/rudex/store";
import { setDecorationMap } from "@/rudex/Block/BlockSlice";
import { GetAlias } from "@/components/Editor/DecorationComponents/GetAlias";
import { Figure } from "@/components/Editor/DecorationComponents/Figure";
import { Table } from "@/components/Editor/DecorationComponents/Table";
import { ListChild } from "@/components/Editor/DecorationComponents/ListChild";

const decorationRule: { component: Function; option: AzDecoratorOption; regex: RegExp }[] = [
  {
    component: InlineDecoration,
    option: { name: "escape" },
    regex: /\\./gu,
  },

  {
    component: SetAlias,
    option: {
      name: "setHeaderAlias",
      parentName: ["header-one", "header-two", "header-three", "header-four", "header-five"],
    },
    regex: /\[.*\]/gu,
  },
  {
    // todo 後でどうにかする
    component: Figure,
    option: {
      name: "figure",
    },
    regex: /^figure$/gu,
  },
  {
    component: SetAlias,
    option: {
      name: "setFigureAlias",
      parentName: ["figure"],
    },
    regex: /\[.*\]/gu,
  },
  {
    // todo 後でどうにかする
    component: Table,
    option: {
      name: "table",
    },
    regex: /^table$/gu,
  },
  {
    component: SetAlias,
    option: {
      name: "setTableAlias",
      parentName: ["table"],
    },
    regex: /\[.*\]/gu,
  },
  {
    component: ListChild,
    option: { name: "listChild" },
    regex: /^: .*$/gu,
  },
  {
    component: GetAlias,
    option: {
      dislikedName: ["header-one", "header-two", "header-three", "header-four", "header-five"],
      name: "getHeaderAlias",
    },
    regex: /\[header\..*\]/gu,
  },
  {
    component: GetAlias,
    option: {
      dislikedName: ["header-one", "header-two", "header-three", "header-four", "header-five"],
      name: "getFigureAlias",
    },
    regex: /\[fig\..*\]/gu,
  },
  {
    component: GetAlias,
    option: {
      dislikedName: ["header-one", "header-two", "header-three", "header-four", "header-five"],
      name: "getTableAlias",
    },
    regex: /\[table\..*\]/gu,
  },
  {
    component: InlineDecoration,
    option: {
      dislikedName: [
        "setHeaderAlias",
        "getHeaderAlias",
        "setFigureAlias",
        "getFigureAlias",
        "setTableAlias",
        "getTableAlias",
      ],
      name: "bold",
    },
    regex: /\*/gu,
  },
  {
    component: InlineDecoration,
    option: {
      dislikedName: [
        "setHeaderAlias",
        "getHeaderAlias",
        "setFigureAlias",
        "getFigureAlias",
        "setTableAlias",
        "getTableAlias",
      ],
      name: "italic",
    },
    regex: /\//gu,
  },
  {
    component: InlineDecoration,
    option: {
      dislikedName: [
        "setHeaderAlias",
        "getHeaderAlias",
        "setFigureAlias",
        "getFigureAlias",
        "setTableAlias",
        "getTableAlias",
      ],
      name: "superscript",
    },
    regex: /\^/gu,
  },
  {
    component: InlineDecoration,
    option: {
      dislikedName: [
        "setHeaderAlias",
        "getHeaderAlias",
        "setFigureAlias",
        "getFigureAlias",
        "setTableAlias",
        "getTableAlias",
      ],
      name: "subscript",
    },
    regex: /_/gu,
  },
];

const strategy = (regex: RegExp) => (contentBlock: ContentBlock, callback: Function) => {
  const text = contentBlock.getText();
  let matchArr;
  // eslint-disable-next-line no-cond-assign
  while ((matchArr = regex.exec(text)) !== null) {
    const start = matchArr.index;
    const end = start + matchArr[0].length;
    callback(start, end);
  }
};

const decorator: Array<AzDecorator> = decorationRule.map(rule => ({
  component: rule.component,
  option: rule.option,
  props: {
    decorationName: rule.option.name,
  },
  strategy: strategy(rule.regex),
}));

const callback = (decoratorRange: DecoratorRange[][], block: ContentBlock) => {
  store.dispatch(
    setDecorationMap({
      blockKey: block.getKey(),
      decorationMap: decoratorRange,
    })
  );
  return decoratorRange;
};

export const compoundDecorator = new CompoundDecorator(decorator, callback);
