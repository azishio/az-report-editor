import styles from "src/styles/components/Editor/DecorationComponents/SetAlias.module.css";
import { DecoratorPropsType } from "@/components/Editor/DecorationComponents/decoratorPropsType";
import { useAppDispatch } from "@/rudex/store";
import { deleteAlias, setAlias } from "@/rudex/Alias/AliasSlice";
import { useEffect } from "react";

const aliasType = {
  setFigureAlias: "figure",
  setHeaderAlias: "header",
  setTableAlias: "table",
} as const;

export function SetAlias(props: DecoratorPropsType) {
  const { children, blockKey, decoratedText, decorationName } = props;
  const dispatch = useAppDispatch();
  const alias = decoratedText.slice(1, -1);
  console.log("alias", alias);

  useEffect(() => {
    dispatch(
      setAlias({
        alias,
        blockKey,
        category: "header",
      })
    );
    return () => {
      dispatch(
        deleteAlias({
          blockKey,
          category:
            aliasType[decorationName as "setHeaderAlias" | "setFigureAlias" | "setTableAlias"],
        })
      );
    };
  });

  dispatch(
    setAlias({
      alias,
      blockKey,
      category: "header",
    })
  );
  return <span className={styles.wrapper}>{children}</span>;
}
