import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { hotkeyManager } from '../utils/hotkeyManager';

describe('HotkeyManager', () => {
  let mockToggleDebugPanel: ReturnType<typeof vi.fn>;
  let mockCaptureScreenshot: ReturnType<typeof vi.fn>;
  let mockCopyRecentLogs: ReturnType<typeof vi.fn>;

  // Helper function to create key events
  const createKeyEvent = (key: string, ctrlKey: boolean = false, metaKey: boolean = false) => {
    return new KeyboardEvent('keydown', {
      key,
      ctrlKey,
      metaKey,
      bubbles: true,
      cancelable: true,
    });
  };

  beforeEach(() => {
    // Mock global functions
    mockToggleDebugPanel = vi.fn();
    mockCaptureScreenshot = vi.fn();
    mockCopyRecentLogs = vi.fn();
    
    (global as any).window = {
      toggleDebugPanel: mockToggleDebugPanel,
      captureScreenshot: mockCaptureScreenshot,
      copyRecentLogs: mockCopyRecentLogs,
    };

    // Clear all mocks before each test
    vi.clearAllMocks();
    
    // Enable the hotkey manager
    hotkeyManager.enable();
  });

  afterEach(() => {
    // Disable the hotkey manager after each test
    hotkeyManager.disable();
  });

  describe('Hotkey Detection', () => {
    it('should trigger toggleDebugPanel on Ctrl+D', () => {
      const event = createKeyEvent('d', true);
      document.dispatchEvent(event);
      
      expect(mockToggleDebugPanel).toHaveBeenCalledTimes(1);
    });

    it('should trigger toggleDebugPanel on Cmd+D (Mac)', () => {
      const event = createKeyEvent('d', false, true);
      document.dispatchEvent(event);
      
      expect(mockToggleDebugPanel).toHaveBeenCalledTimes(1);
    });

    it('should trigger captureScreenshot on Ctrl+S', () => {
      const event = createKeyEvent('s', true);
      document.dispatchEvent(event);
      
      expect(mockCaptureScreenshot).toHaveBeenCalledTimes(1);
    });

    it('should trigger captureScreenshot on Cmd+S (Mac)', () => {
      const event = createKeyEvent('s', false, true);
      document.dispatchEvent(event);
      
      expect(mockCaptureScreenshot).toHaveBeenCalledTimes(1);
    });

    it('should trigger copyRecentLogs on Ctrl+L', () => {
      const event = createKeyEvent('l', true);
      document.dispatchEvent(event);
      
      expect(mockCopyRecentLogs).toHaveBeenCalledTimes(1);
      expect(mockCopyRecentLogs).toHaveBeenCalledWith(50);
    });

    it('should trigger copyRecentLogs on Cmd+L (Mac)', () => {
      const event = createKeyEvent('l', false, true);
      document.dispatchEvent(event);
      
      expect(mockCopyRecentLogs).toHaveBeenCalledTimes(1);
      expect(mockCopyRecentLogs).toHaveBeenCalledWith(50);
    });

    it('should not trigger hotkeys without Ctrl or Cmd', () => {
      const event = createKeyEvent('d', false, false);
      document.dispatchEvent(event);
      
      expect(mockToggleDebugPanel).not.toHaveBeenCalled();
    });

    it('should not trigger hotkeys for other keys', () => {
      const event = createKeyEvent('x', true);
      document.dispatchEvent(event);
      
      expect(mockToggleDebugPanel).not.toHaveBeenCalled();
      expect(mockCaptureScreenshot).not.toHaveBeenCalled();
      expect(mockCopyRecentLogs).not.toHaveBeenCalled();
    });

    it('should not trigger hotkeys in input fields', () => {
      const input = document.createElement('input');
      input.type = 'text';
      document.body.appendChild(input);
      input.focus();
      
      const event = createKeyEvent('d', true);
      // Manually set the target for the test
      Object.defineProperty(event, 'target', { value: input });
      document.dispatchEvent(event);
      
      expect(mockToggleDebugPanel).not.toHaveBeenCalled();
      
      document.body.removeChild(input);
    });

    it('should not trigger hotkeys in textarea fields', () => {
      const textarea = document.createElement('textarea');
      document.body.appendChild(textarea);
      textarea.focus();
      
      const event = createKeyEvent('d', true);
      // Manually set the target for the test
      Object.defineProperty(event, 'target', { value: textarea });
      document.dispatchEvent(event);
      
      expect(mockToggleDebugPanel).not.toHaveBeenCalled();
      
      document.body.removeChild(textarea);
    });

    it('should not trigger hotkeys in select fields', () => {
      const select = document.createElement('select');
      document.body.appendChild(select);
      select.focus();
      
      const event = createKeyEvent('d', true);
      // Manually set the target for the test
      Object.defineProperty(event, 'target', { value: select });
      document.dispatchEvent(event);
      
      expect(mockToggleDebugPanel).not.toHaveBeenCalled();
      
      document.body.removeChild(select);
    });
  });

  describe('Enable/Disable', () => {
    it('should disable hotkeys when disabled', () => {
      hotkeyManager.disable();
      
      const event = createKeyEvent('d', true);
      document.dispatchEvent(event);
      
      expect(mockToggleDebugPanel).not.toHaveBeenCalled();
    });

    it('should re-enable hotkeys when enabled', () => {
      hotkeyManager.disable();
      hotkeyManager.enable();
      
      const event = createKeyEvent('d', true);
      document.dispatchEvent(event);
      
      expect(mockToggleDebugPanel).toHaveBeenCalledTimes(1);
    });
  });

  describe('Global Functions', () => {
    it('should set global functions correctly', () => {
      const functions = {
        toggleDebugPanel: vi.fn(),
        captureScreenshot: vi.fn(),
        copyRecentLogs: vi.fn(),
      };
      
      hotkeyManager.setGlobalFunctions(functions);
      
      expect((global as any).window.toggleDebugPanel).toBe(functions.toggleDebugPanel);
      expect((global as any).window.captureScreenshot).toBe(functions.captureScreenshot);
      expect((global as any).window.copyRecentLogs).toBe(functions.copyRecentLogs);
    });
  });

  describe('Event Prevention', () => {
    it('should prevent default behavior for hotkeys', () => {
      const event = createKeyEvent('d', true);
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      
      document.dispatchEvent(event);
      
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should not prevent default for non-hotkeys', () => {
      const event = createKeyEvent('x', true);
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      
      document.dispatchEvent(event);
      
      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
  });

  describe('Case Insensitivity', () => {
    it('should handle uppercase keys', () => {
      const event = createKeyEvent('D', true);
      document.dispatchEvent(event);
      
      expect(mockToggleDebugPanel).toHaveBeenCalledTimes(1);
    });

    it('should handle lowercase keys', () => {
      const event = createKeyEvent('d', true);
      document.dispatchEvent(event);
      
      expect(mockToggleDebugPanel).toHaveBeenCalledTimes(1);
    });
  });
});
