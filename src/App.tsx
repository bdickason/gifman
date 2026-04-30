import React, { useState, useEffect } from 'react';
import { ErrorBoundary, DebugPanel } from './components';
import { createLogger, debugLogger, screenshotCapture, hotkeyManager } from './utils';
import './App.css';

const App: React.FC = () => {
  const [showDebugPanel, setShowDebugPanel] = useState(false);

  const appLogger = createLogger('App');

  useEffect(() => {
    appLogger.info('App initialized at', new Date().toISOString());

    debugLogger.init();

    hotkeyManager.setGlobalFunctions({
      toggleDebugPanel: () => {
        setShowDebugPanel(prev => !prev);
      },
      captureScreenshot: () => {
        screenshotCapture.captureScreenshot('App screenshot');
      },
      copyRecentLogs: (count: number = 50) => {
        debugLogger.copyRecentLogs(count);
      },
      copyDebugReport: () => {
        debugLogger.copyDebugReport();
      }
    });
  }, []);

  const toggleDebugPanel = () => {
    setShowDebugPanel(prev => !prev);
  };

  return (
    <ErrorBoundary>
      <div id="app-container" className="min-h-screen flex flex-col">
        <div className="synthwave-bg" aria-hidden />

        <main className="relative z-10 flex flex-1 items-center justify-center p-6">
          <div className="max-w-2xl w-full rounded-lg overflow-hidden shadow-2xl ring-2 ring-yellow-400/30 p-8 bg-black/30 backdrop-blur-sm text-yellow-300 text-center">
            Testing bro2
          </div>
        </main>

        <DebugPanel isVisible={showDebugPanel} onClose={toggleDebugPanel} />
      </div>
    </ErrorBoundary>
  );
};

export default App;
