import styles from "src/styles/components/Editor/DecorationComponents/UnorderedList.module.css";
import { DecoratorPropsType } from "@/components/Editor/DecorationComponents/decoratorPropsType";
import { isBOL } from "@/components/Functions/isBOL";
import { useAppSelector } from "@/rudex/store";
import { getDisplayTypeForBlock } from "@/components/Functions/getDisplayTypeForBlock";
import { getStringWithoutSymbols } from "@/components/Functions/getStringWithoutSymbols";

const listLv = {
  "unordered-list-five": 5,
  "unordered-list-four": 3,
  "unordered-list-one": 0,
  "unordered-list-three": 2,
  "unordered-list-two": 1,
};

export function UnorderedList(props: DecoratorPropsType) {
  const { blockKey, children, decoratedText, decorationName, offsetKey } = props;

  const isBol = isBOL(offsetKey);
  const haveFocus = useAppSelector(state => state.selection.focusBlockKey.has(blockKey));

  const displayType = getDisplayTypeForBlock(isBol, haveFocus);

  const content = getStringWithoutSymbols("unordered-list", decoratedText, isBol);

  return (
    <span
      className={styles.wrapper}
      data-display-type={displayType}
      data-indent-depth={isBol ? listLv[decorationName as keyof typeof listLv] : "none"}
    >
      <span className={styles.bullet} data-bullet="・" />
      <span className={styles.children}>{children}</span>
      <span className={styles.content} data-content-text={content} />
    </span>
  );
}
