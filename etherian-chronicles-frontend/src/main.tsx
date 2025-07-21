import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createThirdwebClient } from "thirdweb";

const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App client={client} />
  </StrictMode>
);
