import { DecoratorPropsType } from "@/components/Editor/DecorationComponents/decoratorPropsType";
import styled from "styled-components";
import { useAppSelector } from "@/rudex/store";

const SPAN_InlineDecoration = styled("span")`
  &[data-type="bold"] {
    font-weight: bold;
  }

  &[data-type="italic"] {
    font-style: italic;
  }

  &[data-type="superscript"] {
    vertical-align: super;
    font-size: 0.7em;
  }

  &[data-type="subscript"] {
    vertical-align: sub;
    font-size: 0.7em;
  }
`;

export function InlineDecoration(props: DecoratorPropsType) {
  const { blockKey, children, decoratedText, decorationName } = props;

  console.log(props);

  const content = decoratedText.slice(1, -1);
  const focused = useAppSelector(state =>
    state.selection.isFocusBlock(blockKey) ? state.selection.focusDecorationId.has(1000) : false
  );

  return (
    <SPAN_InlineDecoration data-type={decorationName}>
      {focused ? children : content}
    </SPAN_InlineDecoration>
  );
}
