# K6 Performance Testing Suite - Expense Management API

A comprehensive performance testing suite built with K6, following Page Object Model (POM) design patterns for the Expense Management API.

## 🚀 Quick Start

### Prerequisites
- [K6](https://k6.io/docs/getting-started/installation/) installed on your system
- Node.js (for development tools, optional)

### Installation

**Windows:**
```bash
winget install k6
```

**macOS:**
```bash
brew install k6
```

**Linux:**
```bash
sudo apt install k6
```

### Running Tests

#### 1. Main Performance Test (50 Users, 2-minute ramp)
```bash
cd performance-tests
k6 run main-performance-test.js
```

#### 2. Individual Test Suites

**GET Requests Test:**
```bash
k6 run tests/get-requests.test.js
```

**POST Requests Test:**
```bash
k6 run tests/post-requests.test.js
```

**PUT Requests Test:**
```bash
k6 run tests/put-requests.test.js
```

**DELETE Requests Test:**
```bash
k6 run tests/delete-requests.test.js
```

#### 3. Stress Test (10→100→0 Users)
```bash
k6 run tests/stress-test.js
```

### Generate Reports

**HTML Report:**
```bash
k6 run --out html=report.html main-performance-test.js
```

**JSON Report:**
```bash
k6 run --out json=results.json main-performance-test.js
```

**InfluxDB (if available):**
```bash
k6 run --out influxdb=http://localhost:8086/k6 main-performance-test.js
```

## 📁 Project Structure

```
performance-tests/
├── config/
│   └── config.js                 # Configuration settings and endpoints
├── utils/
│   ├── auth.js                   # Authentication utilities
│   └── helpers.js                # Common helper functions
├── pages/
│   ├── BasePage.js               # Base page object class
│   ├── EmployeePage.js           # Employee operations
│   ├── ExpensePage.js            # Expense operations
│   ├── MedicalExpensePage.js     # Medical expense operations
│   └── LocationPage.js           # Location management
├── tests/
│   ├── get-requests.test.js      # GET endpoints test
│   ├── post-requests.test.js     # POST endpoints test
│   ├── put-requests.test.js      # PUT endpoints test
│   ├── delete-requests.test.js   # DELETE endpoints test
│   └── stress-test.js            # High-load stress test
├── main-performance-test.js      # Main orchestrator
└── README.md                     # This file
```

## 🎯 Test Coverage

### Endpoints Tested

#### GET Requests (3 endpoints)
- `GET /api/v1/employees/me` - Current user information
- `GET /api/v1/expense-types` - Available expense types
- `GET /api/v1/medical-expenses/available-amount` - Medical budget

#### POST Requests (2 endpoints)
- `POST /api/v1/expenses` - Create expense
- `POST /api/v1/medical-expenses` - Create medical expense

#### PUT Requests (2 endpoints)
- `PUT /api/v1/expenses` - Update expenses (bulk)
- `PUT /api/v1/locations` - Update location

#### DELETE Requests (2 endpoints)
- `DELETE /api/v1/request-expenses/{id}` - Delete expense request
- `DELETE /api/v1/locations/{id}` - Delete location

## ⚙️ Configuration

### Test Configurations

#### Default Load Test
- **Users:** 10 → 50 → 50 → 0
- **Duration:** 1m → 2m → 3m → 1m (7 minutes total)
- **Thresholds:**
  - 95% of requests < 2000ms
  - Error rate < 10%
  - Request rate > 1 RPS

#### Stress Test
- **Users:** 10 → 100 → 100 → 0  
- **Duration:** 2m → 5m → 10m → 2m (19 minutes total)
- **Thresholds:**
  - 95% of requests < 3000ms
  - Error rate < 20%
  - Request rate > 5 RPS

#### Main Performance Test (As Requested)
- **Users:** 0 → 50 → 50 → 0
- **Duration:** 2m → 5m → 1m (8 minutes total)
- **Realistic user behavior with think times**

### Environment Configuration

The tests are configured to use the mock API server by default:
```
Base URL: https://mock-api-server.wiremockapi.cloud
```

To change the environment, modify the `BASE_URL` in `config/config.js` or use environment variables.

## 👥 User Personas

The test suite simulates realistic user behavior with different personas:

1. **Regular Employee (40%)** - Basic expense management
2. **Manager (25%)** - Team oversight and approvals  
3. **Admin User (15%)** - System administration
4. **Medical User (15%)** - Medical expense focused
5. **Heavy User (5%)** - Intensive operations

## 🔐 Authentication

- Users are pre-authenticated at test startup
- Session management handles token expiration
- Multiple test users with different roles
- Realistic authentication flow simulation

## ⏱️ Think Times

Realistic user behavior simulation includes:
- **Short:** 1-2 seconds (quick actions)
- **Medium:** 3-5 seconds (form filling)
- **Long:** 5-8 seconds (reading/decision making)
- **Very Long:** 10-15 seconds (breaks/interruptions)

## 📊 Performance Thresholds

### Response Time Requirements
- **GET requests:** < 1000ms (95th percentile)
- **POST requests:** < 2000ms (95th percentile) 
- **PUT requests:** < 1500ms (95th percentile)
- **DELETE requests:** < 1000ms (95th percentile)

### Error Rate Targets
- **Normal load:** < 10% error rate
- **Stress load:** < 20% error rate

### Throughput Targets
- **Minimum:** 1 RPS per virtual user
- **Target:** 2-5 RPS sustained

## 🧪 Test Data Management

- **Dynamic data generation** for realistic test scenarios
- **Automatic cleanup** of test resources
- **UUID generation** for unique identifiers
- **Realistic business data** (amounts, dates, descriptions)

## 🔍 Error Handling

- Comprehensive error logging with context
- Retry logic with exponential backoff
- Graceful handling of authentication failures
- Clear error categorization (4xx, 5xx, timeouts)

## 📈 Monitoring & Metrics

### Built-in Metrics
- Response times (min, max, avg, percentiles)
- Request rates (RPS)
- Error rates and types
- Data transfer rates
- Virtual user metrics

### Custom Metrics
- Operation success/failure counts
- User session tracking
- Business operation metrics
- Performance degradation detection

## 🚀 Advanced Usage

### Custom Load Patterns
```bash
# Custom user count and duration
k6 run --vus 100 --duration 10m main-performance-test.js

# Spike testing
k6 run --stage 30s:10,1m:100,30s:10 main-performance-test.js
```

### Environment-Specific Testing
```bash
# Staging environment
K6_BASE_URL=https://api-stage.company.com k6 run main-performance-test.js

# Production (be careful!)
K6_BASE_URL=https://api.company.com k6 run main-performance-test.js
```

### Cloud Execution
```bash
# K6 Cloud (requires account)
k6 cloud main-performance-test.js

# Docker execution
docker run --rm -v $(pwd):/scripts grafana/k6:latest run /scripts/main-performance-test.js
```

## 🛠️ Development

### Adding New Tests

1. **Create page object** in `pages/` directory
2. **Add endpoint configuration** in `config/config.js`
3. **Create test file** in `tests/` directory
4. **Update main orchestrator** to include new scenarios

### Custom Configurations

Edit `config/config.js` to modify:
- Base URLs for different environments
- Test data and user credentials
- Performance thresholds
- Think time configurations

## 📋 Best Practices

### Test Design
- ✅ Follow realistic user workflows
- ✅ Include proper think times
- ✅ Test both success and error scenarios
- ✅ Use dynamic test data
- ✅ Clean up test resources

### Performance Testing
- ✅ Start with baseline tests
- ✅ Gradually increase load
- ✅ Monitor system resources
- ✅ Test during different time periods
- ✅ Document performance requirements

### Maintenance
- ✅ Keep tests updated with API changes
- ✅ Review and update test data regularly
- ✅ Monitor test execution times
- ✅ Update performance thresholds based on SLAs

## 🔧 Troubleshooting

### Common Issues

**Authentication Failures:**
```bash
# Check if auth endpoints are accessible
curl -X POST https://mock-api-server.wiremockapi.cloud/api/v1/auth/login
```

**Network Timeouts:**
- Increase timeout values in `config/config.js`
- Check network connectivity to target environment
- Consider using local proxy for debugging

**High Error Rates:**
- Reduce concurrent users
- Check server logs for capacity issues
- Verify test data is valid

### Debug Mode
```bash
# Enable verbose logging
K6_LOG_LEVEL=debug k6 run main-performance-test.js

# Run single iteration for debugging
k6 run --iterations 1 --vus 1 tests/get-requests.test.js
```

## 📚 Additional Resources

- [K6 Documentation](https://k6.io/docs/)
- [Performance Testing Best Practices](https://k6.io/docs/testing-guides/)
- [K6 Results Analysis](https://k6.io/docs/results-visualization/)
- [API Testing with K6](https://k6.io/docs/testing-guides/api-load-testing/)

## 🤝 Contributing

1. Follow the existing code structure and patterns
2. Add appropriate error handling and logging
3. Include realistic test data and scenarios
4. Update documentation for any new features
5. Test your changes thoroughly

## 📄 License

This performance testing suite is provided as-is for educational and testing purposes.