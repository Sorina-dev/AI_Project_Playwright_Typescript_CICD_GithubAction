Feature:Playwright test example as BDD
  As a user of Playwright test
  I want to see an example of BDD-style tests
  So that I can understand how to write my own BDD tests

  Background:
     Given the user is on the Playwright homepage

  @exampleAsBDD
  Scenario: User visits the homepage
    Given the user has internet access
    When they navigate to the Playwright homepage
    Then the homepage loads successfully
    And the main navigation is visible
    And the page title contains "Playwright"

  @exampleAsBDD
  Scenario: User accesses documentation
    When they click on the documentation link
    Then they are redirected to the documentation page
    And the documentation content is visible

  @exampleAsBDD
  Scenario: User views getting started information
    When they search for content
    Then they can see the "API" documentation
    
  @exampleAsBDD
   Scenario: User sees the main feature being displayed
   When they look for main features
   Then they can see the main features are highlighted
   And they can see the code examples are displayed