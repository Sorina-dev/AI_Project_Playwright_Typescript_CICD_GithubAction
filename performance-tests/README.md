# Performance Testing Suite

A comprehensive K6-based performance testing framework for web applications with multiple testing scenarios, reporting options, and monitoring integration.

## 📁 Project Structure

```
performance-tests/
├── README.md                    # This documentation
├── package.json                 # Node.js dependencies and scripts
├── config/                      # Test configuration files
├── tests/                       # K6 test scripts
│   ├── main-performance-test.js # Comprehensive API testing
│   ├── load-test.js            # Basic load testing
│   ├── stress-test.js          # Stress testing scenarios
│   └── spike-test.js           # Spike testing patterns
├── pages/                       # Page object models for web testing
├── utils/                       # Utility functions and helpers
├── reports/                     # Generated test reports
│   ├── html/                   # HTML interactive reports
│   ├── json/                   # Raw JSON data reports
│   └── csv/                    # CSV spreadsheet reports
└── grafana-stack/              # Grafana monitoring setup
    ├── docker-compose.yml      # Docker infrastructure
    └── dashboards/            # Grafana dashboard configs
```

## 🚀 Quick Start

### Prerequisites
- **K6 installed**: `winget install k6` or download from [k6.io](https://k6.io/docs/get-started/installation/)
- **Node.js** (optional): For HTML report generation
- **Docker** (optional): For Grafana monitoring

### Install Dependencies
```powershell
npm install
```

## 📊 Test Types & Commands

### Prerequisites Setup
First navigate to performance tests directory:

```powershell
cd performance-tests
```

### 🎯 Quick Test & Report Workflow

1. **Run test with JSON output**:
```powershell
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
k6 run --out json="reports/test-$timestamp.json" tests/main-performance-test.js
```

2. **View results using interactive HTML viewer**:
```powershell
Start-Process "reports/report-viewer.html"
# Then load your JSON file in the browser interface
```

3. **Or open reports folder to view JSON files**:
```powershell
Start-Process "reports"
```
### 1. Load Testing
Tests normal expected load to verify system performance under typical conditions.

```powershell
# Basic load test
k6 run tests/main-performance-test.js

# Load test with timestamped JSON report
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
k6 run --out json="reports/load-test-$timestamp.json" tests/main-performance-test.js

# Load test with HTML report viewer
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
k6 run --out json="reports/load-test-$timestamp.json" tests/main-performance-test.js
Start-Process "reports/report-viewer.html"  # Load the JSON file in browser

# Load test with CSV report
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
k6 run --out csv="reports/load-test-$timestamp.csv" tests/main-performance-test.js
```

### 2. Stress Testing
Tests system behavior under extreme conditions beyond normal capacity.

```powershell
# Stress test (50 VUs for 2 minutes)
k6 run --vus 50 --duration 2m tests/main-performance-test.js

# Stress test with timestamped reports and HTML viewer
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
k6 run --vus 50 --duration 2m --out json="reports/stress-test-$timestamp.json" tests/main-performance-test.js
./scripts/generate-html-report.ps1 "reports/stress-test-$timestamp.json"
```

### 3. Spike Testing
Tests system response to sudden load increases.

```powershell
# Spike test pattern
k6 run --stage 30s:10,1m:100,30s:10 tests/main-performance-test.js

# Spike test with reports and auto-open HTML
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
k6 run --stage 30s:10,1m:100,30s:10 --out json="reports/spike-test-$timestamp.json" tests/main-performance-test.js
./scripts/generate-html-report.ps1 "reports/spike-test-$timestamp.json"
```

### 4. Endurance Testing
Tests system stability over extended periods.

```powershell
# Endurance test (10 VUs for 10 minutes)
k6 run --vus 10 --duration 10m tests/main-performance-test.js

# Endurance test with reports and auto-open HTML
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
k6 run --vus 10 --duration 10m --out json="reports/endurance-test-$timestamp.json" tests/main-performance-test.js
./scripts/generate-html-report.ps1 "reports/endurance-test-$timestamp.json"
```

### 5. Volume Testing
Tests system with large amounts of data.

```powershell
# Volume test (100 VUs for 5 minutes)
k6 run --vus 100 --duration 5m tests/main-performance-test.js

# Volume test with reports and auto-open HTML
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
k6 run --vus 100 --duration 5m --out json="reports/volume-test-$timestamp.json" tests/main-performance-test.js
./scripts/generate-html-report.ps1 "reports/volume-test-$timestamp.json"
```

## 📈 Report Generation

### HTML Reports (Interactive)
```powershell
# Open the interactive report viewer
Start-Process "reports/report-viewer.html"

# Then use the file picker to load your JSON report
# The viewer will display all metrics, thresholds, and detailed results

# Alternative: Open reports folder to view JSON files directly
Start-Process "reports"
```

### JSON Reports (Raw Data)
```powershell
# Generate JSON during test run
k6 run --out json="reports/test-$(Get-Date -Format 'yyyy-MM-dd_HH-mm-ss').json" tests/main-performance-test.js
```

### CSV Reports (Spreadsheet)
```powershell
# Generate CSV during test run
k6 run --out csv="reports/test-$(Get-Date -Format 'yyyy-MM-dd_HH-mm-ss').csv" tests/main-performance-test.js

# Open CSV in Excel
Start-Process "reports/your-test.csv"
```

## 🔧 Advanced Commands

### Custom VU and Duration
```powershell
# Custom virtual users and duration
k6 run --vus 25 --duration 3m tests/main-performance-test.js

# Staged load pattern
k6 run --stage 1m:10,2m:20,1m:0 tests/main-performance-test.js
```

### Environment Variables
```powershell
# Set custom base URL
$env:BASE_URL = "https://api.example.com"
k6 run tests/main-performance-test.js

# Set test data size
$env:DATA_SIZE = "large"
k6 run tests/main-performance-test.js
```

### Multiple Output Formats
```powershell
# Generate multiple report formats with HTML auto-open
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
k6 run --out json="reports/test-$timestamp.json" --out csv="reports/test-$timestamp.csv" tests/main-performance-test.js
./scripts/generate-html-report.ps1 "reports/test-$timestamp.json"
```

## 📊 Grafana Monitoring Integration

### Start Grafana Stack
```powershell
# Navigate to grafana-stack directory
cd grafana-stack

# Start Grafana and InfluxDB
docker-compose up -d

# Verify services are running
docker-compose ps
```

### Run Tests with Grafana Output
```powershell
# Run test with InfluxDB output for real-time monitoring
k6 run --out influxdb=http://localhost:8086/k6 tests/main-performance-test.js
```

### Access Grafana Dashboard
- **URL**: http://localhost:3000
- **Username**: admin
- **Password**: admin
- **Database**: k6 (InfluxDB)

### Stop Grafana Stack
```powershell
cd grafana-stack
docker-compose down
```

## 🔍 Report Management

### Open Reports
```powershell
# Open latest HTML report
$latestReport = Get-ChildItem "reports/*.html" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
Start-Process $latestReport.FullName

# Open reports directory
Start-Process "reports"

# Open specific report by timestamp
Start-Process "reports/load-test-2024-01-15_14-30-45.html"
```

### Clean Old Reports
```powershell
# Remove reports older than 7 days
Get-ChildItem "reports" -File | Where-Object {$_.LastWriteTime -lt (Get-Date).AddDays(-7)} | Remove-Item

# Remove all reports
Remove-Item "reports/*" -Force
```

### List Recent Reports
```powershell
# List 10 most recent reports
Get-ChildItem "reports" -File | Sort-Object LastWriteTime -Descending | Select-Object -First 10 Name, LastWriteTime
```

## 📋 NPM Scripts

Add these to your `package.json` for easier execution:

```json
{
  "scripts": {
    "perf:load": "k6 run tests/main-performance-test.js",
    "perf:stress": "k6 run --vus 50 --duration 2m tests/main-performance-test.js",
    "perf:spike": "k6 run --stage 30s:10,1m:100,30s:10 tests/main-performance-test.js",
    "perf:endurance": "k6 run --vus 10 --duration 10m tests/main-performance-test.js",
    "perf:volume": "k6 run --vus 100 --duration 5m tests/main-performance-test.js",
    "perf:report": "k6-html-report",
    "grafana:start": "cd grafana-stack && docker-compose up -d",
    "grafana:stop": "cd grafana-stack && docker-compose down",
    "reports:clean": "Remove-Item reports/* -Force",
    "reports:open": "Start-Process reports"
  }
}
```

## 🎯 Test Scenarios

### API Endpoints Tested
- **GET** `/posts` - Retrieve all posts
- **GET** `/posts/{id}` - Retrieve specific post
- **POST** `/posts` - Create new post
- **PUT** `/posts/{id}` - Update existing post
- **DELETE** `/posts/{id}` - Delete post
- **GET** `/users` - Retrieve all users
- **GET** `/comments` - Retrieve all comments

### Performance Metrics
- **Response Time**: Average, min, max, percentiles
- **Throughput**: Requests per second
- **Error Rate**: Failed requests percentage
- **Virtual Users**: Concurrent user simulation
- **Data Transfer**: Bytes sent/received

## 🛠️ Troubleshooting

### Common Issues

1. **K6 not found**
   ```powershell
   winget install k6
   # or
   choco install k6
   ```

2. **HTML reports not generating**
   ```powershell
   npm install -g k6-html-reporter
   ```

3. **Port conflicts with Grafana**
   ```powershell
   # Check what's using port 3000
   netstat -ano | findstr :3000
   ```

4. **Docker not running**
   ```powershell
   # Start Docker Desktop or service
   Start-Service docker
   ```

### Performance Optimization Tips

1. **Reduce output during test runs**
   ```powershell
   k6 run --quiet tests/main-performance-test.js
   ```

2. **Use specific test files for focused testing**
   ```powershell
   k6 run tests/load-test.js  # Instead of main-performance-test.js
   ```

3. **Monitor system resources during tests**
   ```powershell
   # Open Task Manager or Resource Monitor
   taskmgr
   resmon
   ```

## 📚 Additional Resources

- **K6 Documentation**: https://k6.io/docs/
- **Grafana Documentation**: https://grafana.com/docs/
- **JSONPlaceholder API**: https://jsonplaceholder.typicode.com/
- **Performance Testing Best Practices**: https://k6.io/docs/testing-guides/

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run Performance Tests
  run: |
    $timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
    k6 run --out json="reports/ci-test-$timestamp.json" tests/main-performance-test.js
```

### Jenkins Pipeline Example
```groovy
stage('Performance Testing') {
    steps {
        powershell '''
            $timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
            k6 run --out json="reports/jenkins-test-$timestamp.json" tests/main-performance-test.js
        '''
    }
}
```

---

## 💡 Pro Tips

1. **Use timestamps for all reports** to avoid overwriting
2. **Start with load testing** before stress testing
3. **Monitor system resources** during tests
4. **Use Grafana for real-time monitoring** during long tests
5. **Clean old reports regularly** to save disk space
6. **Set realistic VU numbers** based on your system capacity

Happy Performance Testing! 🚀