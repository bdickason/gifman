# Components Directory

This directory contains reusable React components that provide the building blocks for the application's user interface.

## Component Overview

### Core UI Components

#### `Button.tsx`
- **Purpose**: Reusable button component with multiple variants
- **Props**: `variant`, `size`, `disabled`, `onClick`, `children`
- **Variants**: `primary`, `secondary`, `outline`, `ghost`
- **Sizes**: `sm`, `md`, `lg`
- **Usage**: Standard button for forms, actions, and navigation

#### `Input.tsx`
- **Purpose**: Form input component with validation support
- **Props**: `type`, `placeholder`, `value`, `onChange`, `error`, `disabled`
- **Features**: Error state styling, disabled state, controlled component
- **Usage**: Text inputs, email inputs, password fields

#### `Card.tsx`
- **Purpose**: Container component for content sections
- **Props**: `title`, `children`, `className`
- **Features**: Consistent styling, optional title, flexible content
- **Usage**: Content containers, feature sections, information panels

#### `Badge.tsx`
- **Purpose**: Small status indicator component
- **Props**: `variant`, `children`
- **Variants**: `default`, `success`, `warning`, `error`
- **Usage**: Status indicators, labels, small notifications

### Form Components

#### `Form.tsx`
- **Purpose**: Form container with validation and submission handling
- **Props**: `onSubmit`, `children`, `className`
- **Features**: Form validation, error handling, submission management
- **Usage**: Multi-field forms, data entry interfaces

#### `Dropdown.tsx`
- **Purpose**: Dropdown/select component with search and multi-select
- **Props**: `options`, `value`, `onChange`, `placeholder`, `multiple`
- **Features**: Search functionality, multi-select support, keyboard navigation
- **Usage**: Selection interfaces, navigation menus, filters

### Feedback Components

#### `Loading.tsx`
- **Purpose**: Loading spinner and skeleton components
- **Props**: `size`, `text`, `skeleton`
- **Features**: Multiple sizes, skeleton loading states, custom text
- **Usage**: Loading states, data fetching indicators

#### `Tooltip.tsx`
- **Purpose**: Tooltip component for additional information
- **Props**: `content`, `position`, `children`
- **Features**: Multiple positions, hover/focus triggers, custom content
- **Usage**: Help text, additional information, feature explanations

#### `Modal.tsx`
- **Purpose**: Modal dialog component for overlays
- **Props**: `isOpen`, `onClose`, `title`, `children`
- **Features**: Backdrop click to close, escape key support, focus management
- **Usage**: Confirmations, detailed views, forms in overlays

### Error Handling

#### `ErrorBoundary.tsx`
- **Purpose**: React error boundary for catching component errors
- **Props**: `children`, `fallback`
- **Features**: Error catching, fallback UI, error reporting
- **Usage**: Wrapping components to prevent app crashes

### Debug Components

#### `DebugPanel.tsx`
- **Purpose**: Comprehensive debug panel with logging and tools
- **Props**: `isVisible`, `onClose`
- **Features**:
  - Real-time log viewing with filtering
  - Screenshot capture and management
  - Performance monitoring
  - Hotkey shortcuts display
  - Copy to clipboard functionality
- **Usage**: Development debugging, log analysis, performance monitoring

#### `DebugPanel.css`
- **Purpose**: Styling for the debug panel
- **Features**: Dark theme, responsive design, smooth animations
- **Classes**: `.debug-bar`, `.debug-panel-overlay`, `.log-entry`, etc.

## Usage Patterns

### Basic Component Usage
```typescript
import { Button, Input, Card } from './components';

function MyComponent() {
  return (
    <Card title="My Form">
      <Input 
        type="email" 
        placeholder="Enter email" 
        onChange={handleChange} 
      />
      <Button variant="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </Card>
  );
}
```

### Form with Validation
```typescript
import { Form, Input, Button } from './components';

function MyForm() {
  return (
    <Form onSubmit={handleSubmit}>
      <Input 
        type="text" 
        placeholder="Name" 
        error={errors.name}
        onChange={handleNameChange} 
      />
      <Button type="submit" variant="primary">
        Save
      </Button>
    </Form>
  );
}
```

### Debug Panel Integration
```typescript
import { DebugPanel } from './components';

function App() {
  const [showDebug, setShowDebug] = useState(false);
  
  return (
    <div>
      {/* Main app content */}
      <DebugPanel 
        isVisible={showDebug} 
        onClose={() => setShowDebug(false)} 
      />
    </div>
  );
}
```

## Component Architecture

### Design Principles
- **Consistent API**: All components follow similar prop patterns
- **TypeScript Support**: Full type safety with proper interfaces
- **Accessibility**: ARIA attributes and keyboard navigation support
- **Responsive Design**: Mobile-first approach with responsive utilities
- **Theme Support**: Consistent styling with CSS custom properties

### Styling Approach
- **Tailwind CSS**: Utility-first styling for rapid development
- **CSS Modules**: Component-scoped styles where needed
- **Custom Properties**: Theme variables for consistent theming
- **Responsive Utilities**: Mobile-first responsive design

### State Management
- **Controlled Components**: Most components are controlled for predictable behavior
- **Local State**: Component-specific state managed internally
- **Props Interface**: Clear prop contracts for component communication

## Recent Changes

### 2024-12-19: Debug Panel Enhancement
- **Feature**: Added comprehensive debug panel with logging and screenshot tools
- **Integration**: Hotkey support (Ctrl+D) for quick access
- **UI**: Fixed bottom panel with expandable tabs and real-time updates

### Component Library Development
- **Standardization**: Consistent prop interfaces across all components
- **TypeScript**: Full type safety implementation
- **Documentation**: Component usage examples and prop documentation

## Future Considerations

- Add component unit tests for all components
- Consider implementing a component storybook for documentation
- Add more accessibility features (ARIA labels, keyboard navigation)
- Implement component variants system for consistent theming
- Add animation library integration for smooth transitions
- Consider extracting components to a separate package for reuse

## Development Guidelines

### Adding New Components
1. Create component file with TypeScript interface
2. Add to `index.ts` exports
3. Include usage examples in this README
4. Add unit tests for component behavior
5. Update this documentation

### Component Best Practices
- Use TypeScript interfaces for all props
- Include proper accessibility attributes
- Follow consistent naming conventions
- Add JSDoc comments for complex components
- Test component in isolation before integration
