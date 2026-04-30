# 🚀 Web App Template

A production-ready template for web-based projects with optimized workflow, built on the lessons learned from real-world development challenges.

## ✨ Features

- **⚡ Lightning Fast**: Vite + React + TypeScript setup
- **🧪 Testing Ready**: Vitest + jsdom with comprehensive mocks
- **🔧 Development Tools**: Hot reload, SSL, and persistent development
- **📱 Responsive Design**: Tailwind CSS with mobile-first approach
- **🚀 Performance**: Optimized builds and modern bundling
- **🛡️ Error Handling**: Comprehensive error boundaries and logging
- **♿ Accessibility**: ARIA support and keyboard navigation
- **📦 Component Library**: Reusable UI components with TypeScript

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
# Standard development
npm run dev

# HTTPS development (recommended)
npm run dev:ssl

# Persistent development with auto-restart
npm run dev:persistent
```

### 3. Run Tests

```bash
# Run tests once
npm run test:unit

# Watch mode
npm run test:unit:watch
```

### 4. Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
project-name/
├── src/
│   ├── __tests__/          # Test files
│   ├── components/          # React components
│   │   ├── Button.tsx      # Reusable button component
│   │   ├── Input.tsx       # Form input component
│   │   ├── Modal.tsx       # Modal dialog component
│   │   ├── Loading.tsx     # Loading states
│   │   ├── ErrorBoundary.tsx # Error handling
│   │   ├── Form.tsx        # Form with validation
│   │   ├── Card.tsx        # Content containers
│   │   ├── Badge.tsx       # Status indicators
│   │   ├── Tooltip.tsx     # Tooltips
│   │   └── Dropdown.tsx    # Dropdown menus
│   ├── utils/              # Utility functions
│   │   ├── debug.ts        # Debug logging
│   │   ├── dom.ts          # DOM utilities
│   │   ├── validation.ts   # Form validation
│   │   ├── formatting.ts   # Data formatting
│   │   ├── storage.ts      # Local/session storage
│   │   └── api.ts          # HTTP client
│   ├── types.ts            # TypeScript definitions
│   ├── test-setup.ts       # Test configuration
│   ├── App.tsx             # Root component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
├── scripts/                # Utility scripts
│   ├── health-check.js     # Server monitoring
│   └── health-check-ssl-auto.js # SSL monitoring
├── package.json
├── vite.config.ts          # Vite configuration
├── vitest.config.ts        # Test configuration
├── tailwind.config.js      # Tailwind CSS config
├── tsconfig.json           # TypeScript config
└── eslint.config.js        # ESLint configuration
```

## 🎯 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run dev:ssl` | Start HTTPS development server |
| `npm run dev:watch` | Development with file watching |
| `npm run dev:persistent` | Auto-restart development |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test:unit` | Run unit tests |
| `npm run test:unit:watch` | Watch mode tests |
| `npm run health-check` | Monitor server health |
| `npm run health-check:ssl` | Monitor HTTPS server |

## 🔧 Configuration

### Vite Configuration

The template includes a pre-configured Vite setup with:
- React plugin for JSX support
- SSL plugin for HTTPS development
- Port 5173 (standard Vite port)
- Host binding for network access

### TypeScript Configuration

Strict TypeScript configuration with:
- ES2022 target for modern features
- Strict mode enabled
- Bundler module resolution
- Proper JSX handling

### Testing Configuration

Vitest setup with:
- jsdom environment for DOM testing
- React Testing Library integration
- Comprehensive browser API mocks
- CSS support in tests

## 🧪 Testing Best Practices

### Component Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../components/Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Mocking Browser APIs

The template includes comprehensive mocks for:
- Clipboard API
- MatchMedia
- ResizeObserver
- IntersectionObserver
- Console warnings suppression

## 🚀 Development Workflow

### 1. Component Development

1. Create component in `src/components/`
2. Add TypeScript interfaces
3. Implement with proper error handling
4. Add comprehensive tests
5. Export from `src/components/index.ts`

### 2. Utility Functions

1. Create utility in `src/utils/`
2. Add JSDoc documentation
3. Include error handling
4. Add tests for edge cases
5. Export from `src/utils/index.ts`

### 3. Testing Strategy

- Unit tests for all components and utilities
- Integration tests for complex workflows
- E2E tests for critical user journeys
- Performance testing for optimization

## 🎨 Styling Guidelines

### Tailwind CSS

- Use utility classes for rapid development
- Extend theme in `tailwind.config.js`
- Create component classes for reusability
- Follow mobile-first responsive design

### CSS Custom Properties

```css
/* Use CSS custom properties for theming */
:root {
  --color-primary: #3b82f6;
  --color-secondary: #64748b;
}

/* Apply in components */
.button {
  background-color: var(--color-primary);
}
```

## 🔒 Security Considerations

- HTTPS development by default
- Input validation and sanitization
- XSS prevention measures
- Secure HTTP headers
- Content Security Policy

## 📱 Performance Optimization

- Code splitting with dynamic imports
- Lazy loading for components
- Image optimization
- Bundle analysis
- Tree shaking

## 🔧 Development Features

### Debug Panel
This template includes a comprehensive debug panel that can be toggled with **Ctrl+D**. It provides:
- Real-time log viewing and export (ctrl+L)
- Screenshot capture and management  (ctrl+s)
- Development tools and shortcuts
- Performance monitoring

**⚠️ Important for Template Users:**
When creating new projects from this template, preserve these essential debug components:

1. **Required Components:**
   - `src/components/DebugPanel.tsx` - Main debug panel UI
   - `src/components/DebugPanel.css` - Debug panel styling
   - `src/utils/debug.ts` - Enhanced logging system
   - `src/utils/hotkeyManager.ts` - Global hotkey management
   - `src/utils/screenshotCapture.ts` - Screenshot functionality

2. **Required App.tsx Integration:**
   ```typescript
   // These imports must be preserved:
   import { DebugPanel } from './components/DebugPanel';
   import { hotkeyManager } from './utils/hotkeyManager';
   import { debugLogger } from './utils/debug';
   import { screenshotCapture } from './utils/screenshotCapture';
   
   // This state must be preserved:
   const [showDebugPanel, setShowDebugPanel] = useState(false);
   
   // This initialization must be preserved in useEffect:
   debugLogger.init();
   hotkeyManager.setGlobalFunctions({...});
   
   // This JSX must be preserved:
   <DebugPanel isVisible={showDebugPanel} onClose={() => setShowDebugPanel(false)} />
   ```

3. **Available Hotkeys:**
   - **Ctrl+D**: Toggle debug panel
   - **Ctrl+S**: Capture screenshot
   - **Ctrl+L**: Copy recent logs

**Note:** The debug panel is essential for the development workflow and should not be removed without careful consideration.

## 🚀 Deployment

### Build Process

```bash
npm run build
```

The build process:
1. TypeScript compilation
2. Vite bundling and optimization
3. Asset optimization
4. Output to `dist/` directory

### Deployment Options

- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **CDN**: Cloudflare, AWS CloudFront
- **Server**: Node.js, Docker containers

## 🤝 Contributing

1. Follow the established patterns
2. Add comprehensive tests
3. Update documentation
4. Follow TypeScript best practices
5. Use conventional commits

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Testing Library](https://testing-library.com/docs/)

## 🆘 Troubleshooting

### Common Issues

1. **Port already in use**: Change port in `vite.config.ts`
2. **SSL certificate issues**: Run `npm run dev:ssl` for HTTPS
3. **Test failures**: Check `src/test-setup.ts` for mocks
4. **Build errors**: Verify TypeScript configuration

### Getting Help

- Check the console for error messages
- Review the test setup configuration
- Verify all dependencies are installed
- Check browser compatibility

## 📄 License

MIT License - see LICENSE file for details.

---

**Happy coding! 🚀**

This template is designed to get you up and running quickly while maintaining high code quality and developer experience standards.
