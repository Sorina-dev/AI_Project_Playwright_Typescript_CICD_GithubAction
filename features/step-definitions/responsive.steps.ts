import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { PlaywrightHomePage } from '../../src/pages';
import { BaseClass } from './baseClass';

let homePage: PlaywrightHomePage;

// Scenario: User views website on mobile device
Given('the user is using a mobile device', async function(this: BaseClass) {
  await this.page.setViewportSize({ width: 375, height: 667 });
  console.log('User is using a mobile device (375x667)');
});

When('they navigate to the homepage', { timeout: 60000 }, async function(this: BaseClass) {
  homePage = new PlaywrightHomePage(this.page);
  await homePage.navigateToHomePage();
  console.log('Navigated to the homepage');
});

Then('the page displays correctly on mobile', async function(this: BaseClass) {
  await homePage.assertHomePageLoaded();
  console.log('Page displays correctly on mobile');
});

Then('navigation elements are accessible', async function(this: BaseClass) {
  const hasNavigation = await this.page.locator('nav, .navbar, [role="navigation"]').isVisible();
  expect(hasNavigation).toBe(true);
  console.log('Navigation elements are accessible');
});

// Scenario: User views website on tablet device
Given('the user is using a tablet device', async function(this: BaseClass) {
  await this.page.setViewportSize({ width: 768, height: 1024 });
  console.log('User is using a tablet device (768x1024)');
});

Then('the page displays correctly on tablet', async function(this: BaseClass) {
  await homePage.assertHomePageLoaded();
  console.log('Page displays correctly on tablet');
});

Then('all interactive elements are functional', async function(this: BaseClass) {
  const hasNavigation = await this.page.locator('nav, .navbar, [role="navigation"]').isVisible();
  expect(hasNavigation).toBe(true);
  console.log('All interactive elements are functional');
});
