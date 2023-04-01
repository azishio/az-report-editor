import { useDispatch } from "react-redux";
import { setBlockType } from "@/rudex/Block/BlockSlice";
import { DecoratorPropsType } from "@/components/Editor/DecorationComponents/decoratorPropsType";

export function Figure(props: DecoratorPropsType) {
  const dispatch = useDispatch();
  const { blockKey, children, decorationName } = props;

  dispatch(
    setBlockType({
      blockKey,
      decorationName,
    })
  );

  return (
    <span>
      <span>{children}</span>
    </span>
  );
}
