Feature: Search functionality
  As a user of the Playwright website
  I want to search for content
  So that I can find relevant information quickly

  Background:
    Given the user is on the Playwright website
@search
  Scenario: User searches for content
    Given the search functionality is available
    When they search for "API testing"
    Then the search functionality responds
    And they remain on the Playwright domain