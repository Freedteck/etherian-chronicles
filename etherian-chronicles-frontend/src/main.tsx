import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThirdwebProvider } from "thirdweb/react";
import StoryContext from "./contexts/StoryContext.tsx";
import { SequenceConnect } from "@0xsequence/connect";
import { config } from "./lib/utils.ts";

createRoot(document.getElementById("root")!).render(
  <ThirdwebProvider>
    <SequenceConnect config={config}>
      <StoryContext>
        <App />
      </StoryContext>
    </SequenceConnect>
  </ThirdwebProvider>
);
