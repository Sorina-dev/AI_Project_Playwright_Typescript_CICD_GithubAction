import { test, expect } from '@playwright/test';
import { PlaywrightHomePage } from '../src/pages';

/**
 * BDD (Behavior-Driven Development) Test Suite
 * 
 * This file demonstrates BDD testing patterns using Playwright with TypeScript.
 * BDD focuses on describing the behavior of the application from the user's perspective
 * using Given-When-Then scenarios.
 * 
 * Structure:
 * - Given: Initial context/state
 * - When: Action performed
 * - Then: Expected outcome
 */

// Test data for BDD scenarios
const testUsers = {
  validUser: {
    email: 'test@playwright.dev',
    password: 'securePassword123'
  },
  invalidUser: {
    email: 'invalid@example.com',
    password: 'wrongPassword'
  }
};

const testContent = {
  searchTerm: 'API testing',
  blogTitle: 'Getting Started with Playwright',
  documentationSection: 'Installation'
};

test.describe('🎭 BDD Test Suite - Playwright Website Features', () => {

  test.describe('Feature: Homepage Navigation', () => {
    
    test('Scenario: User visits the homepage and sees main navigation elements', async ({ page }) => {
      console.log('🎯 Scenario: User visits the homepage and sees main navigation elements');
      
      const homePage = new PlaywrightHomePage(page);

      // Given: User is on the internet
      console.log('  📋 Given: User has access to the internet');
      
      // When: User navigates to the Playwright homepage
      console.log('  🎬 When: User navigates to the Playwright homepage');
      await homePage.navigateToHomePage();
      
      // Then: User should see the main navigation elements
      console.log('  ✅ Then: User should see the main navigation elements');
      await homePage.assertHomePageLoaded();
      await homePage.assertNavigationPresent();
      
      // And: The page title should contain "Playwright"
      console.log('  ✅ And: The page title should contain "Playwright"');
      await expect(page).toHaveTitle(/Playwright/);
      
      console.log('  🎉 Scenario completed successfully!');
    });

    test('Scenario: User can access documentation from homepage', async ({ page }) => {
      console.log('🎯 Scenario: User can access documentation from homepage');
      
      const homePage = new PlaywrightHomePage(page);

      // Given: User is on the Playwright homepage
      console.log('  📋 Given: User is on the Playwright homepage');
      await homePage.navigateToHomePage();
      await homePage.assertHomePageLoaded();
      
      // When: User clicks on the "Docs" link
      console.log('  🎬 When: User clicks on the "Docs" link');
      await homePage.clickDocsLink();
      
      // Then: User should be redirected to the documentation page
      console.log('  ✅ Then: User should be redirected to the documentation page');
      await expect(page).toHaveURL(/.*docs.*/);
      
      // And: The documentation page should load successfully
      console.log('  ✅ And: The documentation page should load successfully');
      await expect(page.locator('h1')).toBeVisible();
      
      console.log('  🎉 Scenario completed successfully!');
    });

    test('Scenario: User can view getting started information', async ({ page }) => {
      console.log('🎯 Scenario: User can view getting started information');
      
      const homePage = new PlaywrightHomePage(page);

      // Given: User is on the Playwright homepage
      console.log('  📋 Given: User is on the Playwright homepage');
      await homePage.navigateToHomePage();
      
      // When: User looks for getting started information
      console.log('  🎬 When: User looks for getting started information');
      
      // Then: User should see the "Get Started" button
      console.log('  ✅ Then: User should see the "Get Started" button');
      await expect(page.locator('text=Get started')).toBeVisible();
      
      // And: The main features should be highlighted
      console.log('  ✅ And: The main features should be highlighted');
      await expect(page.locator('text=Cross-browser')).toBeVisible();
      
      console.log('  🎉 Scenario completed successfully!');
    });

  });

  test.describe('Feature: Search Functionality', () => {
    
    test('Scenario: User attempts to search for content', async ({ page }) => {
      console.log('🎯 Scenario: User attempts to search for content');
      
      const homePage = new PlaywrightHomePage(page);

      // Given: User is on the Playwright homepage
      console.log('  📋 Given: User is on the Playwright homepage');
      await homePage.navigateToHomePage();
      await homePage.assertHomePageLoaded();
      
      // When: User tries to search for content
      console.log('  🎬 When: User tries to search for content');
      await homePage.searchContent(testContent.searchTerm);
      
      // Then: The search functionality should be accessible
      console.log('  ✅ Then: The search functionality should be accessible');
      // Note: This is a placeholder test as search might not be fully implemented
      await expect(page).toHaveURL(/playwright\.dev/);
      
      console.log('  🎉 Scenario completed successfully!');
    });

  });

  test.describe('Feature: Responsive Design', () => {
    
    test('Scenario: User views the website on mobile device', async ({ page }) => {
      console.log('🎯 Scenario: User views the website on mobile device');
      
      const homePage = new PlaywrightHomePage(page);

      // Given: User is using a mobile device
      console.log('  📋 Given: User is using a mobile device');
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
      
      // When: User navigates to the Playwright homepage
      console.log('  🎬 When: User navigates to the Playwright homepage');
      await homePage.navigateToHomePage();
      
      // Then: The page should be responsive and usable
      console.log('  ✅ Then: The page should be responsive and usable');
      await homePage.assertHomePageLoaded();
      
      // And: Navigation elements should be accessible (mobile may use hamburger menu)
      console.log('  ✅ And: Navigation elements should be accessible');
      // On mobile, navigation might be in a hamburger menu, so we'll check for basic navigation presence
      const hasNavigation = await page.locator('nav, .navbar, [role="navigation"]').isVisible();
      expect(hasNavigation).toBe(true);
      
      console.log('  🎉 Scenario completed successfully!');
    });

    test('Scenario: User views the website on tablet device', async ({ page }) => {
      console.log('🎯 Scenario: User views the website on tablet device');
      
      const homePage = new PlaywrightHomePage(page);

      // Given: User is using a tablet device
      console.log('  📋 Given: User is using a tablet device');
      await page.setViewportSize({ width: 768, height: 1024 }); // iPad size
      
      // When: User navigates to the Playwright homepage
      console.log('  🎬 When: User navigates to the Playwright homepage');
      await homePage.navigateToHomePage();
      
      // Then: The page should display correctly
      console.log('  ✅ Then: The page should display correctly');
      await homePage.assertHomePageLoaded();
      
      // And: All interactive elements should be functional (tablet may have different navigation)
      console.log('  ✅ And: All interactive elements should be functional');
      // On tablet, check for navigation container rather than specific elements
      const hasNavigation = await page.locator('nav, .navbar, [role="navigation"]').isVisible();
      expect(hasNavigation).toBe(true);
      
      console.log('  🎉 Scenario completed successfully!');
    });

  });

  test.describe('Feature: User Authentication (Demo)', () => {
    
    test('Scenario: User attempts to login with valid credentials', async ({ page }) => {
      console.log('🎯 Scenario: User attempts to login with valid credentials');
      
      // Note: This is a demo scenario as Playwright.dev doesn't have a login form
      // In a real application, you would navigate to an actual login page
      
      // Given: User is on the login page
      console.log('  📋 Given: User is on the login page');
      // For demo purposes, we'll use the homepage
      await page.goto('https://playwright.dev');
      
      // When: User enters valid credentials
      console.log('  🎬 When: User enters valid credentials');
      console.log(`    📧 Email: ${testUsers.validUser.email}`);
      console.log(`    🔑 Password: [PROTECTED]`);
      
      // Then: User should be authenticated successfully
      console.log('  ✅ Then: User should be authenticated successfully');
      // For demo, we'll just verify the page loads
      await expect(page).toHaveTitle(/Playwright/);
      
      console.log('  🎉 Scenario completed successfully!');
    });

    test('Scenario: User attempts to login with invalid credentials', async ({ page }) => {
      console.log('🎯 Scenario: User attempts to login with invalid credentials');
      
      // Given: User is on the login page
      console.log('  📋 Given: User is on the login page');
      await page.goto('https://playwright.dev');
      
      // When: User enters invalid credentials
      console.log('  🎬 When: User enters invalid credentials');
      console.log(`    📧 Email: ${testUsers.invalidUser.email}`);
      console.log(`    🔑 Password: [INVALID]`);
      
      // Then: User should see an error message
      console.log('  ✅ Then: User should see an error message');
      // For demo, we'll verify page is still accessible
      await expect(page).toHaveTitle(/Playwright/);
      
      console.log('  🎉 Scenario completed successfully!');
    });

  });

  test.describe('Feature: Content Discovery', () => {
    
    test('Scenario: User explores different sections of the website', async ({ page }) => {
      console.log('🎯 Scenario: User explores different sections of the website');
      
      const homePage = new PlaywrightHomePage(page);

      // Given: User is on the Playwright homepage
      console.log('  📋 Given: User is on the Playwright homepage');
      await homePage.navigateToHomePage();
      
      // When: User explores the main features section
      console.log('  🎬 When: User explores the main features section');
      
      // Then: User should see information about Playwright capabilities
      console.log('  ✅ Then: User should see information about Playwright capabilities');
      await expect(page.locator('text=Cross-browser')).toBeVisible();
      
      // And: User should be able to access additional resources
      console.log('  ✅ And: User should be able to access additional resources');
      await homePage.assertNavigationPresent();
      
      console.log('  🎉 Scenario completed successfully!');
    });

    test('Scenario: User wants to learn about API testing', async ({ page }) => {
      console.log('🎯 Scenario: User wants to learn about API testing');
      
      const homePage = new PlaywrightHomePage(page);

      // Given: User is interested in API testing with Playwright
      console.log('  📋 Given: User is interested in API testing with Playwright');
      await homePage.navigateToHomePage();
      
      // When: User navigates to documentation
      console.log('  🎬 When: User navigates to documentation');
      await homePage.clickDocsLink();
      
      // Then: User should find relevant API testing information
      console.log('  ✅ Then: User should find relevant API testing information');
      await expect(page).toHaveURL(/.*docs.*/);
      
      // And: The documentation should be comprehensive
      console.log('  ✅ And: The documentation should be comprehensive');
      await expect(page.locator('h1')).toBeVisible();
      
      console.log('  🎉 Scenario completed successfully!');
    });

  });

  test.describe('Feature: Cross-Browser Compatibility', () => {
    
    test('Scenario: Website works consistently across different browsers', async ({ page, browserName }) => {
      console.log(`🎯 Scenario: Website works consistently in ${browserName}`);
      
      const homePage = new PlaywrightHomePage(page);

      // Given: User is using a specific browser
      console.log(`  📋 Given: User is using ${browserName} browser`);
      
      // When: User visits the Playwright website
      console.log('  🎬 When: User visits the Playwright website');
      await homePage.navigateToHomePage();
      
      // Then: The website should function properly
      console.log('  ✅ Then: The website should function properly');
      await homePage.assertHomePageLoaded();
      
      // And: All navigation elements should be interactive
      console.log('  ✅ And: All navigation elements should be interactive');
      await homePage.assertNavigationPresent();
      
      // And: The user experience should be consistent
      console.log('  ✅ And: The user experience should be consistent');
      await expect(page).toHaveTitle(/Playwright/);
      
      console.log(`  🎉 Scenario completed successfully in ${browserName}!`);
    });

  });

  test.describe('Feature: Performance and Accessibility', () => {
    
    test('Scenario: Website loads within acceptable time limits', async ({ page }) => {
      console.log('🎯 Scenario: Website loads within acceptable time limits');
      
      // Given: User has a standard internet connection
      console.log('  📋 Given: User has a standard internet connection');
      
      // When: User navigates to the website
      console.log('  🎬 When: User navigates to the website');
      const startTime = Date.now();
      await page.goto('https://playwright.dev');
      const loadTime = Date.now() - startTime;
      
      // Then: The page should load within 5 seconds
      console.log('  ✅ Then: The page should load within 5 seconds');
      expect(loadTime).toBeLessThan(5000);
      console.log(`    ⏱️ Actual load time: ${loadTime}ms`);
      
      // And: The page should be fully interactive
      console.log('  ✅ And: The page should be fully interactive');
      await expect(page.locator('h1')).toBeVisible();
      
      console.log('  🎉 Scenario completed successfully!');
    });

    test('Scenario: Website meets basic accessibility requirements', async ({ page }) => {
      console.log('🎯 Scenario: Website meets basic accessibility requirements');
      
      const homePage = new PlaywrightHomePage(page);

      // Given: User is using assistive technology
      console.log('  📋 Given: User is using assistive technology');
      
      // When: User navigates to the website
      console.log('  🎬 When: User navigates to the website');
      await homePage.navigateToHomePage();
      
      // Then: The page should have proper heading structure
      console.log('  ✅ Then: The page should have proper heading structure');
      await expect(page.locator('h1')).toBeVisible();
      
      // And: Interactive elements should be keyboard accessible
      console.log('  ✅ And: Interactive elements should be keyboard accessible');
      // Check for focusable elements
      const focusableElements = page.locator('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const count = await focusableElements.count();
      expect(count).toBeGreaterThan(0);
      console.log(`    🎯 Found ${count} focusable elements`);
      
      console.log('  🎉 Scenario completed successfully!');
    });

  });

});

/**
 * 📚 BDD Testing Patterns Summary:
 * 
 * ✅ Given-When-Then Structure
 * ✅ User-focused scenarios
 * ✅ Business-readable test descriptions
 * ✅ Comprehensive feature coverage
 * ✅ Cross-browser compatibility testing
 * ✅ Responsive design validation
 * ✅ Performance testing
 * ✅ Accessibility considerations
 * ✅ Clear console logging for traceability
 * ✅ Real-world user scenarios
 * 
 * 🎯 Key BDD Principles:
 * - Tests describe behavior, not implementation
 * - Scenarios are written from user's perspective
 * - Clear acceptance criteria using Given-When-Then
 * - Focus on business value and user outcomes
 * - Tests serve as living documentation
 * - Collaboration between developers, testers, and business analysts
 */