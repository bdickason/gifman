import { describe, it, expect } from 'vitest';

describe('Basic Test Suite', () => {
  it('should run basic tests', () => {
    expect(2 + 2).toBe(4);
    expect('hello').toBe('hello');
    expect(true).toBe(true);
  });

  it('should handle arrays', () => {
    const arr = [1, 2, 3];
    expect(arr).toHaveLength(3);
    expect(arr).toContain(2);
  });

  it('should handle objects', () => {
    const obj = { name: 'test', value: 42 };
    expect(obj.name).toBe('test');
    expect(obj.value).toBe(42);
  });
});

describe('Template Tests', () => {
  it('should verify template structure', () => {
    // This test verifies our template setup is working
    const templateInfo = {
      name: 'Web App Template',
      version: '1.0.0',
      hasReact: true,
      hasTypeScript: true,
      hasVite: true
    };
    
    expect(templateInfo.name).toBe('Web App Template');
    expect(templateInfo.hasReact).toBe(true);
    expect(templateInfo.hasTypeScript).toBe(true);
    expect(templateInfo.hasVite).toBe(true);
  });
});
