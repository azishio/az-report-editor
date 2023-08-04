import { Box, Fade, Paper } from "@mui/material";
import { InlineMath } from "react-katex";
import { useAppSelector } from "@/rudex/store";

function FormulaPreview() {
  const { bottom, left, show, text } = useAppSelector(state => state.formulaPreview.formula);
  console.log(show);
  return (
    <Box
      sx={{
        left,
        position: "fixed",
        top: bottom,
        zIndex: 10,
      }}
    >
      <Fade in={show}>
        <Paper
          sx={{
            padding: "10px",
            width: "fit-content",
          }}
        >
          <Box sx={{ fontSize: "10px" }}>preview：</Box>
          <InlineMath>{text}</InlineMath>
        </Paper>
      </Fade>
    </Box>
  );
}

export default FormulaPreview;
