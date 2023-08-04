import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  breakpoints: {
    values: {
      lg: 1200,
      md: 900,
      sm: 650,
      xl: 1536,
      xs: 0,
    },
  },
  palette: { mode: "light" },
  typography: {
    button: {
      textTransform: "none",
    },
  },
});
