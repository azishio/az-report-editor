import { ContentBlock, DraftDecorator } from "draft-js";
import { BlockDecoration } from "@/components/Editor/DecorationComponents/BlockDecoration";
import { InlineDecoration } from "@/components/Editor/DecorationComponents/InlineDecoration";
import {
  BlockDecorationRule,
  blockDecorationRule,
  depthMap,
  DepthMapKey,
  inlineDecorationRule,
  InlineDecorationRule,
} from "@/components/Editor/myDecorationType";
import { pushBlockInfo } from "@/rudex/BlockInfo/BlockInfoSlice";
import { store } from "@/rudex/store";
import CompoundDecoratora from "@/components/Editor/CompoundDecorator/CompoundDecorator";

type BlockStrategyProps = {
  readonly rule: BlockDecorationRule;
  readonly contentBlock: ContentBlock;
  readonly callback: Function;
};
type InlineStrategyProps = {
  readonly rule: InlineDecorationRule;
  readonly contentBlock: ContentBlock;
  readonly callback: Function;
};
type HaveGroupsRegExpExecArray = RegExpExecArray & {
  groups: { [key: string]: string };
};
const blockStrategy =
  (rule: BlockDecorationRule) => (contentBlock: ContentBlock, callback: Function) => {
    const text = contentBlock.getText();

    let matchArr;
    while ((matchArr = <HaveGroupsRegExpExecArray>rule.regex.exec(text)) !== null) {
      // store登録
      switch (rule.category) {
        case "header":
          store.dispatch(
            pushBlockInfo({
              category: "header",
              key: contentBlock.getKey(),
              type: rule.type,
              content: matchArr.groups.content,
              depth: depthMap[rule.type],
              alias: matchArr.groups.alias,
            })
          );
          break;
        case "ordered-list":
        case "unordered-list":
          store.dispatch(
            pushBlockInfo({
              category: rule.category,
              key: contentBlock.getKey(),
              type: rule.type,
              content: matchArr.groups.content,
              depth: depthMap[<DepthMapKey>rule.type],
            })
          );
          break;
        case "block-formula":
          store.dispatch(
            pushBlockInfo({
              category: rule.category,
              key: contentBlock.getKey(),
              type: rule.type,
              content: matchArr.groups.content,
            })
          );
      }

      // コンポーネント生成
      const start = matchArr.index;
      const end = start + matchArr[0].length;
      callback(start, end);
    }
  };

const inlineStrategy =
  (rule: InlineDecorationRule) => (contentBlock: ContentBlock, callback: Function) => {
    const text = contentBlock.getText();
    let matchArr;
    while ((matchArr = <HaveGroupsRegExpExecArray>rule.regex.exec(text)) !== null) {
      const start = matchArr.index;
      const end = start + matchArr[0].length;
      callback(start, end);
    }
  };
const blockDecorator: Array<DraftDecorator> = blockDecorationRule.map(rule => ({
  strategy: blockStrategy(rule),
  component: BlockDecoration,
  props: {
    category: rule.category,
    type: rule.type,
  },
}));

const inlineDecorator: Array<DraftDecorator> = inlineDecorationRule.map(rule => ({
  strategy: inlineStrategy(rule),
  component: InlineDecoration,
  props: {
    type: rule.type,
  },
}));
export const compoundDecorator = new CompoundDecoratora([...blockDecorator, ...inlineDecorator]);
