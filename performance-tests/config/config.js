/**
 * K6 Performance Test Configuration
 * Expense Management API - Configuration File
 * 
 * This file contains all configuration settings for the performance tests
 */

// Environment Configuration
export const CONFIG = {
  // Base URLs
  BASE_URL: 'https://mock-api-server.wiremockapi.cloud',
  
  // API Endpoints
  ENDPOINTS: {
    // Authentication
    AUTH: '/api/v1/auth/login',
    
    // Employee endpoints
    EMPLOYEES_ME: '/api/v1/employees/me',
    EMPLOYEES: '/api/v1/employees',
    
    // Expense endpoints
    EXPENSES: '/api/v1/expenses',
    EXPENSE_TYPES: '/api/v1/expense-types',
    REQUEST_EXPENSES: '/api/v1/request-expenses',
    
    // Medical expense endpoints
    MEDICAL_EXPENSES: '/api/v1/medical-expenses',
    MEDICAL_EXPENSES_AVAILABLE: '/api/v1/medical-expenses/available-amount',
    
    // Location endpoints
    LOCATIONS: '/api/v1/locations',
    
    // Other endpoints
    CURRENCIES: '/api/v1/currency',
    PROJECTS: '/api/v1/projects'
  },
  
  // Test Configuration
  TEST_CONFIG: {
    // Default load test configuration
    DEFAULT_LOAD: {
      stages: [
        { duration: '1m', target: 10 },    // Ramp up to 10 VUs over 1 minute
        { duration: '2m', target: 50 },    // Ramp up to 50 VUs over 2 minutes
        { duration: '3m', target: 50 },    // Stay at 50 VUs for 3 minutes
        { duration: '1m', target: 0 },     // Ramp down to 0 VUs over 1 minute
      ],
      thresholds: {
        http_req_duration: ['p(95)<2000'],     // 95% of requests should be below 2000ms
        http_req_failed: ['rate<0.1'],         // Less than 10% of requests should fail
        http_reqs: ['rate>1'],                 // Should generate more than 1 request per second
      }
    },
    
    // Stress test configuration
    STRESS_TEST: {
      stages: [
        { duration: '2m', target: 10 },     // Start with 10 users
        { duration: '5m', target: 100 },    // Ramp up to 100 users over 5 minutes
        { duration: '10m', target: 100 },   // Maintain 100 users for 10 minutes
        { duration: '2m', target: 0 },      // Ramp down to 0 over 2 minutes
      ],
      thresholds: {
        http_req_duration: ['p(95)<3000'],     // 95% of requests should be below 3000ms under stress
        http_req_failed: ['rate<0.2'],         // Less than 20% of requests should fail
        http_reqs: ['rate>5'],                 // Should generate more than 5 requests per second
        checks: ['rate>0.8'],                  // 80% of checks should pass
      }
    },
    
    // Spike test configuration
    SPIKE_TEST: {
      stages: [
        { duration: '30s', target: 10 },    // Normal load
        { duration: '1m', target: 200 },    // Spike to 200 users
        { duration: '30s', target: 10 },    // Back to normal
        { duration: '30s', target: 0 },     // Ramp down
      ],
      thresholds: {
        http_req_duration: ['p(95)<5000'],     // More lenient during spike
        http_req_failed: ['rate<0.3'],         // Higher error rate acceptable during spike
      }
    }
  },
  
  // Think times (realistic user behavior simulation)
  THINK_TIMES: {
    SHORT: 1,      // 1 second
    MEDIUM: 3,     // 3 seconds
    LONG: 5,       // 5 seconds
    VERY_LONG: 10  // 10 seconds
  },
  
  // Request timeouts
  TIMEOUTS: {
    DEFAULT: '30s',
    LONG: '60s',
    SHORT: '10s'
  },
  
  // Common headers
  HEADERS: {
    DEFAULT: {
      'Accept': 'application/json, text/plain, */*',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
      'Connection': 'keep-alive',
      'Content-Type': 'application/json',
      'User-Agent': 'K6 Performance Test/1.0',
      'Cache-Control': 'no-cache'
    },
    
    AUTHENTICATED: {
      'Accept': 'application/json, text/plain, */*',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
      'Connection': 'keep-alive',
      'Content-Type': 'application/json',
      'User-Agent': 'K6 Performance Test/1.0',
      'Cache-Control': 'no-cache'
      // Authorization header will be added dynamically
    }
  },
  
  // Test data
  TEST_DATA: {
    USERS: [
      { email: 'test.user1@company.com', password: 'Test123!', role: 'employee' },
      { email: 'test.admin@company.com', password: 'Admin123!', role: 'admin' },
      { email: 'test.manager@company.com', password: 'Manager123!', role: 'manager' }
    ],
    
    EXPENSE_TYPES: ['Travel', 'Meals', 'Accommodation', 'Office Supplies', 'Training'],
    
    CURRENCIES: ['USD', 'EUR', 'GBP', 'RON'],
    
    LOCATIONS: {
      COUNTRIES: ['Romania', 'United States', 'United Kingdom', 'Germany'],
      CITIES: ['Bucharest', 'New York', 'London', 'Berlin']
    }
  },
  
  // Validation patterns
  VALIDATION: {
    UUID_PATTERN: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    CURRENCY_PATTERN: /^[A-Z]{3}$/,
    AMOUNT_PATTERN: /^\d+(\.\d{1,2})?$/
  }
};

// Mock testing configuration only
export function getEnvironmentConfig() {
  return {
    ...CONFIG,
    BASE_URL: 'https://mock-api-server.wiremockapi.cloud',
    // Mock server configuration
    TIMEOUTS: {
      DEFAULT: '45s',
      LONG: '90s',
      SHORT: '15s'
    }
  };
}

export default CONFIG;