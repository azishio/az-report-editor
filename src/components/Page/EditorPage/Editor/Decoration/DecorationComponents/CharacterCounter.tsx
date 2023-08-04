import { DecoratorPropsType } from "@/components/Page/EditorPage/Editor/Decoration/DecorationComponents/decoratorPropsType";

function CharacterCounter(props: DecoratorPropsType) {
  const { children } = props;
  return <span className="characterCounter">{children}</span>;
}

export default CharacterCounter;
