import { IconButton } from "@mui/material";
import { Close, Maximize, Minimize } from "@mui/icons-material";
import { appWindow } from "@tauri-apps/api/window";

export default function WindowButtons() {
  return (
    <div>
      <IconButton onClick={() => appWindow.minimize()} size="small">
        <Minimize fontSize="small" />
      </IconButton>
      <IconButton onClick={() => appWindow.toggleMaximize()} size="small">
        <Maximize fontSize="small" />
      </IconButton>
      <IconButton onClick={() => appWindow.close()} size="small">
        <Close fontSize="small" />
      </IconButton>
    </div>
  );
}
