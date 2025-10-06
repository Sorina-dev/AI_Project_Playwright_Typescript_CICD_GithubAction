import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object Model for The Internet Herokuapp Login page
 * Contains all locators and methods specific to the login functionality
 */
export class LoginPage extends BasePage {
  // Page URL
  private readonly url = 'https://the-internet.herokuapp.com/login';

  // Locators
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly successMessage: Locator;
  private readonly pageTitle: Locator;
  private readonly logoutLink: Locator;
  private readonly secureAreaHeading: Locator;

  constructor(page: Page) {
    super(page, 'https://the-internet.herokuapp.com');
    
    // Initialize locators
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.flash.error');
    this.successMessage = page.locator('.flash.success');
    this.pageTitle = page.locator('h2');
    this.logoutLink = page.locator('a[href="/logout"]');
    this.secureAreaHeading = page.locator('h2');
  }

  /**
   * Navigate to the login page
   */
  async navigateToLoginPage(): Promise<void> {
    await this.goto(this.url);
    await this.waitForPageLoad();
  }

  /**
   * Fill username field
   * @param username - The username to enter
   */
  async fillUsername(username: string): Promise<void> {
    await this.fillInput(this.usernameInput, username);
  }

  /**
   * Fill password field
   * @param password - The password to enter
   */
  async fillPassword(password: string): Promise<void> {
    await this.fillInput(this.passwordInput, password);
  }

  /**
   * Click the login button
   */
  async clickLoginButton(): Promise<void> {
    await this.clickElement(this.loginButton);
  }

  /**
   * Perform complete login action
   * @param username - The username to use
   * @param password - The password to use
   */
  async login(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLoginButton();
  }

  /**
   * Click the logout link (available after successful login)
   */
  async clickLogoutLink(): Promise<void> {
    await this.clickElement(this.logoutLink);
  }

  /**
   * Get the error message text
   */
  async getErrorMessage(): Promise<string> {
    await this.waitForElement(this.errorMessage);
    return await this.getElementText(this.errorMessage);
  }

  /**
   * Get the success message text
   */
  async getSuccessMessage(): Promise<string> {
    await this.waitForElement(this.successMessage);
    return await this.getElementText(this.successMessage);
  }

  /**
   * Get the page title text
   */
  async getPageTitleText(): Promise<string> {
    return await this.getElementText(this.pageTitle);
  }

  /**
   * Check if login was successful
   */
  async isLoginSuccessful(): Promise<boolean> {
    try {
      await this.waitForElement(this.successMessage, 5000);
      return await this.isVisible(this.successMessage);
    } catch {
      return false;
    }
  }

  /**
   * Check if login failed
   */
  async isLoginFailed(): Promise<boolean> {
    try {
      await this.waitForElement(this.errorMessage, 5000);
      return await this.isVisible(this.errorMessage);
    } catch {
      return false;
    }
  }

  /**
   * Check if logout link is visible (indicates successful login)
   */
  async isLogoutLinkVisible(): Promise<boolean> {
    return await this.isVisible(this.logoutLink);
  }

  /**
   * Check if we're on the secure area page
   */
  async isOnSecureArea(): Promise<boolean> {
    const heading = await this.getElementText(this.secureAreaHeading);
    return heading.toLowerCase().includes('secure area');
  }

  /**
   * Assert login page elements are present
   */
  async assertLoginPageLoaded(): Promise<void> {
    await this.assertElementVisible(this.usernameInput);
    await this.assertElementVisible(this.passwordInput);
    await this.assertElementVisible(this.loginButton);
    await this.assertElementText(this.pageTitle, 'Login Page');
  }

  /**
   * Assert successful login
   */
  async assertLoginSuccess(): Promise<void> {
    await this.assertElementVisible(this.successMessage);
    await this.assertElementText(this.successMessage, 'You logged into a secure area!');
    await this.assertElementVisible(this.logoutLink);
  }

  /**
   * Assert failed login
   */
  async assertLoginFailure(): Promise<void> {
    await this.assertElementVisible(this.errorMessage);
  }

  /**
   * Clear all form fields
   */
  async clearForm(): Promise<void> {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
  }

  /**
   * Get current form values
   */
  async getFormValues(): Promise<{ username: string; password: string }> {
    const username = await this.usernameInput.inputValue();
    const password = await this.passwordInput.inputValue();
    return { username, password };
  }
}