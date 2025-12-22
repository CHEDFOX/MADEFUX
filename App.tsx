import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Threshold from "./components/Threshold";
import BlackHoleEffect from "./components/BlackHoleEffect";
import MainContent from "./components/MainContent";

export enum PageState {
  THRESHOLD = "THRESHOLD",
  TRANSITION = "TRANSITION",
  CONTENT = "CONTENT",
  SCROLL_FALL = "SCROLL_FALL",
}

const App: React.FC = () => {
  const [state, setState] = useState<PageState>(PageState.THRESHOLD);

  // Triggered when center button is pressed
  const startInitialTransition = () => {
    setState(PageState.TRANSITION);

    // Sync with black hole burst
    setTimeout(() => {
      setState(PageState.CONTENT);
    }, 2800);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none">
      
      {/* BACKGROUND — ALWAYS RUNNING */}
      <BlackHoleEffect state={state} />

      {/* THRESHOLD ENTRY */}
      <AnimatePresence mode="wait">
        {state === PageState.THRESHOLD && (
          <Threshold key="threshold" onEnter={startInitialTransition} />
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <AnimatePresence>
        {(state === PageState.CONTENT || state === PageState.SCROLL_FALL) && (
          <MainContent
            key="content"
            setGlobalState={setState}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
