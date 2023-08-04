import { Box } from "@mui/material";
import ReportEditor from "@/components/Page/EditorPage/Editor/ReportEditor";
import Tools from "@/components/Page/EditorPage/Tools/Tools";
import DropZone from "@/components/Page/EditorPage/ResourceBox/DropZone";
import ResourceBox from "@/components/Page/EditorPage/ResourceBox/ResourceBox";

export default function EditorPage() {
  return (
    <DropZone>
      <Box
        sx={{
          background: "whitesmoke",
          display: "flex",
          height: "100%",
          position: "relative",
          width: "100%",
        }}
      >
        <ResourceBox />
        <Box
          sx={{
            flex: 1,
            height: "100%",
            overflow: "scroll",
            position: "relative",
          }}
        >
          <Tools />
          <Box
            sx={{
              margin: "0 auto",
              width: "fit-content",
            }}
          >
            <ReportEditor />
          </Box>
        </Box>
      </Box>
    </DropZone>
  );
}
