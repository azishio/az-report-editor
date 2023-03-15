import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "src/styles/components/Editor/DecorationComponents/BlockDecoration.module.css";
import { RootState, store } from "@/rudex/store";

// Draft.js用のDecoratorComponent用のprops型定義はどこだ。。。
export function BlockDecoration(props: { [prop: string]: any }) {
  const myInfo = useSelector((state: RootState) => state.blockInfo[props.blockKey]);
  const [focused, setFocused] = useState(false);
  const focusedBlock = store.getState().selection.focusBlockKey;
  useEffect(() => {
    if (focusedBlock === props.blockKey) {
      setFocused(true);
    } else {
      setFocused(false);
    }
  }, [props.blockKey, focusedBlock]);

  let view;
  switch (myInfo.category) {
    case "header":
      view = <span>ヘッダー</span>;
      break;
    case "block-formula":
      const formulaCode = encodeURI("aaa");
      const formulaSvg = `https://latex.codecogs.com/svg.image?${formulaCode}`;
      break;
    default:
  }

  return (
    <span
      className={styles.wrapper}
      data-indent-lv={myInfo.indentLv}
      data-decoration-category={myInfo.category}
    >
      {props.children}
    </span>
  );
}
