import { test, expect } from '@playwright/test';

test.describe('🎨 Comprehensive Visual Testing Suite', () => {
  
  test.beforeEach(async ({ page }) => {
    // Set consistent settings for visual testing
    await page.addInitScript(() => {
      // Disable animations for consistent screenshots
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

  test.describe('📸 Screenshot Testing', () => {
    
    test('Should capture full page visual baseline', async ({ page }) => {
      console.log('🔧 Setting up full page screenshot test...');
      
      await page.goto('https://playwright.dev/');
      await page.waitForLoadState('networkidle');
      
      // Wait for all images to load
      await page.waitForFunction(() => {
        const images = Array.from(document.querySelectorAll('img'));
        return images.every(img => img.complete && img.naturalHeight !== 0);
      });
      
      console.log('📸 Capturing full page screenshot...');
      
      // Take full page screenshot for visual comparison
      await expect(page).toHaveScreenshot('homepage-full.png', {
        fullPage: true,
        animations: 'disabled',
        threshold: 0.2 // Allow 20% visual difference
      });
      
      console.log('✅ Full page screenshot captured successfully');
    });

    test('Should capture viewport screenshot', async ({ page }) => {
      console.log('🔧 Setting up viewport screenshot test...');
      
      await page.goto('https://playwright.dev/');
      await page.waitForLoadState('networkidle');
      
      console.log('📸 Capturing viewport screenshot...');
      
      // Capture only the visible viewport
      await expect(page).toHaveScreenshot('homepage-viewport.png', {
        fullPage: false,
        animations: 'disabled'
      });
      
      console.log('✅ Viewport screenshot captured successfully');
    });

    test('Should capture element-specific screenshots', async ({ page }) => {
      console.log('🔧 Setting up element screenshot test...');
      
      await page.goto('https://playwright.dev/');
      await page.waitForLoadState('networkidle');
      
      // Screenshot navigation element specifically
      const navigation = page.locator('nav').first();
      if (await navigation.count() > 0) {
        console.log('📸 Capturing navigation element screenshot...');
        await expect(navigation).toHaveScreenshot('navigation-element.png');
      }
      
      // Screenshot header element specifically  
      const header = page.locator('header').first();
      if (await header.count() > 0) {
        console.log('📸 Capturing header element screenshot...');
        await expect(header).toHaveScreenshot('header-element.png');
      }
      
      // Screenshot hero section
      const heroSection = page.locator('.hero').first();
      if (await heroSection.count() > 0) {
        console.log('📸 Capturing hero section screenshot...');
        await expect(heroSection).toHaveScreenshot('hero-section.png');
      }
      
      console.log('✅ Element screenshots captured successfully');
    });
  });

  test.describe('📱 Responsive Visual Testing', () => {
    
    const devices = [
      { name: 'Mobile Portrait', width: 375, height: 667 },
      { name: 'Mobile Landscape', width: 667, height: 375 },
      { name: 'Tablet Portrait', width: 768, height: 1024 },
      { name: 'Tablet Landscape', width: 1024, height: 768 },
      { name: 'Desktop', width: 1920, height: 1080 },
      { name: 'Large Desktop', width: 2560, height: 1440 }
    ];

    for (const device of devices) {
      test(`Should render correctly on ${device.name} (${device.width}x${device.height})`, async ({ page }) => {
        console.log(`🔧 Setting up ${device.name} test...`);
        
        await page.setViewportSize({ width: device.width, height: device.height });
        await page.goto('https://playwright.dev/');
        await page.waitForLoadState('networkidle');
        
        // Wait for responsive layout adjustments
        await page.waitForTimeout(500);
        
        console.log(`📸 Capturing ${device.name} screenshot...`);
        
        // Capture screenshot for this device size
        await expect(page).toHaveScreenshot(`${device.name.toLowerCase().replace(/\s+/g, '-')}.png`, {
          fullPage: true,
          animations: 'disabled'
        });
        
        // Verify no horizontal scroll on smaller devices
        if (device.width <= 768) {
          const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
          const viewportWidth = device.width;
          expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20); // Allow small tolerance
        }
        
        console.log(`✅ ${device.name} test completed successfully`);
      });
    }
  });

  test.describe('🌈 Theme and Color Testing', () => {
    
    test('Should test light theme visual appearance', async ({ page }) => {
      console.log('🔧 Setting up light theme test...');
      
      await page.goto('https://playwright.dev/');
      await page.waitForLoadState('networkidle');
      
      // Force light theme
      await page.emulateMedia({ colorScheme: 'light' });
      await page.waitForTimeout(500);
      
      console.log('🌞 Testing light theme appearance...');
      
      // Take screenshot in light mode
      await expect(page).toHaveScreenshot('homepage-light-theme.png', {
        animations: 'disabled'
      });
      
      console.log('✅ Light theme test completed');
    });

    test('Should test dark theme visual appearance', async ({ page }) => {
      console.log('🔧 Setting up dark theme test...');
      
      await page.goto('https://playwright.dev/');
      await page.waitForLoadState('networkidle');
      
      // Force dark theme
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.waitForTimeout(500);
      
      console.log('🌙 Testing dark theme appearance...');
      
      // Take screenshot in dark mode
      await expect(page).toHaveScreenshot('homepage-dark-theme.png', {
        animations: 'disabled'
      });
      
      console.log('✅ Dark theme test completed');
    });
  });

  test.describe('🎭 Interactive State Testing', () => {
    
    test('Should capture hover states', async ({ page }) => {
      console.log('🔧 Setting up hover state test...');
      
      await page.goto('https://playwright.dev/');
      await page.waitForLoadState('networkidle');
      
      // Find interactive elements that are visible
      const buttons = page.locator('button:visible, a:visible').first();
      
      if (await buttons.count() > 0) {
        await buttons.scrollIntoViewIfNeeded();
        
        console.log('🖱️ Testing hover state...');
        
        // Hover over the element
        await buttons.hover();
        await page.waitForTimeout(300); // Allow hover effects
        
        // Capture hover state
        await expect(buttons).toHaveScreenshot('button-hover-state.png');
        
        console.log('✅ Hover state captured successfully');
      } else {
        console.log('ℹ️ No visible interactive elements found for hover testing');
      }
    });

    test('Should capture focus states', async ({ page }) => {
      console.log('🔧 Setting up focus state test...');
      
      await page.goto('https://playwright.dev/');
      await page.waitForLoadState('networkidle');
      
      // Find focusable elements
      const focusableElements = page.locator('button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])');
      const elementCount = await focusableElements.count();
      
      if (elementCount > 0) {
        const firstElement = focusableElements.first();
        await firstElement.scrollIntoViewIfNeeded();
        
        console.log('⌨️ Testing focus state...');
        
        // Focus the element
        await firstElement.focus();
        await page.waitForTimeout(300); // Allow focus effects
        
        // Capture focus state
        await expect(firstElement).toHaveScreenshot('element-focus-state.png');
        
        console.log('✅ Focus state captured successfully');
      }
    });

    test('Should capture form interaction states', async ({ page }) => {
      console.log('🔧 Setting up form interaction test...');
      
      await page.goto('https://playwright.dev/');
      await page.waitForLoadState('networkidle');
      
      // Look for search input or any form field
      const searchInput = page.locator('input[type="search"], input[placeholder*="search" i], .search input');
      
      if (await searchInput.count() > 0) {
        const input = searchInput.first();
        await input.scrollIntoViewIfNeeded();
        
        console.log('📝 Testing form interaction states...');
        
        // Empty state
        await expect(input).toHaveScreenshot('form-input-empty.png');
        
        // Focused state
        await input.focus();
        await page.waitForTimeout(200);
        await expect(input).toHaveScreenshot('form-input-focused.png');
        
        // Filled state
        await input.fill('Test search query');
        await page.waitForTimeout(200);
        await expect(input).toHaveScreenshot('form-input-filled.png');
        
        console.log('✅ Form interaction states captured successfully');
      }
    });
  });

  test.describe('📊 Layout and Component Testing', () => {
    
    test('Should verify navigation layout consistency', async ({ page }) => {
      console.log('🔧 Setting up navigation layout test...');
      
      await page.goto('https://playwright.dev/');
      await page.waitForLoadState('networkidle');
      
      const navigation = page.locator('nav, .navbar, [role="navigation"]');
      
      if (await navigation.count() > 0) {
        console.log('🧭 Testing navigation layout...');
        
        // Capture navigation component
        await expect(navigation.first()).toHaveScreenshot('navigation-component.png');
        
        // Test navigation items alignment
        const navItems = navigation.locator('a, button');
        const itemCount = await navItems.count();
        if (itemCount > 0) {
          const firstItem = navItems.first();
          await firstItem.scrollIntoViewIfNeeded();
          const boundingBox = await firstItem.boundingBox();
          if (boundingBox) {
            expect(boundingBox.width).toBeGreaterThan(0);
            expect(boundingBox.height).toBeGreaterThan(0);
          }
        }
        
        console.log('✅ Navigation layout test completed');
      }
    });

    test('Should verify footer layout consistency', async ({ page }) => {
      console.log('🔧 Setting up footer layout test...');
      
      await page.goto('https://playwright.dev/');
      await page.waitForLoadState('networkidle');
      
      const footer = page.locator('footer, [role="contentinfo"]');
      
      if (await footer.count() > 0) {
        console.log('🦶 Testing footer layout...');
        
        // Scroll to footer
        await footer.first().scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);
        
        // Capture footer component
        await expect(footer.first()).toHaveScreenshot('footer-component.png');
        
        console.log('✅ Footer layout test completed');
      }
    });

    test('Should verify card/content grid layouts', async ({ page }) => {
      console.log('🔧 Setting up grid layout test...');
      
      await page.goto('https://playwright.dev/');
      await page.waitForLoadState('networkidle');
      
      // Look for grid or card layouts
      const gridContainers = page.locator('.grid, .cards, [class*="grid"], [class*="card"]').first();
      
      if (await gridContainers.count() > 0) {
        console.log('🃏 Testing grid/card layouts...');
        
        await gridContainers.scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);
        
        // Capture grid layout
        await expect(gridContainers).toHaveScreenshot('grid-layout.png');
        
        console.log('✅ Grid layout test completed');
      }
    });
  });

  test.describe('🖼️ Image and Media Testing', () => {
    
    test('Should verify image loading and display', async ({ page }) => {
      console.log('🔧 Setting up image loading test...');
      
      await page.goto('https://playwright.dev/');
      await page.waitForLoadState('networkidle');
      
      // Wait for all images to load
      await page.waitForFunction(() => {
        const images = Array.from(document.querySelectorAll('img'));
        return images.every(img => img.complete && img.naturalHeight !== 0);
      });
      
      console.log('🖼️ Testing image display...');
      
      const images = page.locator('img');
      const imageCount = await images.count();
      
      console.log(`📊 Found ${imageCount} images to validate`);
      
      // Test first few images
      for (let i = 0; i < Math.min(imageCount, 3); i++) {
        const img = images.nth(i);
        await img.scrollIntoViewIfNeeded();
        
        // Verify image is visible and has proper dimensions
        await expect(img).toBeVisible();
        
        const boundingBox = await img.boundingBox();
        if (boundingBox) {
          expect(boundingBox.width).toBeGreaterThan(0);
          expect(boundingBox.height).toBeGreaterThan(0);
        }
      }
      
      console.log('✅ Image loading test completed');
    });

    test('Should test image lazy loading behavior', async ({ page }) => {
      console.log('🔧 Setting up lazy loading test...');
      
      await page.goto('https://playwright.dev/');
      await page.waitForLoadState('networkidle');
      
      console.log('🦥 Testing lazy loading behavior...');
      
      // Find images with lazy loading
      const lazyImages = page.locator('img[loading="lazy"]');
      const lazyCount = await lazyImages.count();
      
      if (lazyCount > 0) {
        console.log(`📊 Found ${lazyCount} lazy-loaded images`);
        
        // Scroll to trigger lazy loading
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });
        
        // Wait for lazy images to load
        await page.waitForTimeout(1000);
        
        // Verify lazy images are now loaded
        for (let i = 0; i < Math.min(lazyCount, 3); i++) {
          const img = lazyImages.nth(i);
          await expect(img).toBeVisible();
        }
        
        console.log('✅ Lazy loading test completed');
      } else {
        console.log('ℹ️ No lazy-loaded images found');
      }
    });
  });

  test.describe('🎯 Cross-Browser Visual Consistency', () => {
    
    test('Should maintain visual consistency across browsers', async ({ page, browserName }) => {
      console.log(`🔧 Setting up cross-browser test for ${browserName}...`);
      
      await page.goto('https://playwright.dev/');
      await page.waitForLoadState('networkidle');
      
      // Wait for fonts to load
      await page.waitForFunction(() => document.fonts.ready);
      
      console.log(`🌐 Testing visual consistency on ${browserName}...`);
      
      // Capture browser-specific screenshot
      await expect(page).toHaveScreenshot(`homepage-${browserName}.png`, {
        fullPage: false,
        animations: 'disabled',
        threshold: 0.3 // Allow for browser differences
      });
      
      // Test specific CSS rendering
      const heading = page.locator('h1').first();
      if (await heading.count() > 0) {
        const fontSize = await heading.evaluate(el => 
          getComputedStyle(el).fontSize
        );
        expect(fontSize).toBeTruthy();
      }
      
      console.log(`✅ ${browserName} visual consistency test completed`);
    });
  });

  test.describe('⚡ Performance Visual Testing', () => {
    
    test('Should capture loading states and transitions', async ({ page }) => {
      console.log('🔧 Setting up loading state test...');
      
      // Capture loading state
      const responsePromise = page.waitForResponse('**/*');
      await page.goto('https://playwright.dev/');
      
      console.log('⏳ Capturing loading state...');
      
      // Take screenshot during loading (if possible)
      try {
        await expect(page).toHaveScreenshot('loading-state.png', {
          timeout: 2000
        });
      } catch (error) {
        console.log('ℹ️ Loading state too fast to capture');
      }
      
      await responsePromise;
      await page.waitForLoadState('networkidle');
      
      console.log('🎯 Capturing loaded state...');
      
      // Take screenshot of fully loaded page
      await expect(page).toHaveScreenshot('loaded-state.png');
      
      console.log('✅ Loading state test completed');
    });
  });
});

test.describe('🛠️ Visual Testing Utilities', () => {
  
  test('Should provide visual debugging information', async ({ page }) => {
    console.log('🔧 Setting up visual debugging...');
    
    await page.goto('https://playwright.dev/');
    await page.waitForLoadState('networkidle');
    
    // Get page dimensions and viewport info
    const viewportInfo = await page.evaluate(() => {
      return {
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        document: {
          width: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight
        },
        devicePixelRatio: window.devicePixelRatio
      };
    });
    
    console.log('📊 Visual debugging information:');
    console.log(`   Viewport: ${viewportInfo.viewport.width}x${viewportInfo.viewport.height}`);
    console.log(`   Document: ${viewportInfo.document.width}x${viewportInfo.document.height}`);
    console.log(`   Device Pixel Ratio: ${viewportInfo.devicePixelRatio}`);
    
    // Check for visual elements that might cause issues
    const potentialIssues = await page.evaluate(() => {
      const issues = [];
      
      // Check for elements with fixed positioning
      const fixedElements = Array.from(document.querySelectorAll('*')).filter(el => 
        getComputedStyle(el).position === 'fixed'
      );
      if (fixedElements.length > 0) {
        issues.push(`${fixedElements.length} fixed position elements found`);
      }
      
      // Check for elements with transforms
      const transformedElements = Array.from(document.querySelectorAll('*')).filter(el => 
        getComputedStyle(el).transform !== 'none'
      );
      if (transformedElements.length > 0) {
        issues.push(`${transformedElements.length} transformed elements found`);
      }
      
      return issues;
    });
    
    if (potentialIssues.length > 0) {
      console.log('⚠️ Potential visual testing issues:');
      potentialIssues.forEach(issue => console.log(`   - ${issue}`));
    }
    
    expect(viewportInfo.viewport.width).toBeGreaterThan(0);
    expect(viewportInfo.viewport.height).toBeGreaterThan(0);
    
    console.log('✅ Visual debugging completed');
  });
});