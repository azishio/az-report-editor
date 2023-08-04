import { ContentBlock } from "draft-js";
import {
  AzDecorator,
  AzDecoratorOption,
  HaveOverLoadStrategy,
} from "@azishio/draft-compound-decorator/dist/types";
import CompoundDecorator from "@azishio/draft-compound-decorator";
import InlineDecoration from "@/components/Page/EditorPage/Editor/Decoration/DecorationComponents/InlineDecoration";
import GetAlias from "@/components/Page/EditorPage/Editor/Decoration/DecorationComponents/GetAlias";
import CustomBlockSigns from "@/components/Page/EditorPage/Editor/Decoration/DecorationComponents/CustomBlockSigns";
import Formula from "@/components/Page/EditorPage/Editor/Decoration/DecorationComponents/Formula";
import CharacterCounter from "@/components/Page/EditorPage/Editor/Decoration/DecorationComponents/CharacterCounter";

const decorationRule: { component: Function; option: AzDecoratorOption; regex: RegExp }[] = [
  {
    component: InlineDecoration,
    option: { name: "escape" },
    regex: /\\[#$+^_\][]/gu,
  },
  {
    component: CustomBlockSigns,
    option: {
      name: "header-signs",
      parentBlockType: [
        "header-one",
        "header-two",
        "header-three",
        "header-four",
        "header-five",
        "header-six",
        "ordered-list-item",
        "unordered-list-item",
      ],
    },
    regex: /(^#{1,6} )|(^\+ )|(^\$ )/gu,
  },
  {
    component: CustomBlockSigns,
    option: {
      name: "unordered-list-sign",
      parentBlockType: ["unordered-list"],
    },
    regex: /^\+ */gu,
  },
  {
    component: CustomBlockSigns,
    option: {
      name: "ordered-list-sign",
      parentBlockType: ["ordered-list"],
    },
    regex: /^\$. */gu,
  },
  {
    component: GetAlias,
    option: {
      name: "get-header-alias",
      parentBlockType: ["undecorated"],
    },
    regex: /\[hdr\..*\]/gu,
  },
  {
    component: GetAlias,
    option: {
      name: "get-figure-alias",
      parentBlockType: ["undecorated"],
    },
    regex: /\[fig\..*\]/gu,
  },
  {
    component: GetAlias,
    option: {
      name: "get-table-alias",
      parentBlockType: ["undecorated"],
    },
    regex: /\[tbl\..*\]/gu,
  },
  {
    component: Formula,
    option: {
      name: "inline-formula",

      parentBlockType: ["undecorated", "table", "unordered-table"],
      parentName: ["_undecorated"],
    },
    regex: /\$[^$]+\$/gu,
  },
  {
    component: InlineDecoration,
    option: {
      dislikedName: ["inline-formula"],
      endOffset: 1,
      name: "bold",
      overload: [
        {
          regex: /[^*]\*$/gu,
          startOffset: 1,
        },
      ],
      parentBlockType: ["undecorated", "table"],
      splitEdge: true,
    },
    regex: /(\*[^*])/gu,
  },
  {
    component: InlineDecoration,
    option: {
      dislikedName: ["inline-formula"],
      endOffset: 1,
      name: "italic",
      overload: [
        {
          regex: /[^/]\/$/gu,
          startOffset: 1,
        },
      ],
      parentBlockType: ["undecorated", "table"],
      splitEdge: true,
    },
    regex: /\/[^/]/gu,
  },
  {
    component: InlineDecoration,
    option: {
      dislikedName: ["inline-formula"],
      endOffset: 1,
      name: "superscript",
      overload: [
        {
          regex: /[^^]\^$/gu,
          startOffset: 1,
        },
      ],
      parentBlockType: ["undecorated", "table"],
      splitEdge: true,
    },
    regex: /\^[^^]/gu,
  },
  {
    component: InlineDecoration,
    option: {
      dislikedName: ["inline-formula"],
      endOffset: 1,
      name: "subscript",
      overload: [
        {
          regex: /[^_]_$/gu,
          startOffset: 1,
        },
      ],
      parentBlockType: ["undecorated", "table"],
      splitEdge: true,
    },
    regex: /_[^_]/gu,
  },
  {
    component: CharacterCounter,
    option: {
      dislikedName: ["inline-formula"],
      name: "character-counter",
      notJudging: true,
    },
    regex: /./gu,
  },
];

//

const strategy: HaveOverLoadStrategy = (
  contentBlock: ContentBlock,
  callback: Function,
  contentState,
  regex: RegExp
) => {
  const text = contentBlock.getText();

  let matchArr;
  // eslint-disable-next-line no-cond-assign
  while ((matchArr = regex.exec(text)) !== null) {
    const start = matchArr.index;
    const end = start + matchArr[0].length;
    callback(start, end);
  }
};

const decorator: AzDecorator[] = decorationRule.map(rule => ({
  component: rule.component,
  option: rule.option,
  props: {
    decorationName: rule.option.name,
  },
  regex: rule.regex,
  strategy,
}));

const compoundDecorator = new CompoundDecorator(decorator);

export default compoundDecorator;
