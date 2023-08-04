import { Box, Collapse, IconButton, Paper } from "@mui/material";
import { useState } from "react";
import { ArrowBackIosNew, ImageSearch } from "@mui/icons-material";
import Images from "@/components/Page/EditorPage/ResourceBox/Images";

export default function ResourceBox() {
  const [openImages, setOpenImages] = useState(false);

  return (
    <Paper
      elevation={2}
      sx={{
        "::-webkit-scrollbar": {
          display: "none",
        },
        display: "flex",
        // 15pxはmargenTopの分
        height: "calc(100% - 15px)",
        marginTop: "15px",
        position: "relative",
        transition: "500ms",
      }}
    >
      <Collapse in={openImages} orientation="horizontal">
        <Images />
      </Collapse>
      <Box position="sticky" top="0">
        <IconButton onClick={() => setOpenImages(!openImages)}>
          {openImages ? <ArrowBackIosNew /> : <ImageSearch />}
        </IconButton>
      </Box>
    </Paper>
  );
}
