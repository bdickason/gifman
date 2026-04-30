# Tests Directory

This directory contains comprehensive test suites for the application, ensuring code quality and preventing regressions.

## Test Files

### `basic.test.ts`
- **Purpose**: Basic functionality and template structure validation
- **Coverage**: 
  - Basic JavaScript operations (arrays, objects)
  - Template structure verification
  - Project setup validation

### `server.test.ts`
- **Purpose**: Server configuration and static file serving validation
- **Coverage**:
  - Vite configuration structure
  - SSL plugin configuration
  - Static file serving (index.html)
  - Package.json scripts and dependencies
  - File structure validation
  - TypeScript and ESLint configuration

### `hotkeyManager.test.ts`
- **Purpose**: Comprehensive testing of the hotkey management system
- **Coverage**:
  - **Hotkey Detection**: Tests for all three main hotkeys (Ctrl+D, Ctrl+S, Ctrl+L)
  - **Cross-Platform Support**: Tests for both Ctrl (Windows/Linux) and Cmd (Mac) keys
  - **Input Field Detection**: Ensures hotkeys don't trigger in form fields
  - **Enable/Disable**: Tests for enabling and disabling hotkey functionality
  - **Event Prevention**: Verifies default browser behavior is prevented
  - **Case Insensitivity**: Tests for uppercase and lowercase key handling
  - **Global Functions**: Tests for setting and calling global functions

## Test Categories

### Hotkey Detection Tests
```typescript
// Tests Ctrl+D and Cmd+D for debug panel toggle
it('should trigger toggleDebugPanel on Ctrl+D', () => {
  const event = createKeyEvent('d', true);
  document.dispatchEvent(event);
  expect(mockToggleDebugPanel).toHaveBeenCalledTimes(1);
});
```

### Input Field Protection Tests
```typescript
// Tests that hotkeys don't trigger in input fields
it('should not trigger hotkeys in input fields', () => {
  const input = document.createElement('input');
  input.type = 'text';
  document.body.appendChild(input);
  input.focus();
  
  const event = createKeyEvent('d', true);
  Object.defineProperty(event, 'target', { value: input });
  document.dispatchEvent(event);
  
  expect(mockToggleDebugPanel).not.toHaveBeenCalled();
});
```

### Cross-Platform Tests
```typescript
// Tests both Ctrl (Windows/Linux) and Cmd (Mac) keys
it('should trigger toggleDebugPanel on Cmd+D (Mac)', () => {
  const event = createKeyEvent('d', false, true); // metaKey = true
  document.dispatchEvent(event);
  expect(mockToggleDebugPanel).toHaveBeenCalledTimes(1);
});
```

## Test Utilities

### Helper Functions
- `createKeyEvent()`: Creates keyboard events for testing
- Mock functions for global window functions
- Proper cleanup and isolation between tests

### Test Environment
- **Framework**: Vitest with jsdom environment
- **Mocking**: Comprehensive mocking of browser APIs
- **Isolation**: Each test runs in isolation with proper cleanup

## Running Tests

### Safe Test Command
```bash
npm run test:safe
```
- **Purpose**: Secure test execution with verbose output
- **Safety**: No file system operations or external dependencies
- **Output**: Detailed test results with pass/fail status

### Other Test Commands
```bash
npm run test:unit        # Standard unit tests
npm run test:unit:watch  # Watch mode for development
```

## Test Coverage

### Current Coverage
- **Hotkey Manager**: 100% coverage of all functionality
- **Basic Operations**: Core JavaScript functionality
- **Server Configuration**: Build and deployment setup
- **Total Tests**: 34 tests across 3 test suites

### Coverage Areas
- ✅ Hotkey detection and handling
- ✅ Cross-platform compatibility (Mac/Windows/Linux)
- ✅ Input field protection
- ✅ Event prevention and cleanup
- ✅ Global function management
- ✅ Enable/disable functionality
- ✅ Case sensitivity handling

## Best Practices

### Test Structure
1. **Arrange**: Set up test data and mocks
2. **Act**: Execute the function being tested
3. **Assert**: Verify the expected outcome

### Mocking Strategy
- Mock global functions (`window.toggleDebugPanel`, etc.)
- Use `vi.fn()` for function mocks
- Proper cleanup with `vi.clearAllMocks()`

### Isolation
- Each test runs independently
- Proper cleanup in `afterEach` hooks
- No shared state between tests

## Future Test Additions

### Planned Coverage
- Component rendering tests
- Integration tests for debug panel
- Performance tests for hotkey responsiveness
- Accessibility tests for keyboard navigation
- Error boundary tests

### Test Utilities to Add
- Custom test helpers for common operations
- Snapshot testing for UI components
- E2E tests for complete user workflows
