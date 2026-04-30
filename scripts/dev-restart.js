#!/usr/bin/env node

import { execSync } from 'child_process';

console.log('🔄 Development Server Restart Script');
console.log('=====================================');

try {
  // Kill any existing Vite processes
  console.log('1. Stopping existing Vite processes...');
  try {
    execSync('pkill -f vite', { stdio: 'pipe' });
    console.log('   ✅ Existing processes stopped');
  } catch (error) {
    console.log('   ℹ️  No existing processes found');
  }

  // Clear Vite cache
  console.log('2. Clearing Vite cache...');
  try {
    execSync('rm -rf node_modules/.vite', { stdio: 'inherit' });
    console.log('   ✅ Cache cleared');
  } catch (error) {
    console.log('   ℹ️  No cache to clear');
  }

  // Run type check
  console.log('3. Running type check...');
  execSync('npm run type-check', { stdio: 'inherit' });
  console.log('   ✅ Type check passed');

  // Run tests
  console.log('4. Running unit tests...');
  execSync('npm run test:unit', { stdio: 'inherit' });
  console.log('   ✅ Tests passed');

  // Start development server
  console.log('5. Starting development server...');
  console.log('   🚀 Server will be available at: https://localhost:5173');
  console.log('   🔧 Debug hotkeys: Ctrl+D (debug panel), Ctrl+S (screenshot), Ctrl+L (logs)');
  console.log('   📝 Check browser console for debug messages');
  
  execSync('npm run dev', { stdio: 'inherit' });

} catch (error) {
  console.error('❌ Error during restart:', error.message);
  process.exit(1);
}

