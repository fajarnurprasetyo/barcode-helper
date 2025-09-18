import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TourProvider, type StepType } from "@reactour/tour";
import { DialogsProvider } from "@toolpad/core";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import theme from "./theme.ts";

const steps: StepType[] = [];

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <TourProvider steps={steps}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DialogsProvider>
            <App />
          </DialogsProvider>
        </LocalizationProvider>
      </TourProvider>
    </ThemeProvider>
  </StrictMode>
);
