export const blockDecorationRule = [
  {
    category: "header",
    type: "header-one",
    regex: /^# (?<content>.*)(\[(?<alias>.+)\])?$/gu,
  },
  {
    category: "header",
    type: "header-two",
    regex: /^#{2} (?<content>.*)(\[(?<alias>.+)\])?$/gu,
  },
  {
    category: "header",
    type: "header-three",
    regex: /^#{3} (?<content>.*)(\[(?<alias>.+)\])?$/gu,
  },
  {
    category: "header",
    type: "header-four",
    regex: /^#{4} (?<content>.*)(\[(?<alias>.+)\])?$/gu,
  },
  {
    category: "header",
    type: "header-five",
    regex: /^#{5} (?<content>.*)(\[(?<alias>.+)\])?$/gu,
  },
  {
    category: "unordered-list",
    type: "unordered-list-one",
    regex: /^\+ (?<content>.*)$/gu,
  },
  {
    category: "unordered-list",
    type: "unordered-list-two",
    regex: /^\+ {2}(?<content>.*)$/gu,
  },
  {
    category: "unordered-list",
    type: "unordered-list-three",
    regex: /^\+ {3}(?<content>.*)$/gu,
  },
  {
    category: "unordered-list",
    type: "unordered-list-four",
    regex: /^\+ {4}(?<content>.*)$/gu,
  },
  {
    category: "unordered-list",
    type: "unordered-list-five",
    regex: /^\+ {5}(?<content>.*)$/gu,
  },
  {
    category: "ordered-list",
    type: "ordered-list-one",
    regex: /^\d\. (?<content>.*)$/gu,
  },
  {
    category: "ordered-list",
    type: "ordered-list-two",
    regex: /^\d\. {2}(?<content>.*)$/gu,
  },
  {
    category: "ordered-list",
    type: "ordered-list-three",
    regex: /^\d\. {3}(?<content>.*)$/gu,
  },
  {
    category: "ordered-list",
    type: "ordered-list-four",
    regex: /^\d\. {4}(?<content>.*)$/gu,
  },
  {
    category: "ordered-list",
    type: "ordered-list-five",
    regex: /^\d\. {5}(?<content>.*)$/gu,
  },
  {
    category: "block-formula",
    type: "block-formula",
    regex: /^\$(?<content>.*)\$$/gu,
  },
] as const;
export type BlockDecorationRule = (typeof blockDecorationRule)[number];
const blockCategory = blockDecorationRule.map(v => v.category);
export type BlockCategory = (typeof blockCategory)[number];
const blockType = blockDecorationRule.map(v => v.type);
export type BlockType = (typeof blockType)[number];

export const depthMap = {
  "header-one": 0,
  "header-two": 1,
  "header-three": 2,
  "header-four": 3,
  "header-five": 4,
  "ordered-list-one": 0,
  "ordered-list-two": 1,
  "ordered-list-three": 2,
  "ordered-list-four": 3,
  "ordered-list-six": 4,
  "unordered-list-one": 0,
  "unordered-list-two": 1,
  "unordered-list-three": 2,
  "unordered-list-four": 3,
  "unordered-list-six": 4,
} as const;
export type DepthMapKey = keyof typeof depthMap;
export const inlineDecorationRule = [
  {
    type: "escape",
    regex: /\\(?<content>.)/gu,
  },
  {
    type: "line-break",
    regex: /(?<content> {2})/gu, // 保存する必要はないけど、group.contentのnullチェックをサボるため
  },
  {
    type: "bold",
    regex: /\*(?<content>[^*]*)\*/gu,
  },
  {
    type: "italic",
    regex: /\/(?<content>[^/]*)\//gu,
  },
  {
    type: "strikethrough",
    regex: /-(?<content>[^-]*)-/gu,
  },
  {
    type: "subscript",
    regex: /_(?<content>[^_]*)_/gu,
  },
  {
    type: "superscript",
    regex: /\^(?<content>[^^]*)\^/gu,
  },
] as const;
// effectiveBlockを追加してもいいかも
export type InlineDecorationRule = (typeof inlineDecorationRule)[number];
export type InlineCategory = (typeof blockCategory)[number];
const inlineType = blockDecorationRule.map(v => v.type);
export type inlineType = (typeof blockType)[number];
