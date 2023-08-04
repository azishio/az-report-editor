/*
 compoundDecoratorのためか、インライン数式がある場所でキャレットの移動がうまくいかない。
 すべて標準の動作は無効化し、手動でキャレットの制御を行う。

 TODO: とにかく重い。矢印キーを長押しすると処理落ちするので処理の軽量化は必須。
 軽量化案：ブロック内のplainTextが変更されるまでrangeをキャッシュする (済)
 TODO: 文字数ではなく、座標ベースでキャレット位置を決定する
 */

import { Dispatch, KeyboardEvent, SetStateAction } from "react";
import { convertToRaw, EditorState } from "draft-js";
import { store } from "@/rudex/store";
import { clearFormulaPreviewState } from "@/rudex/FormulaPreview/FormulaPreviewSlice";
import { setSelection } from "@/rudex/Selection/SelectionSlice";

type SyntheticKeyboardEvent = KeyboardEvent<{}>;

class Selection {
  private static localOffset = 0;

  private currentBlockIndex;

  private readonly blocks;

  private selection;

  private currentBlockRange;

  private readonly shift;

  private currentLineIndex;

  constructor(editorState: EditorState, shift: boolean) {
    this.blocks = convertToRaw(editorState.getCurrentContent()).blocks;
    this.selection = editorState.getSelection();
    this.currentBlockRange = this.getLineRange(this.selection.getFocusKey());
    this.currentBlockIndex = this.blocks.findIndex(b => b.key === this.selection.getFocusKey());
    const offset = this.selection.getFocusOffset();
    this.currentLineIndex = this.currentBlockRange.findIndex(
      ([start, end]) => start <= offset && offset <= end
    );
    this.shift = shift;
  }

  up() {
    const isFirstLine = this.isFirstLine();
    const isFirstBlock = this.isFirstBlock();

    if (isFirstLine) {
      if (isFirstBlock) return this.returnSelection();
      // ブロック移動
      this.moveBlock("up");
      this.moveLine("last");
      return this.returnSelection();
    }
    // 行移動
    this.moveLine("up");
    return this.returnSelection();
  }

  down() {
    const isLastLine = this.isLastLine();
    const isLastBlock = this.isLastBlock();

    if (isLastLine) {
      if (isLastBlock) return this.returnSelection();
      // ブロック移動
      this.moveBlock("down");
      this.moveLine("first");
      return this.returnSelection();
    }
    // 行移動
    this.moveLine("down");
    return this.returnSelection();
  }

  right() {
    const isLastChar = this.isLastChar();
    const isLastLine = this.isLastLine();
    const isLastBlock = this.isLastBlock();

    if (isLastChar) {
      if (isLastLine) {
        if (isLastBlock) return this.returnSelection();
        // ブロック移動
        this.moveBlock("down");
        this.moveLine("first");
        this.moveChar("first");
        return this.returnSelection();
      }
      // 行移動
      this.moveLine("down");
      this.moveChar("first");
      return this.returnSelection();
    }
    // 文字移動
    this.moveChar("right");
    return this.returnSelection();
  }

  left() {
    const isFirstChar = this.isFirstChar();
    const isFirstLine = this.isFirstLine();
    const isFirstBlock = this.isFirstBlock();

    if (isFirstChar) {
      if (isFirstLine) {
        if (isFirstBlock) return this.returnSelection();
        // ブロック移動
        this.moveBlock("up");
        this.moveLine("last");
        this.moveChar("last");
        return this.returnSelection();
      }
      // 行移動
      this.moveLine("up");
      this.moveChar("last");
      return this.returnSelection();
    }
    // 文字移動
    this.moveChar("left");
    return this.returnSelection();
  }

  /**
   * 折り返しの判定
   * エディタ上の文字は一文字ずつ＜span class="characterCounter"＞＜\span＞にラップされている。
   * querySelectorAllですべて収集し、x座標を比較して端を見つける
   */
  private getLineRange(key: string) {
    console.log(store.getState().lineRange.range);
    return [...store.getState().lineRange.range[key]];
  }

  private isFirstChar() {
    const offset = this.selection.getFocusOffset();
    return this.currentBlockRange.some(([start]) => start === offset);
  }

  private isLastChar() {
    const offset = this.selection.getFocusOffset();
    return this.currentBlockRange.some(([, end]) => end === offset);
  }

  private isFirstLine() {
    return this.currentLineIndex === 0;
  }

  private isLastLine() {
    return this.currentLineIndex === this.currentBlockRange.length - 1;
  }

  private moveBlock(operation: "up" | "down") {
    if (operation === "up") {
      this.currentBlockIndex--;
    } else {
      this.currentBlockIndex++;
    }

    const newBlockKey = this.blocks[this.currentBlockIndex].key;

    this.set({ key: newBlockKey });

    this.currentBlockRange = this.getLineRange(newBlockKey);
  }

  private moveLine(operation: "up" | "down" | "first" | "last") {
    switch (operation) {
      case "up":
        this.currentLineIndex--;
        break;
      case "down":
        this.currentLineIndex++;
        break;
      case "first":
        this.currentLineIndex = 0;
        break;
      case "last":
        this.currentLineIndex = this.currentBlockRange.length - 1;
        break;
      default:
    }

    const [newLineStartOffset, newLineEndOffset] = this.currentBlockRange[this.currentLineIndex];

    const { localOffset } = Selection;
    const newOffset =
      newLineStartOffset + localOffset > newLineEndOffset
        ? newLineEndOffset
        : newLineStartOffset + localOffset;

    this.set({ offset: newOffset });
  }

  private moveChar(operation: "right" | "left" | "first" | "last") {
    const [lineStartOffset, lineEndOffset] = this.currentBlockRange[this.currentLineIndex];

    let offset = this.selection.getFocusOffset();
    switch (operation) {
      case "right":
        offset++;
        break;
      case "left":
        offset--;
        break;
      case "first":
        offset = lineStartOffset;
        break;
      case "last":
        offset = lineEndOffset;
        break;
      default:
    }

    this.set({ offset });

    Selection.localOffset = offset - lineStartOffset;
  }

  private set({ key, offset }: { key?: string; offset?: number } = {}) {
    key = key ?? this.selection.getFocusKey();
    offset = offset ?? this.selection.getFocusOffset();

    if (this.shift) {
      this.selection = this.selection.merge({
        focusKey: key,
        focusOffset: offset,
      });
    } else {
      this.selection = this.selection.merge({
        anchorKey: key,
        anchorOffset: offset,
        focusKey: key,
        focusOffset: offset,
      });
    }
  }

  private isFirstBlock() {
    return this.blocks[0].key === this.selection.getFocusKey();
  }

  private isLastBlock(key?: string) {
    key = key ?? this.selection.getFocusKey();
    return this.blocks.at(-1)!.key === key;
  }

  private returnSelection() {
    // isBackwardの更新
    let isBackward: boolean;

    const anchorBlockIndex = this.blocks.findIndex(b => b.key === this.selection.getAnchorKey());
    const focusBlockIndex = this.blocks.findIndex(b => b.key === this.selection.getFocusKey());

    if (anchorBlockIndex === focusBlockIndex) {
      isBackward = this.selection.getFocusOffset() < this.selection.getAnchorOffset();
    } else {
      isBackward = focusBlockIndex < anchorBlockIndex;
    }

    return this.selection.merge({ isBackward });
  }
}

const onArrowKey = (setEditorState: Dispatch<SetStateAction<EditorState>>) =>
  function (e: SyntheticKeyboardEvent): void {
    e.preventDefault();

    setEditorState(state => {
      const { key, shiftKey } = e;

      /*
       Anchorが後ろ、focusが前でないと選択がうまくいかない模様
       */

      const selection = new Selection(state, shiftKey);
      let newSelection;
      switch (key) {
        case "ArrowUp":
          newSelection = selection.up();
          break;

        case "ArrowDown":
          newSelection = selection.down();
          break;

        case "ArrowRight":
          newSelection = selection.right();
          break;

        case "ArrowLeft":
          newSelection = selection.left();
          break;

        default:
          newSelection = state.getSelection();
      }

      store.dispatch(
        setSelection({
          blockArr: convertToRaw(state.getCurrentContent()).blocks.map(b => b.key),
          endKey: newSelection.getEndKey(),
          endOffset: newSelection.getEndOffset(),
          startKey: newSelection.getStartKey(),
          startOffset: newSelection.getStartOffset(),
        })
      );
      store.dispatch(clearFormulaPreviewState());

      return EditorState.forceSelection(state, newSelection);
    });
  };

export default onArrowKey;
