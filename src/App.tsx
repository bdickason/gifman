import React, { useState, useEffect } from 'react';
import { ErrorBoundary, DebugPanel } from './components';
import { createLogger, debugLogger, screenshotCapture, hotkeyManager } from './utils';
import './App.css';

/** Direct GIF URLs — Tenor / Giphy / Pinterest so each refresh feels unpredictable. */
const HOMEPAGE_GIFS = [
  { src: 'https://media.tenor.com/J6ZWAOxGYwcAAAAC/spider-man-pointing-at-spider-man.gif', alt: 'Spider-Men pointing at each other' },
  { src: 'https://media.tenor.com/XwmvWxBfOZAAAAAC/peanut-butter-jelly-time-banana.gif', alt: 'Peanut butter jelly time banana' },
  { src: 'https://media.tenor.com/mGgWYKKyYJwAAAAC/cat-jam.gif', alt: 'Cat vibing with headphones' },
  { src: 'https://media.tenor.com/5lLcKZBSmAcAAAAC/this-is-fine-fire.gif', alt: 'This is fine dog' },
  { src: 'https://media.tenor.com/3b6ZtjqldkkAAAAC/surprised-pikachu.gif', alt: 'Surprised Pikachu' },
  { src: 'https://media.tenor.com/tIacNkz8xKsAAAAC/skeletor.gif', alt: 'Skeletor' },
  { src: 'https://media.tenor.com/mKTSNBp_6yAAAAAC/stonks-meme.gif', alt: 'Stonks' },
  { src: 'https://media.tenor.com/nqJ8dB5WcDkAAAAC/why-not-both.gif', alt: 'Why not both' },
  { src: 'https://media.tenor.com/EvyhnGSx_uMAAAAC/michael-scott-no.gif', alt: 'Michael Scott no' },
  { src: 'https://media.tenor.com/buIEIAFRwlcAAAAC/shrek-shrek-meme.gif', alt: 'Shrek smirking' },
  { src: 'https://media.tenor.com/JoyZSXZYUHoAAAAC/raccoon-standing-confused.gif', alt: 'Confused raccoon' },
  { src: 'https://media.tenor.com/4qP5V2vYTUGAAAAC/typing-cat.gif', alt: 'Cat typing furiously' },
  { src: 'https://media.tenor.com/5lS5uF7hEAAAAAC/doge-shibe.gif', alt: 'Doge' },
  { src: 'https://i.pinimg.com/originals/2b/58/d3/2b58d34afa44785070e3674d09869a10.gif', alt: 'Synthwave loop' },
  { src: 'https://media.giphy.com/media/13CoXDiaCcCoyk/giphy.gif', alt: 'Homer backs into bushes' },
  { src: 'https://media1.tenor.com/m/NII7Z9YQLsMAAAAC/go-for-it-you-can-do-it.gif', alt: 'Kermit cheering' },
  { src: 'https://media.tenor.com/iTS0iaUVE1UAAAAM/spongebob-patrick.gif', alt: 'SpongeBob and Patrick' },
  { src: 'https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif', alt: 'Deal with it' },
] as const;

const App: React.FC = () => {
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [gifIndex] = useState(() => Math.floor(Math.random() * HOMEPAGE_GIFS.length));
  const gif = HOMEPAGE_GIFS[gifIndex];

  const appLogger = createLogger('App');

  useEffect(() => {
    appLogger.info('App initialized at', new Date().toISOString());
    appLogger.info('Homepage GIF selected', { index: gifIndex, total: HOMEPAGE_GIFS.length, src: gif.src });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only: log selected GIF once; createLogger is not stable across renders
  }, []);

  const toggleDebugPanel = () => {
    setShowDebugPanel(prev => !prev);
  };

  return (
    <ErrorBoundary>
      <div id="app-container" className="min-h-screen flex flex-col">
        <div className="synthwave-bg" aria-hidden />

        <main className="relative z-10 flex flex-1 items-center justify-center p-6">
          <div className="gif-container max-w-2xl w-full rounded-lg overflow-hidden shadow-2xl ring-2 ring-yellow-400/30">
            <img src={gif.src} alt={gif.alt} className="w-full h-auto block" loading="eager" decoding="async" />
            Testing bro2
          </div>
        </main>

        <DebugPanel isVisible={showDebugPanel} onClose={toggleDebugPanel} />
      </div>
    </ErrorBoundary>
  );
};

export default App;
