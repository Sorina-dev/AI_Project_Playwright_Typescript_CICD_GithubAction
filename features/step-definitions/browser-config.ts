import { LaunchOptions } from '@playwright/test';

// Environment-based configuration
const isCI = process.env['CI'] === 'true';
const isDebug = process.env['DEBUG'] === 'true';

export const browserConfig: LaunchOptions = {
  headless: isCI ? true : false,  // Headless in CI, visible locally
  slowMo: isDebug ? 1000 : 3000,  // Faster in debug mode
  args: [
    '--start-maximized',
    '--no-sandbox',
    '--disable-web-security',
    '--force-device-scale-factor=1',
    '--new-window',
    '--disable-features=VizDisplayCompositor',
    '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding',
    '--disable-backgrounding-occluded-windows'
  ]
};

export const contextConfig = {
  viewport: { width: 1920, height: 1080 },
  recordVideo: isCI ? undefined : {  // Videos only locally, not in CI
    dir: 'test-results/videos',
    size: { width: 1920, height: 1080 }
  }
} as const;