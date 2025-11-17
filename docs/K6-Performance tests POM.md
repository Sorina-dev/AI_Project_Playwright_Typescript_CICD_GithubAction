# K6 Performance Testing Suite - JSONPlaceholder API

A comprehensive performance testing suite built with K6, following Page Object Model (POM) design patterns for the **JSONPlaceholder API** (https://jsonplaceholder.typicode.com). This suite simulates expense management workflows using reliable, mock API endpoints.

## 🚀 Quick Start

### Prerequisites
- [K6](https://k6.io/docs/getting-started/installation/) installed on your system
- Internet connection (for JSONPlaceholder API access)
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
```bash
k6 run main-performance-test.js --duration 30s --vus 5
```

#### 1. Main Performance Test (50 Users, 8-minute comprehensive workflow)
```bash
cd performance-tests
k6 run main-performance-test.js
```

#### 2. Individual Test Suites (2-3 minutes each)

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

#### 3. Load Test (50 Users, 5 minutes)
```bash
npm run test:load
# OR: k6 run --vus 50 --duration 5m main-performance-test.js
```

#### 4. Spike Test (10→100→10 Users)
```bash
npm run test:spike
# OR: k6 run --stage 30s:10,1m:100,30s:10 main-performance-test.js
```

#### 5. Stress Test (10→100→0 Users, 19 minutes)
```bash
npm run test:stress
# OR: k6 run tests/stress-test.js
```

#### 6. Endurance/Soak Test (25 Users, 30 minutes)
```bash
npm run test:endurance
# OR: k6 run --vus 25 --duration 30m main-performance-test.js

# With timestamped reports (JSON, CSV, HTML dashboard):
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
k6 run --vus 25 --duration 30m --out json=reports/endurance-$timestamp.json --out csv=reports/endurance-$timestamp.csv main-performance-test.js

# CORRECT PowerShell syntax with variable expansion:
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"; k6 run --vus 25 --duration 30m --out json=reports/endurance-$timestamp.json --out csv=reports/endurance-$timestamp.csv main-performance-test.js

# With Grafana real-time monitoring + reports:
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"; k6 run --vus 25 --duration 30m --out json=reports/endurance-$timestamp.json --out csv=reports/endurance-$timestamp.csv --out influxdb=http://localhost:8086/k6 main-performance-test.js
```
# example
k6 run --vus 2 --duration 10s --out json=reports/load-test-10s-$(Get-Date -Format 'yyyy-MM-dd_HH-mm-ss').json --out csv=reports/load-test-10s-$(Get-Date -Format 'yyyy-MM-dd_HH-mm-ss').csv --out web-dashboard=reports/endurance-dashboard-$timestamp.html tests/get-requests.test.js

#### 7. Volume Test (Large Dataset Simulation)
```bash
npm run test:volume
# OR: k6 run --vus 100 --iterations 10000 main-performance-test.js
```

### 🧪 Performance Testing Types Explained

#### **🔧 Load Testing**
- **Purpose**: Verify system performance under expected normal load
- **Pattern**: Gradual ramp-up to target users, sustained load, gradual ramp-down
- **Example**: 50 concurrent users for 5 minutes
- **Thresholds**: 95% requests < 2000ms, <10% error rate

#### **⚡ Spike Testing** 
- **Purpose**: Test system behavior during sudden traffic spikes
- **Pattern**: Normal load → sudden spike → return to normal
- **Example**: 10→100→10 users with rapid transitions
- **Thresholds**: 95% requests < 5000ms, <30% error rate during spike

#### **🚀 Stress Testing**
- **Purpose**: Find system breaking point and behavior under extreme load
- **Pattern**: Gradual increase beyond normal capacity until failure
- **Example**: 10→100 users sustained for extended period
- **Thresholds**: More lenient, focus on stability and graceful degradation

#### **⏰ Endurance/Soak Testing**
- **Purpose**: Verify system stability over extended periods
- **Pattern**: Moderate load sustained for long duration (30+ minutes)
- **Example**: 25 users for 30-60 minutes
- **Focus**: Memory leaks, resource exhaustion, performance degradation

#### **📊 Volume Testing**
- **Purpose**: Test with large amounts of data/transactions
- **Pattern**: High number of operations rather than concurrent users
- **Example**: 10,000 iterations across 100 users
- **Focus**: Database performance, data handling capacity

### Generate Reports

**HTML Report:**
```bash
k6 run --out html=report.html main-performance-test.js
```

**JSON Report:**
```bash
k6 run --out json=results.json main-performance-test.js
```

**CSV Report:**
```bash
k6 run --out csv=results.csv main-performance-test.js
```

**Complete Test with Timestamped Reports:**
```powershell
# Create timestamp
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"

# Run with all output formats
k6 run --out json=reports/performance-$timestamp.json --out csv=reports/performance-$timestamp.csv --out web-dashboard=reports/dashboard-$timestamp.html main-performance-test.js

# With Grafana real-time monitoring
k6 run --out json=reports/performance-$timestamp.json --out csv=reports/performance-$timestamp.csv --out web-dashboard=reports/dashboard-$timestamp.html --out influxdb=http://localhost:8086/k6 main-performance-test.js
```

**InfluxDB (Grafana Integration):**
```bash
k6 run --out influxdb=http://localhost:8086/k6 main-performance-test.js
```

## 📁 Project Structure

```
performance-tests/
├── config/
│   └── config.js                 # JSONPlaceholder endpoints & configuration
├── utils/
│   ├── testHelpers.js            # Test data generation utilities
│   └── helpers.js                # Common helper functions (think times, etc.)
├── pages/                        # Page Object Model (if using POM pattern)
│   ├── BasePage.js               # Base page object class (optional)
│   ├── UserPage.js               # User/Employee operations (/users endpoints)
│   ├── PostPage.js               # Post/Expense operations (/posts endpoints)
│   ├── AlbumPage.js              # Album/Category operations (/albums endpoints)
│   └── CommentPage.js            # Comment/Approval operations (/comments endpoints)
├── tests/
│   ├── get-requests.test.js      # GET endpoints (users, posts, albums, comments)
│   ├── post-requests.test.js     # POST endpoints (posts, comments)
│   ├── put-requests.test.js      # PUT endpoints (posts, users)
│   ├── delete-requests.test.js   # DELETE endpoints (posts, users)
│   └── stress-test.js            # High-load stress testing (optional)
├── main-performance-test.js      # Comprehensive test orchestrator
└── README.md                     # Complete documentation guide
```

## 🎯 Test Coverage

### JSONPlaceholder API Endpoints Tested

#### GET Requests (4 endpoint types)
- `GET /users` - Employee directory (all users)
- `GET /users/{id}` - Individual employee profile
- `GET /posts` - Expense reports listing (all posts)
- `GET /posts/{id}` - Individual expense report
- `GET /albums` - Expense categories (all albums)
- `GET /comments` - Expense comments/approvals

#### POST Requests (2 endpoint types)
- `POST /posts` - Create new expense report
- `POST /comments` - Add expense comment/approval

#### PUT Requests (2 endpoint types)
- `PUT /posts/{id}` - Update existing expense report
- `PUT /users/{id}` - Update employee profile

#### DELETE Requests (2 endpoint types)
- `DELETE /posts/{id}` - Delete/withdraw expense report
- `DELETE /users/{id}` - Remove employee account (simulation)

### Business Logic Mapping
| **Expense Management Concept** | **JSONPlaceholder Endpoint** | **Test Simulation** |
|--------------------------------|-------------------------------|---------------------|
| Employee Directory | `GET /users` | User management system |
| Employee Profile | `GET /users/{id}` | Individual employee details |
| Expense Reports | `GET /posts` | All submitted expenses |
| Expense Categories | `GET /albums` | Available expense types |
| Submit Expense | `POST /posts` | Create new expense |
| Manager Comments | `GET /comments` | Approval notes |
| Add Approval | `POST /comments` | Manager feedback |
| Update Expense | `PUT /posts/{id}` | Modify expense details |
| Withdraw Expense | `DELETE /posts/{id}` | Remove expense |

## ⚙️ Configuration

### JSONPlaceholder Configuration
- **Base URL:** `https://jsonplaceholder.typicode.com`
- **Authentication:** None required (public API)
- **Rate Limits:** None (unlimited testing)
- **Data:** 100 users, 100 posts, 100 albums, 500 comments
- **Reliability:** 99.9% uptime, consistent responses

### Test Configurations

#### Default Load Test (Individual Tests)
- **Users:** 3 → 7-10 → 0
- **Duration:** 30s → 1-1.5m → 30s (2-3 minutes total per test)
- **Thresholds:**
  - 95% of requests < 1000ms
  - Error rate < 5%
  - Request rate > 1 RPS

#### Comprehensive Test (Main Test)
- **Users:** 0 → 50 → 50 → 0
- **Duration:** 1m → 2m → 4m → 1m (8 minutes total)
- **Thresholds:**
  - 95% of requests < 2000ms
  - Error rate < 10%
  - Request rate > 2 RPS
- **Realistic user behavior with think times**

#### Load Test (Sustained Performance)
- **Users:** Constant 50 users
- **Duration:** 5 minutes sustained
- **Thresholds:**
  - 95% of requests < 2000ms
  - Error rate < 10%
  - Request rate > 5 RPS
- **Purpose:** Verify normal operational capacity

#### Spike Test (Traffic Surge)
- **Users:** 10 → 100 → 10 (rapid changes)
- **Duration:** 30s → 1m → 30s (2 minutes total)
- **Thresholds:**
  - 95% of requests < 5000ms (lenient during spike)
  - Error rate < 30% (higher tolerance)
  - Request rate > 10 RPS at peak
- **Purpose:** Test auto-scaling and recovery

#### Stress Test (Breaking Point)
- **Users:** 10 → 100 → 100 → 0  
- **Duration:** 2m → 5m → 10m → 2m (19 minutes total)
- **Thresholds:**
  - 95% of requests < 3000ms
  - Error rate < 20%
  - Request rate > 5 RPS
- **Purpose:** Find system limits and failure modes

#### Endurance/Soak Test (Long Duration)
- **Users:** Constant 25 users
- **Duration:** 30-60 minutes sustained
- **Thresholds:**
  - 95% of requests < 2500ms
  - Error rate < 15%
  - Request rate > 3 RPS
- **Purpose:** Detect memory leaks, resource exhaustion

#### Volume Test (High Data Load)
- **Users:** 100 users
- **Duration:** Until 10,000 total iterations completed
- **Thresholds:**
  - 95% of requests < 3000ms
  - Error rate < 15%
  - Total operations > 10,000
- **Purpose:** Test database performance and data handling

### Environment Configuration

The tests are configured to use **JSONPlaceholder API** by default:
```
Base URL: https://jsonplaceholder.typicode.com
Authentication: None required
Data: 100 users, 100 posts, 100 albums, 500 comments
Reliability: 99.9% uptime, no rate limits
```

JSONPlaceholder provides consistent, reliable mock data without authentication requirements.

## 👥 User Personas

The test suite simulates realistic user behavior patterns using JSONPlaceholder data:

1. **Regular Employee (40%)** - Basic expense reporting (user IDs 1-4)
2. **Manager (25%)** - Review and approve expenses (user IDs 5-7)  
3. **Admin User (15%)** - System maintenance and cleanup (user IDs 8-9)
4. **Finance User (15%)** - Expense analysis and reporting (user ID 10)
5. **Heavy User (5%)** - High-volume operations across all endpoints

## 🔐 Authentication & Security

**JSONPlaceholder Benefits:**
- **No Authentication Required** - Eliminates auth-related test failures
- **Public API Access** - No API keys or tokens needed
- **CORS Enabled** - Works from any testing environment
- **HTTPS Support** - Secure connections available
- **No Rate Limits** - Unlimited concurrent testing

This eliminates common testing issues like:
- ❌ Authentication token expiration
- ❌ Rate limiting in CI/CD pipelines  
- ❌ API key management across environments
- ❌ CORS issues in browser-based testing

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

### JSONPlaceholder Test Data
- **Users:** 10 predefined users (simulating employees)
- **Posts:** 100 predefined posts (simulating expense reports)
- **Albums:** 100 predefined albums (simulating expense categories)
- **Comments:** 500 predefined comments (simulating manager approvals)

### Dynamic Data Generation
- **Random User IDs:** 1-10 (simulates 10-employee company)
- **Random Post IDs:** 1-100 (various expense reports)
- **Realistic Expense Data:**
  - Amounts: $100-$900 range
  - Categories: Travel, Office supplies, Medical, etc.
  - Current month dates for relevance
- **Business Context:** Proper JSON structure with meaningful fields

### Test Scenarios
1. **Employee Workflow:** Get profile → Check categories → Submit expense → Update details
2. **Manager Workflow:** Review expenses → Add comments → Approve/modify
3. **Admin Workflow:** Audit system → Cleanup invalid entries → Generate reports

## 🔍 Error Handling

### JSONPlaceholder Response Handling
- **Success responses:** 200 (GET), 201 (POST), 200 (PUT/DELETE)
- **Simulated errors:** 404 for non-existent resources
- **Network resilience:** Retry logic for temporary failures
- **Response validation:** JSON structure and required fields verification

### Error Categories
- **4xx Client Errors:** Invalid IDs, malformed requests
- **5xx Server Errors:** Rare but handled gracefully
- **Network Timeouts:** Connection issues, slow responses
- **Validation Errors:** Missing required fields, invalid data types

## 📈 Monitoring & Metrics

### Built-in Metrics
- Response times (min, max, avg, percentiles)
- Request rates (RPS)
- Error rates and types
- Data transfer rates
- Virtual user metrics

### Custom Metrics (JSONPlaceholder-Specific)
- **Employee operations:** User profile views, updates
- **Expense operations:** Create, read, update, delete success rates
- **Comment operations:** Manager approval workflow metrics  
- **Category operations:** Expense type browsing patterns
- **Business metrics:** Average expense amounts, processing times

## 🚀 Advanced Usage

### Custom Load Patterns
```bash
# Custom user count and duration
k6 run --vus 100 --duration 10m main-performance-test.js

# Spike testing
k6 run --stage 30s:10,1m:100,30s:10 main-performance-test.js

# Individual test with custom load
k6 run --vus 20 --duration 5m tests/get-requests.test.js
```

### 📊 Advanced Reporting Commands

#### **Easy Batch File Execution (Recommended):**
```cmd
# Interactive menu with all options
performance-suite.bat

# Run all test types automatically  
run-all-tests.bat
```

#### **Direct K6 Commands with Reports:**

**Load Test:**
```powershell
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
k6 run --vus 50 --duration 5m --out json=reports/load-test-$timestamp.json --out csv=reports/load-test-$timestamp.csv main-performance-test.js
```

**Stress Test:**
```powershell  
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
k6 run --vus 25 --duration 5m --out json=reports/stress-test-$timestamp.json --out csv=reports/stress-test-$timestamp.csv main-performance-test.js
```

**Spike Test:**
```powershell
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
k6 run --stage 30s:10,1m:50,30s:10 --out json=reports/spike-test-$timestamp.json --out csv=reports/spike-test-$timestamp.csv main-performance-test.js
```

**Endurance Test:**
```powershell
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
k6 run --vus 15 --duration 10m --out json=reports/endurance-test-$timestamp.json --out csv=reports/endurance-test-$timestamp.csv main-performance-test.js
```

**Individual HTTP Method Tests:**
```powershell
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"

# GET operations test
k6 run --vus 5 --duration 30s --out json=reports/get-test-$timestamp.json tests/get-requests.test.js

# POST operations test  
k6 run --vus 5 --duration 30s --out json=reports/post-test-$timestamp.json tests/post-requests.test.js

# PUT operations test
k6 run --vus 5 --duration 30s --out json=reports/put-test-$timestamp.json tests/put-requests.test.js

# DELETE operations test
k6 run --vus 5 --duration 30s --out json=reports/delete-test-$timestamp.json tests/delete-requests.test.js
```

#### **View Reports:**
```cmd
# Open reports folder
explorer reports

# View specific report types
start reports\load-test-2025-11-13_14-30-45.html
notepad reports\load-test-2025-11-13_14-30-45.json
excel reports\load-test-2025-11-13_14-30-45.csv
```
Write-Host "   📈 CSV Data: reports/$TestType-test-$timestamp.csv"
Write-Host "   🎯 Live Grafana: http://localhost:3001"
```

#### **Easy Batch File Usage (Recommended):**

**Interactive Testing:**
```cmd
# Launch interactive menu with all options
performance-suite.bat
```

**Automated Testing:**
```cmd
# Run all test types automatically (takes ~8-10 minutes)
run-all-tests.bat
```

**Benefits:**
- ✅ No complex commands to remember
- ✅ Automatic timestamped report generation
- ✅ Built-in report viewing and management
- ✅ Interactive menus for easy selection
- ✅ Automatic error handling and validation

### Environment-Specific Testing
```bash
# JSONPlaceholder (default - always available)
k6 run main-performance-test.js

# Quick validation (10 seconds)
k6 run --duration 10s tests/get-requests.test.js

# CI/CD optimized (2 minutes)
k6 run --stage 30s:5,1m:10,30s:0 main-performance-test.js
```

### Custom Thresholds for Different Environments
```javascript
// Development/CI (fast feedback)
thresholds: {
  http_req_duration: ['p(95)<1000'],
  http_req_failed: ['rate<0.05'],
}

// Staging (realistic load)
thresholds: {
  http_req_duration: ['p(95)<2000'], 
  http_req_failed: ['rate<0.10'],
}

// Production simulation (high performance)
thresholds: {
  http_req_duration: ['p(95)<500'],
  http_req_failed: ['rate<0.01'],
}
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

**JSONPlaceholder Connectivity:**
```bash
# Check if JSONPlaceholder is accessible
curl https://jsonplaceholder.typicode.com/posts/1

# Should return JSON object with post data
# If fails, check internet connectivity
```

**Network Timeouts:**
- JSONPlaceholder typically responds in <200ms
- Check internet connectivity if timeouts occur
- Consider using local JSONPlaceholder setup for offline testing

**High Error Rates:**
- JSONPlaceholder is very reliable (99.9% uptime)
- Errors usually indicate network issues on client side
- Check firewall/proxy settings if consistent failures
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