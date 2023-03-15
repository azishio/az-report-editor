//focusは別のスライス
import {
  BlockCategory,
  BlockType,
  depthMap,
  DepthMapKey,
} from "@/components/Editor/myDecorationType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CommonBlockInfoProperty = {
  category: Exclude<
    BlockCategory,
    "header" | "ordered-list" | "unordered-list"
  >;
  type: BlockType;
  content: string;
  indentLv: 0 | 1 | 2 | 3 | 4;
};
type HeaderBlockInfoProperty = {
  category: "header";
  type: BlockType;
  content: string;
  indentLv: 0 | 1 | 2 | 3 | 4;
  alias: string | null;
  count: Exclude<
      [number, ...number[]],
      [number, number, number, number, number, ...number[]]
  >; //1-5
};
type ListBlockInfoProperty = {
  category: "ordered-list" | "unordered-list";
  type: BlockType;
  content: string;
  indentLv: 0 | 1 | 2 | 3 | 4;
  count: Exclude<
      [number, ...number[]],
      [number, number, number, number, number, ...number[]]
  >;
};
type BlockInfo = {
  [blockKey: string]:
      | CommonBlockInfoProperty
      | HeaderBlockInfoProperty
      | ListBlockInfoProperty;
};
const initialState: BlockInfo = {};

type CommonPushAction = {
  category: Exclude<
      BlockCategory,
      "header" | "ordered-list" | "unordered-list"
  >;
  key: string;
  type: BlockType;
  content: string;
};
type HeaderPushAction = {
  category: "header";
  key: string;
  type: BlockType;
  content: string;
  depth: 0 | 1 | 2 | 3 | 4;
  alias: string | null;
};
type ListPushAction = {
  category: "ordered-list" | "unordered-list";
  key: string;
  type: BlockType;
  content: string;
  depth: 0 | 1 | 2 | 3 | 4;
};

type PushAction = CommonPushAction | HeaderPushAction | ListPushAction;
export const decorationSlice = createSlice({
  name    : "blockInfo",
  initialState,
  reducers: {
    clearBlockInfo   : (state) => {
      state = {};
    },
    cleanUpBlockInfo : (
        state,
        action: PayloadAction<{ blockArr: string[] }>
    ) => {
      const blockArr = action.payload.blockArr;

      const registeredBlockList = Object.keys(state);
      for (const key of registeredBlockList) {
        if (!blockArr.some((v) => v === key)) {
          delete state[key];
        }
      }
    },
    pushBlockInfo    : (state, action: PayloadAction<PushAction>) => {
      switch (action.payload.category) {
        case "header":
          state[action.payload.key] = {
            category: action.payload.category,
            type    : action.payload.type,
            content : action.payload.content,
            alias   : action.payload.alias,
            indentLv: depthMap[<DepthMapKey>action.payload.type],
            count   : [0], //reNumberで設定
          };
          break;
        case "ordered-list":
        case "unordered-list":
          state[action.payload.key] = {
            category: action.payload.category,
            type    : action.payload.type,
            content : action.payload.content,
            indentLv: 0, //reNumberで設定
            count   : [0], //reNumberで設定
          };
          break;
        default:
          state[action.payload.key] = {
            category: action.payload.category,
            type    : action.payload.type,
            content : action.payload.content,
            indentLv: 0, //reNumberで設定
          };
      }
    },
    reNumberBlockInfo: (
        state,
        action: PayloadAction<{ blockArr: string[] }>
    ) => {
      const blockArr = action.payload.blockArr;
    },
  },
});

export const {pushBlockInfo, cleanUpBlockInfo, reNumberBlockInfo} =
                 decorationSlice.actions;

export const blockInfoReducer = decorationSlice.reducer;
