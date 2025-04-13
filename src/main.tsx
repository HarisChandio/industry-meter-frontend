import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { store } from "./store/index.ts";
import { Provider } from "react-redux";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <Toaster
        position="top-right"
        richColors
        duration={3000}
        className="z-50 top-0 right-0"
      />
      <App />
    </Provider>
  </StrictMode>
);
