import { EditorBlock } from "draft-js";
import { Box } from "@mui/material";
import { CustomBlockProps } from "@/components/Page/EditorPage/Editor/Decoration/CustomBlockComponent/commonType";
import getBlockValue from "@/components/Page/EditorPage/Editor/Functions/getBlockValue";
import LineRangeDispatcher from "@/components/Page/EditorPage/Editor/Decoration/CustomBlockComponent/LineRangeDispatcher";

export default function Undecorated(props: CustomBlockProps) {
  const { block } = props;
  const { blockKey, depth, text } = getBlockValue(block);

  return (
    <Box
      sx={{
        lineHeight: "11pt",
        marginLeft: `${depth}em`,
      }}
    >
      <LineRangeDispatcher blockKey={blockKey} text={text}>
        <EditorBlock {...props} />
      </LineRangeDispatcher>
    </Box>
  );
}
