import { test, expect } from '@playwright/test';
import { TableDataPage } from '../src/pages/TableDataPage';

test.describe('Table Data Exercise Tests', () => {  
    
  test('should navigate to the principal page and go to the table data page and verify the Headers names', async ({ page }) => {
    const tableDataPage = new TableDataPage(page);
    await tableDataPage.navigateMainPage();
    await tableDataPage.navigateToTableDataPage(); 
    await tableDataPage.waitForPageLoad();
    await tableDataPage.isVisibleTable1();
    const headers = await tableDataPage.getTableHeaders();
    console.log('Table Headers: ', headers);
    expect(headers).toEqual(['Last Name', 'First Name', 'Email', 'Due', 'Web Site', 'Action']);
  })    

test('should count the number of table headers', async ({ page }) => {
    const tableDataPage = new TableDataPage(page);
    await tableDataPage.navigateMainPage();
    await tableDataPage.navigateToTableDataPage();
    await tableDataPage.isVisibleTable1();
    const headerCount = await tableDataPage.countTableHeaders();
    console.log('Header count is: ' + headerCount);
    //expect(headerCount).toBe(6); // Assuming there are 6 headers in the table
  })
test('Iterate Through Table rows and get the info', async ({ page }) => {
    const tableDataPage = new TableDataPage(page);
    await tableDataPage.navigateMainPage();
    await tableDataPage.navigateToTableDataPage();
    await tableDataPage.isVisibleTable1();

    const rowData = await tableDataPage.getTableRowsData();
    console.log('Table Row Data: ', rowData);
  })


});