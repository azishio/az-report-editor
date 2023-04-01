import styled from "styled-components";

export const DIV_CommonBlockStyle = styled("div")<{ indent: number }>`
  display: flex;

  * {
    display: inline;
  }

  margin-left: ${props => (props.indent ? props.indent : "0")}em;
`;

type InFocusProp = {
  focused: boolean;
  focusedContent?: string;
  unfocusedContent?: string;
};
export const SPAN_InFocusPseudoElements = styled("span").attrs<InFocusProp>(props => ({
  focused: props.focused,
  focusedContent: props.focusedContent || "",
  unfocusedComponent: props.unfocusedContent || "",
}))<InFocusProp>`

  &::before {
    content: "${({ focused, focusedContent, unfocusedContent }) =>
      focused ? focusedContent : unfocusedContent}";
    white-space: nowrap;

`;
