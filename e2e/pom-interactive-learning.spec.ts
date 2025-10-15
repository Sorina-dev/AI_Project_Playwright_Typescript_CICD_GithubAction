import { test } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { validCredentials } from '../src/data/testData';

/**
 * 🎓 INTERACTIVE POM LEARNING GUIDE
 * 
 * Run this test to see step-by-step how POM works!
 * Each test demonstrates a key POM concept with detailed explanations.
 */

test.describe('🎓 POM Learning Guide - Interactive Examples', () => {

  test('📖 Lesson 1: What is a Page Object?', async ({ page }) => {
    console.log('='.repeat(60));
    console.log('📖 LESSON 1: Understanding Page Objects');
    console.log('='.repeat(60));
    
    console.log('🤔 Question: What is a Page Object?');
    console.log('💡 Answer: A class that represents a web page and its elements');
    console.log('');
    
    console.log('🔧 Creating a LoginPage object...');
    const loginPage = new LoginPage(page);
    console.log('✅ Created! This object contains:');
    console.log('   📍 Locators (how to find elements)');
    console.log('   🎬 Methods (actions you can do)');
    console.log('   ✅ Assertions (ways to check page state)');
    console.log('');
    
    await loginPage.navigateToLoginPage();
    console.log('🌐 Navigated to login page using POM!');
    console.log('💡 Instead of: page.goto("long-url...")');
    console.log('💡 We used: loginPage.navigateToLoginPage()');
  });

  test('📖 Lesson 2: Locators - Finding Elements', async ({ page }) => {
    console.log('='.repeat(60));
    console.log('📖 LESSON 2: Understanding Locators');
    console.log('='.repeat(60));
    
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    
    console.log('🔍 Locators are defined in the page object constructor:');
    console.log('   this.usernameInput = page.locator("#username")');
    console.log('   this.passwordInput = page.locator("#password")');
    console.log('   this.loginButton = page.locator("button[type=submit]")');
    console.log('');
    
    console.log('💡 Benefits:');
    console.log('   ✅ Centralized - all selectors in one place');
    console.log('   ✅ Reusable - multiple methods can use same locator');
    console.log('   ✅ Maintainable - change selector once, works everywhere');
    console.log('');
    
    console.log('🎯 Testing locators by filling form...');
    await loginPage.fillUsername('demo-username');
    await loginPage.fillPassword('demo-password');
    console.log('✅ Form filled using page object methods!');
  });

  test('📖 Lesson 3: Methods - Page Actions', async ({ page }) => {
    console.log('='.repeat(60));
    console.log('📖 LESSON 3: Understanding Methods');
    console.log('='.repeat(60));
    
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    
    console.log('🎬 Page objects have different types of methods:');
    console.log('');
    console.log('1️⃣ Simple Actions:');
    console.log('   - fillUsername()');
    console.log('   - fillPassword()');
    console.log('   - clickLoginButton()');
    console.log('');
    
    console.log('2️⃣ Composite Actions:');
    console.log('   - login() - combines fill username + password + click');
    console.log('');
    
    console.log('3️⃣ Information Getters:');
    console.log('   - getErrorMessage()');
    console.log('   - getSuccessMessage()');
    console.log('   - getFormValues()');
    console.log('');
    
    console.log('🎯 Demonstrating composite action...');
    await loginPage.login(validCredentials.username, validCredentials.password);
    console.log('✅ One method call performed multiple steps!');
  });

  test('📖 Lesson 4: Inheritance from BasePage', async ({ page }) => {
    console.log('='.repeat(60));
    console.log('📖 LESSON 4: Understanding Inheritance');
    console.log('='.repeat(60));
    
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    
    console.log('🏗️ LoginPage extends BasePage');
    console.log('📋 This means LoginPage inherits all BasePage methods:');
    console.log('');
    console.log('From BasePage:');
    console.log('   🌐 goto() - navigation');
    console.log('   ⏳ waitForPageLoad() - timing');
    console.log('   🖱️ clickElement() - interactions');
    console.log('   ⌨️ fillInput() - form filling');
    console.log('   ✅ assertElementVisible() - verification');
    console.log('');
    
    console.log('Plus LoginPage-specific methods:');
    console.log('   🔐 login() - login workflow');
    console.log('   📝 fillUsername() - specific to login form');
    console.log('   🔍 assertLoginSuccess() - login-specific verification');
    console.log('');
    
    const currentUrl = await loginPage.getCurrentUrl();
    console.log('🌐 Current URL (using inherited method): ' + currentUrl.substring(0, 50) + '...');
  });

  test('📖 Lesson 5: Assertions and Verification', async ({ page }) => {
    console.log('='.repeat(60));
    console.log('📖 LESSON 5: Understanding Assertions');
    console.log('='.repeat(60));
    
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    
    console.log('✅ Page objects provide intelligent assertions:');
    console.log('');
    console.log('🔍 assertLoginPageLoaded() checks:');
    console.log('   - Username field is visible');
    console.log('   - Password field is visible');
    console.log('   - Login button is visible');
    console.log('   - Page title is correct');
    console.log('');
    
    await loginPage.assertLoginPageLoaded();
    console.log('✅ Login page assertion passed!');
    console.log('');
    
    await loginPage.login(validCredentials.username, validCredentials.password);
    
    console.log('🔍 assertLoginSuccess() checks:');
    console.log('   - Success message is visible');
    console.log('   - Success message contains correct text');
    console.log('   - Logout link is present');
    console.log('');
    
    await loginPage.assertLoginSuccess();
    console.log('✅ Login success assertion passed!');
  });

  test('📖 Lesson 6: Test Data Management', async ({ page }) => {
    console.log('='.repeat(60));
    console.log('📖 LESSON 6: Understanding Test Data');
    console.log('='.repeat(60));
    
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    
    console.log('📊 Test data is centralized in testData.ts:');
    console.log('');
    console.log('export const validCredentials = {');
    console.log('  username: "tomsmith",');
    console.log('  password: "SuperSecretPassword!"');
    console.log('};');
    console.log('');
    
    console.log('💡 Benefits:');
    console.log('   ✅ Single source of truth for test data');
    console.log('   ✅ Easy to update credentials for all tests');
    console.log('   ✅ Different data sets for different scenarios');
    console.log('');
    
    console.log('🎯 Using centralized test data...');
    await loginPage.login(validCredentials.username, validCredentials.password);
    await loginPage.assertLoginSuccess();
    console.log('✅ Login successful with centralized data!');
  });

  test('📖 Lesson 7: Complete POM Workflow', async ({ page }) => {
    console.log('='.repeat(60));
    console.log('📖 LESSON 7: Complete POM Workflow');
    console.log('='.repeat(60));
    
    console.log('🔄 This is how a complete POM test works:');
    console.log('');
    
    console.log('Step 1: Create page object');
    const loginPage = new LoginPage(page);
    console.log('✅ LoginPage instance created');
    
    console.log('');
    console.log('Step 2: Navigate to page');
    await loginPage.navigateToLoginPage();
    console.log('✅ Navigated to login page');
    
    console.log('');
    console.log('Step 3: Verify page loaded');
    await loginPage.assertLoginPageLoaded();
    console.log('✅ Page loading verified');
    
    console.log('');
    console.log('Step 4: Perform user actions');
    await loginPage.login(validCredentials.username, validCredentials.password);
    console.log('✅ Login action completed');
    
    console.log('');
    console.log('Step 5: Verify results');
    await loginPage.assertLoginSuccess();
    console.log('✅ Success verified');
    
    console.log('');
    console.log('Step 6: Additional actions');
    await loginPage.clickLogoutLink();
    console.log('✅ Logout completed');
    
    console.log('');
    console.log('Step 7: Final verification');
    await loginPage.assertLoginPageLoaded();
    console.log('✅ Back to login page verified');
    
    console.log('');
    console.log('🎉 Complete POM workflow finished!');
    console.log('💡 Notice how readable and maintainable this is!');
  });

  test('📖 Lesson 8: POM vs Traditional Comparison', async ({ page }) => {
    console.log('='.repeat(60));
    console.log('📖 LESSON 8: POM vs Traditional Comparison');
    console.log('='.repeat(60));
    
    console.log('❌ Traditional approach (without POM):');
    console.log('');
    console.log('await page.goto("https://the-internet.herokuapp.com/login");');
    console.log('await page.fill("#username", "tomsmith");');
    console.log('await page.fill("#password", "SuperSecretPassword!");');
    console.log('await page.click("button[type=submit]");');
    console.log('await expect(page.locator(".flash.success")).toBeVisible();');
    console.log('');
    
    console.log('✅ POM approach:');
    console.log('');
    console.log('const loginPage = new LoginPage(page);');
    console.log('await loginPage.navigateToLoginPage();');
    console.log('await loginPage.login(validCredentials.username, validCredentials.password);');
    console.log('await loginPage.assertLoginSuccess();');
    console.log('');
    
    console.log('🎯 Demonstrating POM approach...');
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    await loginPage.login(validCredentials.username, validCredentials.password);
    await loginPage.assertLoginSuccess();
    
    console.log('');
    console.log('🏆 POM Benefits:');
    console.log('   📖 More readable - reads like business language');
    console.log('   🔧 More maintainable - changes in one place');
    console.log('   ♻️ More reusable - same methods across tests');
    console.log('   🏗️ Better structure - organized and scalable');
    console.log('   🧪 Easier testing - focus on scenarios, not implementation');
  });
});

/**
 * 🎯 NEXT STEPS FOR LEARNING:
 * 
 * 1. Run this test file: npx playwright test tests/pom-learning-examples.spec.ts
 * 2. Read through the console output to understand each concept
 * 3. Look at the actual page object files (LoginPage.ts, BasePage.ts)
 * 4. Try creating your own page object for a different website
 * 5. Experiment with adding new methods to existing page objects
 * 
 * 📚 Additional Learning Resources:
 * - Read POM_LEARNING_GUIDE.md for comprehensive guide
 * - Look at other test files to see POM in action
 * - Try the hands-on exercises in the learning guide
 */