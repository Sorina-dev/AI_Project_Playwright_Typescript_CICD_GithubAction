import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object Model for Playwright.dev homepage
 * Contains all locators and methods specific to the Playwright homepage
 */
export class PlaywrightHomePage extends BasePage {
  // Page URL
  private readonly url = 'https://playwright.dev/';

  // Locators
  private readonly pageTitle: Locator;
  private readonly mainHeading: Locator;
  private readonly docsLink: Locator;
  private readonly getStartedButton: Locator;
  private readonly githubLink: Locator;
  private readonly navigationMenu: Locator;
  private readonly searchButton: Locator;
  private readonly featuresSection: Locator;
  private readonly codeExample: Locator;

  constructor(page: Page) {
    super(page, 'https://playwright.dev');
    
    // Initialize locators
    this.pageTitle = page.locator('title');
    this.mainHeading = page.locator('h1').first();
    this.docsLink = page.locator('text=Docs').first();
    this.getStartedButton = page.locator('text=Get started');
    this.githubLink = page.locator('[aria-label="GitHub"]');
    this.navigationMenu = page.locator('nav[role="navigation"]');
    this.searchButton = page.locator('[aria-label="Search"]');
    this.featuresSection = page.locator('text=Cross-browser').first();
    this.codeExample = page.locator('pre').first();
  }

  /**
   * Navigate to the Playwright homepage
   */
  async navigateToHomePage(): Promise<void> {
    await this.goto(this.url);
    await this.waitForPageLoad();
  }

  /**
   * Click on the Docs link
   */
  async clickDocsLink(): Promise<void> {
    await this.clickElement(this.docsLink);
  }

  /**
   * Click on the Get Started button
   */
  async clickGetStartedButton(): Promise<void> {
    await this.clickElement(this.getStartedButton);
  }

  /**
   * Click on the GitHub link
   */
  async clickGitHubLink(): Promise<void> {
    await this.clickElement(this.githubLink);
  }

  /**
   * Get the main heading text
   */
  async getMainHeadingText(): Promise<string> {
    return await this.getElementText(this.mainHeading);
  }

  /**
   * Check if the features section is visible
   */
  async isFeaturesSectonVisible(): Promise<boolean> {
    return await this.isVisible(this.featuresSection);
  }

  /**
   * Check if the code example is visible
   */
  async isCodeExampleVisible(): Promise<boolean> {
    return await this.isVisible(this.codeExample);
  }

  /**
   * Get the code example text
   */
  async getCodeExampleText(): Promise<string> {
    return await this.getElementText(this.codeExample);
  }

  /**
   * Assert that the homepage loaded correctly
   */
  async assertHomePageLoaded(): Promise<void> {
    await this.assertPageTitle('Playwright');
    await this.assertElementVisible(this.mainHeading);
    await this.assertElementText(this.mainHeading, 'Playwright');
  }

  /**
   * Assert that navigation elements are present
   */
  async assertNavigationPresent(): Promise<void> {
    await this.assertElementVisible(this.docsLink);
    await this.assertElementVisible(this.githubLink);
    await this.assertElementVisible(this.navigationMenu);
  }

  /**
   * Search for content (if search functionality exists)
   * @param searchTerm - The term to search for
   */
  async searchContent(searchTerm: string): Promise<void> {
    if (await this.isVisible(this.searchButton)) {
      await this.clickElement(this.searchButton);
      // Additional search functionality would go here
      // This is a placeholder for when search input appears
    }
  }

  /**
   * Get all visible navigation links
   */
  async getNavigationLinks(): Promise<string[]> {
    const navLinks = this.page.locator('nav a');
    const count = await navLinks.count();
    const links: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const text = await navLinks.nth(i).textContent();
      if (text) {
        links.push(text.trim());
      }
    }
    
    return links;
  }
}