// eslint-disable-next-line max-classes-per-file
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DecoratorRange } from "@azishio/draft-compound-decorator/dist/types";
import { HEADER_COUNTER_DELIMITER } from "@/components/Editor/commonEditorValue";

type Category = "header" | "figure" | "table" | "orderedList";
export type BlockState = {
  changes: {
    addBlock: Set<string>;
    // blockType
    beforeBlockNum: number;
    // blockType
    deleteBlock: Set<string>;
  };
  counter: { [category in Category]: Map<string, string> };
  decorationMap: Map<string, DecoratorRange[][]>;
  decorationType: Map<string, string>;
  // blockDecoratorで登録

  indentByHeader: Map<string, number>;
};

const initialState: BlockState = {
  changes: {
    addBlock: new Set(),
    beforeBlockNum: 0,
    deleteBlock: new Set(),
  },
  counter: {
    figure: new Map(),
    header: new Map(),
    orderedList: new Map(),
    table: new Map(),
  },
  decorationMap: new Map(),
  decorationType: new Map(),
  indentByHeader: new Map(),
};

// reducers内で使用

const headerType = [
  "header-one",
  "header-two",
  "header-three",
  "header-four",
  "header-five",
] as const;
const isHeader = (blockType: string): blockType is (typeof headerType)[number] =>
  (<readonly string[]>headerType).includes(blockType);

const orderedListType = [
  "ordered-list-five",
  "ordered-list-four",
  "ordered-list-one",
  "ordered-list-three",
  "ordered-list-two",
] as const;
const isOrderedList = (blockType: string): blockType is (typeof orderedListType)[number] =>
  (<readonly string[]>orderedListType).includes(blockType);

const indentLv = {
  "header-five": 4,
  "header-four": 3,
  "header-one": 0,
  "header-three": 2,
  "header-two": 1,
  "ordered-list-five": 4,
  "ordered-list-four": 3,
  "ordered-list-one": 0,
  "ordered-list-three": 2,
  "ordered-list-two": 1,
  "unordered-list-five": 4,
  "unordered-list-four": 3,
  "unordered-list-one": 0,
  "unordered-list-three": 2,
  "unordered-list-two": 1,
};

class MultiCounter {
  private readonly count: [number, number, number, number, number];

  private update: boolean;

  constructor() {
    this.count = [0, 0, 0, 0, 0];
    this.update = false;
  }

  reset() {
    if (this.update) {
      this.update = false;

      for (let i = 0; i < 5; i++) {
        this.count[i] = 0;
      }
    }
  }

  countUp(type: keyof typeof indentLv) {
    this.update = true;

    const index = indentLv[type];
    this.count[index]++;

    for (let i = index + 1; i < 5; i++) {
      this.count[i] = 0;
    }
  }

  getUpTo(type: keyof typeof indentLv) {
    const index = indentLv[type];
    return this.count
      .slice(0, index + 1)
      .reduce(
        (previousValue, currentValue) =>
          `${previousValue}${currentValue.toString()}${HEADER_COUNTER_DELIMITER}`,
        ""
      );
  }

  getTo(type: keyof typeof indentLv) {
    return `${this.count[indentLv[type]]}`;
  }
}

class SingleCounter {
  private count: number;

  constructor() {
    this.count = 0;
  }

  countUp() {
    return (++this.count).toString();
  }
}

export const blockSlice = createSlice({
  initialState,
  name: "block",
  reducers: {
    // もっといい名前あるかも
    cleanUp: (state, action: PayloadAction<Set<string>>) => {
      const blockSet = action.payload;
      const { size } = blockSet;
      const { changes, decorationMap, indentByHeader } = state;
      const { beforeBlockNum } = changes;
      // 存在しないkeyの情報を削除
      if (beforeBlockNum > size) {
        changes.beforeBlockNum = size;

        decorationMap.forEach((v, k) => {
          if (!blockSet.has(k)) {
            decorationMap.delete(k);
          }
        });

        indentByHeader.forEach((v, k) => {
          if (!blockSet.has(k)) {
            indentByHeader.delete(k);
          }
        });
      }
    },

    clearChanges: state => {
      const { addBlock, deleteBlock } = state.changes;
      addBlock.clear();
      deleteBlock.clear();
    },

    runningCounters: (state, action: PayloadAction<Set<string>>) => {
      const blockSet = action.payload;
      const { changes, decorationType, indentByHeader } = state;
      const { addBlock, deleteBlock } = changes;

      // headerのカウント,行間管理
      // headerの更新が重いようであればレベルによって更新する範囲を書き分ける
      if (headerType.some(v => addBlock.has(v) || deleteBlock.has(v))) {
        const counter = new MultiCounter();
        const { header } = state.counter;
        header.clear();

        blockSet.forEach(blockKey => {
          const blockType = decorationType.get(blockKey) as string;
          if (isHeader(blockType)) {
            // カウント
            counter.countUp(blockType);
            header.set(blockKey, counter.getUpTo(blockType));
          }
        });
      }

      // orderedListのカウント,インデント
      if (
        orderedListType.some(v => addBlock.has(v) || deleteBlock.has(v)) ||
        addBlock.has("listChild") ||
        deleteBlock.has("listChild")
      ) {
        const counter = new MultiCounter();
        const { orderedList } = state.counter;
        orderedList.clear();

        blockSet.forEach(blockKey => {
          const blockType = decorationType.get(blockKey)!;

          if (isOrderedList(blockType)) {
            counter.countUp(blockType);
            orderedList.set(blockKey, counter.getTo(blockType));
          } else {
            counter.reset();
          }
        });
      }

      // figureのカウント
      if (addBlock.has("figure") || deleteBlock.has("figure")) {
        const counter = new SingleCounter();
        const { figure } = state.counter;
        figure.clear();

        blockSet.forEach(blockKey => {
          const blockType = decorationType.get(blockKey)!;
          if (blockType === "figure") {
            figure.set(blockKey, counter.countUp());
          }
        });
      }

      // tableのカウント
      if (addBlock.has("table") || deleteBlock.has("table")) {
        const counter = new SingleCounter();
        const { table } = state.counter;
        table.clear();

        blockSet.forEach(blockKey => {
          const blockType = decorationType.get(blockKey)!;
          if (blockType === "table") {
            table.set(blockKey, counter.countUp());
          }
        });
      }

      // headerによるインデントの決定
      indentByHeader.clear();
      let indent = 0;
      blockSet.forEach(blockKey => {
        const blockType = decorationType.get(blockKey)!;
        if (isHeader(blockType)) {
          indent = indentLv[blockType];
        }
        indentByHeader.set(blockKey, indent);
      });
    },

    setBlockType: (state, action: PayloadAction<{ blockKey: string; decorationName: string }>) => {
      const { blockKey, decorationName } = action.payload;

      const beforeDecorationType = state.decorationType.get(blockKey);

      if (beforeDecorationType) {
        if (beforeDecorationType === decorationName) return;

        state.changes.deleteBlock.add(beforeDecorationType);
      }
      state.changes.addBlock.add(decorationName);
      state.decorationType.set(blockKey, decorationName);
    },

    setDecorationMap(
      state,
      action: PayloadAction<{ blockKey: string; decorationMap: DecoratorRange[][] }>
    ) {
      const { blockKey, decorationMap } = action.payload;
      state.decorationMap.set(blockKey, decorationMap);
    },

    // correct時に
    setIndent(state, action: PayloadAction<{ blockKey: string; indent: number }>) {
      const { blockKey, indent } = action.payload;
      state.indentByHeader.set(blockKey, indent);
    },
  },
});

export const { cleanUp, clearChanges, runningCounters, setBlockType, setDecorationMap } =
  blockSlice.actions;

export const blockReducer = blockSlice.reducer;
