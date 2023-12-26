import { ThemeProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import { BrowserRouter } from "react-router-dom";

// MUI theme
import theme from "mui";

// containers
import Routes from "routes";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={3000}
        hideIconVariant
        preventDuplicate
      >
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
