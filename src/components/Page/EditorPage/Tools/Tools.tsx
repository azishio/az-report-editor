import { Box, IconButton, Tooltip } from "@mui/material";
import { Code, CodeOff, Help, Print } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "@/rudex/store";
import { toggleViewAllSign } from "@/rudex/UI/UiSlice";

export default function Tools() {
  const viewAllSign = useAppSelector(state => state.ui.viewAllSign);
  const dispatch = useAppDispatch();
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "nowrap",
        margin: "0 auto",
        maxWidth: "210mm",
        position: "sticky",
        top: "10px",
      }}
    >
      <Box sx={{ marginLeft: "auto" }}>
        <Tooltip title="修飾記号を表示">
          <IconButton
            onClick={() => {
              dispatch(toggleViewAllSign());
            }}
          >
            {viewAllSign ? <CodeOff /> : <Code />}
          </IconButton>
        </Tooltip>
        <Tooltip title="印刷(未実装)">
          <IconButton>
            <Print />
          </IconButton>
        </Tooltip>
        <Tooltip title="ヘルプ(未実装)">
          <IconButton>
            <Help />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
