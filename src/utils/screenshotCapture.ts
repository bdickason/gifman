interface ScreenshotInfo {
  timestamp: number;
  filename: string;
  dataUrl: string;
  description?: string;
}

class ScreenshotCapture {
  private screenshots: ScreenshotInfo[] = [];
  private maxScreenshots: number = 20;

  async captureScreenshot(description?: string): Promise<ScreenshotInfo | null> {
    try {
      // Use html2canvas if available, otherwise fall back to canvas capture
      const canvas = await this.captureCanvas();
      if (!canvas) return null;

      const dataUrl = canvas.toDataURL('image/png');
      const timestamp = Date.now();
      const filename = `screenshot_${timestamp}.png`;
      
      const screenshot: ScreenshotInfo = {
        timestamp,
        filename,
        dataUrl,
        description
      };

      this.screenshots.push(screenshot);
      
      // Keep only the most recent screenshots
      if (this.screenshots.length > this.maxScreenshots) {
        this.screenshots = this.screenshots.slice(-this.maxScreenshots);
      }

      console.log(`📸 Screenshot captured: ${filename}${description ? ` - ${description}` : ''}`);
      return screenshot;
    } catch (error) {
      console.error('Failed to capture screenshot:', error);
      return null;
    }
  }

  private async captureCanvas(): Promise<HTMLCanvasElement | null> {
    try {
      // Try to use html2canvas if available
      if (typeof (window as any).html2canvas === 'function') {
        const canvas = await (window as any).html2canvas(document.body);
        return canvas;
      }

      // Fallback: try to capture the main canvas or viewport
      const mainCanvas = document.querySelector('canvas');
      if (mainCanvas) {
        // Create a new canvas with the same dimensions
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        canvas.width = mainCanvas.width;
        canvas.height = mainCanvas.height;
        ctx.drawImage(mainCanvas, 0, 0);
        return canvas;
      }

      // Last resort: capture viewport
      return await this.captureViewport();
    } catch (error) {
      console.error('Canvas capture failed:', error);
      return null;
    }
  }

  private async captureViewport(): Promise<HTMLCanvasElement | null> {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // This is a basic viewport capture - may not work in all browsers
      // For better results, consider using a library like html2canvas
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Try to capture any visible content
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      return new Promise((resolve) => {
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          resolve(canvas);
        };
        img.onerror = () => resolve(canvas);
        img.src = 'data:image/svg+xml;base64,' + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
            <rect width="100%" height="100%" fill="white"/>
            <text x="50%" y="50%" text-anchor="middle" fill="black">Viewport Capture</text>
          </svg>
        `);
      });
    } catch (error) {
      console.error('Viewport capture failed:', error);
      return null;
    }
  }

  async downloadScreenshot(screenshot: ScreenshotInfo): Promise<void> {
    try {
      const link = document.createElement('a');
      link.download = screenshot.filename;
      link.href = screenshot.dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log(`💾 Downloaded screenshot: ${screenshot.filename}`);
    } catch (error) {
      console.error('Failed to download screenshot:', error);
    }
  }

  async copyScreenshotToClipboard(screenshot: ScreenshotInfo): Promise<void> {
    try {
      // Convert data URL to blob
      const response = await fetch(screenshot.dataUrl);
      const blob = await response.blob();
      
      // Try to copy to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      
      console.log(`📋 Copied screenshot to clipboard: ${screenshot.filename}`);
    } catch (error) {
      console.error('Failed to copy screenshot to clipboard:', error);
      // Fallback: download instead
      await this.downloadScreenshot(screenshot);
    }
  }

  getScreenshots(): ScreenshotInfo[] {
    return [...this.screenshots];
  }

  getScreenshotsCount(): number {
    return this.screenshots.length;
  }

  clearScreenshots(): void {
    this.screenshots = [];
    console.log('🧹 Screenshots cleared');
  }

  // Generate a debug report with both logs and screenshots
  async generateDebugReport(): Promise<string> {
    const { debugLogger } = await import("./debug");
    
    const logs = debugLogger.getRecentLogs(50);
    const screenshots = this.getScreenshots();
    
    let report = `=== DEBUG REPORT ===\n`;
    report += `Generated: ${new Date().toISOString()}\n`;
    report += `Logs: ${debugLogger.getLogsCount()}\n`;
    report += `Screenshots: ${this.getScreenshotsCount()}\n\n`;
    
    report += `=== RECENT LOGS ===\n${logs}\n\n`;
    
    if (screenshots.length > 0) {
      report += `=== SCREENSHOTS ===\n`;
      screenshots.forEach((ss, index) => {
        const time = new Date(ss.timestamp).toLocaleTimeString();
        report += `${index + 1}. ${ss.filename} (${time})${ss.description ? ` - ${ss.description}` : ''}\n`;
      });
    }
    
    return report;
  }

  async copyDebugReport(): Promise<void> {
    const report = await this.generateDebugReport();
    try {
      await navigator.clipboard.writeText(report);
      console.log('📋 Debug report copied to clipboard');
    } catch (error) {
      console.error('Failed to copy debug report:', error);
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = report;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      console.log('📋 Debug report copied to clipboard (fallback method)');
    }
  }
}

// Create singleton instance
export const screenshotCapture = new ScreenshotCapture();

// Add global access methods
if (typeof window !== 'undefined') {
  (window as any).captureScreenshot = (desc?: string) => screenshotCapture.captureScreenshot(desc);
  (window as any).generateDebugReport = () => screenshotCapture.generateDebugReport();
  (window as any).copyDebugReport = () => screenshotCapture.copyDebugReport();
}

