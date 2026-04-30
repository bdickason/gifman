# 🚀 Development Workflow & Collaboration Guide

## **Our Collaborative Approach**

You are a collaborative AI coding partner who works **WITH** the user, not **FOR** them. This creates a faster, more controlled development experience where you provide guidance and code while the user runs commands.

## **🚀 Quick Start Commands**

```bash
# 1. Create project and navigate
mkdir my-web-app && cd my-web-app

# 2. Initialize package.json (copy the exact dependencies from package.json)
npm init -y

# 3. Install dependencies
npm install

# 4. Copy all config files from this template

# 5. Start development server
npm run dev

# 6. Run tests
npm run test:unit
```

## **🔧 Development Server Management**

| Command | Description | Use Case |
|---------|-------------|----------|
| `npm run dev` | Standard development server | Daily development |
| `npm run dev:ssl` | HTTPS development server | **RECOMMENDED** - SSL testing, mobile testing |
| `npm run dev:persistent` | Auto-restart development | Long development sessions |
| `npm run dev:watch` | File watching with nodemon | When you want file watching |

**Port 5173** is the standard development port.

## **🧪 Testing Strategy**

| Command | Description | Use Case |
|---------|-------------|----------|
| `npm run test:unit` | Run tests once | CI/CD, verification |
| `npm run test:unit:watch` | Watch mode tests | **RECOMMENDED** - Active development |
| `npm run test:watch` | Full test suite watching | Comprehensive testing |

Tests run in **jsdom environment** with proper mocks to avoid browser API issues.

## **📋 Command Execution Philosophy**

### **CRITICAL RULES - Follow These**

1. **NEVER run commands yourself** - always provide commands for the user to run
2. **ALWAYS start with `cd /path/to/project`** to ensure correct directory
3. **Use `is_background: false`** for most commands unless explicitly needed
4. **Provide clear, copy-pasteable commands**
5. **User runs commands, you provide guidance and code**

### **Example Workflow**

```
USER: "I want to start the development server"
YOU: "Run this command to start the development server:"
     cd /path/to/project
     npm run dev:ssl

USER: "The server started but I see an error"
YOU: "Let me help you debug that. Can you show me the error message?"
     [Then provide code fixes or guidance]
```

## **⚡ React Component Best Practices**

### **1. React StrictMode Issues**

```typescript
// ❌ WRONG - This will double-mount and cause issues
useEffect(() => {
  const controller = new SomeController();
  return () => controller.cleanup();
}, []);

// ✅ CORRECT - Use refs to prevent double-initialization
const controllerRef = useRef<SomeController | null>(null);
const isInitializedRef = useRef(false);

useEffect(() => {
  if (!controllerRef.current && !isInitializedRef.current) {
    controllerRef.current = new SomeController();
    isInitializedRef.current = true;
  }
  
  return () => {
    if (isInitializedRef.current) {
      controllerRef.current?.cleanup();
      isInitializedRef.current = false;
    }
  };
}, []);
```

### **2. DOM Element Waiting**

```typescript
// ❌ WRONG - Direct DOM access without waiting
useEffect(() => {
  const element = document.querySelector('.my-element');
  element?.addEventListener('click', handler);
}, []);

// ✅ CORRECT - Exponential backoff for DOM readiness
useEffect(() => {
  let checkInterval: NodeJS.Timeout;
  let attempts = 0;
  
  const checkForElement = () => {
    const element = document.querySelector('.my-element');
    if (element) {
      element.addEventListener('click', handler);
      clearInterval(checkInterval);
    } else {
      attempts++;
      if (attempts > 10) {
        console.warn('Element not found after 10 attempts');
        clearInterval(checkInterval);
      }
    }
  };
  
  checkInterval = setInterval(checkForElement, Math.pow(2, attempts) * 100);
  checkForElement(); // Check immediately
  
  return () => clearInterval(checkInterval);
}, []);
```

### **3. State vs Ref Usage**

```typescript
// ❌ WRONG - Ref updates don't trigger re-renders
const [isReady, setIsReady] = useState(false);
const controllerRef = useRef<Controller | null>(null);

useEffect(() => {
  controllerRef.current = new Controller(); // This won't re-render!
}, []);

// ✅ CORRECT - Use state to trigger re-renders
const [isReady, setIsReady] = useState(false);
const controllerRef = useRef<Controller | null>(null);

useEffect(() => {
  controllerRef.current = new Controller();
  setIsReady(true); // This triggers re-render
}, []);
```

## **🐛 Debugging Patterns**

### **1. Custom DebugLogger Class**

```typescript
import { createLogger } from './utils/debug';

const logger = createLogger('MyComponent');

// Use throughout your component
logger.info('Component mounted');
logger.debug('State updated', { newState: state });
logger.warn('Something unexpected happened');
logger.error('Error occurred', { error });
```

### **2. Performance Measurement**

```typescript
import { measurePerformance, measureAsyncPerformance } from './utils/debug';

// Sync operations
const result = measurePerformance('expensiveOperation', () => {
  return performExpensiveOperation();
});

// Async operations
const result = await measureAsyncPerformance('apiCall', async () => {
  return await fetchData();
});
```

## **🔍 Common Development Tasks**

### **Adding a New Component**

1. Create component file in `src/components/`
2. Add TypeScript interfaces
3. Implement with proper error handling
4. Add to `src/components/index.ts`
5. Create tests in `src/__tests__/`
6. Update documentation

### **Adding a New Utility**

1. Create utility file in `src/utils/`
2. Add JSDoc documentation
3. Include error handling
4. Add to `src/utils/index.ts`
5. Create tests
6. Update documentation

### **Debugging Issues**

1. Check browser console for errors
2. Use the DebugLogger for application-specific logging
3. Verify React StrictMode isn't causing double-mounting
4. Check if DOM elements are ready before accessing
5. Verify all dependencies are properly installed

## **📱 Development Environment Setup**

### **Required Tools**

- Node.js 18+ (LTS recommended)
- npm or yarn package manager
- Modern browser (Chrome, Firefox, Safari, Edge)
- Code editor with TypeScript support (VS Code recommended)

### **Recommended VS Code Extensions**

- TypeScript and JavaScript Language Features
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- React Developer Tools
- Error Lens

## **🚨 Troubleshooting Common Issues**

### **1. Port Already in Use**

```bash
# Check what's using port 5173
lsof -i :5173

# Kill the process
kill -9 <PID>

# Or change port in vite.config.ts
```

### **2. SSL Certificate Issues**

```bash
# Use the SSL development command
npm run dev:ssl

# Or check if the SSL plugin is properly configured
```

### **3. Test Failures**

- Verify `src/test-setup.ts` is properly configured
- Check that all mocks are working
- Ensure jsdom environment is set up correctly

### **4. Build Errors**

- Check TypeScript configuration
- Verify all imports are correct
- Check for syntax errors in components

## **📈 Performance Monitoring**

### **Development Performance**

- Use `npm run dev:persistent` for long sessions
- Monitor with health check scripts
- Check browser dev tools for performance issues

### **Build Performance**

- Monitor build times
- Use bundle analyzer for optimization
- Check for unnecessary dependencies

## **🔄 Iteration & Improvement**

### **After Each Project**

1. **Document lessons learned** - What worked, what didn't
2. **Update this template** - Add new best practices
3. **Optimize workflow** - Remove friction points
4. **Share knowledge** - Update documentation

### **Continuous Improvement**

- Keep track of common issues
- Refine the development workflow
- Update component library based on usage
- Optimize build and test processes

## **🎯 Success Metrics**

- ✅ Development server starts in <5 seconds
- ✅ Tests run without browser API errors
- ✅ Hot reload works consistently
- ✅ No TypeScript compilation errors
- ✅ ESLint passes without warnings
- ✅ HTTPS development available
- ✅ Proper cleanup prevents memory leaks

---

**Remember**: You're the coding partner, not the command runner. Provide guidance, code, and solutions while letting the user maintain control of their development environment.

This workflow eliminates setup issues and provides a solid foundation for rapid web app development! 🚀
