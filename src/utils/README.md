# Utils Directory

This directory contains utility functions and classes that provide common functionality across the application.

## Files Overview

### Core Utilities

#### `hotkeyManager.ts`
- **Purpose**: Simple keyboard shortcut management for debug panel functionality
- **Key Features**:
  - Cross-platform support (Ctrl for Windows/Linux, Cmd for Mac)
  - Three main hotkeys: `Ctrl+D`, `Ctrl+S`, `Ctrl+L`
  - Prevents default browser behavior for custom shortcuts
  - Ignores input fields to avoid conflicts
- **Usage**: Automatically initialized, calls global functions set by App.tsx

#### `debug.ts`
- **Purpose**: Enhanced logging system with console interception
- **Key Features**:
  - Captures all console.log, warn, error, info calls
  - Structured logging with timestamps and categories
  - 200 log retention limit
  - Copy to clipboard functionality
  - Global functions for external access

#### `screenshotCapture.ts`
- **Purpose**: Screenshot functionality with clipboard integration
- **Key Features**:
  - Canvas-based screenshot capture
  - Automatic clipboard copying
  - Download support
  - 20 screenshot limit for memory management

### API & Data Utilities

#### `api.ts`
- **Purpose**: HTTP client and API utilities
- **Key Features**:
  - HttpClient class with configurable options
  - ApiClient with common patterns
  - RetryHandler with exponential backoff
  - RateLimiter for API protection
  - ApiCache for response caching

#### `storage.ts`
- **Purpose**: Local storage utilities
- **Key Features**:
  - Type-safe storage operations
  - JSON serialization/deserialization
  - Error handling for storage failures

#### `validation.ts`
- **Purpose**: Form and data validation utilities
- **Key Features**:
  - Common validation patterns
  - Custom validation functions
  - Error message formatting

### DOM & UI Utilities

#### `dom.ts`
- **Purpose**: DOM manipulation utilities
- **Key Features**:
  - Element selection helpers
  - Event handling utilities
  - DOM traversal functions

#### `formatting.ts`
- **Purpose**: Data formatting utilities
- **Key Features**:
  - Date/time formatting
  - Number formatting
  - String manipulation helpers

### Index File

#### `index.ts`
- **Purpose**: Central export point for all utilities
- **Exports**: All utility functions and classes for easy importing

## Usage Patterns

### Hotkey Management
```typescript
import { hotkeyManager } from './utils';

// Set global functions that hotkeys can call
hotkeyManager.setGlobalFunctions({
  toggleDebugPanel: () => { /* ... */ },
  captureScreenshot: () => { /* ... */ },
  copyRecentLogs: () => { /* ... */ }
});
```

### Debug Logging
```typescript
import { createLogger, debugLogger } from './utils';

const logger = createLogger('MyComponent');
logger.info('Component initialized');
debugLogger.copyRecentLogs(50); // Copy last 50 logs
```

### Screenshot Capture
```typescript
import { screenshotCapture } from './utils';

screenshotCapture.captureScreenshot('My screenshot');
```

## Recent Changes

### 2024-12-19: Hotkey Manager Simplification
- **Issue**: Complex hotkey registration system was causing matching failures
- **Solution**: Replaced with simple switch statement approach
- **Result**: Reliable hotkey detection for Ctrl+D, Ctrl+S, Ctrl+L
- **Cross-platform**: Works with both Ctrl (Windows/Linux) and Cmd (Mac)

### 2024-12-19: Import Error Fix
- **Issue**: TypeScript `verbatimModuleSyntax` causing import errors
- **Solution**: Removed unused type imports from api.ts
- **Result**: Clean TypeScript compilation

## Future Considerations

- Consider adding more hotkeys as needed
- Monitor memory usage for debug logs and screenshots
- Add unit tests for utility functions
- Consider extracting hotkey manager to a separate package if reused
