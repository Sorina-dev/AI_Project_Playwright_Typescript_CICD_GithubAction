import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { PlaywrightHomePage } from '../../src/pages';
import { BaseClass } from './baseClass';

let homePage: PlaywrightHomePage;

Given('the user has internet access and a modern browser', async function(this: BaseClass) {
  console.log('User has internet access and a modern browser');
});

Given('the user has internet access', async function(this: BaseClass) {
  console.log('User has internet access');
});

When('they navigate to the Playwright homepage', { timeout: 60000 }, async function(this: BaseClass) {
  homePage = new PlaywrightHomePage(this.page);
  await homePage.navigateToHomePage();
  console.log('Navigated to the Playwright homepage');
});

Then('the homepage loads successfully', async function(this: BaseClass) {
  await homePage.assertHomePageLoaded();
  console.log('Homepage loaded successfully');
});

Then('the main navigation is visible', async function(this: BaseClass) {
  await homePage.assertNavigationPresent();
  console.log('Main navigation is visible');
});

Then('the page title contains {string}', async function(this: BaseClass, expectedTitle: string) {
  await expect(this.page).toHaveTitle(new RegExp(expectedTitle));
  console.log(`Page title contains "${expectedTitle}"`);
});

// Scenario: User accesses documentation
Given('the user is on the Playwright homepage', { timeout: 60000 }, async function(this: BaseClass) {
  homePage = new PlaywrightHomePage(this.page);
  await homePage.navigateToHomePage();
  await homePage.assertHomePageLoaded();
  console.log('User is on the Playwright homepage');
});

When('they click on the documentation link', async function(this: BaseClass) {
  await homePage.clickDocsLink();
  console.log('Clicked on documentation link');
});

Then('they are redirected to the documentation page', async function(this: BaseClass) {
  await expect(this.page).toHaveURL(/.*docs.*/);
  console.log('Redirected to documentation page');
});

Then('the documentation content is visible', async function(this: BaseClass) {
  await expect(this.page.locator('h1')).toBeVisible();
  console.log('Documentation content is visible');
});

// Scenario: User views getting started information
When('they look for getting started information', async function(this: BaseClass) {
  console.log('Looking for getting started information');
});

Then('they can see the {string} button', async function(this: BaseClass, buttonText: string) {
  await expect(this.page.locator(`text=${buttonText}`)).toBeVisible();
  console.log(`Can see the "${buttonText}" button`);
});

Then('the main features are highlighted', async function(this: BaseClass) {
  await expect(this.page.locator('text=Cross-browser')).toBeVisible();
  console.log('Main features are highlighted');
});
