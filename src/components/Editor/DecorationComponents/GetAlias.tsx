import styles from "@/styles/components/Editor/DecorationComponents/GetAlias.module.css";
import { DecoratorPropsType } from "@/components/Editor/DecorationComponents/decoratorPropsType";
import { useAppSelector } from "@/rudex/store";

const aliasType = {
  getFigureAlias: "figure",
  getHeaderAlias: "header",
  getTableAlias: "table",
} as const;

export function GetAlias(props: DecoratorPropsType) {
  const { blockKey, children, decoratedText, decorationName } = props;
  console.log(props);

  const alias = (() => {
    switch (decorationName) {
      case "getHeaderAlias":
        return (
          (/\[header.(?<alias>.*)\]/u.exec(decoratedText) as RegExpExecArray).groups as {
            alias: string;
          }
        ).alias;
      case "getFigureAlias":
        return (
          (/\[fig.(?<alias>.*)\]/u.exec(decoratedText) as RegExpExecArray).groups as {
            alias: string;
          }
        ).alias;
      case "getTableAlias":
        return (
          (/\[table.(?<alias>.*)\]/u.exec(decoratedText) as RegExpExecArray).groups as {
            alias: string;
          }
        ).alias;
      default:
        return null;
    }
  })();

  const hasFocused = useAppSelector(state => state.selection.isFocusBlock(blockKey));

  const aliasedBlockKey = useAppSelector(
    state =>
      state.alias[aliasType[decorationName as keyof typeof aliasType]].get(
        alias as string /* 嘘 */
      ) || null
  );

  const aliasedNum = useAppSelector(state => {
    if (!aliasedBlockKey) return "Undefined Alias";
    return (
      state.block.counter[aliasType[decorationName as keyof typeof aliasType]].get(
        aliasedBlockKey
      ) as string
    ).slice(0, -1);
  });

  return (
    <span className={styles.wrapper}>
      <span className={styles.children}>{children}</span>
      <span className={styles.content} data-content-text={aliasedNum} />
    </span>
  );
}
