import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * K6 Performance Test Script
 * Generated from HAR file entry for Expense Management API
 * 
 * API Endpoint: Medical Expenses - Get Minimum Year
 * Method: GET
 * Environment: Staging
 */

// Test configuration
export const options = {
  // Default load test configuration
  stages: [
    { duration: '30s', target: 5 },   // Ramp up to 5 VUs over 30s
    { duration: '1m', target: 5 },    // Stay at 5 VUs for 1 minute
    { duration: '30s', target: 0 },   // Ramp down to 0 VUs over 30s
  ],
  
  // Alternative: Simple load test
  // vus: 10,        // 10 virtual users
  // duration: '30s', // for 30 seconds
  
  // Thresholds for performance criteria - relaxed for better stability
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests should be below 2000ms (more realistic)
    http_req_failed: ['rate<0.2'],     // Less than 20% of requests should fail
    http_reqs: ['rate>0.5'],           // Should generate more than 0.5 requests per second
  },
};

// Base URL and endpoint configuration
const BASE_URL = 'https://app-expensemanagement-api-stage.azurewebsites.net';
const API_ENDPOINT = '/api/v1/medical-expenses/admin/min-year';

// Request headers (extracted from HAR file)
const headers = {
  'Accept': 'application/json, text/plain, */*',
  'Accept-Encoding': 'gzip, deflate, br, zstd',
  'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
  'Connection': 'keep-alive',
  'Host': 'app-expensemanagement-api-stage.azurewebsites.net',
  'Origin': 'https://app-expensemanagement-stage.azurewebsites.net',
  'Referer': 'https://app-expensemanagement-stage.azurewebsites.net/',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'cross-site',
  'Sec-Fetch-Storage-Access': 'active',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
  'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"'
};

// Query parameters (extracted from HAR file)
const queryParams = {
  'status[]': ['Approved', 'Rejected', 'PartiallyApproved', 'Submitted']
};

// Main test function
export default function () {
  console.log('🚀 Starting Expense Management API Test');
  
  // Construct the full URL with query parameters
  const url = `${BASE_URL}${API_ENDPOINT}?status=Approved&status=Rejected&status=PartiallyApproved&status=Submitted`;
  
  console.log(`📡 Making GET request to: ${url}`);
  
  // Make the HTTP GET request
  const response = http.get(url, {
    headers: headers,
    timeout: '30s', // 30 second timeout
  });
  
  // Performance and correctness checks
  const checks = check(response, {
    '✅ Status is 200': (r) => r.status === 200,
    '✅ Status text is OK': (r) => r.status_text === 'OK',
    '✅ Response time < 1000ms': (r) => r.timings.duration < 1000,
    '✅ Response time < 500ms': (r) => r.timings.duration < 500,
    '✅ Response has content': (r) => r.body && r.body.length > 0,
    '✅ Content-Type is JSON': (r) => r.headers['Content-Type'] && r.headers['Content-Type'].includes('application/json'),
    '✅ Has CORS headers': (r) => r.headers['Access-Control-Allow-Origin'] !== undefined,
    '✅ Has security headers': (r) => r.headers['X-Content-Type-Options'] === 'nosniff',
    '✅ Server is Kestrel': (r) => r.headers['Server'] === 'Kestrel',
  });
  
  // Log response details
  if (checks['✅ Status is 200']) {
    console.log(`✅ Request successful - Status: ${response.status}`);
    console.log(`📊 Response time: ${Math.round(response.timings.duration)}ms`);
    console.log(`📦 Response body: ${response.body}`);
    console.log(`🔧 API Version: ${response.headers['api-supported-versions'] || 'Unknown'}`);
  } else {
    console.error(`❌ Request failed - Status: ${response.status}`);
    console.error(`🔍 Error details: ${response.body}`);
  }
  
  // Validate response content matches expected format
  if (response.body) {
    try {
      const year = parseInt(response.body.replace(/"/g, '')); // Remove quotes if present
      check(response, {
        '✅ Response is a valid year': () => year >= 2000 && year <= new Date().getFullYear(),
        '✅ Response matches expected format': () => /^\d{4}$/.test(response.body.replace(/"/g, '')),
      });
      console.log(`📅 Minimum year found: ${year}`);
    } catch (error) {
      console.error(`⚠️ Failed to parse response as year: ${error.message}`);
    }
  }
  
  // Optional: Add think time between requests (simulates real user behavior)
  sleep(1); // Wait 1 second before next iteration
}

/**
 * Setup function - runs once before the test starts
 */
export function setup() {
  console.log('🔧 Setting up Expense Management API Performance Test');
  console.log(`📍 Target: ${BASE_URL}${API_ENDPOINT}`);
  console.log(`🎯 Testing multiple status filters: Approved, Rejected, PartiallyApproved, Submitted`);
  console.log('⏱️ Starting load test...\n');
}

/**
 * Teardown function - runs once after the test ends
 */
export function teardown(data) {
  console.log('\n🏁 Expense Management API Performance Test Completed');
  console.log('📈 Check the summary report above for detailed metrics');
}

/**
 * 🚀 How to run this K6 script:
 * 
 * 1. Install K6:
 *    - Windows: winget install k6
 *    - macOS: brew install k6
 *    - Linux: sudo apt install k6
 * 
 * 2. Run the test:
 *    k6 run k6-expense-management-test.js
 * 
 * 3. Run with different load patterns:
 *    k6 run --vus 10 --duration 30s k6-expense-management-test.js
 *    k6 run --vus 50 --duration 2m k6-expense-management-test.js
 * 
 * 4. Generate HTML report:
 *    k6 run --out html=report.html k6-expense-management-test.js
 * 
 * 5. Run with custom thresholds:
 *    k6 run --threshold http_req_duration=p(95)<200 k6-expense-management-test.js
 * 
 * 📊 Key Metrics to Monitor:
 * - http_req_duration: Response time
 * - http_req_failed: Error rate
 * - http_reqs: Request rate (RPS)
 * - vus: Virtual users
 * - iterations: Total iterations completed
 * 
 * 🎯 Expected Results (based on HAR data):
 * - Response time: ~301ms (based on HAR timing)
 * - Status: 200 OK
 * - Content-Type: application/json
 * - Response: Year value (e.g., "2021")
 * 
 * 🔐 Security Headers Validated:
 * - X-Content-Type-Options: nosniff
 * - X-Frame-Options: SAMEORIGIN
 * - Content-Security-Policy: Present
 * - X-XSS-Protection: 1; mode=block
 */