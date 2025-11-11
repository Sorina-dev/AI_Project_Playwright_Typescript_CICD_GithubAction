# 🚀 API Testing Framework Guide

## Overview

This guide covers the comprehensive API testing framework built using Playwright with a **Page Object Model (POM)-inspired architecture**. The framework is designed for maintainability, reusability, and scalability.

## 🏗️ Framework Architecture

### Directory Structure

```
src/
├── clients/           # API Client Classes
│   └── index.ts      # BaseApiClient, UsersClient, PostsClient, ReqResClient
├── data/
│   ├── factories/    # Test Data Factory Classes
│   │   └── index.ts  # UserFactory, PostFactory, CommentFactory, AuthFactory
│   ├── models/       # TypeScript DTOs and Interfaces
│   │   └── index.ts  # User, Post, Comment, ApiResponse, etc.
│   ├── static/       # Static Test Data Files
│   │   ├── testData.json     # Test users, posts, scenarios
│   │   └── apiConfig.json    # Environment configs, headers
│   └── index.ts      # Data layer exports
├── utils/            # Utility Functions
│   └── index.ts      # LoggerUtils, ValidationUtils, PerformanceUtils, etc.
└── index.ts          # Main framework exports

test/
└── api/              # API Test Files
    ├── users.spec.ts         # User management tests
    ├── posts.spec.ts         # Post management tests
    └── authentication.spec.ts # Authentication tests
```

## 🔧 Core Components

### 1. API Clients (`src/clients/`)

**BaseApiClient**: Provides common HTTP methods with logging, error handling, and performance metrics.

```typescript
export class BaseApiClient {
  protected async get<T>(endpoint: string): Promise<ApiResponse<T>>
  protected async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>>
  protected async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>>
  protected async patch<T>(endpoint: string, data: any): Promise<ApiResponse<T>>
  protected async delete<T>(endpoint: string): Promise<ApiResponse<T>>
}
```

**Specialized Clients**:
- `UsersClient`: JSONPlaceholder users API operations
- `PostsClient`: JSONPlaceholder posts API operations  
- `ReqResClient`: ReqRes authentication and user management

### 2. Data Models (`src/data/models/`)

TypeScript interfaces providing type safety:

```typescript
export interface User extends BaseEntity {
  name: string;
  username?: string;
  email: string;
  phone?: string;
  website?: string;
  address?: Address;
  company?: Company;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
  responseTime: number;
}
```

### 3. Test Data Factories (`src/data/factories/`)

Generate consistent test data:

```typescript
export class UserFactory {
  static createUser(overrides?: Partial<User>): User
  static createUserRequest(overrides?: Partial<CreateUserRequest>): CreateUserRequest
  static createUsers(count: number): User[]
  static createInvalidUser(): Partial<User>
}
```

### 4. Utilities (`src/utils/`)

**LoggerUtils**: Structured logging with levels
**PerformanceUtils**: Response time tracking and metrics
**ValidationUtils**: Data validation and schema checking
**RetryUtils**: Retry mechanisms with exponential backoff
**ResponseUtils**: Response assertion helpers

### 5. Static Data (`src/data/static/`)

**testData.json**: Predefined test data, scenarios, validation schemas
**apiConfig.json**: Environment configurations, headers, thresholds

## 📝 Writing API Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { UsersClient, UserFactory, LoggerUtils, PerformanceUtils } from '../../src';

test.describe('Users API Tests', () => {
  let usersClient: UsersClient;

  test.beforeEach(async ({ request }) => {
    usersClient = new UsersClient(request);
  });

  test('should create user successfully', async () => {
    const userData = UserFactory.createUser();
    const response = await usersClient.createUser(userData);
    
    expect(response.status).toBe(201);
    expect(response.data.name).toBe(userData.name);
  });
});
```

### Advanced Test Patterns

#### Performance Testing
```typescript
test('should handle concurrent requests', async () => {
  const testName = 'concurrentRequests';
  PerformanceUtils.startMeasurement(testName);
  
  const promises = [1, 2, 3].map(id => usersClient.getUserById(id));
  const responses = await Promise.all(promises);
  
  const metrics = PerformanceUtils.endMeasurement(testName);
  expect(metrics?.averageResponseTime).toBeLessThan(2000);
});
```

#### Data Validation
```typescript
test('should validate response structure', async () => {
  const response = await usersClient.getUserById(1);
  const user = response.data;
  
  const validation = ValidationUtils.validateRequiredFields(user, ['id', 'name', 'email']);
  expect(validation.isValid).toBeTruthy();
  
  expect(ValidationUtils.isValidEmail(user.email)).toBeTruthy();
});
```

#### Error Handling
```typescript
test('should handle 404 gracefully', async () => {
  const response = await usersClient.getUserById(999999);
  expect(response.status).toBe(404);
});
```

## 🎯 Test Categories

### 1. CRUD Operations
- Create, Read, Update, Delete operations
- Input validation and edge cases
- Response structure validation

### 2. Authentication Tests
- Registration and login flows
- Token validation
- Authorization scenarios
- Security testing

### 3. Performance Tests
- Response time measurements
- Concurrent request handling
- Load testing scenarios
- Performance threshold validation

### 4. Data Validation
- Schema validation
- Field type checking
- Business rule validation
- Edge case handling

### 5. Error Handling
- HTTP status code validation
- Error message verification
- Rate limiting handling
- Network failure simulation

## 🔍 Running Tests

### Run All API Tests
```bash
npx playwright test test/api/
```

### Run Specific Test File
```bash
npx playwright test test/api/users.spec.ts
```

### Run Tests with Tags
```bash
npx playwright test --grep "@api"
```

### Generate Reports
```bash
npx playwright test --reporter=html
```

## 📊 Framework Features

### 1. Automatic Logging
- Request/response logging with timestamps
- Performance metrics tracking
- Error logging with context
- Configurable log levels

### 2. Performance Monitoring
- Response time measurement
- Concurrent request tracking
- Performance threshold assertions
- Detailed metrics reporting

### 3. Data Management
- Factory pattern for test data generation
- Static data files for complex scenarios
- Type-safe data models
- Validation utilities

### 4. Error Recovery
- Retry mechanisms with exponential backoff
- Rate limiting handling
- Network failure recovery
- Graceful degradation

### 5. Maintainability
- POM-inspired architecture
- Separation of concerns
- Reusable components
- Easy test maintenance

## 🛠️ Configuration

### Environment Setup
Configure different environments in `apiConfig.json`:

```json
{
  "environments": {
    "development": {
      "jsonPlaceholder": {
        "baseUrl": "https://jsonplaceholder.typicode.com",
        "timeout": 10000
      }
    }
  }
}
```

### Test Configuration
Set logging levels and performance thresholds:

```json
{
  "logging": {
    "level": "info",
    "enableRequestLogging": true,
    "enablePerformanceLogging": true
  },
  "performanceThresholds": {
    "responseTime": {
      "fast": 500,
      "acceptable": 2000,
      "slow": 5000
    }
  }
}
```

## 📈 Best Practices

### 1. Test Organization
- Group related tests in describe blocks
- Use descriptive test names with emojis
- Implement proper setup and teardown
- Use tags for test categorization

### 2. Data Management
- Use factories for dynamic data generation
- Leverage static data for complex scenarios
- Implement data cleanup strategies
- Avoid hard-coded test data

### 3. Assertions
- Use framework assertion helpers
- Validate both success and error scenarios
- Check response structure and data types
- Implement comprehensive validation

### 4. Performance
- Monitor response times consistently
- Set appropriate performance thresholds
- Test concurrent scenarios
- Track performance trends

### 5. Maintenance
- Keep clients and utilities updated
- Document new patterns and utilities
- Refactor tests regularly
- Monitor test stability

## 🚀 Advanced Usage

### Custom Clients
Extend BaseApiClient for new APIs:

```typescript
export class CustomClient extends BaseApiClient {
  constructor(request: APIRequestContext) {
    super(request, 'https://custom-api.com');
  }
  
  async getCustomData(): Promise<ApiResponse<CustomData>> {
    return this.get<CustomData>('/custom-endpoint');
  }
}
```

### Custom Factories
Create specialized data factories:

```typescript
export class CustomFactory {
  static createCustomData(overrides = {}): CustomData {
    return {
      id: Date.now(),
      customField: 'default value',
      ...overrides
    };
  }
}
```

### Performance Monitoring
Implement custom performance tracking:

```typescript
test('custom performance test', async () => {
  PerformanceUtils.startMeasurement('customTest');
  
  // Your test logic
  
  const metrics = PerformanceUtils.endMeasurement('customTest');
  
  PerformanceUtils.assertPerformance('customTest', {
    maxDuration: 5000,
    maxAverageResponseTime: 1000,
    minSuccessRate: 95
  });
});
```

## 📋 API Testing Checklist

### Pre-Test Setup
- [ ] API client configured correctly
- [ ] Test data prepared and validated
- [ ] Environment configuration verified
- [ ] Performance thresholds defined

### During Testing
- [ ] Request/response logging enabled
- [ ] Performance metrics collected
- [ ] Error scenarios covered
- [ ] Edge cases tested

### Post-Test Validation
- [ ] All assertions passed
- [ ] Performance within thresholds
- [ ] Logs reviewed for issues
- [ ] Test data cleaned up

## 🎯 Migration from Legacy Tests

### Step 1: Identify Test Patterns
- Extract CRUD operations
- Identify authentication flows
- Map data dependencies
- Categorize test types

### Step 2: Create Framework Components
- Build API clients
- Define data models
- Create test factories
- Implement utilities

### Step 3: Refactor Tests
- Replace direct API calls with client methods
- Use factories for test data
- Add logging and performance tracking
- Implement proper assertions

### Step 4: Validate Migration
- Ensure test coverage maintained
- Verify performance improvements
- Validate maintainability gains
- Update documentation

## 🔧 Troubleshooting

### Common Issues
1. **TypeScript Errors**: Ensure all imports are correctly typed
2. **Rate Limiting**: Implement delays between requests
3. **Network Issues**: Use retry mechanisms
4. **Data Conflicts**: Use unique test data

### Debugging Tips
1. Enable debug logging: `LoggerUtils.setLogLevel('debug')`
2. Check performance metrics for bottlenecks
3. Validate request/response data
4. Use sanitized logging for sensitive data

## 📊 Pipeline Integration

The API testing framework is fully integrated with the existing GitHub Actions pipeline:

### Pipeline Configuration
The framework maintains compatibility with the existing pipeline configuration in `.github/workflows/playwright.yml`:

```yaml
playwright-tests:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
    - run: npm ci
    - run: npx playwright install
    - run: npx playwright test
    - uses: actions/upload-artifact@v4
      with:
        name: playwright-report
        path: playwright-report/
```

### Test Execution
API tests run as part of the standard Playwright test suite:
- All API tests include the `@api` tag for easy filtering
- Tests are organized in the `test/api/` directory
- Framework components are imported from `src/` directory
- Performance metrics and logging are captured during CI runs

### Backwards Compatibility
The new framework structure maintains full backwards compatibility:
- Existing test files continue to work unchanged
- New framework components are additive, not replacing
- Pipeline configuration requires no modifications
- All existing npm scripts and commands remain functional

This framework provides a robust, maintainable approach to API testing with Playwright, following POM principles for better organization and reusability while maintaining full integration with existing CI/CD processes.