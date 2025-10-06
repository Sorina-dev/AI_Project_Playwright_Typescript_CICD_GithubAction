import { Page } from '@playwright/test';

/**
 * Common actions that can be used across multiple tests
 */
export class CommonActions {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Wait for network to be idle
   */
  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Take a screenshot with timestamp
   * @param name - Base name for the screenshot
   */
  async takeTimestampedScreenshot(name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({ 
      path: `screenshots/${name}-${timestamp}.png`, 
      fullPage: true 
    });
  }

  /**
   * Scroll to top of page
   */
  async scrollToTop(): Promise<void> {
    await this.page.evaluate(() => {
      window.scrollTo(0, 0);
    });
  }

  /**
   * Scroll to bottom of page
   */
  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
  }

  /**
   * Get browser console logs
   */
  async getConsoleLogs(): Promise<string[]> {
    const logs: string[] = [];
    this.page.on('console', msg => logs.push(msg.text()));
    return logs;
  }

  /**
   * Clear browser cache and cookies
   */
  async clearBrowserData(): Promise<void> {
    await this.page.context().clearCookies();
    await this.page.context().clearPermissions();
  }

  /**
   * Set viewport size
   * @param width - Viewport width
   * @param height - Viewport height
   */
  async setViewportSize(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({ width, height });
  }

  /**
   * Emulate mobile device
   */
  async emulateMobile(): Promise<void> {
    await this.page.setViewportSize({ width: 375, height: 667 });
    await this.page.evaluate(() => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
        configurable: true
      });
    });
  }

  /**
   * Wait for specific number of network requests to complete
   * @param count - Number of requests to wait for
   */
  async waitForNetworkRequests(count: number): Promise<void> {
    let requestCount = 0;
    
    const requestPromise = new Promise<void>((resolve) => {
      this.page.on('response', () => {
        requestCount++;
        if (requestCount >= count) {
          resolve();
        }
      });
    });

    await requestPromise;
  }

  /**
   * Block specific resources (images, stylesheets, etc.)
   * @param resourceTypes - Array of resource types to block
   */
  async blockResources(resourceTypes: string[]): Promise<void> {
    await this.page.route('**/*', (route) => {
      if (resourceTypes.includes(route.request().resourceType())) {
        route.abort();
      } else {
        route.continue();
      }
    });
  }

  /**
   * Wait for element to be stable (not moving)
   * @param selector - Element selector
   */
  async waitForElementStable(selector: string): Promise<void> {
    await this.page.waitForFunction(
      (sel) => {
        const element = document.querySelector(sel);
        if (!element) return false;
        
        const rect1 = element.getBoundingClientRect();
        return new Promise(resolve => {
          setTimeout(() => {
            const rect2 = element.getBoundingClientRect();
            resolve(rect1.top === rect2.top && rect1.left === rect2.left);
          }, 100);
        });
      },
      selector
    );
  }
}