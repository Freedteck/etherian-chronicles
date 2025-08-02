import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThirdwebProvider } from "thirdweb/react";
import StoryContext from "./contexts/StoryContext.tsx";
import ProfileContext from "./contexts/ProfileContext.tsx";

createRoot(document.getElementById("root")!).render(
  <ThirdwebProvider>
    <StoryContext>
      <ProfileContext>
        {/* The main application component */}
        <App />
      </ProfileContext>
    </StoryContext>
  </ThirdwebProvider>
);
