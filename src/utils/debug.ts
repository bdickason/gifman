interface LogEntry {
  timestamp: number;
  level: 'log' | 'warn' | 'error' | 'info';
  message: string;
  args: any[];
  source: 'console' | 'addLog';
  category?: string;
}

class EnhancedDebugLogger {
  private logs: LogEntry[] = [];
  private maxLogs: number = 200; // Increased to capture more logs
  private isInitialized: boolean = false;
  private originalAddLog: ((level: string, message: string, category: string) => void) | null = null;

  init() {
    if (this.isInitialized) return;
    
    // Store original console methods
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
    const originalInfo = console.info;

    // Override console methods
    console.log = (...args) => {
      this.captureLog('log', args, 'console');
      originalLog.apply(console, args);
    };

    console.warn = (...args) => {
      this.captureLog('warn', args, 'console');
      originalWarn.apply(console, args);
    };

    console.error = (...args) => {
      this.captureLog('error', args, 'console');
      originalError.apply(console, args);
    };

    console.info = (...args) => {
      this.captureLog('info', args, 'console');
      originalInfo.apply(console, args);
    };

    // Intercept the global addLog function
    this.interceptAddLog();

    // Add global access methods
    (window as any).getRecentLogs = (count: number = 50) => this.getRecentLogs(count);
    (window as any).copyRecentLogs = (count: number = 50) => this.copyRecentLogs(count);
    (window as any).clearDebugLogs = () => this.clearLogs();
    (window as any).getDebugLogs = () => this.logs;
    (window as any).getDebugLogsByCategory = (category: string) => this.getLogsByCategory(category);
    (window as any).getDebugLogsByLevel = (level: string) => this.getLogsByLevel(level);
    (window as any).captureScreenshot = (description?: string) => {
      // Import and use screenshotCapture
      import("./screenshotCapture").then(({ screenshotCapture }) => {
        screenshotCapture.captureScreenshot(description);
      });
    };

    this.isInitialized = true;
    console.log('🔧 Enhanced debug logger initialized. Captures both console.log AND addLog calls');
    console.log('🔧 Use getRecentLogs(), copyRecentLogs(), or clearDebugLogs()');
  }

  private interceptAddLog() {
    // Wait for the addLog function to be available
    const checkAndIntercept = () => {
      // Check if window exists (for test environments)
      if (typeof window === 'undefined') {
        return;
      }
      
      if ((window as any).addLog && !this.originalAddLog) {
        this.originalAddLog = (window as any).addLog;
        
        // Override the global addLog function
        (window as any).addLog = (level: string, message: string, category: string) => {
          // Capture the log
          this.captureLog(level as any, [message], 'addLog', category);
          
          // Call the original function
          if (this.originalAddLog) {
            this.originalAddLog(level, message, category);
          }
        };
        
        console.log('🔧 Intercepted addLog function - now capturing structured logs');
      } else if (!(window as any).addLog) {
        // Keep checking until addLog is available, but only if window exists
        if (typeof window !== 'undefined') {
          setTimeout(checkAndIntercept, 100);
        }
      }
    };
    
    checkAndIntercept();
  }

  private captureLog(level: LogEntry['level'], args: any[], source: 'console' | 'addLog', category?: string) {
    const message = args.map(arg => {
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg);
        } catch {
          return String(arg);
        }
      }
      return String(arg);
    }).join(' ');

    this.logs.push({
      timestamp: Date.now(),
      level,
      message,
      args,
      source,
      category
    });

    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  getRecentLogs(count: number = 50): string {
    const recent = this.logs.slice(-count);
    return recent.map(log => {
      const time = new Date(log.timestamp).toLocaleTimeString();
      const source = log.source === 'addLog' ? '[addLog]' : '[console]';
      const category = log.category ? ` [${log.category}]` : '';
      return `[${time}] ${source}${category} ${log.level.toUpperCase()}: ${log.message}`;
    }).join('\n');
  }

  getLogsByCategory(category: string): LogEntry[] {
    return this.logs.filter(log => log.category && log.category === category);
  }

  getLogsByLevel(level: string): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  async copyRecentLogs(count: number = 50): Promise<void> {
    const logs = this.getRecentLogs(count);
    try {
      await navigator.clipboard.writeText(logs);
      console.log(`📋 Copied ${count} recent logs to clipboard`);
    } catch (err) {
      console.error('Failed to copy logs:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = logs;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      console.log(`📋 Copied ${count} recent logs to clipboard (fallback method)`);
    }
  }

  clearLogs(): void {
    this.logs = [];
    console.log('🧹 Debug logs cleared');
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  getLogsCount(): number {
    return this.logs.length;
  }

  // Generate a comprehensive debug report
  generateDebugReport(): string {
    const totalLogs = this.logs.length;
    const consoleLogs = this.logs.filter(log => log.source === 'console').length;
    const addLogLogs = this.logs.filter(log => log.source === 'addLog').length;
    
    const categories = [...new Set(this.logs.filter(log => log.category).map(log => log.category))];
    const levels = [...new Set(this.logs.map(log => log.level))];
    
    let report = `=== COMPREHENSIVE DEBUG REPORT ===\n`;
    report += `Generated: ${new Date().toISOString()}\n`;
    report += `Total Logs: ${totalLogs}\n`;
    report += `Console Logs: ${consoleLogs}\n`;
    report += `AddLog Logs: ${addLogLogs}\n`;
    report += `Categories: ${categories.join(', ')}\n`;
    report += `Log Levels: ${levels.join(', ')}\n\n`;
    
    // Recent logs (last 30)
    report += `=== RECENT LOGS (Last 30) ===\n${this.getRecentLogs(30)}\n\n`;
    
    // Logs by category
    if (categories.length > 0) {
      report += `=== LOGS BY CATEGORY ===\n`;
      categories.forEach(category => {
        if (category) {
          const categoryLogs = this.getLogsByCategory(category);
          report += `${category}: ${categoryLogs.length} logs\n`;
        }
      });
      report += '\n';
    }
    
    // Logs by level
    report += `=== LOGS BY LEVEL ===\n`;
    levels.forEach(level => {
      const levelLogs = this.getLogsByLevel(level);
      report += `${level}: ${levelLogs.length} logs\n`;
    });
    
    return report;
  }

  async copyDebugReport(): Promise<void> {
    const report = this.generateDebugReport();
    try {
      await navigator.clipboard.writeText(report);
      console.log('📋 Comprehensive debug report copied to clipboard');
    } catch (error) {
      console.error('Failed to copy debug report:', error);
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = report;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      console.log('📋 Comprehensive debug report copied to clipboard (fallback method)');
    }
  }
}

// Create singleton instance
export const debugLogger = new EnhancedDebugLogger();

// Auto-initialize when imported
if (typeof window !== 'undefined') {
  debugLogger.init();
}

// Legacy compatibility - keep the old interface
export class DebugLogger {
  private prefix: string;
  private isEnabled: boolean;

  constructor(prefix: string, enabled: boolean = true) {
    this.prefix = prefix;
    this.isEnabled = enabled;
  }

  log(...args: any[]): void {
    if (this.isEnabled) {
      console.log(`[${this.prefix}]`, ...args);
    }
  }

  warn(...args: any[]): void {
    if (this.isEnabled) {
      console.warn(`[${this.prefix}]`, ...args);
    }
  }

  error(...args: any[]): void {
    if (this.isEnabled) {
      console.error(`[${this.prefix}]`, ...args);
    }
  }

  info(...args: any[]): void {
    if (this.isEnabled) {
      console.info(`[${this.prefix}]`, ...args);
    }
  }

  debug(...args: any[]): void {
    if (this.isEnabled && process.env.NODE_ENV === 'development') {
      console.debug(`[${this.prefix}]`, ...args);
    }
  }

  group(label: string): void {
    if (this.isEnabled) {
      console.group(`[${this.prefix}] ${label}`);
    }
  }

  groupEnd(): void {
    if (this.isEnabled) {
      console.groupEnd();
    }
  }

  time(label: string): void {
    if (this.isEnabled) {
      console.time(`[${this.prefix}] ${label}`);
    }
  }

  timeEnd(label: string): void {
    if (this.isEnabled) {
      console.timeEnd(`[${this.prefix}] ${label}`);
    }
  }

  enable(): void {
    this.isEnabled = true;
  }

  disable(): void {
    this.isEnabled = false;
    }
}

export const createLogger = (prefix: string, enabled: boolean = true): DebugLogger => {
  return new DebugLogger(prefix, enabled);
};

export const logger = createLogger('App');

// Performance measurement utilities
export const measurePerformance = <T>(name: string, fn: () => T): T => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  logger.debug(`${name} took ${end - start}ms`);
  return result;
};

export const measureAsyncPerformance = async <T>(name: string, fn: () => Promise<T>): Promise<T> => {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  logger.debug(`${name} took ${end - start}ms`);
  return result;
};
