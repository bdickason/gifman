import React, { useState, useEffect } from 'react';
import { Button, ErrorBoundary, DebugPanel } from './components';
import { createLogger, debugLogger, screenshotCapture, hotkeyManager } from './utils';
import './App.css';

const App: React.FC = () => {
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  
  const appLogger = createLogger('App');

  useEffect(() => {
    appLogger.info('App initialized at', new Date().toISOString());
    
    // Initialize debug utilities
    debugLogger.init();
    
    // Set up global functions for hotkeys
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
      <div id="app-container">
        {/* Synthwave background */}
        <div className="synthwave-bg"></div>
        
        <div className="relative z-10 container mx-auto px-4 py-12">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-7xl font-bold gradient-text mb-6">
              Cursor www template
            </h1>
            <p className="text-2xl text-gray-200 mb-8 font-light">
              Let's build something awesome
            </p>
          </header>

          {/* Animated GIFs Section */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* GIF 1: Go for it! */}
              <div className="card">
                <div className="text-center">
                  <div className="gif-container">
                    <img 
                      src="https://media1.tenor.com/m/NII7Z9YQLsMAAAAC/go-for-it-you-can-do-it.gif" 
                      alt="Go for it! You can do it!" 
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-yellow-300 mb-2">Go for it!</h3>
                  <p className="text-gray-300 text-sm">You can do it! 🚀</p>
                </div>
              </div>

              {/* GIF 2: Spongebob & Patrick */}
              <div className="card">
                <div className="text-center">
                  <div className="gif-container">
                    <img 
                      src="https://media.tenor.com/iTS0iaUVE1UAAAAM/spongebob-patrick.gif" 
                      alt="Spongebob and Patrick" 
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-yellow-300 mb-2">Best Friends</h3>
                  <p className="text-gray-300 text-sm">Ready to code together! 🐟</p>
                </div>
              </div>

              {/* GIF 3: Synthwave */}
              <div className="card">
                <div className="text-center">
                  <div className="gif-container">
                    <img 
                      src="https://i.pinimg.com/originals/2b/58/d3/2b58d34afa44785070e3674d09869a10.gif" 
                      alt="Synthwave aesthetic" 
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-yellow-300 mb-2">Synthwave Vibes</h3>
                  <p className="text-gray-300 text-sm">Retro-futuristic coding! 🌆</p>
                </div>
              </div>
            </div>

            {/* Quick Start Instructions */}
            <div className="card card-large">
              <h2 className="text-3xl font-bold text-yellow-300 mb-6 text-center">
                ⚡ Quick Start
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-yellow-200 mb-3">🚀 Development</h3>
                  <div className="space-y-2 text-gray-300">
                    <p><span className="arrow">→</span> Press <code className="code">⌘+D</code> (Mac) or <code className="code">Ctrl+D</code> (Windows/Linux) to toggle debug panel</p>
                    <p><span className="arrow">→</span> Press <code className="code">⌘+S</code> (Mac) or <code className="code">Ctrl+S</code> (Windows/Linux) for screenshot</p>
                    <p><span className="arrow">→</span> Press <code className="code">⌘+L</code> (Mac) or <code className="code">Ctrl+L</code> (Windows/Linux) to copy logs</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-yellow-200 mb-3">🛠️ Commands</h3>
                  <div className="space-y-2 text-gray-300">
                    <p><span className="arrow">→</span> <code className="code">npm run dev</code> - Start development server</p>
                    <p><span className="arrow">→</span> <code className="code">npm run test:run</code> - Run tests</p>
                    <p><span className="arrow">→</span> <code className="code">npm run build</code> - Build for production</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Debug Panel */}
        <DebugPanel isVisible={showDebugPanel} onClose={toggleDebugPanel} />
      </div>
    </ErrorBoundary>
  );
};

export default App;
