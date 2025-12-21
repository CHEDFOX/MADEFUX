
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Threshold from './components/Threshold';
import BlackHoleEffect from './components/BlackHoleEffect';
import MainContent from './components/MainContent';

export enum PageState {
  THRESHOLD = 'THRESHOLD',
  TRANSITION = 'TRANSITION',
  CONTENT = 'CONTENT'
}

const App: React.FC = () => {
  const [state, setState] = useState<PageState>(PageState.THRESHOLD);

  const startTransition = () => {
    setState(PageState.TRANSITION);
    // Transition timing to coincide with the "Black Hole" animation burst
    setTimeout(() => {
      setState(PageState.CONTENT);
    }, 2800); // Slightly faster reveal for a punchier transition
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none">
      {/* Background canvas is always active for seamless transition */}
      <BlackHoleEffect state={state} />

      <AnimatePresence mode="wait">
        {state === PageState.THRESHOLD && (
          <Threshold key="threshold" onEnter={startTransition} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {state === PageState.CONTENT && (
          <MainContent key="content" />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
