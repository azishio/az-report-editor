import styles from "@/styles/components/Editor/DecorationComponents/Indenter.module.css";
import { isBOL } from "@/components/Functions/isBOL";
import { useAppSelector } from "@/rudex/store";
import { DecoratorPropsType } from "@/components/Editor/DecorationComponents/decoratorPropsType";

export function ListChild(props: DecoratorPropsType) {
  const { blockKey, children, offsetKey } = props;
  const indent = useAppSelector(state => state.block.indentByHeader.get(blockKey)) || 0;

  return (
    <span className={styles.wrapper} data-indent-lv={isBOL(offsetKey) ? indent : 0}>
      <span>{children}</span>
    </span>
  );
}
