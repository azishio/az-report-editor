import styles from "src/styles/components/Editor/DecorationComponents/Header.module.css";
import { useDispatch } from "react-redux";
import { setBlockType } from "@/rudex/Block/BlockSlice";
import { useAppSelector } from "@/rudex/store";
import { isBOL } from "@/components/Functions/isBOL";
import { getStringWithoutSymbols } from "@/components/Functions/getStringWithoutSymbols";
import { DecoratorPropsType } from "@/components/Editor/DecorationComponents/decoratorPropsType";
import { getDisplayTypeForBlock } from "@/components/Functions/getDisplayTypeForBlock";

export function Header(props: DecoratorPropsType) {
  const dispatch = useDispatch();
  const { blockKey, children, decoratedText, decorationName, offsetKey } = props;
  console.log(props);

  dispatch(
    setBlockType({
      blockKey,
      decorationName,
    })
  );

  const counter = useAppSelector(state => state.block.counter.header.get(blockKey));

  const isBol = isBOL(offsetKey);
  const haveFocus = useAppSelector(state => state.selection.focusBlockKey.has(blockKey));

  const displayType = getDisplayTypeForBlock(isBol, haveFocus);

  const content = getStringWithoutSymbols("header", decoratedText, isBol);

  const isFirstHeader = useAppSelector(state => state.block.headerSpacing.firstHeader === blockKey);
  const toplessSpace = useAppSelector(state =>
    state.block.headerSpacing.needlessTopSpace.has(blockKey)
  );
  let spacingType = "top2_bottom1";
  if (isFirstHeader) {
    spacingType = "top1_bottom1";
  } else if (toplessSpace) {
    spacingType = "top0_bottom1";
  }

  return (
    <span
      className={styles.wrapper}
      data-display-type={displayType}
      data-spacing-type={spacingType}
    >
      <span className={styles.counter} data-counter-num={counter} />
      <span className={styles.children}>{children}</span>
      <span className={styles.content} data-content-text={content} />
    </span>
  );
}
