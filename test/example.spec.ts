import { test, expect } from '@playwright/test';
import { PlaywrightHomePage, PlaywrightDocsPage } from '../src/pages';

test.describe('Basic Navigation Tests', () => {
  test('should load the homepage', async ({ page }) => {
    const homePage = new PlaywrightHomePage(page);
    
    // Navigate to homepage using POM
    await homePage.navigateToHomePage();
    
    // Assert homepage loaded correctly using POM methods
    await homePage.assertHomePageLoaded();
    await homePage.assertNavigationPresent();
  });

  test('should navigate to docs', async ({ page }) => {
    const homePage = new PlaywrightHomePage(page);
    const docsPage = new PlaywrightDocsPage(page);
    
    // Navigate to homepage
    await homePage.navigateToHomePage();
    
    // Click on the docs link using POM
    await homePage.clickDocsLink();
    
    // Assert docs page loaded using POM
    await docsPage.assertDocsPageLoaded();
  });

  test('should search for content', async ({ page }) => {
    const homePage = new PlaywrightHomePage(page);
    
    // Navigate to homepage using POM
    await homePage.navigateToHomePage();
    
    // Search for content using POM
    await homePage.searchContent('API');
    
    // Wait for page to update after search action
    await homePage.waitForPageLoad();
  });

  test('should display main features', async ({ page }) => {
    const homePage = new PlaywrightHomePage(page);
    
    // Navigate to homepage
    await homePage.navigateToHomePage();
    
    // Verify features section is visible
    const featuresVisible = await homePage.isFeaturesSectonVisible();
    expect(featuresVisible).toBeTruthy();
    
    // Verify code example is visible
    const codeExampleVisible = await homePage.isCodeExampleVisible();
    expect(codeExampleVisible).toBeTruthy();
  });
});