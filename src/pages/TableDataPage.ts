/**
 * 🎯 HANDS-ON POM EXERCISE
 * 
 * Your mission: Complete this page object by filling in the missing parts!
 * This exercise will help you understand how to create page objects from scratch.
 * 
 * Instructions:
 * 1. Look at the existing LoginPage.ts for reference
 * 2. Fill in the missing locators and methods below
 * 3. Run the test to see if your implementation works
 * 4. Compare your solution with the provided answer
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * 🏋️‍♂️ EXERCISE: Complete this ContactFormPage
 * 
 * Target website: https://the-internet.herokuapp.com/
 * This page object should handle a simple contact form
 */
export class TableDataPage extends BasePage {
  // 📝 TODO: Add locators for the form elements
  // Hint: Look at LoginPage.ts to see how locators are defined

  //URL page
  private readonly url = 'https://the-internet.herokuapp.com/';

  private readonly sortableDataTableMenuItem: Locator;
  private readonly table1: Locator; // Locator for the table with id "table1"
  private readonly tableHeaders: Locator; // Locator for the table headers
  private readonly rows: Locator; // Locator for the table rows


  constructor(page: Page) {
    super(page, 'https://the-internet.herokuapp.com');
    this.sortableDataTableMenuItem = page.locator('text=Sortable Data Tables');
    this.table1 = page.locator('[id="table1"]');
    this.tableHeaders = this.table1.locator('thead th'); //table[@id='table1']/thead
    this.rows = this.table1.locator('tbody tr');
  }

  async navigateMainPage(): Promise<void> {
    await this.goto(this.url);
    await this.waitForPageLoad();
  }

  /**
   * Implement navigation method to Table Data Page
   */
async navigateToTableDataPage(): Promise<void> {
    await this.clickElement(this.sortableDataTableMenuItem);
  }
  /**
   * Visible table 1
   * @returns {Promise<boolean>}
   */
  async isVisibleTable1(): Promise<boolean> {
    return await this.table1.isVisible();
  }

  /**
   * Get all table headers
   */
  async getTableHeaders(): Promise<string[]> {
    const headers = await this.tableHeaders.allTextContents();
    return headers;
  }

  //  Count number of headers
  async countTableHeaders(): Promise<number> {
    const count = await this.tableHeaders.count();
    console.log('Number of headers: ' + count);
    return count;
  }



  /**
   * Get all table rows info
   */
  async getTableRowsData(): Promise<string[][]> {
    const rows = await this.rows.all();
    const rowData: string[][] = [];

    for (const row of rows) {
      const cells = await row.locator('td').allTextContents();
      rowData.push(cells);
    }

    return rowData;
  }
}