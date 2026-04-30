import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { createServer } from 'vite';

describe('Server Configuration Tests', () => {
  describe('Vite Configuration', () => {
    it('should have correct Vite config structure', () => {
      // This test verifies our Vite configuration structure without starting servers
      const viteConfigPath = join(process.cwd(), 'vite.config.ts');
      expect(existsSync(viteConfigPath)).toBe(true);
      
      const configContent = readFileSync(viteConfigPath, 'utf8');
      
      // Check for required configuration elements (HTTP dev server — no TLS)
      expect(configContent).not.toContain('basicSsl');
      expect(configContent).not.toMatch(/https:\s*true/);
      expect(configContent).toContain('port: 5174');
      expect(configContent).toContain('publicDir: \'public\'');
      expect(configContent).toContain('gifman-gifs-api');
      expect(configContent).toContain("pathname === '/api/gifs'");
      expect(configContent).toContain('configurePreviewServer');
    });

    it('should use plain HTTP for the dev server', () => {
      const viteConfigPath = join(process.cwd(), 'vite.config.ts');
      const configContent = readFileSync(viteConfigPath, 'utf8');
      expect(configContent).not.toContain('@vitejs/plugin-basic-ssl');
    });

    it('should expose HTTPS via vite.config.ssl.ts overlay', () => {
      const sslPath = join(process.cwd(), 'vite.config.ssl.ts');
      expect(existsSync(sslPath)).toBe(true);
      const sslContent = readFileSync(sslPath, 'utf8');
      expect(sslContent).toContain('mergeConfig');
      expect(sslContent).toMatch(/server:\s*\{[^}]*https:\s*true/s);
      expect(sslContent).toMatch(/preview:\s*\{[^}]*https:\s*true/s);
    });
  });

  describe('Static File Serving', () => {
    it('should serve index.html from public directory', async () => {
      const publicDir = join(process.cwd(), 'public');
      const indexHtmlPath = join(publicDir, 'index.html');

      expect(existsSync(publicDir)).toBe(true);
      expect(existsSync(indexHtmlPath)).toBe(true);

      const htmlContent = readFileSync(indexHtmlPath, 'utf8');
      expect(htmlContent).toContain('Rufus GIF Preview');
      expect(htmlContent).toContain("fetch('/api/gifs')");
    });

    it('should have correct HTML structure', async () => {
      const htmlContent = readFileSync(join(process.cwd(), 'public', 'index.html'), 'utf8');

      expect(htmlContent).toContain('<html lang="en">');
      expect(htmlContent).toContain('<title>Rufus GIF Preview</title>');
      expect(htmlContent).toContain('id="root"');
      expect(htmlContent).toContain('renderSection');
    });

    it('should have root index.html for Vite entry point', async () => {
      const rootIndexPath = join(process.cwd(), 'index.html');
      expect(existsSync(rootIndexPath)).toBe(true);
      
      const htmlContent = readFileSync(rootIndexPath, 'utf8');
      expect(htmlContent).toContain('gifman');
      expect(htmlContent).toContain('<div id="root"></div>');
      expect(htmlContent).toContain('src="/src/main.tsx"');
    });
  });

  describe('Package Configuration', () => {
    it('should have correct package.json scripts', async () => {
      const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
      
      expect(packageJson.scripts).toHaveProperty('dev');
      expect(packageJson.scripts).toHaveProperty('dev:ssl');
      expect(packageJson.scripts).toHaveProperty('dev:persistent');
      expect(packageJson.scripts).toHaveProperty('test');
      expect(packageJson.scripts).toHaveProperty('test:run');
      expect(packageJson.scripts).toHaveProperty('build');
    });

    it('should have required dependencies', async () => {
      const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));

      expect(packageJson.dependencies).toHaveProperty('react');
      expect(packageJson.dependencies).toHaveProperty('react-dom');
      expect(packageJson.devDependencies).toHaveProperty('vite');
      expect(packageJson.devDependencies).toHaveProperty('vitest');
      expect(packageJson.devDependencies).not.toHaveProperty('@vitejs/plugin-basic-ssl');
    });

    it('should wire dev:ssl and preview:ssl to vite.config.ssl.ts', () => {
      const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
      expect(packageJson.scripts['dev:ssl']).toContain('vite.config.ssl.ts');
      expect(packageJson.scripts['preview:ssl']).toContain('vite.config.ssl.ts');
    });
  });

  describe('File Structure', () => {
    it('should have correct project structure', () => {
      const cwd = process.cwd();
      
      // Check essential directories
      expect(existsSync(join(cwd, 'src'))).toBe(true);
      expect(existsSync(join(cwd, 'public'))).toBe(true);
      expect(existsSync(join(cwd, 'scripts'))).toBe(true);
      
      // Check essential files
      expect(existsSync(join(cwd, 'package.json'))).toBe(true);
      expect(existsSync(join(cwd, 'vite.config.ts'))).toBe(true);
      expect(existsSync(join(cwd, 'tsconfig.json'))).toBe(true);
      expect(existsSync(join(cwd, 'README.md'))).toBe(true);
      expect(existsSync(join(cwd, 'DEVELOPMENT.md'))).toBe(true);
      expect(existsSync(join(cwd, 'data', 'gifs.json'))).toBe(true);
    });

    it('should have component files', () => {
      const cwd = process.cwd();
      
      const componentsDir = join(cwd, 'src', 'components');
      expect(existsSync(componentsDir)).toBe(true);
      
      // Check for key components
      expect(existsSync(join(componentsDir, 'Button.tsx'))).toBe(true);
      expect(existsSync(join(componentsDir, 'Input.tsx'))).toBe(true);
      expect(existsSync(join(componentsDir, 'ErrorBoundary.tsx'))).toBe(true);
    });

    it('should have utility files', () => {
      const cwd = process.cwd();
      
      const utilsDir = join(cwd, 'src', 'utils');
      expect(existsSync(utilsDir)).toBe(true);
      
      // Check for key utilities
      expect(existsSync(join(utilsDir, 'debug.ts'))).toBe(true);
      expect(existsSync(join(utilsDir, 'dom.ts'))).toBe(true);
      expect(existsSync(join(utilsDir, 'validation.ts'))).toBe(true);
    });
  });

  describe('Configuration Validation', () => {
    it('should have valid TypeScript configuration', () => {
      const tsConfigPath = join(process.cwd(), 'tsconfig.app.json');
      expect(existsSync(tsConfigPath)).toBe(true);
      
      const tsConfig = JSON.parse(readFileSync(tsConfigPath, 'utf8'));
      expect(tsConfig).toHaveProperty('compilerOptions');
      expect(tsConfig.compilerOptions).toHaveProperty('strict');
      expect(tsConfig.compilerOptions.strict).toBe(true);
    });

    it('should have valid ESLint configuration', () => {
      const eslintConfigPath = join(process.cwd(), 'eslint.config.js');
      expect(existsSync(eslintConfigPath)).toBe(true);
      
      const eslintConfig = readFileSync(eslintConfigPath, 'utf8');
      expect(eslintConfig).toContain('@eslint/js');
      expect(eslintConfig).toContain('typescript-eslint');
    });
  });

  describe('GET /api/gifs', () => {
    it('returns gifs from /api/gifs', async () => {
      const vite = await createServer({
        configFile: join(process.cwd(), 'vite.config.ts'),
        server: { port: 5174, strictPort: false },
        logLevel: 'error',
      });
      await vite.listen();
      const addr = vite.httpServer?.address();
      const port =
        addr && typeof addr === 'object' ? addr.port : vite.config.server.port;
      console.log('[test][gifman-api] dev server port', port);
      try {
        const res = await fetch(`http://localhost:${port}/api/gifs`);
        expect(res.status).toBe(200);
        const json = (await res.json()) as { intro?: unknown };
        expect(json.intro).toBeDefined();
        expect(Array.isArray(json.intro)).toBe(true);
      } finally {
        await vite.close();
      }
    }, 30_000);
  });
});
