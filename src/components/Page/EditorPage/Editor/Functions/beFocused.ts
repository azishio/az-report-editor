import { RootState } from "@/rudex/store";

type Argument = {
  blockKey: string;
  end: number;
  includeEdge?: boolean;
  start: number;
  state: RootState;
};

const beFocused = ({ blockKey, end, includeEdge = true, start, state }: Argument) => {
  const { blocks, endOffset, startOffset } = state.selection;

  const contentStart = includeEdge ? start : start + 1;
  const contentEnd = includeEdge ? end + 1 : end;

  if (blocks.length === 1) {
    if (blockKey === blocks[0] && startOffset <= contentEnd && contentStart <= endOffset)
      return true;
  } else {
    if (blocks.slice(1, -1).includes(blockKey)) return true;

    if (blockKey === blocks[0] && startOffset <= contentEnd) return true;
    if (blockKey === blocks.at(-1) && contentStart <= endOffset) return true;
    return false;
  }
  return false;
};

export default beFocused;
