Feature: Playwright Website Navigation
  As a user visiting the Playwright website
  I want to navigate through different sections
  So that I can learn about Playwright's capabilities

  @homepage  @navigation
  Scenario: User views getting started information
    Given the user has internet access already
    When user goes to the Playwright homepage
    Then they can see the "Get Started" button
    And the main features are highlighted