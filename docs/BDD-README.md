# BDD Testing with Cucumber and Playwright

This project includes proper BDD (Behavior-Driven Development) testing using Cucumber with Gherkin syntax and Playwright for automation.
Video recording can be checke din HTML report or in test-result folder itself from Explorer

# Flow for creating tests from existing framework:
* take into consideration Pages already created or create others
* Given - is the step repeated for all scenarios in a feature file
* THEN can also be an AND
* look at existing Features and steps
* No duplicates allowed in same feature and steps file
* Before running in terminal add the test to the script and how it will be called in package.json file:
example:
 "test:bdd-exampleAsBDD": "cucumber-js features/exampleAsBDD.feature --require-module ts-node/register --require features/step-definitions/**/*.ts --format progress-bar --format html:test-results/cucumber-report.html"


## 📁 Project Files & Configuration Explained

### **Essential Configuration Files (✅ KEEP ALL)**

| File | Purpose | Why Essential |
|------|---------|---------------|
| `package.json` | Project metadata, dependencies, npm scripts | ✅ Core project file - contains your BDD test scripts |
| `package-lock.json` | Locks exact dependency versions | ✅ **NEVER DELETE** - Ensures reproducible installs |
| `tsconfig.json` | TypeScript compiler configuration | ✅ Required for compiling .ts step definitions |
| `playwright.config.ts` | Playwright test runner settings | ✅ Configures regular Playwright tests (`test/` folder) |
| `cucumber.js` | Cucumber BDD framework configuration | ✅ **ESSENTIAL** - Browser settings, timeouts for BDD tests |


### **Version Control Files (✅ KEEP)**

- `.gitignore` - Tells Git which files to ignore (node_modules, test results) when pushing to repository
- `.gitconfig` - Git user settings and configuration

---

## 🔒 **Important: Why Never Delete `package-lock.json`**

```bash
# When you run npm install, it creates/updates package-lock.json
npm install

# This file ensures:
✅ Exact same dependency versions for everyone on your team
✅ Prevents "works on my machine" issues
✅ Faster npm installs (uses cached dependency tree)
✅ Security - locks known-good versions
```

**If you accidentally delete it:**
```bash
# It will be recreated, but versions might change
npm install  # Creates new package-lock.json with latest compatible versions
```

---

## BDD Framework Structure

├── features/
│   ├── navigation.feature          # Navigation test scenarios
│   ├── search.feature              # Search functionality tests  
│   ├── responsive.feature          # Responsive design tests
│   └── step-definitions/
│       ├── navigation.steps.ts     # Navigation step implementations
│       ├── search.steps.ts         # Search step implementations
│       ├── responsive.steps.ts     # Responsive step implementations
│       ├── world.ts                # Cucumber World configuration
│       └── hooks.ts                # Before/After hooks
├── cucumber.js                     # Cucumber configuration
├── package.json                    # Updated with BDD dependencies
└── BDD-README.md                   # BDD framework documentation
## Running BDD Tests

### **🚀 Quick Commands (With Visible Browser)**

```bash
# Run all BDD tests
npm run test:bdd

# Run individual features
npm run test:bdd-navigation   # Homepage navigation tests
npm run test:bdd-search       # Search functionality tests  
npm run test:bdd-responsive   # Mobile/tablet responsive tests
```

### **⚙️ Advanced Commands**

```bash
# Run single scenario (by line number)
npx cucumber-js features/navigation.feature:9 --require-module ts-node/register --require features/step-definitions/**/*.ts

# Run by tags
npx cucumber-js --tags "@homepage" --require-module ts-node/register --require features/step-definitions/**/*.ts

# Generate HTML report   Standard Cucumber HTML report
npm run report:bdd   #after it was generated in established placed, for me test-results/cucumber-report.html

# For checking videos - copy path from HTML report and use these commands:
# Examples:
# From project root:
Invoke-Item "test-results\videos\2025-10-29T15-30-53-270Z_User_searches_for_content\video-player.html"
```

### **🎯 Test Results (All Passing)**
- ✅ **6 scenarios** (6 passed)
- ✅ **29 steps** (29 passed) 
- ✅ **Browser visible** during execution
- ✅ **3-second slow motion** for clear visibility

---

## ❗ VS Code Test Explorer Limitation

**🚫 Why clicking "Run Test" in .feature files doesn't work:**

| VS Code Test Explorer | Cucumber BDD |
|----------------------|--------------|
| ✅ Recognizes `*.spec.ts` files | ❌ Cannot execute `.feature` files |
| ✅ Runs Playwright/Jest tests | ❌ Doesn't understand Gherkin syntax |
| ✅ Direct test execution | ❌ Needs Cucumber runner to link features + steps |


📁 browser-config.ts
  ├── 🌍 Environment-aware settings
  ├── 🎛️ Browser launch options  
  ├── 📹 Video/screenshot settings
  └── 💻 CI/local adaptations

📁 baseClass.ts  
  ├── 📱 Runtime browser context
  ├── 📄 Current page instance
  └── 🎯 Pure data container

📁 hooks.ts
  ├── 🎣 Imports config when needed
  ├── 🚀 Browser lifecycle management
  └── 📸 Evidence capture logic
  
**💡 Solution:** Always use terminal commands above! This is the standard approach for Cucumber in VS Code.

---

## Writing Features

Create `.feature` files in the `features/` directory using Gherkin syntax:

```gherkin
Feature: User login
  As a user
  I want to log into the application
  So that I can access my account

  Background:
    Given the user is on the login page

  Scenario: Successful login
    Given the user has valid credentials
    When they enter their username and password
    And they click the login button
    Then they should be redirected to the dashboard
    And they should see a welcome message
```

## Step Definitions

Implement step definitions in TypeScript files under `features/step-definitions/`:

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given('the user is on the login page', async function() {
  await this.page.goto('/login');
});

When('they enter their username and password', async function() {
  await this.page.fill('#username', 'testuser');
  await this.page.fill('#password', 'testpass');
});

Then('they should be redirected to the dashboard', async function() {
  await expect(this.page).toHaveURL('/dashboard');
});
```

## Features Included

- **Navigation**: Homepage and documentation access
- **Search**: Content search functionality
- **Responsive**: Mobile and tablet testing
- **Cross-browser**: Chromium, Firefox, and WebKit support

## Reports

Test reports and evidence are generated in the `test-results/` directory:

### **📊 HTML Reports**
- `cucumber-report.html` - Standard Cucumber HTML report
- `enhanced-report.html` - Enhanced visual report with screenshot integration
- `cucumber-report.json` - JSON report for CI/CD integration

### **📸 Visual Evidence (Timestamp-based naming)**
All screenshots and videos use timestamp-based naming for easy organization:

**Screenshots:**
- `{timestamp}_{scenario_name}_start.png` - Initial screenshot
- `{timestamp}_{scenario_name}_end.png` - Final screenshot  
- `{timestamp}_{scenario_name}_FAILURE_{timestamp}.png` - Failure evidence

**Videos:**
- `videos/{timestamp}_{scenario_name}/` - Video recordings directory
- Each scenario gets its own timestamped folder

**Example naming:**
```
test-results/
├── screenshots/
│   ├── 2025-10-29T14-30-15-123Z_User_visits_the_homepage_start.png
│   └── 2025-10-29T14-30-15-123Z_User_visits_the_homepage_end.png
└── videos/
    └── 2025-10-29T14-30-15-123Z_User_visits_the_homepage/
        └── video.webm
```

### **🚀 View Reports**
```bash
# View standard Cucumber report
npm run report:bdd

# View enhanced visual report  
npm run report:enhanced
```

## Benefits of BDD

1. **Business-readable**: Non-technical stakeholders can understand tests
2. **Living documentation**: Features serve as up-to-date documentation
3. **Collaboration**: Enables better communication between teams
4. **User-focused**: Tests are written from the user's perspective
5. **Reusable**: Step definitions can be shared across features