import { convertFromRaw, convertToRaw, EditorState, RawDraftContentBlock } from "draft-js";
import MultiCounter from "@/components/Page/EditorPage/Editor/Functions/contentAnalysis/multiCounter";
import SingleCounter from "@/components/Page/EditorPage/Editor/Functions/contentAnalysis/singleCounter";
import {
  HEADER_COUNTER_DELIMITER,
  ORDERED_LIST_COUNTER_END,
} from "@/components/Page/EditorPage/Editor/commonEditorValue";
import {
  FigureBlockData,
  FormulaBlockData,
  HeaderBlockData,
  OrderedListBlockData,
  TableBlockData,
} from "@/components/Page/EditorPage/Editor/Functions/contentAnalysis/dataType";

const headerType = [
  "header-one",
  "header-two",
  "header-three",
  "header-four",
  "header-five",
  "header-six",
] as const;

const regex = {
  figure: /^fig\.(?<alias>[0-9a-z]{2})\.(?<caption>.*)$/u,
  formulaSign: /^\$\$((?<left><)|(?<right>>))?((?<aligned>=)|(?<variation>=>))?$/u,
  header: /^(?<lv>#{1,6}) ([^ ].*)?(?<alias>\[.*\])?$/u,
  orderedList: /^\$(?<lv> {1,6})([^ ].*)?$/u,
  table: {
    cell: /(((?<center>-)|(?<right>>))?(?<colspan>\d+)?(,(?<rowspan>\d+))? )?.*/u,
    endOfTable: /^<!-- end-of-table -->$/u,
    getNamedTableCommand: /^tbl\.\S+\[\S+\]$/u,
    getNamelessTableCommand: /^tbl\._$/,
    nextRowSign: /^<!-- next-row -->/u,
    startTableSign: /^<!-- beginning-of-table -->$/u,
  },
  unOrderedList: /^\+(?<lv> {1,6})([^ ].*)?$/u,
} as const;

export default class ContentAnalyzer {
  // `${row}-${col}`を格納する
  private invalidCell = new Set<string>();

  private headerCounter = new MultiCounter(6);

  private tableCounter = new SingleCounter();

  private figureCounter = new SingleCounter();

  private indentByHeader = 0;

  private orderedListCounter = new MultiCounter(6);

  private readonly newBlocks;

  private isBlockFormula = false;

  private isTable = false;

  private readonly entityMap;

  private readonly state;

  private headerAlias: { [key: string]: string } = {};

  private figureAlias: { [key: string]: string } = {};

  private tableAlias: { [key: string]: string } = {};

  private cellLocation = {
    col: 0,
    row: 0,
  };

  constructor(state: EditorState) {
    const { blocks, entityMap } = convertToRaw(state.getCurrentContent());

    this.entityMap = entityMap;
    this.newBlocks = this.getNewBlock(blocks);

    this.state = state;
  }

  getAlias() {
    return {
      figure: this.figureAlias,
      header: this.headerAlias,
      table: this.tableAlias,
    };
  }

  getNewContent() {
    const newContentState = convertFromRaw({
      blocks: this.newBlocks,
      entityMap: this.entityMap,
    });

    const selectionState = this.state.getSelection();

    const { forceSelection, push, set } = EditorState;
    const stateNoUndo = set(this.state, { allowUndo: false });
    const newEditorState = forceSelection(
      push(stateNoUndo, newContentState, "change-block-type"),
      selectionState
    );
    return set(newEditorState, { allowUndo: true });
  }

  private isInvalidCell() {
    const { col, row } = this.cellLocation;
    return this.invalidCell.has(`${row}-${col}`);
  }

  private setInvalidCell(rowspan: number, colspan: number) {
    const { col, row } = this.cellLocation;

    for (let r = row; r <= row + rowspan; r++) {
      for (let c = col; c <= col + colspan; c++) {
        this.invalidCell.add(`${r}-${c}`);
      }
    }
  }

  private getNewBlock(blocks: RawDraftContentBlock[]): RawDraftContentBlock[] {
    return blocks.map((block, index) => {
      const newProps = this.getNewProps(block);
      const { type } = newProps;

      // --複数ブロックにわたる要素の判定--
      // formula
      if (type === "block-formula") {
        if (this.isBlockFormula) {
          this.isBlockFormula = false;
        } else if (blocks.some((b, i) => i > index && regex.formulaSign.test(b.text))) {
          // 以降のブロックに"$$"がある場合
          this.isBlockFormula = true;
        }
      }

      // table
      if (type === "table") {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const { subType } = newProps.data as TableBlockData;
        if (subType === "start") this.isTable = true;
        if (subType === "end") this.isTable = false;
      }

      return {
        ...block,
        depth: this.indentByHeader,
        ...newProps,
      };
    });
  }

  private getNewProps({ key, text }: { key: string; text: string }): {
    data:
      | HeaderBlockData
      | OrderedListBlockData
      | FigureBlockData
      | TableBlockData
      | FormulaBlockData
      | { [key: string | symbol | number]: never };
    depth?: number;
    type: string;
  } {
    let matchArr;
    /* eslint-disable no-cond-assign */

    // 途切れたらorderedListCounterをclearする必要があるため、先頭で処理すること
    if ((matchArr = regex.orderedList.exec(text)) !== null) {
      const listLv = matchArr.groups!.lv.length - 1;
      this.orderedListCounter.countUp(listLv);

      const count = `${this.orderedListCounter
        .getTo(listLv)
        .toString()}${ORDERED_LIST_COUNTER_END}`;

      return {
        data: {
          count,
        },
        depth: this.indentByHeader + listLv,
        type: "ordered-list-item",
      };
    }
    // 途切れたためclear
    this.orderedListCounter.clear();

    if ((matchArr = regex.header.exec(text)) !== null) {
      const headerLv = matchArr.groups!.lv.length - 1;
      const alias = matchArr.groups!.alias || null;

      if (alias) this.headerAlias[key] = alias;

      this.headerCounter.countUp(headerLv);
      this.indentByHeader = headerLv;

      return {
        data: {
          count: this.headerCounter
            .getUpTo(headerLv)
            .reduce(
              (previousValue, currentValue) =>
                `${previousValue}${currentValue.toString()}${HEADER_COUNTER_DELIMITER}`,
              ""
            ),
        },
        type: headerType[headerLv],
      };
    }

    if ((matchArr = regex.unOrderedList.exec(text)) !== null) {
      const listLv = matchArr.groups!.lv.length - 1;
      return {
        data: {},
        depth: this.indentByHeader + listLv,
        type: "unordered-list-item",
      };
    }

    if ((matchArr = regex.figure.exec(text)) !== null) {
      const caption = matchArr.groups!.caption || "";
      const { alias } = matchArr.groups!;

      this.figureAlias[key] = alias;

      return {
        data: {
          alias,
          caption,
          count: this.figureCounter.countUp(),
        },
        type: "figure",
      };
    }

    // formula
    if ((matchArr = regex.formulaSign.exec(text)) !== null) {
      if (this.isBlockFormula)
        return {
          data: { subType: "end" },
          type: "block-formula",
        };

      const { aligned, left, right, variation } = matchArr.groups!;

      let autoform: "aligned" | "variation" | null = null;
      if (aligned) autoform = "aligned";
      if (variation) autoform = "variation";

      let align: "center" | "left" | "right" = "center";
      if (left) align = "left";
      if (right) align = "right";

      return {
        data: {
          align,
          autoform,
          subType: "start",
        },
        type: "block-formula",
      };
    }

    if (this.isBlockFormula) {
      return {
        data: {
          subType: "content",
        },
        type: "block-formula",
      };
    }

    // table
    if (regex.table.startTableSign.test(text)) {
      return {
        data: {
          subType: "start",
        },
        type: "table",
      };
    }
    if (regex.table.endOfTable.test(text)) {
      this.orderedListCounter.clear();

      return {
        data: {
          subType: "end",
        },
        type: "table",
      };
    }

    // undecoratedと同じだが、フラグが立っているときのみcellとして扱う。
    // undecoratedの一つ上で処理すること
    if (this.isTable) {
      if (this.isInvalidCell())
        return {
          data: {
            subType: "invalid",
          },
          type: "table",
        };

      const { center, colspan, right, rowspan } = regex.table.cell.exec(text)!.groups!;

      let align: "left" | "center" | "right" = "left";
      if (right) align = "right";
      if (center) align = "center";

      const { parseInt } = Number;
      const rowspanNum = rowspan ? parseInt(rowspan, 10) : 0;
      const colspanNum = colspan ? parseInt(colspan, 10) : 0;

      if (colspan || rowspan) this.setInvalidCell(rowspanNum, colspanNum);

      this.cellLocation.row++;
      return {
        data: {
          align,
          colspan: colspanNum,
          rowspan: rowspanNum,
          subType: "cell",
        },

        type: "table",
      };
    }

    return {
      data: {},

      type: "undecorated",
    };
    /* eslint-enable no-cond-assign */
  }
}
