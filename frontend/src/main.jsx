import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";

import App from "./App";
import AuthProvider from "./context/AuthContext";
import SheetsProvider from "./context/SheetsContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SheetsProvider>
          <App />
        </SheetsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
