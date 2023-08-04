import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Box } from "@mui/material";
import { store } from "@/rudex/store";
import TitleBar from "@/components/TitleBar/TitleBar";
import { appTheme } from "@/styles/themes";

export default function Layout({ children }: any) {
  return (
    <ThemeProvider theme={appTheme}>
      <Provider store={store}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <CssBaseline />
          <TitleBar />
          <Box
            sx={{
              height: "calc(100vh - 30px)",
              minHeight: 400, // tauri.config.jsonのwindows[0].minHeightが機能していないため。機能したら削除
              minWidth: 400, // tauri.config.jsonのwindows[0].minWidthが機能していないため。機能したら削除
              width: "100%",
            }}
          >
            {children}
          </Box>
        </LocalizationProvider>
      </Provider>
    </ThemeProvider>
  );
}
