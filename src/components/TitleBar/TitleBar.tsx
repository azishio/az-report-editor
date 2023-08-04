import { AppBar, Box, IconButton } from "@mui/material";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Home } from "@mui/icons-material";
import { styled } from "@mui/system";

const WindowButtons = dynamic(() => import("@/components/TitleBar/WindowButtons"), {
  ssr: false,
});

const AppBar_TitleBar = styled(AppBar)({
  display: "flex",
  flexDirection: "row",
  height: 30,
  justifyContent: "space-between",
  position: "sticky",
  width: "100%",
});

export default function TitleBar() {
  const router = useRouter();
  const directoryName = router.query.dirName as string;
  const projectName = router.pathname.match("edit")
    ? /\d*_(?<projectName>.*)/gu.exec(directoryName)?.groups?.projectName
    : null;
  return (
    <AppBar_TitleBar data-tauri-drag-region>
      <IconButton onClick={() => router.push("/")} size="small" sx={{ position: "sticky" }}>
        <Home />
      </IconButton>

      <Box
        flexShrink="1"
        overflow="hidden"
        padding="0 30px"
        sx={{ pointerEvents: "none" }}
        textAlign="center"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
        width="calc(100% - 150px)"
      >
        {projectName}
      </Box>
      <WindowButtons />
    </AppBar_TitleBar>
  );
}
