import React, { useState, useEffect, useRef } from "react";
import { debugLogger } from "../utils/debug";
import { screenshotCapture } from "../utils/screenshotCapture";
import "./DebugPanel.css";

interface DebugPanelProps {
  isVisible: boolean;
  onClose: () => void;
  showAnnotationTool?: boolean;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ isVisible, onClose, showAnnotationTool = false }) => {
  const [activeTab, setActiveTab] = useState<'logs' | 'screenshots' | 'tools' | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [screenshots, setScreenshots] = useState<any[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-refresh logs and screenshots
  useEffect(() => {
    if (!isVisible || !autoRefresh) return;

    const interval = setInterval(() => {
      refreshData();
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible, autoRefresh]);

  // Scroll to bottom of logs
  useEffect(() => {
    if (logsEndRef.current && logsEndRef.current.scrollIntoView) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const refreshData = () => {
    setLogs(debugLogger.getLogs());
    setScreenshots(screenshotCapture.getScreenshots());
  };

  const captureScreenshot = async () => {
    // Get current view context for better naming
    const viewContext = showAnnotationTool ? 'annotation' : 'app';
    const timestamp = new Date().toLocaleString('en-US', { 
      hour12: false, 
      month: 'short', 
      day: '2-digit',
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    const screenshot = await screenshotCapture.captureScreenshot(
      `screenshot: ${viewContext} ${timestamp}`
    );
    
    if (screenshot) {
      refreshData();
      // Auto-copy to clipboard
      await screenshotCapture.copyScreenshotToClipboard(screenshot);
    }
  };

  const copyLogs = async (count: number = 50) => {
    await debugLogger.copyRecentLogs(count);
  };

  const copyDebugReport = async () => {
    await debugLogger.copyDebugReport();
  };

  const clearLogs = () => {
    debugLogger.clearLogs();
    refreshData();
  };

  const clearScreenshots = () => {
    screenshotCapture.clearScreenshots();
    refreshData();
  };

  const downloadScreenshot = async (screenshot: any) => {
    await screenshotCapture.downloadScreenshot(screenshot);
  };

  const copyScreenshot = async (screenshot: any) => {
    await screenshotCapture.copyScreenshotToClipboard(screenshot);
  };

  if (!isVisible) return null;

  return (
    <div className="debug-bar">
      {/* Bottom Debug Bar */}
      <div className="debug-bar-main">
        <div className="debug-bar-left">
          <button
            className={`debug-tab ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => setActiveTab(activeTab === 'logs' ? null : 'logs')}
          >
            📝 Logs ({logs.length})
          </button>
          <button
            className={`debug-tab ${activeTab === 'screenshots' ? 'active' : ''}`}
            onClick={() => setActiveTab(activeTab === 'screenshots' ? null : 'screenshots')}
          >
            📸 Screenshots ({screenshots.length})
          </button>
          <button
            className={`debug-tab ${activeTab === 'tools' ? 'active' : ''}`}
            onClick={() => setActiveTab(activeTab === 'tools' ? null : 'tools')}
          >
            🛠️ Tools
          </button>
        </div>
        
        <div className="debug-bar-center">
          <button 
            className="quick-screenshot"
            onClick={captureScreenshot}
            title="Quick Screenshot"
          >
            📸 Capture (Ctrl+S)
          </button>
        </div>

        <div className="debug-bar-right">
          <button 
            className="auto-refresh-toggle"
            onClick={() => setAutoRefresh(!autoRefresh)}
            title={`Auto-refresh: ${autoRefresh ? 'ON' : 'OFF'}`}
          >
            {autoRefresh ? '🔄' : '⏸️'}
          </button>
          <button 
            className="debug-close"
            onClick={onClose}
            title="Close Debug Panel"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Expandable Content Panel */}
      {activeTab && (
        <div className="debug-panel-overlay">
          <div className="debug-panel-content">
            {activeTab === 'logs' && (
              <div className="logs-tab">
                <div className="logs-controls">
                  <button onClick={() => copyLogs(50)}>📋 Copy Last 50</button>
                  <button onClick={() => copyLogs(100)}>📋 Copy Last 100</button>
                  <button onClick={copyDebugReport}>📋 Copy Full Report</button>
                  <button onClick={clearLogs}>🧹 Clear</button>
                </div>
                <div className="logs-container">
                  {logs.map((log, index) => (
                    <div key={index} className={`log-entry log-${log.level} log-${log.source}`}>
                      <span className="log-time">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <span className="log-source">
                        {log.source === 'addLog' ? '[addLog]' : '[console]'}
                      </span>
                      {log.category && (
                        <span className="log-category">[{log.category}]</span>
                      )}
                      <span className="log-level">{log.level.toUpperCase()}</span>
                      <span className="log-message">{log.message}</span>
                    </div>
                  ))}
                  <div ref={logsEndRef} />
                </div>
              </div>
            )}

            {activeTab === 'screenshots' && (
              <div className="screenshots-tab">
                <div className="screenshots-controls">
                  <button onClick={captureScreenshot}>📸 Capture Now</button>
                  <button onClick={clearScreenshots}>🧹 Clear All</button>
                </div>
                <div className="screenshots-container">
                  {screenshots.length === 0 ? (
                    <p>No screenshots captured yet. Click "Capture Now" to take one!</p>
                  ) : (
                    screenshots.map((screenshot, index) => (
                      <div key={index} className="screenshot-item">
                        <div className="screenshot-info">
                          <span className="screenshot-time">
                            {new Date(screenshot.timestamp).toLocaleTimeString()}
                          </span>
                          {screenshot.description && (
                            <span className="screenshot-description">
                              {screenshot.description}
                            </span>
                          )}
                        </div>
                        <div className="screenshot-actions">
                          <button onClick={() => downloadScreenshot(screenshot)}>
                            💾 Download
                          </button>
                          <button onClick={() => copyScreenshot(screenshot)}>
                            📋 Copy
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'tools' && (
              <div className="tools-tab">
                <div className="tools-grid">
                  <div className="tool-section">
                    <h4>⌨️ Keyboard Shortcuts</h4>
                    <div className="shortcuts-list">
                      <div className="shortcut-item">
                        <span className="shortcut-key">Ctrl+L</span>
                        <span className="shortcut-desc">Copy recent logs</span>
                      </div>
                      <div className="shortcut-item">
                        <span className="shortcut-key">Ctrl+Shift+L</span>
                        <span className="shortcut-desc">Copy full debug report</span>
                      </div>
                      <div className="shortcut-item">
                        <span className="shortcut-key">Ctrl+D</span>
                        <span className="shortcut-desc">Debug panel</span>
                      </div>
                      <div className="shortcut-item">
                        <span className="shortcut-key">Ctrl+S</span>
                        <span className="shortcut-desc">Quick screenshot</span>
                      </div>
                    </div>
                  </div>

                  <div className="tool-section">
                    <h4>📝 Logging Tools</h4>
                    <div className="tool-buttons">
                      <button onClick={() => copyLogs(30)}>Copy Last 30</button>
                      <button onClick={() => copyLogs(100)}>Copy Last 100</button>
                      <button onClick={copyDebugReport}>Full Report</button>
                      <button onClick={clearLogs}>Clear Logs</button>
                    </div>
                  </div>

                  <div className="tool-section">
                    <h4>📸 Screenshot Tools</h4>
                    <div className="tool-buttons">
                      <button onClick={captureScreenshot}>Capture</button>
                      <button onClick={clearScreenshots}>Clear All</button>
                    </div>
                  </div>

                  <div className="tool-section">
                    <h4>⚡ Quick Actions</h4>
                    <div className="tool-buttons">
                      <button onClick={() => {
                        copyLogs(50);
                        captureScreenshot();
                      }}>
                        📋📸 Logs + Screenshot
                      </button>
                      <button onClick={copyDebugReport}>
                        📊 Debug Report
                      </button>
                    </div>
                  </div>

                  <div className="tool-section">
                    <h4>🌐 Console Functions</h4>
                    <div className="console-functions">
                      <code>getRecentLogs(count)</code>
                      <code>copyRecentLogs(count)</code>
                      <code>captureScreenshot(desc)</code>
                      <code>generateDebugReport()</code>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugPanel;

