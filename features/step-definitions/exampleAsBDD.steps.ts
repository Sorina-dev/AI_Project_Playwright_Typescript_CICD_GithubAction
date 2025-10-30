import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { PlaywrightHomePage, PlaywrightDocsPage } from '../../src/pages';
import { BaseClass } from './baseClass';
let homePage: PlaywrightHomePage; 

// Background step

Given('the user is on the Playwright homepage', { timeout: 60000 }, async function(this: BaseClass) {
  homePage = new PlaywrightHomePage(this.page); 
  await homePage.navigateToHomePage();
  console.log('Navigated to the Playwright homepage');
});

//Scenario: User visits the homepage
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

When('they click on the documentation link', async function(this: BaseClass) {
  await homePage.clickDocsLink();
  console.log('Clicked on documentation link');
});
Then('they are redirected to the documentation page', async function(this: BaseClass) {
  const docsPage = new PlaywrightDocsPage(this.page);
  await docsPage.assertDocsPageLoaded();
  await expect(this.page).toHaveURL(/.*docs.*/);
  console.log('Redirected to documentation page');
}); 
Then('the documentation content is visible', async function(this: BaseClass) {
  await expect(this.page.locator('h1')).toBeVisible();
  console.log('Documentation content is visible');
});

// Scenario: User searches for content
When('they search for content', async function(this: BaseClass) {
  await homePage.searchContent('API')
  console.log('Searched for "API" content');
});
Then('they can see the "API" documentation', async function(this: BaseClass) {
  await expect(this.page.getByRole('link', { name: 'API' })).toBeVisible();
  console.log('API documentation is visible');
}); 

// Scenario: User views main features
When('they look for main features', async function(this: BaseClass) {
  console.log('Looking for main features');
});
Then('they can see the main features are highlighted', async function(this: BaseClass) {
  const featuresVisible = await homePage.isFeaturesSectonVisible();
  expect(featuresVisible).toBeTruthy();
  console.log('Main features are highlighted');
});
Then('they can see the code examples are displayed', async function(this: BaseClass) {
  const codeExampleVisible = await homePage.isCodeExampleVisible();
  expect(codeExampleVisible).toBeTruthy();
  console.log('Code examples are displayed');
});
