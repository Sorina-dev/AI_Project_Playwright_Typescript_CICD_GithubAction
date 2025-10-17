import { test, expect } from '@playwright/test';

test.describe('🎨 Visual Testing Suite', () => {
  
  test.beforeEach(async ({ page }) => {
    // Disable animations for consistent screenshots
    await page.addInitScript(() => {
      const style = document.createElement('style');
      style.innerHTML = `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `;
      document.head.appendChild(style);
    });
  });

  test.describe('📸 Basic Screenshot Testing', () => {
    
    test('Should capture full page baseline', async ({ page }) => {
      console.log('🔧 Setting up full page screenshot...');
      
      await page.goto('https://playwright.dev/');
      await page.waitForLoadState('networkidle');
      
      // Wait for images to load
      await page.waitForFunction(() => {
        const images = Array.from(document.querySelectorAll('img'));
        return images.every(img => img.complete && img.naturalHeight !== 0);
      });
      
      console.log('📸 Capturing full page screenshot...');
      
      await expect(page).toHaveScreenshot('homepage-full.png', {
        fullPage: true,
        animations: 'disabled',
        threshold: 0.2
      });
      
      console.log('✅ Full page screenshot completed');
    });

    test('Should capture viewport screenshot', async ({ page }) => {
      console.log('🔧 Setting up viewport screenshot...');
      
      await page.goto('https://playwright.dev/');
      await page.waitForLoadState('networkidle');
      
      console.log('📸 Capturing viewport screenshot...');
      
      await expect(page).toHaveScreenshot('homepage-viewport.png', {
        fullPage: false,
        animations: 'disabled'
      });
      
      console.log('✅ Viewport screenshot completed');
    });

    test('Should capture main navigation', async ({ page }) => {
      console.log('🔧 Setting up navigation screenshot...');
      
      await page.goto('https://playwright.dev/');
      await page.waitForLoadState('networkidle');
      
      // Find the main navigation
      const nav = page.locator('nav').first();
      
      if (await nav.count() > 0) {
        console.log('📸 Capturing navigation screenshot...');
        await expect(nav).toHaveScreenshot('navigation.png');
        console.log('✅ Navigation screenshot completed');
      } else {
        console.log('ℹ️ No navigation element found');
      }
    });
  });

  test.describe('📱 Responsive Testing', () => {
    
    const devices = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1200, height: 800 }
    ];

    for (const device of devices) {
      test(`Should render correctly on ${device.name}`, async ({ page }) => {
        console.log(`🔧 Setting up ${device.name} test...`);
        
        await page.setViewportSize({ 
          width: device.width, 
          height: device.height 
        });
        
        await page.goto('https://playwright.dev/');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(500);
        
        console.log(`📸 Capturing ${device.name} screenshot...`);
        
        await expect(page).toHaveScreenshot(`${device.name}-view.png`, {
          fullPage: false,
          animations: 'disabled'
        });
        
        // Verify no horizontal scroll on mobile
        if (device.width <= 768) {
          const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
          expect(bodyWidth).toBeLessThanOrEqual(device.width + 20);
        }
        
        console.log(`✅ ${device.name} test completed`);
      });
    }
  });

  test.describe('🌈 Theme Testing', () => {
    
    test('Should test light theme', async ({ page }) => {
      console.log('🔧 Setting up light theme test...');
      
      await page.goto('https://playwright.dev/');
      await page.waitForLoadState('networkidle');
      
      await page.emulateMedia({ colorScheme: 'light' });
      await page.waitForTimeout(300);
      
      console.log('🌞 Capturing light theme...');
      
      await expect(page).toHaveScreenshot('theme-light.png', {
        fullPage: false,
        animations: 'disabled'
      });
      
      console.log('✅ Light theme completed');
    });

    test('Should test dark theme', async ({ page }) => {
      console.log('🔧 Setting up dark theme test...');
      
      await page.goto('https://playwright.dev/');
      await page.waitForLoadState('networkidle');
      
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.waitForTimeout(300);
      
      console.log('🌙 Capturing dark theme...');
      
      await expect(page).toHaveScreenshot('theme-dark.png', {
        fullPage: false,
        animations: 'disabled'
      });
      
      console.log('✅ Dark theme completed');
    });
  });

  test.describe('🎯 Interactive States', () => {
    
    test('Should test focus states', async ({ page }) => {
      console.log('🔧 Setting up focus state test...');
      
      await page.goto('https://playwright.dev/');
      await page.waitForLoadState('networkidle');
      
      // Find the first visible focusable element
      const focusable = page.locator('a, button, input').first();
      
      if (await focusable.count() > 0) {
        console.log('⌨️ Testing focus state...');
        
        await focusable.focus();
        await page.waitForTimeout(200);
        
        await expect(focusable).toHaveScreenshot('focus-state.png');
        
        console.log('✅ Focus state completed');
      } else {
        console.log('ℹ️ No focusable elements found');
      }
    });

    test('Should test button interactions', async ({ page }) => {
      console.log('🔧 Setting up button interaction test...');
      
      await page.goto('https://playwright.dev/');
      await page.waitForLoadState('networkidle');
      
      // Find a visible button or link that's actually in the viewport
      const button = page.locator('button:visible, a:visible').filter({ hasText: /docs|api|get started/i }).first();
      
      if (await button.count() > 0) {
        console.log('🖱️ Testing button states...');
        
        // Ensure element is in viewport
        await button.scrollIntoViewIfNeeded();
        
        // Normal state
        await expect(button).toHaveScreenshot('button-normal.png');
        
        // Hover state
        await button.hover();
        await page.waitForTimeout(200);
        await expect(button).toHaveScreenshot('button-hover.png');
        
        console.log('✅ Button interaction completed');
      } else {
        console.log('ℹ️ No suitable buttons found, testing generic link');
        
        // Fallback to any visible navigation link
        const navLink = page.locator('nav a:visible').first();
        if (await navLink.count() > 0) {
          await navLink.scrollIntoViewIfNeeded();
          await expect(navLink).toHaveScreenshot('nav-link.png');
        }
      }
    });
  });

  test.describe('📊 Layout Components', () => {
    
    test('Should verify main content layout', async ({ page }) => {
      console.log('🔧 Setting up layout test...');
      
      await page.goto('https://playwright.dev/');
      await page.waitForLoadState('networkidle');
      
      // Test main content area
      const main = page.locator('main, [role="main"]').first();
      
      if (await main.count() > 0) {
        console.log('📋 Testing main content layout...');
        
        await expect(main).toHaveScreenshot('main-content.png');
        
        // Verify main content is visible
        await expect(main).toBeVisible();
        
        console.log('✅ Layout test completed');
      } else {
        console.log('ℹ️ No main content area found');
      }
    });

    test('Should verify header layout', async ({ page }) => {
      console.log('🔧 Setting up header test...');
      
      await page.goto('https://playwright.dev/');
      await page.waitForLoadState('networkidle');
      
      // Test page header
      const header = page.locator('header').first();
      
      if (await header.count() > 0) {
        console.log('🏠 Testing header layout...');
        
        await expect(header).toHaveScreenshot('header-layout.png');
        
        console.log('✅ Header test completed');
      } else {
        console.log('ℹ️ No header found');
      }
    });
  });

  test.describe('🔍 Cross-Browser Consistency', () => {
    
    test('Should maintain visual consistency', async ({ page, browserName }) => {
      console.log(`🔧 Testing ${browserName} consistency...`);
      
      await page.goto('https://playwright.dev/');
      await page.waitForLoadState('networkidle');
      
      // Wait for fonts to load
      await page.waitForFunction(() => document.fonts.ready);
      
      console.log(`🌐 Capturing ${browserName} screenshot...`);
      
      await expect(page).toHaveScreenshot(`browser-${browserName}.png`, {
        fullPage: false,
        animations: 'disabled',
        threshold: 0.3 // Higher threshold for cross-browser differences
      });
      
      console.log(`✅ ${browserName} consistency completed`);
    });
  });

  test.describe('🛠️ Utility Tests', () => {
    
    test('Should capture page performance metrics', async ({ page }) => {
      console.log('🔧 Setting up performance test...');
      
      const startTime = Date.now();
      
      await page.goto('https://playwright.dev/');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      console.log(`⏱️ Page load time: ${loadTime}ms`);
      
      // Get viewport info
      const viewport = await page.evaluate(() => ({
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio
      }));
      
      console.log(`📏 Viewport: ${viewport.width}x${viewport.height}, DPR: ${viewport.devicePixelRatio}`);
      
      // Only take screenshot if load time is reasonable
      if (loadTime < 10000) {
        await expect(page).toHaveScreenshot('performance-test.png');
        console.log('✅ Performance test completed');
      } else {
        console.log('⚠️ Page loaded slowly, skipping screenshot');
      }
      
      expect(loadTime).toBeLessThan(15000); // 15 second timeout
    });

    test('Should test image loading', async ({ page }) => {
      console.log('🔧 Setting up image test...');
      
      await page.goto('https://playwright.dev/');
      await page.waitForLoadState('networkidle');
      
      // Wait for all images to load
      await page.waitForFunction(() => {
        const images = Array.from(document.querySelectorAll('img'));
        return images.every(img => img.complete && img.naturalHeight !== 0);
      });
      
      const imageCount = await page.locator('img').count();
      console.log(`🖼️ Found ${imageCount} images on page`);
      
      if (imageCount > 0) {
        // Test first image
        const firstImage = page.locator('img').first();
        await expect(firstImage).toBeVisible();
        
        console.log('✅ Image loading test completed');
      }
      
      expect(imageCount).toBeGreaterThan(0);
    });
  });
});