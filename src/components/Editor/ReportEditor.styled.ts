import styled from "styled-components";

export const DIV_EditorStyle = styled("div")`
  font-size: 10.5pt;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 21pt;
    margin-bottom: 10.5pt;
    line-height: 1em;

    &:first-child {
      margin-top: 10.5pt;
    }

    & + :is(h1, h2, h3, h4, h5, h6) {
      margin-top: 10.5pt;
    }
  }

  ul,
  ol {
    margin: 1em 0;
  }
`;
