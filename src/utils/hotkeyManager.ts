// Simple hotkey manager for debug panel functionality

class HotkeyManager {
  private isEnabled: boolean = true;
  private eventListener: ((event: KeyboardEvent) => void) | null = null;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;
    
    this.eventListener = this.handleKeyDown.bind(this);
    document.addEventListener('keydown', this.eventListener);
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (!this.isEnabled) return;
    
    // Don't trigger hotkeys when typing in input fields
    if (event.target instanceof HTMLInputElement || 
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement) {
      return;
    }

    // Check for Ctrl or Cmd key
    const isCtrlOrCmd = event.ctrlKey || event.metaKey;
    if (!isCtrlOrCmd) return;

    // Handle specific key combinations
    switch (event.key.toLowerCase()) {
      case 'd':
        event.preventDefault();
        this.toggleDebugPanel();
        break;
      case 's':
        event.preventDefault();
        this.captureScreenshot();
        break;
      case 'l':
        event.preventDefault();
        this.copyLogs();
        break;
    }
  }

  private toggleDebugPanel() {
    if ((window as any).toggleDebugPanel) {
      (window as any).toggleDebugPanel();
    }
  }

  private captureScreenshot() {
    if ((window as any).captureScreenshot) {
      (window as any).captureScreenshot();
    }
  }

  private copyLogs() {
    if ((window as any).copyRecentLogs) {
      (window as any).copyRecentLogs(50);
    }
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  // Clean up event listeners (useful for testing)
  destroy() {
    if (this.eventListener) {
      document.removeEventListener('keydown', this.eventListener);
      this.eventListener = null;
    }
  }

  // Set global functions that can be called by hotkeys
  setGlobalFunctions(functions: Record<string, () => void>) {
    Object.entries(functions).forEach(([key, fn]) => {
      (window as any)[key] = fn;
    });
  }
}

// Create singleton instance
export const hotkeyManager = new HotkeyManager();

// Export the class for testing
export { HotkeyManager };
