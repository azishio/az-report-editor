import { DecoratorPropsType } from "@/components/Editor/DecorationComponents/decoratorPropsType";
import { EditorBlock } from "draft-js";

export function Header(props: DecoratorPropsType) {
  return (
    <div data-im="HEADER">
      <EditorBlock {...props} />
    </div>
  );
}
