import { RawDraftContentBlock } from "draft-js";
import generateRandomKey from "draft-js/lib/generateRandomKey";

class Table {
  private readonly table: RawDraftContentBlock[][] = [[]];

  private row = 0;

  private col = 0;

  private blocks: RawDraftContentBlock[];

  private readonly start: number;

  private readonly length: number;

  constructor(blocks: RawDraftContentBlock[], start: number, length: number) {
    this.blocks = blocks;
    this.start = start;
    this.length = length;
    let rowCount = 0;
    blocks.slice(start, start + length).forEach(
      block => {
        switch (block.text) {
          case "<!-- next-row -->":
            this.table.push([]);
            if (this.row < rowCount) this.row = rowCount;
            rowCount = 0;
            break;
          default:
            this.table.at(-1)!.push(block);
            rowCount++;
        }
      },
      [[]] as RawDraftContentBlock[][]
    );

    this.col = this.table.length;

    // 列数が合わなかったら最大に合わせる。
    this.table.forEach(row => {
      while (row.length === this.row) {
        row.push(Table.generateEmptyBlock());
      }
    });
  }

  static newTable(blocks: RawDraftContentBlock[], currentBlockIndex: number) {
    const newTable = Array.from({ length: 4 }, () =>
      Array.from({ length: 3 }, () => Table.generateEmptyBlock())
    );
    return blocks.splice(currentBlockIndex, 1, ...Table.tableToBlocks(newTable));
  }

  static generateEmptyBlock() {
    return {
      depth: 0,
      entityRanges: [],
      inlineStyleRanges: [],
      key: generateRandomKey(),
      text: "",
      type: "table",
    };
  }

  static generateNewRowBlock() {
    return {
      depth: 0,
      entityRanges: [],
      inlineStyleRanges: [],
      key: generateRandomKey(),
      text: "<!-- next-row -->",
      type: "table",
    };
  }

  static tableToBlocks(table: RawDraftContentBlock[][]) {
    const tableBlocks: RawDraftContentBlock[] = [];
    table.forEach(row => {
      tableBlocks.push(...row);
      tableBlocks.push(Table.generateNewRowBlock());
    });
    return tableBlocks;
  }

  addRow(currentRow: number, direction: "top" | "bottom") {
    return this.returnBlocks(
      this.table.splice(
        currentRow,
        0,
        Array.from({ length: this.row }, () => Table.generateNewRowBlock())
      )
    );
  }

  addCal(currentCol: number, direction: "left" | "right") {
    return this.returnBlocks(
      this.table.map(row => row.splice(currentCol, 0, Table.generateEmptyBlock()))
    );
  }

  deleteRow(currentRow: number) {
    return this.returnBlocks(this.table.splice(currentRow, 1));
  }

  deleteCal(currentCol: number) {
    return this.returnBlocks(this.table.map(row => row.splice(currentCol, 1)));
  }

  private returnBlocks(newTable: RawDraftContentBlock[][]) {
    return this.blocks.splice(this.start, this.length, ...Table.tableToBlocks(newTable));
  }
}
