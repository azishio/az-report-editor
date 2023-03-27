import styles from "src/styles/components/Editor/DecorationComponents/InlineDecoration.module.css";
import { convertToRaw } from "draft-js";
import { DecoratorPropsType } from "@/components/Editor/DecorationComponents/decoratorPropsType";

export function InlineDecoration(props: DecoratorPropsType) {
  console.log("props", props);
  const { children, decorationName, contentState } = props;
  console.log(convertToRaw(contentState));
  return (
    <span className={styles.wrapper} data-decoration-name={decorationName}>
      {children}
    </span>
  );
}
