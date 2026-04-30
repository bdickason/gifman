#!/usr/bin/env node

import { execSync } from 'child_process';

console.log('🔍 Running TypeScript type check...');

try {
  execSync('npx tsc --noEmit', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('✅ TypeScript compilation successful - no errors found');
  process.exit(0);
} catch (error) {
  console.error('❌ TypeScript compilation failed');
  process.exit(1);
}
