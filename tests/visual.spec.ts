import { test, expect } from '@playwright/test';

test.describe('Visual Testing', () => {
  test('should take a screenshot of the homepage', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
    
    // Take a full page screenshot
    await page.screenshot({ 
      path: 'test-results/homepage-screenshot.png', 
      fullPage: true 
    });
    await page.waitForTimeout(2000); // Just to ensure the screenshot is saved before comparison
    // Visual comparison (requires baseline screenshots)
    //await expect(page).toHaveScreenshot('homepage.png');
  });

  test('should check responsive design on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('https://playwright.dev/');
    await page.waitForLoadState('networkidle');
    
    // Check mobile navigation
    await expect(page.locator('[aria-label="Toggle navigation bar"]')).toBeVisible();
    
    // Take mobile screenshot
    await page.screenshot({ path: 'test-results/mobile-homepage.png' });
  });

  test('should verify element visibility and styling', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    
    // Check specific element properties
    const heroSection = page.locator('.hero');
    await expect(heroSection).toBeVisible();
    
    // Check CSS properties
    await expect(heroSection).toHaveCSS('display', 'flex');
    
    // Check text content
    await expect(page.locator('h1')).toContainText('Playwright');
  });
});