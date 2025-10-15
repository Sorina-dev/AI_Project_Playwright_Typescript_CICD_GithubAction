import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages';

test.describe('Form Interaction Tests', () => {
  test('should fill out and submit a contact form', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // Navigate to login page using POM
    await loginPage.navigateToLoginPage();
    
    // Assert login page loaded correctly
    await loginPage.assertLoginPageLoaded();
    
    // Perform login using POM
    await loginPage.login('tomsmith', 'SuperSecretPassword!');
    
    // Assert successful login using POM
    await loginPage.assertLoginSuccess();
  });

  test('should handle form validation errors', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // Navigate to login page using POM
    await loginPage.navigateToLoginPage();
    
    // Assert login page loaded correctly
    await loginPage.assertLoginPageLoaded();
    
    // Try to submit with invalid credentials using POM
    await loginPage.login('invalid', 'invalid');
    
    // Assert login failure using POM
    await loginPage.assertLoginFailure();
    
    // Verify specific error message
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Your username is invalid!');
  });

  test('should handle successful logout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // Navigate to login page and login successfully
    await loginPage.navigateToLoginPage();
    await loginPage.login('tomsmith', 'SuperSecretPassword!');
    
    // Verify successful login
    await loginPage.assertLoginSuccess();
    
    // Perform logout
    await loginPage.clickLogoutLink();
    
    // Verify we're back on login page
    await loginPage.assertLoginPageLoaded();
  });

  test('should clear form fields', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // Navigate to login page
    await loginPage.navigateToLoginPage();
    
    // Fill form fields
    await loginPage.fillUsername('testuser');
    await loginPage.fillPassword('testpass');
    
    // Verify form has values
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