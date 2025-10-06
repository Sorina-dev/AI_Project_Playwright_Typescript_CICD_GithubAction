# Playwright TypeScript Project with CI/CD

A comprehensive Playwright testing project with TypeScript support and GitHub Actions CI/CD pipeline.

## 🚀 Features

- **TypeScript Support**: Full TypeScript configuration for type-safe test development
- **Cross-Browser Testing**: Tests run on Chromium, Firefox, and WebKit
- **Mobile Testing**: Responsive testing with mobile device emulation
- **Visual Testing**: Screenshot comparison and visual regression testing
- **CI/CD Pipeline**: Automated testing with GitHub Actions
- **Multiple Test Types**: Navigation, form interaction, and visual tests
- **Detailed Reporting**: HTML reports with screenshots and videos

## 📋 Prerequisites

- Node.js (18.x or 20.x)
- npm or yarn
- Git

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-github-username/playwright-typescript-project.git
cd playwright-typescript-project
```

### 2. Change GitHub User Configuration

**Update package.json:**
Replace `your-github-username` with your actual GitHub username in:
- `author` field
- `repository.url`
- `bugs.url` 
- `homepage`

**Update Git Configuration:**
```bash
git config user.name "Your Full Name"
git config user.email "your.email@example.com"
```

Or edit the `.gitconfig` file directly with your information.

### 3. Install Dependencies

```bash
npm install
```

### 4. Install Playwright Browsers

```bash
npm run install:browsers
```

## 🎯 Running Tests

### Basic Test Commands

```bash
# Run all tests
npm test

# Run tests in headed mode (with browser UI)
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run tests with UI mode
npm run test:ui
```

### Browser-Specific Tests

```bash
# Run tests only on Chrome
npm run test:chrome

# Run tests only on Firefox
npm run test:firefox

# Run tests only on Safari
npm run test:safari
```

### Mobile Tests

```bash
# Run mobile tests
npm run test:mobile
```

### Generate Test Code

```bash
# Launch Playwright codegen
npm run codegen
```

## 📊 Test Reports

```bash
# View test report
npm run report
```

Reports are generated in `playwright-report/` directory and include:
- Test execution details
- Screenshots on failure
- Video recordings
- Performance metrics

## 🗂️ Project Structure

```
├── .github/
│   └── workflows/
│       └── playwright.yml         # GitHub Actions CI/CD pipeline
├── tests/                         # Test files
│   ├── example.spec.ts            # Basic navigation tests
│   ├── forms.spec.ts              # Form interaction tests
│   └── visual.spec.ts             # Visual testing examples
├── test-results/                  # Test artifacts (auto-generated)
├── playwright-report/             # HTML reports (auto-generated)
├── playwright.config.ts           # Playwright configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Project dependencies and scripts
└── README.md                      # This file
```

## 🔧 Configuration

### Playwright Configuration (`playwright.config.ts`)

The configuration includes:
- Multiple browser projects (Chrome, Firefox, Safari)
- Mobile device emulation
- Screenshot and video recording on failure
- Parallel test execution
- Custom reporters (HTML, JSON, JUnit)

### TypeScript Configuration (`tsconfig.json`)

Configured for:
- ES2022 target
- Strict type checking
- Source maps for debugging
- Optimized for testing

## 🚀 CI/CD Pipeline

The GitHub Actions pipeline (`.github/workflows/playwright.yml`) automatically:

1. **Triggers on:**
   - Push to `main` or `develop` branches
   - Pull requests to `main` branch

2. **Test Matrix:**
   - Node.js versions: 18.x, 20.x
   - Browsers: Chromium, Firefox, WebKit
   - Mobile testing on separate job

3. **Artifacts:**
   - Test reports uploaded for 30 days
   - Screenshots and videos on failures

### Setting up CI/CD

1. Push your code to GitHub
2. GitHub Actions will automatically run tests
3. Check the "Actions" tab for test results

## 📝 Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test('should do something', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Expected Title/);
});
```

### Test Categories

1. **Navigation Tests** (`example.spec.ts`)
   - Page loading and navigation
   - Element visibility checks
   - Basic interactions

2. **Form Tests** (`forms.spec.ts`)
   - Form filling and submission
   - Validation testing
   - Dropdown interactions

3. **Visual Tests** (`visual.spec.ts`)
   - Screenshot comparisons
   - Responsive design testing
   - CSS property validation

## 🐛 Debugging

1. **Run in headed mode:**
   ```bash
   npm run test:headed
   ```

2. **Use debug mode:**
   ```bash
   npm run test:debug
   ```

3. **Use UI mode for interactive debugging:**
   ```bash
   npm run test:ui
   ```

## 📈 Best Practices

1. **Test Organization:**
   - Group related tests using `test.describe()`
   - Use descriptive test names
   - Keep tests independent

2. **Selectors:**
   - Prefer user-facing selectors (text, labels)
   - Use data-testid for complex elements
   - Avoid CSS selectors when possible

3. **Assertions:**
   - Use Playwright's auto-waiting assertions
   - Be specific with expectations
   - Test both positive and negative cases

4. **Performance:**
   - Use `page.waitForLoadState()` for heavy pages
   - Avoid hard waits (`page.waitForTimeout()`)
   - Optimize test parallelization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Resources

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## ⚡ Quick Start Checklist

- [ ] Update GitHub username in package.json
- [ ] Configure Git user settings
- [ ] Install dependencies (`npm install`)
- [ ] Install browsers (`npm run install:browsers`)
- [ ] Run tests (`npm test`)
- [ ] Check test report (`npm run report`)
- [ ] Push to GitHub to trigger CI/CD