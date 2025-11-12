# Playwright TypeScript Project with CI/CD

A comprehensive Playwright testing project with TypeScript support and GitHub Actions CI/CD pipeline.

## 🚀 Features

- **TypeScript Support**: Full TypeScript configuration for type-safe test development
- **Cross-Browser Testing**: Tests run on Chromium, Firefox, and WebKit
- **Mobile Testing**: Responsive testing with mobile device emulation
- **🎨 Visual Testing**: Screenshot comparison and visual regression testing across devices
- **♿ Accessibility Testing**: Comprehensive WCAG 2.1 Level AA compliance testing
- **CI/CD Pipeline**: Automated testing with GitHub Actions
- **Multiple Test Types**: Navigation, form interaction, visual, and accessibility tests
- **Detailed Reporting**: HTML reports with screenshots and videos
- **Production Ready**: Comprehensive test suites with CI/CD integration

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

### Accessibility Tests

```bash
# Run accessibility tests
npx playwright test accessibility-tests.spec.ts

# Run accessibility tests with detailed output
npx playwright test accessibility-tests.spec.ts --reporter=line

# Run specific accessibility test category
npx playwright test accessibility-tests.spec.ts --grep "Document Structure"
```

For comprehensive accessibility testing guidance, see: [`docs/accessibility-testing-guide.md`](docs/accessibility-testing-guide.md)

### Visual Tests

```bash
# Run visual regression tests
npx playwright test visual-testing-simple.spec.ts

# Run comprehensive visual tests
npx playwright test visual-testing-comprehensive.spec.ts

# Update visual baselines
npx playwright test visual-testing-simple.spec.ts --update-snapshots

# Run specific visual test category
npx playwright test visual-testing-simple.spec.ts --grep "Screenshot Testing"
```

For comprehensive visual testing guidance, see: [`docs/visual-testing-guide.md`](docs/visual-testing-guide.md)

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

## 🎯 Available NPM Scripts

### Core Testing
| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:headed` | Run tests in headed mode (visible browser) |
| `npm run test:debug` | Run tests in debug mode |
| `npm run test:ui` | Launch Playwright UI mode |
| `npm run codegen` | Generate test code interactively |
| `npm run report` | View HTML test report |

### Visual Testing
| Command | Description |
|---------|-------------|
| `npm run test:visual` | Run visual regression tests (simple suite) |
| `npm run test:visual-comprehensive` | Run advanced visual tests |
| `npm run test:visual-update` | Update visual test baselines |
| `npm run test:visual-cross-browser` | Cross-browser visual testing |

### Accessibility Testing
| Command | Description |
|---------|-------------|
| `npm run test:accessibility` | Run accessibility compliance tests |
| `npm run test:accessibility-comprehensive` | Full accessibility test suite |

### Development
| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run install-playwright` | Install Playwright browsers |
| `npm run lint` | Check code style (if configured) |

## 🗂️ Project Structure

```
├── .github/
│   └── workflows/
│       ├── playwright.yml         # Main CI/CD pipeline
│       └── visual-tests.yml       # Visual testing CI/CD pipeline
├── tests/                         # Test files
│   ├── example.spec.ts            # Basic navigation tests
│   ├── forms.spec.ts              # Form interaction tests
│   ├── visual.spec.ts             # Basic visual testing examples
│   ├── visual-testing-simple.spec.ts      # Comprehensive visual testing suite
│   ├── visual-testing-comprehensive.spec.ts # Advanced visual testing patterns
│   └── accessibility-tests.spec.ts # Accessibility testing suite
├── docs/                          # Documentation
│   ├── accessibility-testing-guide.md # Comprehensive accessibility guide
│   ├── visual-testing-guide.md    # Comprehensive visual testing guide
│   └── visual-testing-workflow.md # Visual testing workflow & CI/CD guide
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

### Main Pipeline (`.github/workflows/playwright.yml`)
Automatically runs on pushes and PRs:
- **Node.js Matrix**: 18.x, 20.x versions
- **Cross-Browser**: Chromium, Firefox, WebKit  
- **Mobile Testing**: Separate job with device emulation
- **Artifacts**: Reports, screenshots, videos (30 days retention)

### Visual Testing Pipeline (`.github/workflows/visual-tests.yml`)
Comprehensive visual regression testing:
- **Quick Tests**: PR validation (~30s)
- **Cross-Browser**: Main branch pushes (~2min)
- **Comprehensive**: Daily scheduled runs (~5min)
- **Baseline Management**: Auto-update snapshots with commit triggers

**Special Commit Messages:**
- `[visual-full]` → Trigger comprehensive visual tests
- `[update-baselines]` → Update visual test baselines

For detailed workflow guide: [`docs/visual-testing-workflow.md`](docs/visual-testing-workflow.md)

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

---

# 🚀 K6 Performance Testing Guide

## 📖 Overview

This project includes a comprehensive K6 performance testing suite designed to validate the performance, scalability, and reliability of the Expense Management API under various load conditions. The tests follow Page Object Model (POM) design patterns for maintainability and reusability.

## 🎯 Performance Testing Objectives

- **Load Testing**: Validate system performance under expected user loads (50 concurrent users)
- **Stress Testing**: Determine system breaking points (100+ concurrent users)
- **API Testing**: Ensure all CRUD operations perform within acceptable thresholds
- **User Journey Testing**: Simulate realistic user workflows with proper think times
- **Scalability Assessment**: Identify bottlenecks and performance degradation points

## 📁 K6 Test Suite Structure

```
performance-tests/
├── config/
│   └── config.js                 # Mock server configuration & endpoints
├── utils/
│   ├── auth.js                   # Authentication & session management
│   └── helpers.js                # Data generation & validation utilities
├── pages/                        # Page Object Model (POM) classes
│   ├── BasePage.js               # Base HTTP operations
│   ├── EmployeePage.js           # Employee operations
│   ├── ExpensePage.js            # Expense CRUD operations
│   ├── MedicalExpensePage.js     # Medical expense management
│   └── LocationPage.js           # Location management
├── tests/                        # Individual test suites
│   ├── get-requests.test.js      # GET endpoints performance
│   ├── post-requests.test.js     # POST endpoints performance
│   ├── put-requests.test.js      # PUT endpoints performance
│   ├── delete-requests.test.js   # DELETE endpoints performance
│   └── stress-test.js            # High-load stress testing
├── main-performance-test.js      # Main orchestrator (50 users)
├── package.json                  # NPM scripts & dependencies
└── README.md                     # Detailed K6 documentation
```

## 🔧 K6 Installation & Setup

### Prerequisites

- **K6**: Latest stable version (≥0.40.0)
- **Node.js**: 14.x or higher (for development tools)

### Installation

**Windows:**
```powershell
# Using Winget (recommended)
winget install k6

# Using Chocolatey
choco install k6

# Manual download from https://k6.io/docs/getting-started/installation/
```

**macOS:**
```bash
# Using Homebrew (recommended)
brew install k6

# Using MacPorts
sudo port install k6
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt install k6

# RHEL/CentOS/Fedora
sudo dnf install k6

# From source
sudo snap install k6
```

### Verify Installation

```bash
k6 version
# Expected output: k6 v0.XX.X
```

## 🎮 Running Performance Tests

### Basic Commands

Navigate to the performance tests directory:
```bash
cd performance-tests
```

**Main Performance Test (50 Users, 8 minutes):**
```bash
k6 run main-performance-test.js
```

**Individual Test Suites:**
```bash
# GET operations test
k6 run tests/get-requests.test.js

# POST operations test
k6 run tests/post-requests.test.js

# PUT operations test
k6 run tests/put-requests.test.js

# DELETE operations test
k6 run tests/delete-requests.test.js

# High-load stress test
k6 run tests/stress-test.js
```

### NPM Scripts (if Node.js is available)

```bash
# Main performance test
npm run test

# Individual test suites
npm run test:get
npm run test:post
npm run test:put
npm run test:delete

# Stress testing
npm run test:stress

# Generate HTML report
npm run test:report

# All individual tests
npm run test:all

# Quick 30-second test
npm run test:quick

# Debug mode (1 user, 1 iteration)
npm run test:debug
```

### Custom Test Configurations

**Custom Load Patterns:**
```bash
# Custom user count and duration
k6 run --vus 100 --duration 5m main-performance-test.js

# Spike testing pattern
k6 run --stage 30s:10,1m:100,30s:10 main-performance-test.js

# Ramp-up pattern
k6 run --stage 2m:50,5m:50,1m:0 main-performance-test.js
```

**Mock Testing (Default):**
```bash
# Run tests against mock API server (default configuration)
k6 run main-performance-test.js

# Custom mock server URL if needed
K6_BASE_URL=https://your-mock-server.com k6 run main-performance-test.js
```

## 📊 Test Reports & Analysis

### Built-in Reporting

**HTML Report Generation:**
```bash
k6 run --out html=performance-report.html main-performance-test.js
```

**JSON Results Export:**
```bash
k6 run --out json=results.json main-performance-test.js
```

**CSV Export:**
```bash
k6 run --out csv=results.csv main-performance-test.js
```

### Advanced Monitoring

**InfluxDB Integration:**
```bash
k6 run --out influxdb=http://localhost:8086/k6db main-performance-test.js
```

**Prometheus Integration:**
```bash
k6 run --out prometheus main-performance-test.js
```

**Cloud Monitoring (K6 Cloud):**
```bash
k6 cloud main-performance-test.js
```

## 🎯 Test Coverage & Endpoints

### API Endpoints Tested

**GET Operations (3 endpoints):**
- `GET /api/v1/employees/me` - Current user information
- `GET /api/v1/expense-types` - Available expense types
- `GET /api/v1/medical-expenses/available-amount` - Medical budget

**POST Operations (2 endpoints):**
- `POST /api/v1/expenses` - Create expense
- `POST /api/v1/medical-expenses` - Create medical expense

**PUT Operations (2 endpoints):**
- `PUT /api/v1/expenses` - Update expenses (bulk)
- `PUT /api/v1/locations` - Update location

**DELETE Operations (2 endpoints):**
- `DELETE /api/v1/request-expenses/{id}` - Delete expense request
- `DELETE /api/v1/locations/{id}` - Delete location

### Load Test Patterns

**Default Load Test:**
- **Users**: 0 → 50 → 50 → 0
- **Duration**: 2m → 5m → 1m (8 minutes total)
- **Think Times**: Realistic user behavior (1-10 seconds)

**Stress Test:**
- **Users**: 10 → 100 → 100 → 0
- **Duration**: 2m → 5m → 10m → 2m (19 minutes total)
- **Intensity**: High-load sustained testing

## 📈 Performance Thresholds & SLAs

### Response Time Requirements

- **GET requests**: < 1000ms (95th percentile)
- **POST requests**: < 2000ms (95th percentile)
- **PUT requests**: < 1500ms (95th percentile)
- **DELETE requests**: < 1000ms (95th percentile)

### Error Rate Targets

- **Normal Load**: < 10% error rate
- **Stress Load**: < 20% error rate

### Throughput Requirements

- **Minimum**: 1 RPS per virtual user
- **Target**: 2-5 RPS sustained load

## 👥 User Behavior Simulation

### User Personas

The test suite simulates realistic user behavior with different personas:

1. **Regular Employee (40%)** - Basic expense management workflows
2. **Manager (25%)** - Team oversight and approval processes
3. **Admin User (15%)** - System administration and bulk operations
4. **Medical User (15%)** - Medical expense focused workflows
5. **Heavy User (5%)** - Intensive API operations

### Think Time Patterns

- **Short (1-2s)**: Quick actions, navigation clicks
- **Medium (3-5s)**: Form filling, data entry
- **Long (5-8s)**: Reading, decision making
- **Very Long (10-15s)**: Breaks, interruptions

## 🔍 Debugging & Troubleshooting

### Debug Mode

**Single User Debug:**
```bash
k6 run --iterations 1 --vus 1 tests/get-requests.test.js
```

**Verbose Logging:**
```bash
K6_LOG_LEVEL=debug k6 run main-performance-test.js
```

**Console Output Analysis:**
```bash
k6 run --console-output=stdout main-performance-test.js
```

### Common Issues & Solutions

**Authentication Failures:**
```bash
# Verify auth endpoint accessibility
curl -X POST https://mock-api-server.wiremockapi.cloud/api/v1/auth/login

# Check test user credentials in config/config.js
```

**Network Timeouts:**
- Increase timeout values in configuration
- Check network connectivity to mock server
- Consider using local proxy for debugging

**High Error Rates:**
- Reduce concurrent users to identify capacity limits
- Check server logs for capacity issues
- Verify test data validity and format

## 🛠️ Configuration Customization

### Environment Configuration

Edit `config/config.js` to modify:

**Mock Server URL:**
```javascript
BASE_URL: 'https://mock-api-server.wiremockapi.cloud'
```

**Test User Credentials:**
```javascript
TEST_DATA: {
  USERS: [
    { email: 'test@company.com', password: 'password123', role: 'employee' }
  ]
}
```

**Performance Thresholds:**
```javascript
thresholds: {
  http_req_duration: ['p(95)<1500'],  // Custom SLA
  http_req_failed: ['rate<0.05'],     // 5% error rate
  http_reqs: ['rate>3']               // 3 RPS minimum
}
```

### Load Pattern Customization

**Custom Ramp Patterns:**
```javascript
stages: [
  { duration: '5m', target: 20 },   // Gradual ramp
  { duration: '10m', target: 100 }, // Peak load
  { duration: '5m', target: 20 },   // Scale down
  { duration: '2m', target: 0 }     // Complete shutdown
]
```

## 🔄 CI/CD Integration

### GitHub Actions Integration

Add K6 performance tests to your GitHub Actions workflow:

```yaml
name: Performance Tests

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM

jobs:
  performance-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install K6
        run: |
          sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
          echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
          sudo apt-get update
          sudo apt-get install k6
      
      - name: Run Performance Tests
        run: |
          cd performance-tests
          k6 run --out json=results.json main-performance-test.js
      
      - name: Upload Results
        uses: actions/upload-artifact@v3
        with:
          name: k6-performance-results
          path: performance-tests/results.json
```

### Docker Integration

**Dockerfile for K6:**
```dockerfile
FROM grafana/k6:latest
WORKDIR /scripts
COPY performance-tests/ .
CMD ["run", "main-performance-test.js"]
```

**Docker Compose:**
```yaml
version: '3.8'
services:
  k6:
    build: .
    volumes:
      - ./performance-tests:/scripts
    command: run main-performance-test.js
```

## 📚 Performance Testing Best Practices

### Test Design Principles

1. **Realistic Scenarios**: Model actual user behavior patterns
2. **Gradual Load Increase**: Avoid sudden load spikes
3. **Think Time Inclusion**: Simulate real user interactions
4. **Error Handling**: Test both success and failure scenarios
5. **Resource Cleanup**: Clean up test data after execution

### Monitoring & Analysis

1. **Baseline Establishment**: Create performance baselines
2. **Trend Analysis**: Track performance over time
3. **Bottleneck Identification**: Pinpoint system limitations
4. **Capacity Planning**: Plan for future growth
5. **SLA Validation**: Ensure service level agreements are met

### Continuous Improvement

1. **Regular Execution**: Run tests on schedule
2. **Threshold Updates**: Adjust thresholds based on business needs
3. **Test Maintenance**: Keep tests updated with API changes
4. **Mock API Consistency**: Ensure mock server responses match expected format

## 🎓 Learning Resources

### K6 Documentation
- [Official K6 Documentation](https://k6.io/docs/)
- [K6 Performance Testing Guide](https://k6.io/docs/testing-guides/)
- [K6 JavaScript API Reference](https://k6.io/docs/javascript-api/)

### Performance Testing Resources
- [Performance Testing Best Practices](https://k6.io/docs/testing-guides/performance-testing-best-practices/)
- [Load Testing Patterns](https://k6.io/docs/testing-guides/load-testing-patterns/)
- [API Performance Testing](https://k6.io/docs/testing-guides/api-load-testing/)

### Community & Support
- [K6 Community Forum](https://community.k6.io/)
- [K6 GitHub Repository](https://github.com/grafana/k6)
- [K6 Slack Channel](https://k6.io/slack)

---

## ⚡ Quick Start Checklist

- [ ] Update GitHub username in package.json
- [ ] Configure Git user settings
- [ ] Install dependencies (`npm install`)
- [ ] Install browsers (`npm run install:browsers`)
- [ ] Run tests (`npm test`)
- [ ] Check test report (`npm run report`)
- [ ] Push to GitHub to trigger CI/CD