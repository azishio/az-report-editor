import { ContentBlock, ContentState, convertToRaw, EditorState } from "draft-js";

const headerType = [
  "header-one",
  "header-two",
  "header-three",
  "header-four",
  "header-five",
  "header-six",
];

const regex = {
  header: /^(?<lv>#{1,6}) .*$/u,
  orderedList: /^\d\.(?<lv> {1,6})/u,
  unOrderedList: /^\+(?<lv> {1,6})/u,
};

const getNewProps = (text: string) => {
  let matchArr;
  /* eslint-disable no-cond-assign */
  if ((matchArr = regex.header.exec(text)) !== null) {
    const headerLv = matchArr.groups!.lv.length - 1;
    return {
      depth: 0,
      type: headerType[headerLv],
    };
  }
  if ((matchArr = regex.orderedList.exec(text))) {
    return {
      depth: matchArr.groups!.lv.length - 1,
      type: "ordered-list-item",
    };
  }
  if ((matchArr = regex.unOrderedList.exec(text))) {
    return {
      depth: matchArr.groups!.lv.length - 1,
      type: "unordered-list-item",
    };
  }
  return {
    depth: 0,
    type: "undecorated",
  };
  /* eslint-enable no-cond-assign */
};

export const setBlockType = (editorState: EditorState) => {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const { blocks } = convertToRaw(contentState);
  const blockMap = editorState.getCurrentContent().getBlockMap();

  const changePoints: { change: "type" | "depth"; key: string; value: string | number }[] = [];
  blocks.forEach(block => {
    const { key, text } = block;
    const { depth, type } = getNewProps(text);

    if (block.type !== type)
      changePoints.push({
        change: "type",
        key,
        value: type,
      });
    if (block.depth !== depth)
      changePoints.push({
        change: "depth",
        key,
        value: depth,
      });
  });

  const newBlockMap = changePoints.reduce((newBlockMap, changePoint) => {
    const { change, key, value } = changePoint;
    const block = newBlockMap.get(key);
    const newBlock = block.set(change, value) as ContentBlock;
    return newBlockMap.set(key, newBlock);
  }, blockMap);

  const { forceSelection, push, set } = EditorState;
  const stateNoUndo = set(editorState, { allowUndo: false });
  const newEditorState = forceSelection(
    push(stateNoUndo, contentState.set("blockMap", newBlockMap) as ContentState, "insert-fragment"),
    selection
  );
  return EditorState.set(newEditorState, { allowUndo: true });
};
