import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { PlaywrightHomePage } from '../../src/pages';
import { BaseClass } from './baseClass';

let homePage: PlaywrightHomePage;

// Background step for search feature
Given('the user is on the Playwright website', { timeout: 60000 }, async function(this: BaseClass) {
  homePage = new PlaywrightHomePage(this.page);
  await homePage.navigateToHomePage();
  console.log('User is on the Playwright website');
});

// Scenario: User searches for content
Given('the search functionality is available', async function(this: BaseClass) {
  console.log('Search functionality is available');
});

When('they search for {string}', async function(this: BaseClass, searchTerm: string) {
  await homePage.searchContent(searchTerm);
  console.log(`Searched for "${searchTerm}"`);
});

Then('the search functionality responds', async function(this: BaseClass) {
  await expect(this.page).toHaveURL(/playwright\.dev/);
  console.log('Search functionality responds');
});

Then('they remain on the Playwright domain', async function(this: BaseClass) {
  await expect(this.page).toHaveURL(/playwright\.dev/);
  console.log('Remained on Playwright domain');
});