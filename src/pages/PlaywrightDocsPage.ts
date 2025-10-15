import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object Model for Playwright.dev documentation pages
 * Contains all locators and methods specific to the documentation section
 */
export class PlaywrightDocsPage extends BasePage {
  // Locators
  private readonly pageHeading: Locator;
  private readonly docsSidebarNavigation: Locator;
  private readonly breadcrumbs: Locator;
  private readonly contentArea: Locator;
  private readonly searchBox: Locator;
  private readonly nextPageLink: Locator;
  private readonly previousPageLink: Locator;
  private readonly tocSidebar: Locator;
  private readonly codeBlocks: Locator;
  private readonly editPageLink: Locator;

  constructor(page: Page) {
    super(page, 'https://playwright.dev');
    
    // Initialize locators
    this.pageHeading = page.locator('h1').first();
    this.docsSidebarNavigation = page.locator('[aria-label="Docs sidebar"]');
    this.breadcrumbs = page.locator('[aria-label="Breadcrumbs"]');
    this.contentArea = page.locator('main');
    this.searchBox = page.locator('[placeholder*="Search"]');
    this.nextPageLink = page.locator('text=Next').last();
    this.previousPageLink = page.locator('text=Previous').first();
    this.tocSidebar = page.locator('[data-testid="table-of-contents"]');
    this.codeBlocks = page.locator('pre code');
    this.editPageLink = page.locator('text=Edit this page');
  }

  /**
   * Navigate to a specific docs section
   * @param section - The documentation section path (e.g., '/docs/intro')
   */
  async navigateToDocsSection(section: string): Promise<void> {
    const url = section.startsWith('/') ? section : `/docs/${section}`;
    await this.goto(url);
    await this.waitForPageLoad();
  }

  /**
   * Click on a sidebar navigation item
   * @param itemText - The text of the navigation item to click
   */
  async clickSidebarItem(itemText: string): Promise<void> {
    const sidebarItem = this.page.locator(`text=${itemText}`).first();
    await this.clickElement(sidebarItem);
  }

  /**
   * Search in documentation
   * @param searchTerm - The term to search for
   */
  async searchDocs(searchTerm: string): Promise<void> {
    if (await this.isVisible(this.searchBox)) {
      await this.clickElement(this.searchBox);
      await this.fillInput(this.searchBox, searchTerm);
      await this.page.keyboard.press('Enter');
    }
  }

  /**
   * Click next page link
   */
  async clickNextPage(): Promise<void> {
    if (await this.isVisible(this.nextPageLink)) {
      await this.clickElement(this.nextPageLink);
    }
  }

  /**
   * Click previous page link
   */
  async clickPreviousPage(): Promise<void> {
    if (await this.isVisible(this.previousPageLink)) {
      await this.clickElement(this.previousPageLink);
    }
  }

  /**
   * Click on a table of contents item
   * @param heading - The heading text to click in TOC
   */
  async clickTocItem(heading: string): Promise<void> {
    const tocItem = this.page.locator(`text=${heading}`).first();
    await this.clickElement(tocItem);
  }

  /**
   * Get the current page heading
   */
  async getPageHeading(): Promise<string> {
    return await this.getElementText(this.pageHeading);
  }

  /**
   * Get all visible sidebar navigation items
   */
  async getSidebarNavItems(): Promise<string[]> {
    const navItems = this.docsSidebarNavigation.locator('a');
    const count = await navItems.count();
    const items: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const text = await navItems.nth(i).textContent();
      if (text) {
        items.push(text.trim());
      }
    }
    
    return items;
  }

  /**
   * Get all code examples on the page
   */
  async getCodeExamples(): Promise<string[]> {
    const count = await this.codeBlocks.count();
    const examples: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const code = await this.codeBlocks.nth(i).textContent();
      if (code) {
        examples.push(code.trim());
      }
    }
    
    return examples;
  }

  /**
   * Check if breadcrumbs are present
   */
  async areBreadcrumbsVisible(): Promise<boolean> {
    return await this.isVisible(this.breadcrumbs);
  }

  /**
   * Check if table of contents is visible
   */
  async isTocVisible(): Promise<boolean> {
    return await this.isVisible(this.tocSidebar);
  }

  /**
   * Check if edit page link is available
   */
  async isEditPageLinkVisible(): Promise<boolean> {
    return await this.isVisible(this.editPageLink);
  }

  /**
   * Assert that docs page loaded correctly
   */
  async assertDocsPageLoaded(): Promise<void> {
    await this.assertElementVisible(this.pageHeading);
    await this.assertElementVisible(this.contentArea);
    await this.assertElementVisible(this.docsSidebarNavigation);
  }

  /**
   * Assert that search functionality is available
   */
  async assertSearchAvailable(): Promise<void> {
    await this.assertElementVisible(this.searchBox);
  }

  /**
   * Assert that navigation elements are present
   */
  async assertNavigationPresent(): Promise<void> {
    await this.assertElementVisible(this.docsSidebarNavigation);
    // Note: Next/Previous links may not always be present, so we don't assert them
  }

  /**
   * Scroll to a specific heading on the page
   * @param headingText - The heading text to scroll to
   */
  async scrollToHeading(headingText: string): Promise<void> {
    const heading = this.page.locator(`h1, h2, h3, h4, h5, h6`).filter({ hasText: headingText }).first();
    await this.scrollToElement(heading);
  }

  /**
   * Get the current URL path
   */
  async getCurrentDocsPath(): Promise<string> {
    const url = await this.getCurrentUrl();
    return new URL(url).pathname;
  }
}