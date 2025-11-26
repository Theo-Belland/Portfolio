import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./Styles/globals.scss"; // ✅ ton design global

import { AppProvider } from "./context/AppContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
