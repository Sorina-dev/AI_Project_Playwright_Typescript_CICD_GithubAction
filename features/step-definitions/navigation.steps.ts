import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { PlaywrightHomePage } from '../../src/pages';
import { BaseClass } from './baseClass';

let homePage: PlaywrightHomePage;


Given('the user has internet access already', async function(this: BaseClass) {
  console.log('User has internet access');
});

When('user goes to the Playwright homepage', { timeout: 60000 }, async function(this: BaseClass) {
  homePage = new PlaywrightHomePage(this.page);
  await homePage.navigateToHomePage();
  console.log('Navigated to the Playwright homepage');
});

Then('they can see the {string} button', async function(this: BaseClass, buttonText: string) {
  await expect(this.page.locator(`text=${buttonText}`)).toBeVisible();
  console.log(`Can see the "${buttonText}" button`);
});

Then('the main features are highlighted', async function(this: BaseClass) {
  await expect(this.page.locator('text=Cross-browser')).toBeVisible();
  console.log('Main features are highlighted');
});
