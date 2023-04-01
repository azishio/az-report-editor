import styles from "src/styles/components/Editor/DecorationComponents/CustomBlockSign.module.css";
import { DecoratorPropsType } from "@/components/Editor/DecorationComponents/decoratorPropsType";
import { useAppSelector } from "@/rudex/store";

export function CustomBlockSigns(props: DecoratorPropsType) {
  const { blockKey, children } = props;

  const focused = useAppSelector(state => state.selection.focusBlockKey.has(blockKey));

  return (
    <span className={styles.wrapper} data-focused={focused}>
      {children}
    </span>
  );
}
