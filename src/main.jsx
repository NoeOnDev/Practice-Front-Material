import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppProvider } from "@toolpad/core/AppProvider";
import { App } from "./containers/App";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>
);
