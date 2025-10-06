/**
 * 🎯 HANDS-ON POM EXERCISE
 * 
 * Your mission: Complete this page object by filling in the missing parts!
 * This exercise will help you understand how to create page objects from scratch.
 * 
 * Instructions:
 * 1. Look at the existing LoginPage.ts for reference
 * 2. Fill in the missing locators and methods below
 * 3. Run the test to see if your implementation works
 * 4. Compare your solution with the provided answer
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * 🏋️‍♂️ EXERCISE: Complete this ContactFormPage
 * 
 * Target website: https://the-internet.herokuapp.com/
 * This page object should handle a simple contact form
 */
export class ContactFormExercise extends BasePage {
  // 📝 TODO: Add locators for the form elements
  // Hint: Look at LoginPage.ts to see how locators are defined
  
  // ❓ Add locator for name input field
  // private readonly nameInput: Locator;
  
  // ❓ Add locator for email input field  
  // private readonly emailInput: Locator;
  
  // ❓ Add locator for message textarea
  // private readonly messageTextarea: Locator;
  
  // ❓ Add locator for submit button
  // private readonly submitButton: Locator;

  constructor(page: Page) {
    super(page, 'https://the-internet.herokuapp.com');
    
    // 📝 TODO: Initialize your locators here
    // Hint: this.locatorName = page.locator('selector');
    
    // Example from LoginPage:
    // this.usernameInput = page.locator('#username');
    
    // ❓ Initialize nameInput
    // this.nameInput = page.locator('???');
    
    // ❓ Initialize emailInput
    // this.emailInput = page.locator('???');
    
    // ❓ Initialize messageTextarea
    // this.messageTextarea = page.locator('???');
    
    // ❓ Initialize submitButton
    // this.submitButton = page.locator('???');
  }

  /**
   * 📝 TODO: Implement navigation method
   * Hint: Look at LoginPage.navigateToLoginPage() for reference
   */
  async navigateToContactForm(): Promise<void> {
    // ❓ Use the goto() method from BasePage to navigate
    // await this.goto('/contact'); // or whatever the contact form URL is
  }

  /**
   * 📝 TODO: Implement form filling methods
   * Hint: Look at LoginPage.fillUsername() for reference
   */
  
  // ❓ Fill name field
  async fillName(name: string): Promise<void> {
    // Use fillInput() method from BasePage
    // await this.fillInput(this.nameInput, name);
  }

  // ❓ Fill email field
  async fillEmail(email: string): Promise<void> {
    // await this.fillInput(this.emailInput, email);
  }

  // ❓ Fill message field
  async fillMessage(message: string): Promise<void> {
    // await this.fillInput(this.messageTextarea, message);
  }

  /**
   * 📝 TODO: Implement action methods
   * Hint: Look at LoginPage.clickLoginButton() for reference
   */
  
  // ❓ Click submit button
  async clickSubmitButton(): Promise<void> {
    // Use clickElement() method from BasePage
    // await this.clickElement(this.submitButton);
  }

  /**
   * 📝 TODO: Implement composite action
   * Hint: Look at LoginPage.login() for reference
   */
  async fillAndSubmitContactForm(data: { name: string; email: string; message: string }): Promise<void> {
    // ❓ This method should:
    // 1. Fill name field
    // 2. Fill email field  
    // 3. Fill message field
    // 4. Click submit button
    
    // await this.fillName(data.name);
    // await this.fillEmail(data.email);
    // await this.fillMessage(data.message);
    // await this.clickSubmitButton();
  }

  /**
   * 📝 TODO: Implement assertion methods
   * Hint: Look at LoginPage.assertLoginPageLoaded() for reference
   */
  
  // ❓ Assert form is loaded and visible
  async assertContactFormLoaded(): Promise<void> {
    // Use assertion methods from BasePage
    // await this.assertElementVisible(this.nameInput);
    // await this.assertElementVisible(this.emailInput);
    // await this.assertElementVisible(this.messageTextarea);
    // await this.assertElementVisible(this.submitButton);
  }

  // ❓ Assert form was submitted successfully
  async assertFormSubmitted(): Promise<void> {
    // This would check for success message or redirect
    // Implementation depends on what happens after form submission
    // Example: await this.assertElementVisible(this.successMessage);
  }
}

/**
 * 🎓 LEARNING POINTS FROM THIS EXERCISE:
 * 
 * 1. Page objects always extend BasePage
 * 2. Locators are defined as private readonly properties
 * 3. Constructor initializes locators using page.locator()
 * 4. Methods use BasePage utilities (clickElement, fillInput, etc.)
 * 5. Composite actions combine multiple simple actions
 * 6. Assertions verify page state using BasePage assertion methods
 * 
 * 💡 Next Steps:
 * 1. Try implementing this on a real website
 * 2. Add more sophisticated error handling
 * 3. Create page objects for multi-step workflows
 * 4. Practice with different types of form elements (dropdowns, checkboxes, etc.)
 */