Feature: Responsive design
  As a user accessing the website from different devices
  I want the website to work properly on all screen sizes
  So that I can have a consistent experience
@responsive
  Scenario: User views website on mobile device
    Given the user is using a mobile device
    When they navigate to the homepage
    Then the page displays correctly on mobile
    And navigation elements are accessible
@responsive
  Scenario: User views website on tablet device
    Given the user is using a tablet device
    When they navigate to the homepage
    Then the page displays correctly on tablet
    And all interactive elements are functional