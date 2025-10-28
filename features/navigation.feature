Feature: Playwright Website Navigation
  As a user visiting the Playwright website
  I want to navigate through different sections
  So that I can learn about Playwright's capabilities

  Background:
    Given the user has internet access and a modern browser
  @homepage  @navigation #tags for homepage and navigation scenarios
  Scenario: User visits the homepage
    Given the user has internet access
    When they navigate to the Playwright homepage
    Then the homepage loads successfully
    And the main navigation is visible
    And the page title contains "Playwright"
  @homepage  @navigation
  Scenario: User accesses documentation
    Given the user is on the Playwright homepage
    When they click on the documentation link
    Then they are redirected to the documentation page
    And the documentation content is visible
  @homepage  @navigation
  Scenario: User views getting started information
    Given the user is on the Playwright homepage
    When they look for getting started information
    Then they can see the "Get Started" button
    And the main features are highlighted