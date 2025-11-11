# 🚀 K6 Performance Testing Guide

**Complete Guide for API Performance Testing with k6**

✅ **What's Included:**
- 📋 **Comprehensive k6 Setup Guide** - Installation across all platforms
- 🎯 **Performance Testing Strategies** - Load, stress, spike, and endurance testing
- 📊 **Metrics and Analysis** - Understanding k6 output and performance indicators
- 🔧 **Script Development** - Writing effective k6 scripts from scratch
- 🌐 **HAR File Integration** - Converting browser recordings to k6 tests
- 📈 **CI/CD Integration** - Automating performance tests in pipelines
- 🎨 **Advanced Patterns** - Custom metrics, data parameterization, and scenarios
- 🔍 **Troubleshooting** - Common issues and debugging techniques

---

## 📋 Table of Contents

1. [Introduction to k6](#introduction-to-k6)
2. [Installation and Setup](#installation-and-setup)
3. [Getting Started](#getting-started)
4. [Performance Testing Types](#performance-testing-types)
5. [Script Development](#script-development)
6. [HAR File Integration](#har-file-integration)
7. [Metrics and Thresholds](#metrics-and-thresholds)
8. [Advanced Features](#advanced-features)
9. [CI/CD Integration](#cicd-integration)
10. [Best Practices](#best-practices)
11. [Troubleshooting](#troubleshooting)
12. [Resources](#resources)

---

## 🎯 Introduction to k6

k6 is a modern load testing tool built for developers and DevOps engineers. It's designed to test the performance of APIs, microservices, and websites using JavaScript.

### 🌟 **Why Choose k6?**

- ✅ **Developer-friendly**: Write tests in JavaScript ES6+
- ✅ **Cloud-native**: Built for modern architectures
- ✅ **CI/CD ready**: Easy integration with pipelines
- ✅ **Rich metrics**: Comprehensive performance insights
- ✅ **Flexible**: Supports various testing scenarios
- ✅ **Open source**: Free and community-driven

### 🎭 **Testing Philosophy**
```
Performance testing should be:
📊 Data-driven
🔄 Repeatable  
🚀 Fast to execute
📝 Easy to understand
🔧 Simple to maintain
```

---

## 💻 Installation and Setup

### **Windows Installation**

```powershell
# Option 1: Using winget (recommended)
winget install grafana.k6

# Option 2: Using Chocolatey
choco install k6

# Option 3: Using Scoop
scoop install k6

# Option 4: Manual download
# Download from: https://github.com/grafana/k6/releases
```

### **macOS Installation**

```bash
# Using Homebrew (recommended)
brew install k6

# Using MacPorts
sudo port install k6
```

### **Linux Installation**

```bash
# Debian/Ubuntu
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6

# RHEL/CentOS/Fedora
sudo dnf install https://dl.k6.io/rpm/repo.rpm
sudo dnf install k6

# Arch Linux
yay -S k6-bin
```

### **Docker Installation**

```bash
# Pull k6 Docker image
docker pull grafana/k6:latest

# Run k6 with Docker
docker run --rm -v $(pwd):/app -w /app grafana/k6:latest run script.js
```

### **Verification**

```bash
# Check k6 version
k6 version

# Expected output: k6 vX.XX.X
```

---

## 🚀 Getting Started

### **Your First k6 Test**

Create a simple test file `hello-world.js`:

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,        // 10 virtual users
  duration: '30s', // for 30 seconds
};

export default function () {
  const response = http.get('https://httpbin.org/get');
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1); // Wait 1 second between requests
}
```

### **Run Your First Test**

```bash
k6 run hello-world.js
```

### **Understanding the Output**

```
     ✓ status is 200
     ✓ response time < 500ms

     checks.........................: 100.00% ✓ 290      ✗ 0   
     data_received..................: 65 kB   2.2 kB/s
     data_sent......................: 23 kB   766 B/s
     http_req_blocked...............: avg=1.15ms   min=0s       med=0s      max=33.49ms p(90)=0s      p(95)=16.75ms
     http_req_connecting............: avg=558.48µs min=0s       med=0s      max=16.75ms p(90)=0s      p(95)=8.37ms 
     http_req_duration..............: avg=161.48ms min=85.11ms  med=158.8ms max=264.58ms p(90)=197.85ms p(95)=230.21ms
       { expected_response:true }...: avg=161.48ms min=85.11ms  med=158.8ms max=264.58ms p(90)=197.85ms p(95)=230.21ms
     http_req_failed................: 0.00%   ✓ 0        ✗ 290 
     http_req_receiving.............: avg=328.87µs min=0s       med=0s      max=9.84ms  p(90)=0s      p(95)=4.92ms 
     http_req_sending...............: avg=25.91µs  min=0s       med=0s      max=753.7µs p(90)=0s      p(95)=376.85µs
     http_req_tls_handshaking.......: avg=556.70µs min=0s       med=0s      max=16.75ms p(90)=0s      p(95)=8.37ms 
     http_req_waiting...............: avg=161.13ms min=85.11ms  med=158.41ms max=264.58ms p(90)=197.46ms p(95)=229.81ms
     http_reqs......................: 290     9.652301/s
     iteration_duration.............: avg=1.16s    min=1.08s    med=1.15s   max=1.26s   p(90)=1.19s   p(95)=1.23s  
     iterations.....................: 290     9.652301/s
     vus............................: 10      min=10     max=10
     vus_max........................: 10      min=10     max=10
```

---

## 🎭 Performance Testing Types

### **1. 🏃 Load Testing**
*Tests normal expected load*

```javascript
export const options = {
  stages: [
    { duration: '5m', target: 100 }, // Ramp up to 100 users over 5 minutes
    { duration: '10m', target: 100 }, // Stay at 100 users for 10 minutes
    { duration: '5m', target: 0 }, // Ramp down over 5 minutes
  ],
};
```

### **2. 💪 Stress Testing**
*Tests beyond normal capacity*

```javascript
export const options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 }, // Increase load
    { duration: '5m', target: 200 },
    { duration: '2m', target: 300 }, // Further increase
    { duration: '5m', target: 300 },
    { duration: '2m', target: 400 }, // Push to limits
    { duration: '5m', target: 400 },
    { duration: '10m', target: 0 }, // Recovery
  ],
};
```

### **3. ⚡ Spike Testing**
*Tests sudden traffic spikes*

```javascript
export const options = {
  stages: [
    { duration: '10s', target: 100 },
    { duration: '1m', target: 100 },
    { duration: '10s', target: 1400 }, // Sudden spike
    { duration: '3m', target: 1400 },
    { duration: '10s', target: 100 }, // Drop back
    { duration: '3m', target: 100 },
    { duration: '10s', target: 0 },
  ],
};
```

### **4. 🏃‍♂️ Endurance Testing**
*Tests system stability over time*

```javascript
export const options = {
  stages: [
    { duration: '2m', target: 400 },
    { duration: '3h56m', target: 400 }, // Long duration test
    { duration: '2m', target: 0 },
  ],
};
```

### **5. 📊 Volume Testing**
*Tests with large amounts of data*

```javascript
export const options = {
  vus: 50,
  duration: '2h',
  thresholds: {
    http_req_duration: ['p(99)<1500'], // 99% of requests under 1.5s
    'http_req_duration{status:200}': ['p(99)<1000'],
  },
};

export default function () {
  // Test with large payloads
  const largePayload = JSON.stringify({
    data: new Array(1000).fill('large data chunk'),
    timestamp: new Date().toISOString(),
    metadata: generateLargeMetadata(),
  });
  
  const response = http.post('https://api.example.com/data', largePayload, {
    headers: { 'Content-Type': 'application/json' },
  });
}
```

---

## 🔧 Script Development

### **Basic Script Structure**

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

// 1. Configuration
export const options = {
  // Test configuration here
};

// 2. Setup (runs once)
export function setup() {
  // Prepare test data
  return { token: 'auth-token' };
}

// 3. Main test function (runs for each VU iteration)
export default function (data) {
  // Your test logic here
}

// 4. Teardown (runs once)
export function teardown(data) {
  // Cleanup
}
```

### **HTTP Methods Examples**

```javascript
// GET request
const getResponse = http.get('https://api.example.com/users');

// POST request with JSON
const postData = { name: 'John', email: 'john@example.com' };
const postResponse = http.post('https://api.example.com/users', JSON.stringify(postData), {
  headers: { 'Content-Type': 'application/json' },
});

// PUT request
const putResponse = http.put('https://api.example.com/users/1', JSON.stringify(postData), {
  headers: { 'Content-Type': 'application/json' },
});

// DELETE request
const deleteResponse = http.del('https://api.example.com/users/1');

// PATCH request
const patchData = { email: 'newemail@example.com' };
const patchResponse = http.patch('https://api.example.com/users/1', JSON.stringify(patchData), {
  headers: { 'Content-Type': 'application/json' },
});
```

### **Authentication Examples**

```javascript
// API Key authentication
const headers = {
  'Authorization': 'Bearer your-api-key-here',
  'Content-Type': 'application/json',
};

// Basic authentication
import { check } from 'k6';
import http from 'k6/http';
import encoding from 'k6/encoding';

const username = 'user';
const password = 'pass';
const credentials = `${username}:${password}`;
const encodedCredentials = encoding.b64encode(credentials);

const response = http.get('https://api.example.com/protected', {
  headers: {
    'Authorization': `Basic ${encodedCredentials}`,
  },
});

// OAuth 2.0 Bearer Token
export function setup() {
  const loginResponse = http.post('https://api.example.com/login', {
    username: 'user',
    password: 'password',
  });
  
  const token = loginResponse.json('access_token');
  return { token: token };
}

export default function (data) {
  const response = http.get('https://api.example.com/protected', {
    headers: {
      'Authorization': `Bearer ${data.token}`,
    },
  });
}
```

### **Data Parameterization**

```javascript
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

// Load test data from CSV
const csvData = new SharedArray('users', function () {
  return papaparse.parse(open('./test-data.csv'), { header: true }).data;
});

// Load test data from JSON
const jsonData = JSON.parse(open('./test-data.json'));

export default function () {
  // Use random data from CSV
  const user = csvData[Math.floor(Math.random() * csvData.length)];
  
  const response = http.post('https://api.example.com/login', {
    username: user.username,
    password: user.password,
  });
}
```

### **Error Handling**

```javascript
export default function () {
  try {
    const response = http.get('https://api.example.com/endpoint');
    
    check(response, {
      'status is 200': (r) => r.status === 200,
      'response has data': (r) => r.json('data') !== undefined,
    });
    
  } catch (error) {
    console.error(`Request failed: ${error.message}`);
    // Don't fail the test, just log and continue
  }
  
  sleep(1);
}
```

---

## 📊 HAR File Integration

### **What is a HAR File?**

HAR (HTTP Archive) files capture all HTTP requests made by a browser. They're perfect for:
- ✅ **Recording real user flows**
- ✅ **Capturing complex authentication**
- ✅ **Replicating exact headers and timing**
- ✅ **Converting browser sessions to tests**

### **Creating HAR Files**

#### **From Chrome DevTools:**
1. Open DevTools (F12)
2. Go to Network tab
3. Check "Preserve log"
4. Perform your user actions
5. Right-click → Save all as HAR

#### **From Firefox DevTools:**
1. Open DevTools (F12)
2. Network tab
3. Perform actions
4. Click gear icon → Save All As HAR

#### **From Postman:**
1. Send requests in collection
2. Click "Code" link
3. Select "HTTP" → Copy cURL
4. Convert to k6 (see conversion below)

### **Converting HAR to k6 Script**

#### **Method 1: Manual Conversion (Our Approach)**

Based on your HAR file, here's the conversion process:

```javascript
// From HAR entry:
{
  "request": {
    "method": "GET",
    "url": "https://api.example.com/endpoint",
    "headers": [...],
    "queryString": [...]
  }
}

// To k6 script:
export default function () {
  const url = 'https://api.example.com/endpoint?param1=value1&param2=value2';
  const headers = {
    'Accept': 'application/json',
    'User-Agent': 'Mozilla/5.0...',
    // ... other headers from HAR
  };
  
  const response = http.get(url, { headers });
}
```

#### **Method 2: Using k6 Studio (Visual)**
```bash
# Install k6 Studio (GUI tool)
# Create tests visually by importing HAR files
# Export as k6 JavaScript
```

#### **Method 3: Using Online Converters**
- HAR to k6 online tools
- Postman to k6 converters
- Browser extension tools

### **HAR File Best Practices**

```javascript
// ✅ Clean up sensitive data
const cleanHeaders = {
  'Accept': response.headers.Accept,
  'Content-Type': response.headers['Content-Type'],
  // Remove: Authorization, Cookie, etc.
};

// ✅ Parameterize dynamic values
const userId = Math.floor(Math.random() * 1000);
const url = `https://api.example.com/users/${userId}`;

// ✅ Add realistic timing
const harTiming = 301; // From HAR file
const tolerance = 0.2; // 20% tolerance
check(response, {
  'response time similar to HAR': (r) => 
    r.timings.duration < harTiming * (1 + tolerance),
});
```

---

## 📈 Metrics and Thresholds

### **Built-in Metrics**

```javascript
// HTTP Metrics
http_req_duration........: Response time
http_req_blocked.........: Time blocked before request
http_req_connecting......: Connection establishment time
http_req_tls_handshaking.: TLS handshake time
http_req_sending.........: Time sending request
http_req_waiting.........: Time waiting for response
http_req_receiving.......: Time receiving response
http_req_failed..........: Failed request rate
http_reqs................: Total requests

// General Metrics
vus...................: Current virtual users
vus_max...............: Maximum virtual users
iterations............: Completed iterations
iteration_duration....: Time per iteration
data_received.........: Data downloaded
data_sent.............: Data uploaded
```

### **Setting Thresholds**

```javascript
export const options = {
  thresholds: {
    // Response time thresholds
    http_req_duration: ['p(95)<500'], // 95% under 500ms
    'http_req_duration{status:200}': ['p(99)<1000'], // 99% of successful requests under 1s
    
    // Error rate thresholds
    http_req_failed: ['rate<0.01'], // Less than 1% errors
    'http_req_failed{status:500}': ['rate<0.001'], // Less than 0.1% server errors
    
    // Throughput thresholds
    http_reqs: ['rate>100'], // More than 100 requests per second
    
    // Custom checks
    checks: ['rate>0.95'], // 95% of checks should pass
    
    // Iteration thresholds
    iteration_duration: ['p(95)<2000'], // 95% of iterations under 2s
  },
};
```

### **Custom Metrics**

```javascript
import { Counter, Gauge, Rate, Trend } from 'k6/metrics';

// Custom metrics
const loginErrors = new Counter('login_errors');
const activeUsers = new Gauge('active_users');
const loginSuccessRate = new Rate('login_success_rate');
const userThinkTime = new Trend('user_think_time');

export default function () {
  const startTime = Date.now();
  
  const response = http.post('https://api.example.com/login', loginData);
  
  if (response.status === 200) {
    loginSuccessRate.add(true);
    activeUsers.add(1);
  } else {
    loginSuccessRate.add(false);
    loginErrors.add(1);
  }
  
  const thinkTime = Math.random() * 5000; // Random think time
  userThinkTime.add(thinkTime);
  sleep(thinkTime / 1000);
}
```

### **Analyzing Results**

```javascript
// Understanding percentiles:
p(50) = 100ms  // 50% of requests under 100ms (median)
p(90) = 300ms  // 90% of requests under 300ms
p(95) = 500ms  // 95% of requests under 500ms  
p(99) = 1000ms // 99% of requests under 1000ms

// Good performance indicators:
✅ p(95) response time < 500ms
✅ Error rate < 1%
✅ Consistent response times
✅ No memory leaks (stable over time)
✅ High throughput (requests/second)
```

---

## 🎨 Advanced Features

### **Scenario-Based Testing**

```javascript
export const options = {
  scenarios: {
    // Scenario 1: Constant load
    constant_load: {
      executor: 'constant-vus',
      vus: 50,
      duration: '5m',
      tags: { test_type: 'baseline' },
    },
    
    // Scenario 2: Ramping load
    ramping_load: {
      executor: 'ramping-vus',
      stages: [
        { duration: '1m', target: 100 },
        { duration: '2m', target: 100 },
        { duration: '1m', target: 0 },
      ],
      tags: { test_type: 'ramp' },
    },
    
    // Scenario 3: Constant rate
    constant_rate: {
      executor: 'constant-arrival-rate',
      rate: 100, // 100 iterations per second
      timeUnit: '1s',
      duration: '5m',
      preAllocatedVUs: 10,
      maxVUs: 50,
      tags: { test_type: 'rate' },
    },
  },
};

export default function () {
  // Test logic shared across scenarios
  const response = http.get('https://api.example.com/endpoint');
  check(response, { 'status is 200': (r) => r.status === 200 });
}
```

### **Environment-Based Configuration**

```javascript
// config.js
export const config = {
  development: {
    baseUrl: 'https://dev-api.example.com',
    vus: 5,
    duration: '30s',
  },
  staging: {
    baseUrl: 'https://stage-api.example.com',
    vus: 20,
    duration: '5m',
  },
  production: {
    baseUrl: 'https://api.example.com',
    vus: 100,
    duration: '30m',
  },
};

// main script
import { config } from './config.js';

const env = __ENV.ENVIRONMENT || 'development';
const testConfig = config[env];

export const options = {
  vus: testConfig.vus,
  duration: testConfig.duration,
};

export default function () {
  const response = http.get(`${testConfig.baseUrl}/endpoint`);
}
```

### **Dynamic Load Patterns**

```javascript
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export default function () {
  // Variable think time
  const thinkTime = randomIntBetween(1, 5);
  sleep(thinkTime);
  
  // Variable request patterns
  const actions = ['browse', 'search', 'purchase'];
  const action = actions[Math.floor(Math.random() * actions.length)];
  
  switch (action) {
    case 'browse':
      browseBehavior();
      break;
    case 'search':
      searchBehavior();
      break;
    case 'purchase':
      purchaseBehavior();
      break;
  }
}

function browseBehavior() {
  // Simulate browsing behavior
  for (let i = 0; i < randomIntBetween(3, 7); i++) {
    http.get('https://api.example.com/products');
    sleep(randomIntBetween(2, 5));
  }
}

function searchBehavior() {
  // Simulate search behavior
  http.get('https://api.example.com/search?q=laptop');
  sleep(1);
  http.get('https://api.example.com/search?q=gaming+laptop');
}

function purchaseBehavior() {
  // Simulate purchase flow
  const product = http.get('https://api.example.com/products/123');
  sleep(2);
  const cart = http.post('https://api.example.com/cart', { productId: 123 });
  sleep(1);
  const checkout = http.post('https://api.example.com/checkout', { cartId: cart.json('id') });
}
```

### **Response Validation**

```javascript
export default function () {
  const response = http.get('https://api.example.com/users');
  
  // Status code checks
  check(response, {
    'status is 200': (r) => r.status === 200,
    'status is not 404': (r) => r.status !== 404,
    'status is success': (r) => r.status >= 200 && r.status < 300,
  });
  
  // Response body checks
  check(response, {
    'has users array': (r) => Array.isArray(r.json('users')),
    'has pagination': (r) => r.json('pagination') !== undefined,
    'user count > 0': (r) => r.json('users').length > 0,
  });
  
  // Response headers checks
  check(response, {
    'content-type is JSON': (r) => r.headers['Content-Type'].includes('application/json'),
    'has CORS headers': (r) => r.headers['Access-Control-Allow-Origin'] !== undefined,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  // Custom business logic validation
  const users = response.json('users');
  check(response, {
    'all users have valid emails': (r) => {
      return users.every(user => user.email && user.email.includes('@'));
    },
    'no duplicate user IDs': (r) => {
      const ids = users.map(user => user.id);
      return new Set(ids).size === ids.length;
    },
  });
}
```

---

## 🔄 CI/CD Integration

### **GitHub Actions Integration**

Create `.github/workflows/performance-tests.yml`:

```yaml
name: Performance Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 2 * * *' # Run daily at 2 AM

jobs:
  performance-tests:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Install k6
      run: |
        sudo gpg -k
        sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
        echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
        sudo apt-get update
        sudo apt-get install k6
    
    - name: Run performance tests
      run: |
        k6 run --out json=results.json k6-expense-management-test.js
    
    - name: Generate performance report
      run: |
        # Create HTML report from JSON results
        node scripts/generate-report.js results.json
    
    - name: Upload performance report
      uses: actions/upload-artifact@v4
      if: always()
      with:
        name: performance-report
        path: |
          results.json
          performance-report.html
        retention-days: 30
    
    - name: Performance regression check
      run: |
        # Compare with baseline performance
        node scripts/check-regression.js results.json
    
    - name: Comment on PR
      if: github.event_name == 'pull_request'
      uses: actions/github-script@v7
      with:
        script: |
          const fs = require('fs');
          const results = JSON.parse(fs.readFileSync('results.json', 'utf8'));
          
          const comment = `## 📊 Performance Test Results
          
          | Metric | Value | Threshold | Status |
          |--------|-------|-----------|--------|
          | Avg Response Time | ${results.metrics.http_req_duration.values.avg.toFixed(2)}ms | < 500ms | ${results.metrics.http_req_duration.values.avg < 500 ? '✅' : '❌'} |
          | 95th Percentile | ${results.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms | < 1000ms | ${results.metrics.http_req_duration.values['p(95)'] < 1000 ? '✅' : '❌'} |
          | Error Rate | ${(results.metrics.http_req_failed.values.rate * 100).toFixed(2)}% | < 1% | ${results.metrics.http_req_failed.values.rate < 0.01 ? '✅' : '❌'} |
          | Requests/sec | ${results.metrics.http_reqs.values.rate.toFixed(2)} | > 10 | ${results.metrics.http_reqs.values.rate > 10 ? '✅' : '❌'} |
          
          📈 [View detailed report](https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }})`;
          
          github.rest.issues.createComment({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            body: comment
          });

  baseline-comparison:
    runs-on: ubuntu-latest
    needs: performance-tests
    if: github.event_name == 'pull_request'
    
    steps:
    - name: Download current results
      uses: actions/download-artifact@v4
      with:
        name: performance-report
        path: ./current
    
    - name: Download baseline results
      run: |
        # Download baseline from main branch
        gh api repos/${{ github.repository }}/actions/artifacts \
          --jq '.artifacts[] | select(.name=="performance-baseline") | .archive_download_url' \
          | head -1 | xargs curl -L -o baseline.zip
        unzip baseline.zip -d ./baseline
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    
    - name: Compare performance
      run: |
        node scripts/compare-performance.js ./baseline/results.json ./current/results.json
```

### **Azure DevOps Integration**

Create `azure-pipelines-performance.yml`:

```yaml
trigger:
  branches:
    include:
    - main
    - develop

schedules:
- cron: "0 2 * * *"
  displayName: Daily performance test
  branches:
    include:
    - main

pool:
  vmImage: 'ubuntu-latest'

variables:
  - group: performance-test-secrets

steps:
- task: NodeTool@0
  inputs:
    versionSpec: '18.x'
  displayName: 'Install Node.js'

- script: |
    sudo gpg -k
    sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
    echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
    sudo apt-get update
    sudo apt-get install k6
  displayName: 'Install k6'

- script: |
    k6 run --out json=performance-results.json k6-expense-management-test.js
  displayName: 'Run k6 performance tests'
  env:
    API_TOKEN: $(API_TOKEN)

- script: |
    node scripts/generate-azure-report.js performance-results.json
  displayName: 'Generate performance report'

- task: PublishTestResults@2
  inputs:
    testResultsFormat: 'JUnit'
    testResultsFiles: 'performance-junit.xml'
    testRunTitle: 'Performance Tests'
  displayName: 'Publish performance results'

- task: PublishHtmlReport@1
  inputs:
    reportDir: 'performance-report'
    tabName: 'Performance Report'
  displayName: 'Publish HTML report'
```

### **Jenkins Integration**

```groovy
pipeline {
    agent any
    
    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['dev', 'staging', 'production'],
            description: 'Environment to test'
        )
        string(
            name: 'VUS',
            defaultValue: '10',
            description: 'Number of virtual users'
        )
        string(
            name: 'DURATION',
            defaultValue: '5m',
            description: 'Test duration'
        )
    }
    
    environment {
        K6_VERSION = '0.47.0'
    }
    
    stages {
        stage('Setup') {
            steps {
                script {
                    // Install k6
                    sh '''
                        sudo gpg -k
                        sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
                        echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
                        sudo apt-get update
                        sudo apt-get install k6
                    '''
                }
            }
        }
        
        stage('Performance Test') {
            steps {
                script {
                    sh """
                        k6 run \\
                            --vus ${params.VUS} \\
                            --duration ${params.DURATION} \\
                            --env ENVIRONMENT=${params.ENVIRONMENT} \\
                            --out json=results.json \\
                            --out influxdb=http://influxdb:8086/k6 \\
                            k6-expense-management-test.js
                    """
                }
            }
            post {
                always {
                    archiveArtifacts artifacts: 'results.json', fingerprint: true
                }
            }
        }
        
        stage('Generate Report') {
            steps {
                script {
                    sh 'node scripts/generate-jenkins-report.js results.json'
                }
            }
            post {
                always {
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: false,
                        keepAll: true,
                        reportDir: 'reports',
                        reportFiles: 'performance-report.html',
                        reportName: 'Performance Test Report'
                    ])
                }
            }
        }
        
        stage('Performance Gate') {
            steps {
                script {
                    def results = readJSON file: 'results.json'
                    def avgResponseTime = results.metrics.http_req_duration.values.avg
                    def errorRate = results.metrics.http_req_failed.values.rate
                    
                    if (avgResponseTime > 1000 || errorRate > 0.05) {
                        currentBuild.result = 'UNSTABLE'
                        echo "Performance degradation detected!"
                    }
                }
            }
        }
    }
    
    post {
        failure {
            emailext (
                subject: "Performance Test Failed - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: "Performance test failed. Check the report for details.",
                to: "${env.CHANGE_AUTHOR_EMAIL}"
            )
        }
    }
}
```

---

## 🎯 Best Practices

### **📋 Script Organization**

```
k6-tests/
├── config/
│   ├── environments.js
│   └── thresholds.js
├── data/
│   ├── test-users.csv
│   └── test-data.json
├── lib/
│   ├── auth.js
│   ├── utils.js
│   └── helpers.js
├── tests/
│   ├── api/
│   │   ├── auth-test.js
│   │   └── users-test.js
│   ├── load/
│   │   ├── baseline-load.js
│   │   └── stress-test.js
│   └── scenarios/
│       ├── user-journey.js
│       └── spike-test.js
├── scripts/
│   ├── generate-report.js
│   └── compare-baseline.js
└── package.json
```

### **📊 Naming Conventions**

```javascript
// ✅ Good naming
const userRegistrationTest = 'user-registration-test.js';
const loginLoadTest = 'login-load-test.js';
const checkoutStressTest = 'checkout-stress-test.js';

// ❌ Avoid unclear names
const test1 = 'test1.js';
const myTest = 'my-test.js';
const apiTest = 'api.js';
```

### **🔧 Configuration Management**

```javascript
// config/environments.js
export const environments = {
  dev: {
    baseUrl: 'https://api-dev.example.com',
    timeout: 30000,
    rateLimits: false,
  },
  staging: {
    baseUrl: 'https://api-staging.example.com',
    timeout: 10000,
    rateLimits: true,
  },
  production: {
    baseUrl: 'https://api.example.com',
    timeout: 5000,
    rateLimits: true,
  },
};

// config/thresholds.js
export const thresholds = {
  light: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.05'],
  },
  medium: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.02'],
  },
  strict: {
    http_req_duration: ['p(95)<200'],
    http_req_failed: ['rate<0.01'],
  },
};
```

### **🔄 Reusable Functions**

```javascript
// lib/auth.js
export function login(username, password) {
  const response = http.post(`${config.baseUrl}/login`, {
    username: username,
    password: password,
  });
  
  check(response, {
    'login successful': (r) => r.status === 200,
    'has auth token': (r) => r.json('token') !== undefined,
  });
  
  return response.json('token');
}

// lib/utils.js
export function randomEmail() {
  const domains = ['gmail.com', 'yahoo.com', 'example.com'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `user${Math.random().toString(36).substr(2, 9)}@${domain}`;
}

export function waitForCondition(conditionFn, timeout = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (conditionFn()) {
      return true;
    }
    sleep(1);
  }
  return false;
}
```

### **📈 Performance Baselines**

```javascript
// Store baseline performance data
const baselines = {
  'user-registration': {
    p95: 800,     // 95th percentile response time in ms
    errorRate: 0.001, // 0.1% error rate
    throughput: 50,    // requests per second
  },
  'user-login': {
    p95: 300,
    errorRate: 0.005,
    throughput: 100,
  },
};

export default function () {
  const testName = 'user-registration';
  const baseline = baselines[testName];
  
  // Your test logic here...
  
  // Compare against baseline
  check(response, {
    [`response time within baseline (${baseline.p95}ms)`]: (r) => 
      r.timings.duration < baseline.p95,
  });
}
```

### **🎭 Test Data Management**

```javascript
// Use SharedArray for large datasets
import { SharedArray } from 'k6/data';

const testUsers = new SharedArray('test users', function () {
  // This runs only once per VU, not per iteration
  return JSON.parse(open('./data/users.json'));
});

// Cycle through test data
let userIndex = 0;
export default function () {
  const user = testUsers[userIndex % testUsers.length];
  userIndex++;
  
  // Use the user data...
}
```

---

## 🔍 Troubleshooting

### **Common Issues and Solutions**

#### **🐛 Issue: High Response Times**

```javascript
// ❌ Problem: All requests are slow
// 🔍 Debugging approach:

export default function () {
  const startTime = new Date();
  const response = http.get('https://api.example.com/slow-endpoint');
  const endTime = new Date();
  
  console.log(`Request took: ${endTime - startTime}ms`);
  console.log(`k6 measured: ${response.timings.duration}ms`);
  console.log(`Breakdown: blocked=${response.timings.blocked}ms, connecting=${response.timings.connecting}ms, waiting=${response.timings.waiting}ms`);
  
  // Check different response time components
  check(response, {
    'connection time OK': (r) => r.timings.connecting < 100,
    'waiting time OK': (r) => r.timings.waiting < 500,
    'receiving time OK': (r) => r.timings.receiving < 50,
  });
}

// ✅ Solutions:
// - Check network connectivity
// - Verify server capacity
// - Add connection pooling
// - Reduce payload sizes
```

#### **🐛 Issue: High Error Rates**

```javascript
// ❌ Problem: Many 4xx/5xx errors
// 🔍 Debugging approach:

export default function () {
  const response = http.get('https://api.example.com/endpoint');
  
  if (response.status !== 200) {
    console.error(`Error ${response.status}: ${response.body}`);
    console.error(`Request headers: ${JSON.stringify(response.request.headers)}`);
    console.error(`Response headers: ${JSON.stringify(response.headers)}`);
  }
  
  // Log error patterns
  check(response, {
    'not rate limited': (r) => r.status !== 429,
    'not auth error': (r) => r.status !== 401,
    'not server error': (r) => r.status < 500,
  });
}

// ✅ Solutions:
// - Check authentication tokens
// - Verify rate limiting
// - Review request payload format
// - Check server logs
```

#### **🐛 Issue: Memory/Resource Issues**

```javascript
// ❌ Problem: k6 running out of memory
// 🔍 Debugging approach:

export const options = {
  // Reduce memory usage
  discardResponseBodies: true, // Don't store response bodies
  
  // Limit concurrent connections
  batch: 10, // Process in smaller batches
  batchPerHost: 5, // Limit per host
  
  // Use fewer VUs with longer duration instead of many VUs
  vus: 50,
  duration: '10m',
};

// ✅ Solutions:
// - Use discardResponseBodies for large responses
// - Reduce VU count, increase duration
// - Clean up variables in test functions
// - Use SharedArray for large datasets
```

#### **🐛 Issue: Inconsistent Results**

```javascript
// ❌ Problem: Results vary between runs
// 🔍 Debugging approach:

export const options = {
  // Add warm-up period
  stages: [
    { duration: '1m', target: 1 },    // Warm-up
    { duration: '1m', target: 10 },   // Actual test
  ],
  
  // Set consistent timing
  noConnectionReuse: false, // Allow connection reuse
  userAgent: 'k6-test-agent/1.0', // Consistent user agent
};

export default function () {
  // Add consistent think time
  const thinkTime = 1; // Fixed instead of random
  sleep(thinkTime);
  
  // Disable browser caching simulation
  const response = http.get('https://api.example.com/endpoint', {
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
}

// ✅ Solutions:
// - Use fixed think times during debugging
// - Add warm-up periods
// - Disable caching
// - Run tests multiple times
```

### **🔧 Debug Mode**

```bash
# Enable debug mode
k6 run --http-debug script.js

# Verbose logging
k6 run --verbose script.js

# Log all HTTP traffic
k6 run --http-debug=full script.js
```

### **📊 Performance Monitoring**

```javascript
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

export function handleSummary(data) {
  return {
    'summary.html': htmlReport(data),
    'summary.json': JSON.stringify(data, null, 2),
  };
}
```

---

## 📚 Resources

### **📖 Official Documentation**
- [k6 Documentation](https://k6.io/docs/)
- [k6 API Reference](https://k6.io/docs/javascript-api/)
- [k6 Examples](https://k6.io/docs/examples/)

### **🛠️ Tools and Extensions**
- [k6 Studio](https://k6.io/docs/test-authoring/k6-studio/) - Visual test creation
- [k6-to-junit](https://github.com/Mattihaut/k6-to-junit) - Convert results to JUnit
- [k6-html-reporter](https://github.com/benc-uk/k6-reporter) - Generate HTML reports

### **📊 Monitoring and Visualization**
- [Grafana + InfluxDB](https://k6.io/docs/results-visualization/influxdb-+-grafana/)
- [Prometheus + Grafana](https://k6.io/docs/results-visualization/prometheus/)
- [New Relic](https://k6.io/docs/results-visualization/new-relic/)
- [Datadog](https://k6.io/docs/results-visualization/datadog/)

### **🎓 Learning Resources**
- [k6 Learn](https://k6.io/learn/) - Interactive tutorials
- [Performance Testing Fundamentals](https://k6.io/blog/performance-testing-fundamentals/)
- [k6 Community Forum](https://community.k6.io/)

### **📦 Libraries and Utilities**
- [k6-utils](https://github.com/grafana/k6-utils) - Utility functions
- [k6-jslib-expect](https://github.com/grafana/k6-jslib-expect) - Assertion library
- [k6-jslib-httpx](https://github.com/grafana/k6-jslib-httpx) - Extended HTTP library

---

## 🎯 Conclusion

This comprehensive guide provides everything you need to:

### **✅ Get Started:**
- Install and configure k6
- Write your first performance tests
- Understand basic concepts

### **✅ Scale Up:**
- Implement different testing strategies
- Convert HAR files to tests
- Set up CI/CD integration

### **✅ Master Advanced Features:**
- Create complex scenarios
- Build reusable test libraries
- Monitor and analyze results

### **🚀 Next Steps:**

1. **Start Simple**: Begin with basic load tests
2. **Add Complexity**: Introduce scenarios and thresholds
3. **Automate**: Integrate with CI/CD pipelines
4. **Monitor**: Set up result visualization
5. **Scale**: Expand to comprehensive test suites

### **💡 Key Takeaways:**

- **Performance testing is crucial** for application reliability
- **k6 makes it accessible** to developers and DevOps teams
- **Start early** in the development process
- **Automate everything** possible
- **Monitor trends** over time, not just individual runs

---

**Happy Performance Testing! 🚀**

*For questions, improvements, or contributions to this guide, please reach out to your development team or create an issue in the repository.*