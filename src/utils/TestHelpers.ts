import { Page, expect } from '@playwright/test';

/**
 * Test helper functions for common testing patterns
 */
export class TestHelpers {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Assert that a URL contains a specific path
   * @param expectedPath - The path to check for in the URL
   */
  async assertUrlContains(expectedPath: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(expectedPath));
  }

  /**
   * Assert that page title matches expected text
   * @param expectedTitle - Expected title text
   */
  async assertPageTitle(expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveTitle(new RegExp(expectedTitle, 'i'));
  }

  /**
   * Wait for multiple elements to be visible
   * @param selectors - Array of element selectors
   */
  async waitForMultipleElements(selectors: string[]): Promise<void> {
    const promises = selectors.map(selector => 
      this.page.waitForSelector(selector, { state: 'visible' })
    );
    await Promise.all(promises);
  }

  /**
   * Check if element exists (without waiting)
   * @param selector - Element selector
   */
  async elementExists(selector: string): Promise<boolean> {
    return await this.page.locator(selector).count() > 0;
  }

  /**
   * Get text content from multiple elements
   * @param selector - Element selector
   */
  async getMultipleElementsText(selector: string): Promise<string[]> {
    const elements = this.page.locator(selector);
    const count = await elements.count();
    const texts: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const text = await elements.nth(i).textContent();
      if (text) {
        texts.push(text.trim());
      }
    }
    
    return texts;
  }

  /**
   * Verify element has specific CSS property value
   * @param selector - Element selector
   * @param property - CSS property name
   * @param expectedValue - Expected CSS property value
   */
  async assertCssProperty(selector: string, property: string, expectedValue: string): Promise<void> {
    const element = this.page.locator(selector);
    const actualValue = await element.evaluate((el, prop) => {
      return getComputedStyle(el).getPropertyValue(prop);
    }, property);
    expect(actualValue).toBe(expectedValue);
  }

  /**
   * Verify element count matches expected
   * @param selector - Element selector
   * @param expectedCount - Expected number of elements
   */
  async assertElementCount(selector: string, expectedCount: number): Promise<void> {
    await expect(this.page.locator(selector)).toHaveCount(expectedCount);
  }

  /**
   * Perform action and verify URL change
   * @param action - Function that performs the action
   * @param expectedUrlPattern - Expected URL pattern after action
   */
  async performActionAndVerifyUrlChange(
    action: () => Promise<void>, 
    expectedUrlPattern: string
  ): Promise<void> {
    await action();
    await this.assertUrlContains(expectedUrlPattern);
  }

  /**
   * Fill form with data object
   * @param formData - Object with field selectors as keys and values to fill
   */
  async fillForm(formData: Record<string, string>): Promise<void> {
    for (const [selector, value] of Object.entries(formData)) {
      await this.page.fill(selector, value);
    }
  }

  /**
   * Get form values as object
   * @param fieldSelectors - Object with keys and field selectors
   */
  async getFormValues(fieldSelectors: Record<string, string>): Promise<Record<string, string>> {
    const values: Record<string, string> = {};
    
    for (const [key, selector] of Object.entries(fieldSelectors)) {
      values[key] = await this.page.inputValue(selector);
    }
    
    return values;
  }

  /**
   * Wait for element to disappear
   * @param selector - Element selector
   * @param timeout - Timeout in milliseconds
   */
  async waitForElementToDisappear(selector: string, timeout: number = 10000): Promise<void> {
    await this.page.waitForSelector(selector, { state: 'detached', timeout });
  }

  /**
   * Verify multiple assertions in parallel
   * @param assertions - Array of assertion functions
   */
  async verifyMultipleAssertions(assertions: (() => Promise<void>)[]): Promise<void> {
    await Promise.all(assertions.map(assertion => assertion()));
  }

  /**
   * Take screenshot if test condition fails
   * @param condition - Function that returns boolean
   * @param screenshotName - Name for the screenshot if condition fails
   */
  async screenshotOnFailure(condition: () => Promise<boolean>, screenshotName: string): Promise<void> {
    const result = await condition();
    if (!result) {
      await this.page.screenshot({ 
        path: `screenshots/failure-${screenshotName}-${Date.now()}.png`,
        fullPage: true 
      });
    }
  }

  /**
   * Retry action until it succeeds or max attempts reached
   * @param action - Action to retry
   * @param maxAttempts - Maximum number of attempts
   * @param delayMs - Delay between attempts in milliseconds
   */
  async retryAction(
    action: () => Promise<void>, 
    maxAttempts: number = 3, 
    delayMs: number = 1000
  ): Promise<void> {
    let attempts = 0;
    let lastError: Error | null = null;

    while (attempts < maxAttempts) {
      try {
        await action();
        return; // Success, exit
      } catch (error) {
        lastError = error as Error;
        attempts++;
        if (attempts < maxAttempts) {
          await this.page.waitForTimeout(delayMs);
        }
      }
    }

    throw lastError; // All attempts failed
  }
}