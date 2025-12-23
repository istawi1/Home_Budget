import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider, ColorSchemeScript, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { DatesProvider } from "@mantine/dates";
import dayjs from "dayjs";
import "dayjs/locale/pl";
import App from "./app/App";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/charts/styles.css";

import "./index.css";



dayjs.locale("pl");

const theme = createTheme({
  primaryColor: "blue",
  defaultRadius: "md",
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ColorSchemeScript defaultColorScheme="dark" />
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <DatesProvider settings={{ locale: "pl", firstDayOfWeek: 1 }}>
        <Notifications position="top-right" />
        <App />
      </DatesProvider>
    </MantineProvider>
  </React.StrictMode>
);
