import { test, expect } from '@playwright/test';
import { PlaywrightHomePage, LoginPage, TestHelpers } from '../src';
import { validCredentials, expectedMessages } from '../src';

test.describe('POM Demonstration Tests', () => {
  test('comprehensive login flow with POM', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const testHelpers = new TestHelpers(page);
    
    // Navigate and verify login page
    await loginPage.navigateToLoginPage();
    await loginPage.assertLoginPageLoaded();
    
    // Verify URL is correct
    await testHelpers.assertUrlContains('login');
    
    // Test invalid login first
    await loginPage.login('invalid', 'invalid');
    await loginPage.assertLoginFailure();
    
    // Clear form and try valid login
    await loginPage.clearForm();
    await loginPage.login(validCredentials.username, validCredentials.password);
    
    // Verify successful login
    await loginPage.assertLoginSuccess();
    const successMessage = await loginPage.getSuccessMessage();
    expect(successMessage).toContain(expectedMessages.login.success);
    
    // Verify logout functionality
    await loginPage.clickLogoutLink();
    await loginPage.assertLoginPageLoaded();
  });

  test('comprehensive navigation flow with POM', async ({ page }) => {
    const homePage = new PlaywrightHomePage(page);
    const testHelpers = new TestHelpers(page);
    
    // Navigate to homepage
    await homePage.navigateToHomePage();
    await homePage.assertHomePageLoaded();
    
    // Verify page title
    await testHelpers.assertPageTitle(expectedMessages.navigation.playwrightTitle);
    
    // Test navigation elements
    await homePage.assertNavigationPresent();
    
    // Get and verify navigation links
    const navLinks = await homePage.getNavigationLinks();
    expect(navLinks.length).toBeGreaterThan(0);
    
    // Verify features are visible
    const featuresVisible = await homePage.isFeaturesSectonVisible();
    expect(featuresVisible).toBeTruthy();
    
    // Navigate to docs with URL verification
    await testHelpers.performActionAndVerifyUrlChange(
      async () => await homePage.clickDocsLink(),
      'docs'
    );
  });

  test('form interaction patterns with POM', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const testHelpers = new TestHelpers(page);
    
    await loginPage.navigateToLoginPage();
    
    // Test form filling with helper
    const formData = {
      '#username': 'testuser',
      '#password': 'testpassword'
    };
    
    await testHelpers.fillForm(formData);
    
    // Verify form values
    const formValues = await testHelpers.getFormValues({
      username: '#username',
      password: '#password'
    });
    
    expect(formValues['username']).toBe('testuser');
    expect(formValues['password']).toBe('testpassword');
    
    // Submit and verify failure (invalid credentials)
    await loginPage.clickLoginButton();
    await loginPage.assertLoginFailure();
  });

  test('responsive design testing with POM', async ({ page }) => {
    const homePage = new PlaywrightHomePage(page);
    const testHelpers = new TestHelpers(page);
    
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await homePage.navigateToHomePage();
    await homePage.assertHomePageLoaded();
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await homePage.assertNavigationPresent();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await testHelpers.assertPageTitle(expectedMessages.navigation.playwrightTitle);
  });

  test('error handling and retry patterns', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const testHelpers = new TestHelpers(page);
    
    await loginPage.navigateToLoginPage();
    
    // Test retry mechanism
    await testHelpers.retryAction(
      async () => {
        await loginPage.fillUsername(validCredentials.username);
        await loginPage.fillPassword(validCredentials.password);
        await loginPage.clickLoginButton();
        
        // Verify success
        const isSuccessful = await loginPage.isLoginSuccessful();
        if (!isSuccessful) {
          throw new Error('Login failed, retrying...');
        }
      },
      3, // max attempts
      1000 // delay between attempts
    );
    
    // Verify final success
    await loginPage.assertLoginSuccess();
  });

  test('screenshot and debugging helpers', async ({ page }) => {
    const homePage = new PlaywrightHomePage(page);
    const testHelpers = new TestHelpers(page);
    
    await homePage.navigateToHomePage();
    
    // Take screenshot on specific condition
    await testHelpers.screenshotOnFailure(
      async () => await homePage.isFeaturesSectonVisible(),
      'features-section-check'
    );
    
    // Verify multiple conditions
    await testHelpers.verifyMultipleAssertions([
      async () => await homePage.assertHomePageLoaded(),
      async () => await homePage.assertNavigationPresent(),
      async () => await testHelpers.assertPageTitle('Playwright')
    ]);
  });
});