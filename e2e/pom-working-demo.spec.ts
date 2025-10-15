import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { validCredentials } from '../src/data/testData';

test.describe('POM Working Demo', () => {
  test('demonstrate POM login flow', async ({ page }) => {
    console.log('🚀 Starting POM demonstration...');
    
    // Create page object instance
    const loginPage = new LoginPage(page);
    
    console.log('📄 Navigating to login page...');
    await loginPage.navigateToLoginPage();
    
    console.log('✅ Asserting login page loaded correctly...');
    await loginPage.assertLoginPageLoaded();
    
    console.log('🔑 Performing login with valid credentials...');
    await loginPage.login(validCredentials.username, validCredentials.password);
    
    console.log('🎯 Verifying successful login...');
    await loginPage.assertLoginSuccess();
    
    console.log('📝 Getting success message...');
    const successMessage = await loginPage.getSuccessMessage();
    expect(successMessage).toContain('You logged into a secure area!');
    
    console.log('🚪 Performing logout...');
    await loginPage.clickLogoutLink();
    
    console.log('🔄 Verifying back on login page...');
    await loginPage.assertLoginPageLoaded();
    
    console.log('✨ POM demonstration completed successfully!');
  });

  test('demonstrate form field operations', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.navigateToLoginPage();
    
    // Test individual field operations
    await loginPage.fillUsername('testuser');
    await loginPage.fillPassword('testpass');
    
    // Get form values to verify
    const formValues = await loginPage.getFormValues();
    expect(formValues.username).toBe('testuser');
    expect(formValues.password).toBe('testpass');
    
    // Clear form
    await loginPage.clearForm();
    
    // Verify form is cleared
    const clearedValues = await loginPage.getFormValues();
    expect(clearedValues.username).toBe('');
    expect(clearedValues.password).toBe('');
  });
});