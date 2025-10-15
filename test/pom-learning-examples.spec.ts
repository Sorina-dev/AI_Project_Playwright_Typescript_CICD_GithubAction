import { test } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { validCredentials } from '../src/data/testData';

/**
 * 🎓 LEARNING EXERCISE: Understanding POM Structure
 * 
 * This test file demonstrates step-by-step how POM works.
 * Read through each section and run the tests to see POM in action.
 */

test.describe('🎓 POM Learning Examples', () => {
  
  test('📚 Step 1: Understanding Page Object Creation', async ({ page }) => {
    console.log('🔧 Step 1: Creating a page object instance');
    
    // This creates an instance of LoginPage class
    // The page object encapsulates all the login page functionality
    const loginPage = new LoginPage(page);
    
    console.log('✅ Page object created successfully!');
    console.log('📝 The page object contains:');
    console.log('   - Locators (how to find elements)');
    console.log('   - Methods (actions we can perform)');
    console.log('   - Assertions (ways to verify page state)');
    
    // Navigate using the page object method
    await loginPage.navigateToLoginPage();
    
    // This is much cleaner than: await page.goto('https://...')
    console.log('🌐 Navigated to login page using POM method');
  });

  test('📚 Step 2: Understanding Locators and Methods', async ({ page }) => {
    console.log('🔍 Step 2: Learning about locators and methods');
    
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    
    console.log('📍 Locators are defined in the page object:');
    console.log('   - usernameInput: page.locator("#username")');
    console.log('   - passwordInput: page.locator("#password")');
    console.log('   - loginButton: page.locator("button[type=submit]")');
    
    console.log('🎬 Methods encapsulate actions:');
    console.log('   - fillUsername() uses the usernameInput locator');
    console.log('   - fillPassword() uses the passwordInput locator');
    
    // These methods hide the complexity of finding and interacting with elements
    await loginPage.fillUsername('demo-user');
    await loginPage.fillPassword('demo-password');
    
    console.log('✅ Fields filled using POM methods');
    console.log('💡 Notice: No direct page.fill() calls in the test!');
  });

  test('📚 Step 3: Understanding Inheritance from BasePage', async ({ page }) => {
    console.log('🏗️ Step 3: Learning about inheritance');
    
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    
    console.log('📋 LoginPage extends BasePage, which provides:');
    console.log('   - Common navigation methods (goto, waitForPageLoad)');
    console.log('   - Element interaction methods (clickElement, fillInput)');
    console.log('   - Assertion helpers (assertElementVisible, assertElementText)');
    
    // This method comes from BasePage
    const currentUrl = await loginPage.getCurrentUrl();
    console.log('🌐 Current URL (from BasePage method): ' + currentUrl.substring(0, 50) + '...');
    
    // This method comes from BasePage
    const pageTitle = await loginPage.getTitle();
    console.log('📄 Page title (from BasePage method): ' + pageTitle);
    
    console.log('💡 Inheritance allows code reuse across all page objects!');
  });

  test('📚 Step 4: Understanding Composite Actions', async ({ page }) => {
    console.log('🔗 Step 4: Learning about composite actions');
    
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    
    console.log('🎯 Composite actions combine multiple steps:');
    console.log('   login() method does:');
    console.log('   1. fillUsername()');
    console.log('   2. fillPassword()');
    console.log('   3. clickLoginButton()');
    
    // One method call performs multiple actions
    await loginPage.login(validCredentials.username, validCredentials.password);
    
    console.log('✅ Login completed with single method call');
    console.log('💡 This makes tests more readable and maintainable!');
  });

  test('📚 Step 5: Understanding Assertions and Verification', async ({ page }) => {
    console.log('✅ Step 5: Learning about assertions');
    
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    await loginPage.login(validCredentials.username, validCredentials.password);
    
    console.log('🔍 Page objects provide specialized assertions:');
    console.log('   - assertLoginSuccess() checks for success elements');
    console.log('   - assertLoginFailure() checks for error messages');
    console.log('   - assertLoginPageLoaded() verifies page elements');
    
    // This assertion method encapsulates multiple checks
    await loginPage.assertLoginSuccess();
    
    console.log('✅ Login success verified using POM assertion');
    console.log('💡 Assertions are reusable and consistent!');
  });

  test('📚 Step 6: Understanding Data Management', async ({ page }) => {
    console.log('📊 Step 6: Learning about test data management');
    
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    
    console.log('📋 Test data is centralized in testData.ts:');
    console.log('   - Valid username: ' + validCredentials.username);
    console.log('   - Valid password: ' + validCredentials.password);
    
    // Using centralized test data
    await loginPage.login(validCredentials.username, validCredentials.password);
    
    console.log('✅ Login with centralized test data');
    console.log('💡 Data management keeps tests maintainable!');
    
    await loginPage.assertLoginSuccess();
  });

  test('📚 Step 7: Understanding the Complete Flow', async ({ page }) => {
    console.log('🔄 Step 7: Complete POM workflow demonstration');
    
    // 1. Page Object Creation
    console.log('1️⃣ Creating page object...');
    const loginPage = new LoginPage(page);
    
    // 2. Navigation
    console.log('2️⃣ Navigating to page...');
    await loginPage.navigateToLoginPage();
    
    // 3. Page State Verification
    console.log('3️⃣ Verifying page loaded correctly...');
    await loginPage.assertLoginPageLoaded();
    
    // 4. User Actions
    console.log('4️⃣ Performing user actions...');
    await loginPage.login(validCredentials.username, validCredentials.password);
    
    // 5. Result Verification
    console.log('5️⃣ Verifying results...');
    await loginPage.assertLoginSuccess();
    
    // 6. Additional Actions
    console.log('6️⃣ Performing logout...');
    await loginPage.clickLogoutLink();
    
    // 7. Final Verification
    console.log('7️⃣ Verifying final state...');
    await loginPage.assertLoginPageLoaded();
    
    console.log('🎉 Complete POM workflow executed successfully!');
    console.log('💡 Notice how clean and readable the test is!');
  });

  test('📚 Bonus: Comparing Traditional vs POM Approach', async ({ page }) => {
    console.log('⚖️ Bonus: Traditional vs POM comparison');
    
    // Traditional approach (what we DON'T do with POM)
    console.log('❌ Traditional approach would look like:');
    console.log('   await page.goto("https://the-internet.herokuapp.com/login")');
    console.log('   await page.fill("#username", "tomsmith")');
    console.log('   await page.fill("#password", "SuperSecretPassword!")');
    console.log('   await page.click("button[type=submit]")');
    console.log('   await expect(page.locator(".flash.success")).toBeVisible()');
    
    // POM approach (what we DO)
    console.log('✅ POM approach:');
    console.log('   const loginPage = new LoginPage(page)');
    console.log('   await loginPage.navigateToLoginPage()');
    console.log('   await loginPage.login(username, password)');
    console.log('   await loginPage.assertLoginSuccess()');
    
    // Demonstrate POM approach
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    await loginPage.login(validCredentials.username, validCredentials.password);
    await loginPage.assertLoginSuccess();
    
    console.log('🎯 Benefits of POM approach:');
    console.log('   ✅ More readable and maintainable');
    console.log('   ✅ Reusable across multiple tests');
    console.log('   ✅ Changes in UI only require updates in page objects');
    console.log('   ✅ Better separation of concerns');
  });
});