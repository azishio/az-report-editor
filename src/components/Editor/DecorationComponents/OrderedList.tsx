import styles from "src/styles/components/Editor/DecorationComponents/OrderedList.module.css";
import { DecoratorPropsType } from "@/components/Editor/DecorationComponents/decoratorPropsType";

const listLv = {
  "ordered-list-five": 5,
  "ordered-list-four": 3,
  "ordered-list-one": 0,
  "ordered-list-three": 2,
  "ordered-list-two": 1,
};

export function OrderedList(props: DecoratorPropsType) {
  const { children } = props;
  console.log("header", props);
  return (
    <span className={styles.wrapper} deta-depth={listLv}>
      {children}
    </span>
  );
}
