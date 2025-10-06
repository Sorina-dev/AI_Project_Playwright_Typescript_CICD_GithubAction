import { Page, Locator, expect } from '@playwright/test';

/**
 * Base Page class that contains common functionality for all page objects
 * This class provides reusable methods and utilities that can be inherited by specific page classes
 */
export abstract class BasePage {
  protected page: Page;
  protected baseURL: string;

  constructor(page: Page, baseURL: string = '') {
    this.page = page;
    this.baseURL = baseURL;
  }

  /**
   * Navigate to a specific URL
   * @param url - The URL to navigate to (can be relative or absolute)
   */
  async goto(url: string = ''): Promise<void> {
    const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    await this.page.goto(fullURL);
  }

  /**
   * Wait for the page to load completely
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }
  
// export function is used for utility functions outside the class
//   export async function waitForNetworkIdle(page: Page): Promise<void> {
//     await page.waitForLoadState('networkidle');
//   }


  /**
   * Get the current page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get the current page URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Check if an element is visible
   * @param locator - The element locator
   */
  async isVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  /**
   * Check if an element is enabled
   * @param locator - The element locator
   */
  async isEnabled(locator: Locator): Promise<boolean> {
    return await locator.isEnabled();
  }

  /**
   * Wait for an element to be visible
   * @param locator - The element locator
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForElement(locator: Locator, timeout: number = 30000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Click on an element with wait
   * @param locator - The element locator
   */
  async clickElement(locator: Locator): Promise<void> {
    await this.waitForElement(locator);
    await locator.click();
  }

  /**
   * Fill input field with text
   * @param locator - The input element locator
   * @param text - The text to fill
   */
  async fillInput(locator: Locator, text: string): Promise<void> {
    await this.waitForElement(locator);
    await locator.clear();
    await locator.fill(text);
  }

  /**
   * Get text content from an element
   * @param locator - The element locator
   */
  async getElementText(locator: Locator): Promise<string> {
    await this.waitForElement(locator);
    return await locator.textContent() || '';
  }

  /**
   * Get attribute value from an element
   * @param locator - The element locator
   * @param attribute - The attribute name
   */
  async getElementAttribute(locator: Locator, attribute: string): Promise<string> {
    await this.waitForElement(locator);
    return await locator.getAttribute(attribute) || '';
  }

  /**
   * Select option from dropdown
   * @param locator - The select element locator
   * @param option - The option to select (value, label, or index)
   */
  async selectOption(locator: Locator, option: string | number): Promise<void> {
    await this.waitForElement(locator);
    if (typeof option === 'number') {
      await locator.selectOption({ index: option });
    } else {
      await locator.selectOption({ label: option });
    }
  }

  /**
   * Take a screenshot
   * @param name - Screenshot name
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }

  /**
   * Scroll to element
   * @param locator - The element locator
   */
  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Wait for a specific amount of time
   * @param ms - Milliseconds to wait
   */
  async wait(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  /**
   * Refresh the current page
   */
  async refresh(): Promise<void> {
    await this.page.reload();
  }

  /**
   * Go back to the previous page
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  /**
   * Go forward to the next page
   */
  async goForward(): Promise<void> {
    await this.page.goForward();
  }

  /**
   * Assert that page title contains expected text
   * @param expectedTitle - Expected title text
   */
  async assertPageTitle(expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveTitle(new RegExp(expectedTitle, 'i'));
  }

  /**
   * Assert that element contains expected text
   * @param locator - The element locator
   * @param expectedText - Expected text
   */
  async assertElementText(locator: Locator, expectedText: string): Promise<void> {
    await expect(locator).toContainText(expectedText);
  }

  /**
   * Assert that element is visible
   * @param locator - The element locator
   */
  async assertElementVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  /**
   * Assert that element is hidden
   * @param locator - The element locator
   */
  async assertElementHidden(locator: Locator): Promise<void> {
    await expect(locator).toBeHidden();
  }

  /**
   * Assert that element is enabled
   * @param locator - The element locator
   */
  async assertElementEnabled(locator: Locator): Promise<void> {
    await expect(locator).toBeEnabled();
  }

  /**
   * Assert that element is disabled
   * @param locator - The element locator
   */
  async assertElementDisabled(locator: Locator): Promise<void> {
    await expect(locator).toBeDisabled();
  }
}