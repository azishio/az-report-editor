import styles from "src/styles/components/Editor/DecorationComponents/InlineDecoration.module.css";
import { convertToRaw } from "draft-js";

export function InlineDecoration(props: { [prop: string]: any }) {
  console.log("props", props);
  console.log(convertToRaw(props.contentState));
  return (
    <span className={styles.wrapper} data-decoration-type={props.type} data-im="DECORATOR">
      {props.children}
    </span>
  );
}
