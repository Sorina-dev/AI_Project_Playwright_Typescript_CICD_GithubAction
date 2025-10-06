# Page Object Model (POM) Implementation

This project implements a comprehensive Page Object Model (POM) pattern for Playwright TypeScript tests, providing a scalable and maintainable test automation framework.

## 📁 Project Structure

```
src/
├── pages/                  # Page Object classes
│   ├── BasePage.ts        # Base class with common functionality
│   ├── PlaywrightHomePage.ts   # Playwright.dev homepage
│   ├── PlaywrightDocsPage.ts   # Playwright.dev docs pages
│   ├── LoginPage.ts       # Login page for The Internet Herokuapp
│   └── index.ts           # Page exports
├── utils/                 # Utility classes
│   ├── CommonActions.ts   # Common browser actions
│   ├── TestHelpers.ts     # Test helper functions
│   └── index.ts           # Utility exports
├── data/                  # Test data and configuration
│   └── testData.ts        # Test data constants
└── index.ts               # Main exports

tests/
├── example.spec.ts        # Refactored navigation tests using POM
├── forms.spec.ts          # Refactored form tests using POM
├── visual.spec.ts         # Visual tests (original)
└── pom-demo.spec.ts       # Comprehensive POM demonstration
```

## 🎯 Key Features

### 1. **Base Page Class**
- Common functionality shared across all page objects
- Centralized element interaction methods
- Built-in assertions and waiting strategies
- Error handling and logging capabilities

### 2. **Specific Page Classes**
- **PlaywrightHomePage**: Homepage navigation and interactions
- **PlaywrightDocsPage**: Documentation section functionality
- **LoginPage**: Complete login flow management

### 3. **Utility Classes**
- **CommonActions**: Browser-level actions and utilities
- **TestHelpers**: Advanced testing patterns and helpers

### 4. **Test Data Management**
- Centralized test data configuration
- Environment-specific data handling
- Reusable test credentials and URLs

## 🚀 Usage Examples

### Basic Page Object Usage

```typescript
import { test } from '@playwright/test';
import { PlaywrightHomePage } from '../src/pages';

test('homepage navigation', async ({ page }) => {
  const homePage = new PlaywrightHomePage(page);
  
  await homePage.navigateToHomePage();
  await homePage.assertHomePageLoaded();
  await homePage.clickDocsLink();
});
```

### Advanced Usage with Utilities

```typescript
import { test } from '@playwright/test';
import { LoginPage, TestHelpers, validCredentials } from '../src';

test('login with helpers', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const testHelpers = new TestHelpers(page);
  
  await loginPage.navigateToLoginPage();
  await loginPage.login(validCredentials.username, validCredentials.password);
  await testHelpers.assertUrlContains('secure');
});
```

### Form Handling

```typescript
import { test } from '@playwright/test';
import { LoginPage } from '../src/pages';

test('form interactions', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  // Individual field operations
  await loginPage.fillUsername('testuser');
  await loginPage.fillPassword('testpass');
  await loginPage.clickLoginButton();
  
  // Or complete login action
  await loginPage.login('username', 'password');
  
  // Verify results
  await loginPage.assertLoginSuccess();
});
```

## 🔧 Best Practices Implemented

### 1. **Separation of Concerns**
- Page objects handle element location and interaction
- Test files focus on business logic and assertions
- Utilities provide reusable testing patterns

### 2. **Maintainable Locators**
- Centralized element selectors in page objects
- Consistent locator strategies
- Easy to update when UI changes

### 3. **Reusable Methods**
- Common actions inherited from BasePage
- Specific page actions in respective page classes
- Utility methods for complex scenarios

### 4. **Robust Error Handling**
- Built-in waiting strategies
- Retry mechanisms for flaky actions
- Detailed error messages and debugging

### 5. **Scalable Architecture**
- Easy to add new page objects
- Consistent patterns across all pages
- Modular imports and exports

## 📊 Testing Patterns

### 1. **Navigation Testing**
```typescript
// Navigate and verify page load
await homePage.navigateToHomePage();
await homePage.assertHomePageLoaded();
await homePage.assertNavigationPresent();
```

### 2. **Form Testing**
```typescript
// Test form validation
await loginPage.login('invalid', 'invalid');
await loginPage.assertLoginFailure();

// Test successful submission
await loginPage.login(validCredentials.username, validCredentials.password);
await loginPage.assertLoginSuccess();
```

### 3. **Multi-step Workflows**
```typescript
// Complete user journey
await loginPage.navigateToLoginPage();
await loginPage.login(validCredentials.username, validCredentials.password);
await loginPage.assertLoginSuccess();
await loginPage.clickLogoutLink();
await loginPage.assertLoginPageLoaded();
```

## 🎨 Advanced Features

### 1. **Responsive Testing**
```typescript
// Test different viewport sizes
await page.setViewportSize({ width: 1920, height: 1080 });
await homePage.assertNavigationPresent();

await page.setViewportSize({ width: 375, height: 667 });
await homePage.assertHomePageLoaded();
```

### 2. **Screenshot and Debugging**
```typescript
// Conditional screenshots
await testHelpers.screenshotOnFailure(
  async () => await homePage.isFeaturesSectonVisible(),
  'features-check'
);
```

### 3. **Retry Mechanisms**
```typescript
// Retry flaky operations
await testHelpers.retryAction(
  async () => await loginPage.login(username, password),
  3, // max attempts
  1000 // delay between attempts
);
```

## 📝 Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npx playwright test tests/pom-demo.spec.ts

# Run with specific browser
npx playwright test --project=chromium

# Run in headed mode
npx playwright test --headed

# Generate test report
npx playwright show-report
```

## 🔄 Extending the Framework

### Adding New Page Objects

1. Create new page class extending `BasePage`
2. Define page-specific locators and methods
3. Export from `src/pages/index.ts`
4. Import and use in test files

### Adding Utilities

1. Create utility class in `src/utils/`
2. Add specific helper methods
3. Export from `src/utils/index.ts`
4. Import and use across tests

### Adding Test Data

1. Add new data structures to `src/data/testData.ts`
2. Export for use in tests
3. Maintain environment-specific variations

## 🏆 Benefits of This POM Implementation

- **Maintainability**: Easy to update when UI changes
- **Reusability**: Common actions shared across tests
- **Readability**: Clear test structure and business logic
- **Scalability**: Easy to add new pages and functionality
- **Debugging**: Built-in screenshot and error handling
- **Consistency**: Standardized patterns across all tests