import { Box, Icon, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { EditorBlock } from "draft-js";
import { useRouter } from "next/router";
import { BrowserNotSupported } from "@mui/icons-material";
import { DecoratorPropsType } from "@/components/Page/EditorPage/Editor/Decoration/DecorationComponents/decoratorPropsType";
import decodeOffsetKey from "@/components/Page/EditorPage/Editor/Functions/decodeOffsetKey";
import { useAppSelector } from "@/rudex/store";
import { Project } from "@/Functions/Files/project";
import getBlockValue from "@/components/Page/EditorPage/Editor/Functions/getBlockValue";
import { FigureBlockData } from "@/components/Page/EditorPage/Editor/Functions/contentAnalysis/dataType";
import LineRangeDispatcher from "@/components/Page/EditorPage/Editor/Decoration/CustomBlockComponent/LineRangeDispatcher";
import { DIV_Hide } from "@/components/Page/EditorPage/Editor/common.styled";

export default function Figure(props: DecoratorPropsType) {
  const { block, offsetKey } = props;
  const { blockKey } = decodeOffsetKey(offsetKey);
  const { text } = getBlockValue(block);
  const router = useRouter();
  const focused = useAppSelector(state => state.selection.blocks.includes(blockKey));

  const [fig, setFig] = useState("");
  const { data, depth } = getBlockValue<FigureBlockData>(block);
  const { alias, caption, count } = data;

  useEffect(() => {
    (async () => {
      const dirName = router.query.dirName as string;
      const project = new Project(dirName);
      const name = `${alias}.jpeg`;

      const names = await project.getImageList();
      if (names.includes(name)) {
        const image = await project.readImageBinary(name);
        setFig(image);
      } else {
        setFig("");
      }
    })();
  }, [alias]);

  return (
    <Box alignItems="center" display="flex" flexDirection="column" marginLeft={`${depth}em`}>
      <Box margin="1em auto">
        {fig ? (
          <Box component="img" src={fig} width="10cm" />
        ) : (
          <Box
            sx={{
              position: "relative",
            }}
          >
            <Skeleton
              sx={{
                display: "box",
                height: "200px",
                width: "300px",
              }}
              variant="rectangular"
             />
            <Icon
              sx={{
                color: "gray",
                left: "50%",
                margin: "auto",
                position: "absolute",
                top: "50%",
                transform: "translate(-50%,-50%)",
              }}
            >
              <BrowserNotSupported />
            </Icon>
          </Box>
        )}
      </Box>
      <DIV_Hide hide={!focused}>
        <LineRangeDispatcher blockKey={blockKey} text={text}>
          <EditorBlock {...props} />
        </LineRangeDispatcher>
      </DIV_Hide>
      {!focused && <div>{`図 - ${count} ${caption}`}</div>}
    </Box>
  );
}
