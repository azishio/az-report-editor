import { convertToRaw } from "draft-js";
import { useAppSelector } from "@/rudex/store";

export default function TableWrapper(props: any) {
  const { children }: { children: any[] } = props;
  const keyArr = children.map(v => v.key as string);

  const editPlain = useAppSelector(state => state.ui.viewAllSign);

  if (children.length < 2) return <div>{children}</div>;

  const blockArr = convertToRaw(children[0].props.children.props.contentState).blocks;

  // startとendだけ探した後forループしたほうが早いかも
  const contentArr = keyArr.map(key => blockArr.find(block => block.key === key)!.text);

  // セルに対応するchildrenのインデックスを格納する
  // 1行目：開始記号
  // 2行目：tableName[caption]
  // 3行目以降：セル
  // 最後：終端記号
  const cellList = contentArr.reduce(
    (previousValue, line, lineIndex) => {
      if (lineIndex <= 2 || lineIndex === contentArr.length - 1) return previousValue;

      if (line === "<!-- next-row -->") {
        previousValue.push([]);
        return previousValue;
      }

      previousValue.at(-1)!.push(lineIndex);
      return previousValue;
    },
    [[]] as number[][]
  );

  if (editPlain) {
    return <div>{children}</div>;
  }
  return (
    <table>
      <caption>{contentArr[1]}</caption>
      <tbody>
        {cellList.map(r => (
          <tr>
            {r.map(d => (
              <td>{children[d]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
