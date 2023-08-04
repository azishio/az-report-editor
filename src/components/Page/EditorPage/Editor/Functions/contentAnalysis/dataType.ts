export type HeaderBlockData = {
  count: string;
};

export type FigureBlockData = {
  alias: string;
  caption: string;
  count: number;
};

export type OrderedListBlockData = {
  count: string;
};

type TableCellBlockData = {
  align: "center" | "left" | "right";
  colspan: number;
  rowspan: number;
  subType: "cell";
};

type TableSignBlockData = {
  subType: "invalid" | "nextCol" | "start" | "end";
};

type TableInfoBlockData = {
  alias: string;
  caption: string;
  count: string;
  subType: "info";
};

export type TableBlockData = TableCellBlockData | TableInfoBlockData | TableSignBlockData;

type FormulaStartBlockData = {
  align: "center" | "left" | "right";
  autoform: "aligned" | "variation" | null /* 式の変形 */;
  subType: "start";
};

export type FormulaBlockData =
  | {
      subType: "content" | "end";
    }
  | FormulaStartBlockData;
