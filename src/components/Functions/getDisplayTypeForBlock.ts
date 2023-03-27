// 現状print,editの状態わけが必要なのは行頭のみ
export const getDisplayTypeForBlock = (isBol: boolean, haveFocus: boolean) =>
  isBol && !haveFocus ? "print" : "edit";
