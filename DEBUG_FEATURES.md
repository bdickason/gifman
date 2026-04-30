# 🔧 Debug Features

This template now includes a comprehensive debugging system inspired by the super-retro-viewer project, providing professional-grade development tools for faster debugging and better logging.

## 🚀 Quick Start

### Enable Debug Panel
- **Hotkey**: `Ctrl+D` (or `Cmd+D` on Mac)
- **Button**: Click the "🔧 Show Debug Panel" button in the header
- **Position**: Fixed bottom bar that slides up from the bottom

### Quick Screenshot
- **Hotkey**: `Ctrl+S` (or `Cmd+S` on Mac)
- **Auto-copy**: Screenshots are automatically copied to clipboard
- **Format**: PNG format with timestamped filenames

## 🎯 Key Features

### 1. **Enhanced Debug Panel**
- **Fixed Bottom Position**: Always accessible, doesn't interfere with content
- **Expandable Tabs**: Logs, Screenshots, and Tools sections
- **Real-time Updates**: Auto-refresh every second (toggleable)
- **Professional UI**: Dark theme with smooth animations

### 2. **Advanced Logging System**
- **Console Interception**: Captures all `console.log`, `warn`, `error`, `info` calls
- **Structured Logging**: Timestamps, log levels, source tracking
- **200 Log Retention**: Keeps last 200 logs in memory
- **Category Support**: Associate logs with specific features
- **Copy to Clipboard**: Easy sharing of logs and debug reports

### 3. **Screenshot Tool**
- **Quick Capture**: One-click screenshot with hotkey
- **Multiple Formats**: PNG format with fallback to viewport capture
- **Auto-copy**: Automatically copies to clipboard
- **Download Support**: Save screenshots locally
- **20 Screenshot Limit**: Manages memory efficiently

### 4. **Global Hotkey System**
- **Ctrl+D**: Toggle debug panel
- **Ctrl+S**: Quick screenshot
- **Ctrl+L**: Copy recent logs (50 entries)
- **Ctrl+Shift+L**: Copy full debug report
- **Smart Detection**: Won't trigger in input fields

### 5. **Performance Monitoring**
- **Built-in Metrics**: Component render timing
- **Memory Tracking**: Screenshot and log storage limits
- **Async Performance**: Measure async operation timing
- **Performance Logging**: Automatic performance logging

## 📱 User Interface

### Debug Bar Layout
```
┌─────────────────────────────────────────────────────────────┐
│ 📝 Logs (42)  📸 Screenshots (3)  🛠️ Tools  📸 Capture   🔄 ✕ │
└─────────────────────────────────────────────────────────────┘
```

### Tab Sections

#### 📝 Logs Tab
- **Copy Controls**: Last 50, Last 100, Full Report, Clear
- **Log Display**: Color-coded by level, timestamped, categorized
- **Auto-scroll**: Automatically scrolls to latest logs
- **Filtering**: By source (console/addLog) and level

#### 📸 Screenshots Tab
- **Capture Controls**: Capture Now, Clear All
- **Screenshot List**: Timestamp, description, actions
- **Actions**: Download, Copy to Clipboard
- **Empty State**: Helpful guidance when no screenshots

#### 🛠️ Tools Tab
- **Keyboard Shortcuts**: Complete list of available hotkeys
- **Logging Tools**: Quick access to log functions
- **Screenshot Tools**: Screenshot management
- **Quick Actions**: Combined operations (logs + screenshot)
- **Console Functions**: Available global functions

## 🔧 Technical Implementation

### Architecture
```
App.tsx
├── DebugPanel (fixed bottom)
├── hotkeyManager (global shortcuts)
├── debugLogger (console interception)
└── screenshotCapture (PNG capture)
```

### Key Components

#### DebugPanel.tsx
- **Fixed positioning**: `position: fixed; bottom: 0`
- **Z-index**: 10000 (above all content)
- **Responsive design**: Mobile-friendly layout
- **State management**: Local state for tabs and data

#### debugLogger.ts
- **Console interception**: Overrides console methods
- **Log storage**: In-memory array with 200 limit
- **Global functions**: Window object methods
- **Auto-initialization**: Starts when imported

#### screenshotCapture.ts
- **Canvas capture**: Primary screenshot method
- **Viewport fallback**: Backup capture method
- **Clipboard API**: Modern clipboard integration
- **Download support**: File download functionality

#### hotkeyManager.ts
- **Global listener**: Document-level keydown events
- **Smart filtering**: Ignores input field events
- **Configurable**: Add/remove hotkeys dynamically
- **Global functions**: Connect hotkeys to app functions

## 🎨 Styling

### Design System
- **Color Scheme**: Dark theme (#1e1e1e to #2d2d2d)
- **Typography**: Monaco/Menlo monospace fonts
- **Animations**: Smooth slide-up transitions
- **Responsive**: Mobile-first design approach

### CSS Classes
- `.debug-bar`: Main container with fixed positioning
- `.debug-bar-main`: Top bar with controls
- `.debug-panel-overlay`: Expandable content area
- `.debug-tab`: Tab buttons with active states
- `.log-entry`: Individual log entries with level styling

## 🧪 Testing

### Test Coverage
- **Component Tests**: DebugPanel rendering and behavior
- **Utility Tests**: Logger, screenshot, and hotkey functionality
- **Integration Tests**: End-to-end debug workflow
- **Mock Environment**: Browser API mocks for testing

### Running Tests
```bash
# All tests
npm run test:unit

# Specific test file
npm test -- DebugPanel.test.tsx

# Watch mode
npm run test:unit:watch
```

## 🚀 Development Workflow

### Adding New Debug Features
1. **Extend debugLogger**: Add new log methods or categories
2. **Update DebugPanel**: Add new tabs or controls
3. **Add Hotkeys**: Register new keyboard shortcuts
4. **Update Tests**: Ensure comprehensive test coverage

### Debug Best Practices
1. **Use Categories**: Associate logs with specific features
2. **Performance Logging**: Use `measurePerformance` for timing
3. **Structured Data**: Pass objects to logs for better debugging
4. **Screenshot Context**: Provide descriptive names for screenshots

## 🔒 Security & Performance

### Security Features
- **Input Sanitization**: Safe logging of user data
- **Error Handling**: Graceful fallbacks for all operations
- **Memory Limits**: Prevents memory leaks from logs/screenshots

### Performance Optimizations
- **Lazy Loading**: Debug features load only when needed
- **Efficient Storage**: Circular buffer for logs
- **Batch Updates**: Group multiple operations
- **Minimal Overhead**: Debug system has minimal performance impact

## 📚 API Reference

### Global Functions
```typescript
// Logging
getRecentLogs(count: number): string
copyRecentLogs(count: number): Promise<void>
clearDebugLogs(): void
getDebugLogs(): LogEntry[]

// Screenshots
captureScreenshot(description?: string): Promise<ScreenshotInfo | null>
generateDebugReport(): Promise<string>
copyDebugReport(): Promise<void>

// Debug Panel
toggleDebugPanel(): void
```

### Console Functions
```typescript
// Enhanced console methods (automatically intercepted)
console.log(message, ...args)
console.warn(message, ...args)
console.error(message, ...args)
console.info(message, ...args)

// Performance measurement
measurePerformance(name: string, fn: () => T): T
measureAsyncPerformance(name: string, fn: () => Promise<T>): Promise<T>
```

## 🐛 Troubleshooting

### Common Issues

#### Debug Panel Not Opening
- Check if hotkey manager is initialized
- Verify `showDebugPanel` state in App component
- Check browser console for errors

#### Screenshots Not Working
- Ensure clipboard permissions are granted
- Check if canvas elements are available
- Verify screenshotCapture utility is loaded

#### Hotkeys Not Responding
- Check if focus is in input fields
- Verify hotkey manager is enabled
- Check browser console for conflicts

#### Performance Issues
- Disable auto-refresh if not needed
- Clear logs and screenshots periodically
- Check memory usage in browser dev tools

### Debug Mode
- **Development**: Full debug features enabled
- **Production**: Debug features can be conditionally disabled
- **Testing**: Mock environment for unit tests

## 🤝 Contributing

### Adding New Features
1. **Follow Patterns**: Use existing component structure
2. **Add Tests**: Ensure comprehensive test coverage
3. **Update Docs**: Keep this README current
4. **Performance**: Minimize impact on app performance

### Code Quality
- **TypeScript**: Strict type checking
- **ESLint**: Follow established linting rules
- **Error Boundaries**: Graceful error handling
- **Accessibility**: Keyboard navigation support

## 📖 For New Developers

1. **Start Here**: This document provides the overview
2. **Component Code**: Study individual components for implementation
3. **Test Examples**: Review test files for expected behavior
4. **Integration**: Understand how debug tools integrate with the app
5. **Performance**: Focus on minimizing debug system overhead

## 🔮 Future Enhancements

### Planned Features
- **Network Monitoring**: API call tracking and timing
- **State Inspector**: React component state visualization
- **Bundle Analysis**: Code splitting and bundle size monitoring
- **Error Tracking**: Sentry-like error reporting
- **Custom Metrics**: User-defined performance measurements

### Integration Ideas
- **Browser Extensions**: Chrome/Firefox debug extensions
- **Remote Debugging**: Debug across devices
- **Log Aggregation**: Centralized log collection
- **Performance Dashboard**: Real-time metrics display

---

**🎯 Goal**: Provide professional-grade debugging tools that make development faster and more efficient, while maintaining excellent performance and user experience.
