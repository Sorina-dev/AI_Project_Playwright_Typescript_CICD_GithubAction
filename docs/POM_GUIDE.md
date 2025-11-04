# 🎓 Page Object Model (POM) - Complete Guide

Welcome to the comprehensive Page Object Model guide for Playwright TypeScript! This guide combines learning concepts, implementation details, and best practices in one place.

## 📚 Table of Contents
1. [What is Page Object Model?](#-what-is-page-object-model)
2. [Why Use POM?](#-why-use-pom)
3. [Project Structure](#-project-structure)
4. [Architecture Deep Dive](#-architecture-deep-dive)
5. [Hands-On Examples](#-hands-on-examples)
6. [Best Practices](#-best-practices)
7. [Common Patterns](#-common-patterns)
8. [Testing with POM](#-testing-with-pom)
9. [Troubleshooting](#-troubleshooting)

---

## 🎯 What is Page Object Model?

**Page Object Model (POM)** is a design pattern in test automation where you create classes that represent web pages or components. Each page class contains:

- **Locators** (how to find elements)
- **Methods** (actions you can perform)
- **Assertions** (ways to verify page state)

### Traditional Test vs POM Test

**❌ Traditional Approach (Without POM):**
```typescript
test('login test', async ({ page }) => {
  await page.goto('https://example.com/login');
  await page.fill('#username', 'user123');
  await page.fill('#password', 'pass123');
  await page.click('#login-button');
  await expect(page.locator('.success-message')).toBeVisible();
});
```

**✅ POM Approach:**
```typescript
test('login test', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigateToLoginPage();
  await loginPage.login('user123', 'pass123');
  await loginPage.assertLoginSuccess();
});
```

---

## 🚀 Why Use POM?

### **1. 🔧 Maintainability**
- **Single Point of Change**: Update locators in one place
- **Easier Refactoring**: Change implementation without affecting tests
- **Version Control Friendly**: Clear diff when elements change

### **2. 🔄 Reusability**
- **Shared Methods**: Use same login across multiple tests
- **Component Reuse**: Header, footer, navigation components
- **Data Variations**: Same method with different parameters

### **3. 📖 Readability**
- **Business Language**: Tests read like user stories
- **Abstraction**: Hide complex implementation details
- **Self-Documenting**: Method names explain what happens

### **4. 🧪 Testability**
- **Independent Tests**: Each test is isolated
- **Easy Debugging**: Clear separation of concerns
- **Faster Development**: Write tests faster with established patterns

---

## 📁 Project Structure

```
src/
├── pages/                      # Page Object classes
│   ├── BasePage.ts            # Base class with common functionality
│   ├── PlaywrightHomePage.ts  # Playwright.dev homepage
│   ├── PlaywrightDocsPage.ts  # Playwright.dev docs pages
│   ├── LoginPage.ts           # Login page for The Internet Herokuapp
│   ├── TableDataPage.ts       # Table manipulation examples
│   └── index.ts               # Page exports
├── utils/                     # Utility classes
│   ├── CommonActions.ts       # Common browser actions
│   ├── TestHelpers.ts         # Test helper functions
│   └── index.ts               # Utility exports
├── data/                      # Test data and configuration
│   └── testData.ts            # Test data constants
└── index.ts                   # Main exports

test/
├── pom-demo.spec.ts          # Comprehensive POM demonstration
├── pom-working-demo.spec.ts  # Production-ready examples
├── pom-learning-examples.spec.ts  # Learning exercises
├── pom-interactive-learning.spec.ts # Interactive tutorials
└── forms.spec.ts             # Form interactions using POM
```

---

## 🏗️ Architecture Deep Dive

### 1. **BasePage.ts - The Foundation**

```typescript
export abstract class BasePage {
  protected page: Page;           // Playwright page instance
  protected baseURL: string;      // Base URL for navigation

  constructor(page: Page, baseURL: string = '') {
    this.page = page;
    this.baseURL = baseURL;
  }

  // Common navigation methods
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  // Common element interactions
  async clickElement(locator: string): Promise<void> {
    await this.page.locator(locator).click();
  }

  async fillField(locator: string, text: string): Promise<void> {
    await this.page.locator(locator).fill(text);
  }

  // Common assertions
  async assertElementVisible(locator: string): Promise<void> {
    await expect(this.page.locator(locator)).toBeVisible();
  }
}
```

**🤔 Why `abstract class`?**
- Cannot be instantiated directly (you can't do `new BasePage()`)
- Forces you to create specific page classes that inherit from it
- Provides common functionality to all page objects

**🤔 Why `protected` instead of `private`?**
- `protected` = available to child classes (LoginPage, HomePage, etc.)
- `private` = only available within the same class
- This allows child classes to access `this.page` and `this.baseURL`

### 2. **Specific Page Classes**

#### **PlaywrightHomePage.ts - Example Implementation**

```typescript
export class PlaywrightHomePage extends BasePage {
  // Locators (private to this class)
  private readonly getStartedLink = 'text=Get started';
  private readonly docsLink = 'text=Docs';
  private readonly githubLink = 'a[href="https://github.com/microsoft/playwright"]';
  private readonly pageTitle = 'h1';

  constructor(page: Page) {
    super(page, 'https://playwright.dev');
  }

  // Page-specific actions
  async navigateToHomepage(): Promise<void> {
    await this.navigateTo(this.baseURL);
  }

  async clickGetStarted(): Promise<void> {
    await this.clickElement(this.getStartedLink);
  }

  async navigateToDocs(): Promise<void> {
    await this.clickElement(this.docsLink);
  }

  // Page-specific assertions
  async assertHomepageLoaded(): Promise<void> {
    await this.assertElementVisible(this.pageTitle);
    await expect(this.page).toHaveTitle(/Playwright/);
  }

  async assertNavigationVisible(): Promise<void> {
    await this.assertElementVisible(this.getStartedLink);
    await this.assertElementVisible(this.docsLink);
    await this.assertElementVisible(this.githubLink);
  }
}
```

### 3. **Utility Classes**

#### **CommonActions.ts - Shared Browser Operations**

```typescript
export class CommonActions {
  constructor(private page: Page) {}

  // Advanced interactions
  async waitForElementAndClick(locator: string, timeout: number = 5000): Promise<void> {
    await this.page.locator(locator).waitFor({ timeout });
    await this.page.locator(locator).click();
  }

  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }

  // Network and performance
  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async getPageLoadTime(): Promise<number> {
    const performanceTimings = await this.page.evaluate(() => {
      return performance.timing.loadEventEnd - performance.timing.navigationStart;
    });
    return performanceTimings;
  }
}
```

---

## 🎲 Hands-On Examples

### **Example 1: Basic Navigation Test**

```typescript
import { test, expect } from '@playwright/test';
import { PlaywrightHomePage } from '../src/pages';

test.describe('Homepage Navigation', () => {
  test('should navigate to homepage and verify elements', async ({ page }) => {
    const homePage = new PlaywrightHomePage(page);
    
    // Step 1: Navigate to homepage
    await homePage.navigateToHomepage();
    
    // Step 2: Verify page loaded correctly
    await homePage.assertHomepageLoaded();
    
    // Step 3: Verify navigation elements
    await homePage.assertNavigationVisible();
  });
});
```

### **Example 2: Form Interaction Test**

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages';

test.describe('Login Functionality', () => {
  test('should login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // Navigate and perform login
    await loginPage.navigateToLoginPage();
    await loginPage.login('tomsmith', 'SuperSecretPassword!');
    
    // Verify success
    await loginPage.assertLoginSuccess();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.navigateToLoginPage();
    await loginPage.login('invalid', 'credentials');
    
    // Verify error message
    await loginPage.assertLoginError();
  });
});
```

### **Example 3: Complex User Journey**

```typescript
test('should complete full user journey', async ({ page }) => {
  const homePage = new PlaywrightHomePage(page);
  const docsPage = new PlaywrightDocsPage(page);
  
  // Homepage interaction
  await homePage.navigateToHomepage();
  await homePage.assertHomepageLoaded();
  
  // Navigate to docs
  await homePage.navigateToDocs();
  
  // Docs page interaction
  await docsPage.assertDocsPageLoaded();
  await docsPage.searchForContent('API testing');
  await docsPage.assertSearchResults();
});
```

---

## 🏆 Best Practices

### **1. 🎯 Locator Strategy**

**✅ Good Locators:**
```typescript
// Stable, semantic locators
private readonly submitButton = '[data-testid="submit-btn"]';
private readonly emailField = 'input[name="email"]';
private readonly errorMessage = '.error-message';
```

**❌ Avoid:**
```typescript
// Fragile locators that break easily
private readonly submitButton = 'button:nth-child(3)';
private readonly emailField = '#form > div > div:nth-child(2) > input';
```

### **2. 🔄 Method Naming**

**✅ Clear, Action-Based Names:**
```typescript
async clickSubmitButton(): Promise<void>
async fillEmailField(email: string): Promise<void>
async assertSuccessMessageVisible(): Promise<void>
```

**❌ Unclear Names:**
```typescript
async doStuff(): Promise<void>
async check(): Promise<void>
async element1(): Promise<void>
```

### **3. 🎭 Separation of Concerns**

**✅ Separate Actions and Assertions:**
```typescript
// Actions
async login(username: string, password: string): Promise<void> {
  await this.fillField(this.usernameField, username);
  await this.fillField(this.passwordField, password);
  await this.clickElement(this.submitButton);
}

// Assertions
async assertLoginSuccess(): Promise<void> {
  await this.assertElementVisible(this.successMessage);
  await expect(this.page).toHaveURL(/dashboard/);
}
```

### **4. 🏗️ Constructor Patterns**

**✅ Clean Constructor:**
```typescript
export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page, 'https://example.com');
  }
}
```

### **5. 📊 Return Values**

**✅ Consistent Return Types:**
```typescript
// Actions return void
async clickButton(): Promise<void> { }

// Data retrieval returns values
async getPageTitle(): Promise<string> {
  return await this.page.title();
}

// Chaining support returns this
async fillForm(data: FormData): Promise<this> {
  await this.fillField(this.nameField, data.name);
  await this.fillField(this.emailField, data.email);
  return this;
}
```

---

## 🔧 Common Patterns

### **1. 🎯 Page Factory Pattern**

```typescript
// src/pages/PageFactory.ts
export class PageFactory {
  static getHomePage(page: Page): PlaywrightHomePage {
    return new PlaywrightHomePage(page);
  }
  
  static getLoginPage(page: Page): LoginPage {
    return new LoginPage(page);
  }
}

// Usage in tests
test('example test', async ({ page }) => {
  const homePage = PageFactory.getHomePage(page);
  const loginPage = PageFactory.getLoginPage(page);
});
```

### **2. 🔄 Fluent Interface Pattern**

```typescript
export class FormPage extends BasePage {
  async fillName(name: string): Promise<this> {
    await this.fillField(this.nameField, name);
    return this;
  }

  async fillEmail(email: string): Promise<this> {
    await this.fillField(this.emailField, email);
    return this;
  }

  async submit(): Promise<void> {
    await this.clickElement(this.submitButton);
  }
}

// Usage with method chaining
await formPage
  .fillName('John Doe')
  .fillEmail('john@example.com')
  .submit();
```

### **3. 🎭 Component Pattern**

```typescript
// src/components/NavigationComponent.ts
export class NavigationComponent extends BasePage {
  private readonly homeLink = '[data-nav="home"]';
  private readonly aboutLink = '[data-nav="about"]';
  private readonly contactLink = '[data-nav="contact"]';

  async navigateToHome(): Promise<void> {
    await this.clickElement(this.homeLink);
  }

  async navigateToAbout(): Promise<void> {
    await this.clickElement(this.aboutLink);
  }
}

// Use in page objects
export class HomePage extends BasePage {
  navigation = new NavigationComponent(this.page);
  
  // Page-specific methods...
}
```

---

## 🧪 Testing with POM

### **Your Available Test Files:**

1. **`pom-demo.spec.ts`** - Comprehensive demonstrations
2. **`pom-working-demo.spec.ts`** - Production-ready examples
3. **`pom-learning-examples.spec.ts`** - Step-by-step learning
4. **`pom-interactive-learning.spec.ts`** - Interactive tutorials

### **Running POM Tests:**

```bash
# Run all POM demonstrations
npm test pom-demo.spec.ts

# Run working examples
npm test pom-working-demo.spec.ts

# Run with headed browser (see actions)
npm run test:headed pom-demo.spec.ts

# Run specific test
npx playwright test pom-demo.spec.ts --grep "login flow"
```

### **Test Organization Strategy:**

```typescript
test.describe('Login Functionality', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
  });

  test('valid login', async () => {
    await loginPage.login('valid-user', 'valid-pass');
    await loginPage.assertLoginSuccess();
  });

  test('invalid login', async () => {
    await loginPage.login('invalid-user', 'invalid-pass');
    await loginPage.assertLoginError();
  });
});
```

---

## 🔍 Troubleshooting

### **Common Issues & Solutions:**

#### ❌ **Issue: "Cannot find module '../src/pages'"**
```bash
# Solution: Check your import paths
import { PlaywrightHomePage } from '../src/pages/PlaywrightHomePage';
# OR
import { PlaywrightHomePage } from '../src/pages';
```

#### ❌ **Issue: "Element not found" errors**
```typescript
// Solution: Add proper waits
async clickElement(locator: string): Promise<void> {
  await this.page.locator(locator).waitFor({ state: 'visible' });
  await this.page.locator(locator).click();
}
```

#### ❌ **Issue: "Tests are flaky"**
```typescript
// Solution: Improve waiting strategies
async waitForPageLoad(): Promise<void> {
  await this.page.waitForLoadState('networkidle');
  await this.page.waitForSelector(this.mainContent, { state: 'visible' });
}
```

#### ❌ **Issue: "Hard to debug failures"**
```typescript
// Solution: Add better error context
async assertElementVisible(locator: string, elementName?: string): Promise<void> {
  try {
    await expect(this.page.locator(locator)).toBeVisible();
  } catch (error) {
    throw new Error(`${elementName || locator} is not visible: ${error.message}`);
  }
}
```

### **Debugging Tips:**

1. **Use browser in headed mode:**
   ```bash
   npm run test:headed pom-demo.spec.ts
   ```

2. **Add debugging breakpoints:**
   ```typescript
   await page.pause(); // Opens Playwright inspector
   ```

3. **Take screenshots on failures:**
   ```typescript
   await this.page.screenshot({ path: 'debug-screenshot.png' });
   ```

---

## 🎉 Summary

Your POM implementation includes:

### **✅ Complete Architecture:**
- ✅ **BasePage** - Abstract foundation class
- ✅ **Specific Pages** - PlaywrightHomePage, LoginPage, etc.
- ✅ **Utilities** - CommonActions, TestHelpers
- ✅ **Test Data** - Centralized configuration

### **✅ Professional Features:**
- ✅ **TypeScript Support** - Full type safety
- ✅ **Inheritance Pattern** - Proper OOP design
- ✅ **Async/Await** - Modern JavaScript patterns
- ✅ **Error Handling** - Robust failure management
- ✅ **Waiting Strategies** - Stable element interactions

### **✅ Ready-to-Use Tests:**
- ✅ **Demonstration Tests** - Learn from working examples
- ✅ **Production Tests** - Real-world patterns
- ✅ **Interactive Learning** - Hands-on tutorials
- ✅ **Form Examples** - Complex interaction patterns

### **🚀 Next Steps:**
1. **Explore the test files** to see POM in action
2. **Run the examples** with headed browser to watch
3. **Create your own page objects** for new pages
4. **Extend the pattern** with components and advanced features

**Your POM framework is production-ready and follows industry best practices!** 🎯