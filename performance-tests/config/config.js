/**
 * K6 Performance Test Configuration
 * Expense Management API - Configuration File
 * 
 * This file contains all configuration settings for the performance tests
 */

// Environment Configuration
export const CONFIG = {
  // Base URLs - Using JSONPlaceholder for reliable mock testing
  BASE_URL: 'https://jsonplaceholder.typicode.com',
  
  // API Endpoints (JSONPlaceholder compatible)
  ENDPOINTS: {
    // Users (simulating employees)
    USERS: '/users',
    USER_BY_ID: '/users', // will append /{id}
    
    // Posts (simulating expenses)
    POSTS: '/posts',
    POST_BY_ID: '/posts', // will append /{id}
    
    // Comments (simulating expense comments/notes)
    COMMENTS: '/comments',
    
    // Albums (simulating expense categories/types)
    ALBUMS: '/albums',
    
    // Photos (simulating expense attachments)
    PHOTOS: '/photos'
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
    },
    
    // Endurance/Soak test configuration
    ENDURANCE_TEST: {
      stages: [
        { duration: '2m', target: 25 },     // Ramp up to 25 users
        { duration: '26m', target: 25 },    // Maintain 25 users for 26 minutes
        { duration: '2m', target: 0 }       // Ramp down
      ],
      thresholds: {
        http_req_duration: ['p(95)<2500'],     // 95% of requests should be below 2500ms
        http_req_failed: ['rate<0.15'],        // Error rate should be below 15%
        http_reqs: ['rate>3'],                 // Request rate should be above 3 RPS
      }
    },
    
    // Volume test configuration
    VOLUME_TEST: {
      stages: [
        { duration: '30s', target: 100 },   // Ramp up to 100 users quickly
        { duration: '10m', target: 100 },   // Maintain 100 users
        { duration: '30s', target: 0 }      // Ramp down
      ],
      iterations: 10000,                     // Total 10,000 operations across all users
      thresholds: {
        http_req_duration: ['p(95)<3000'],     // 95% of requests should be below 3000ms
        http_req_failed: ['rate<0.15'],        // Error rate should be below 15%
        http_reqs: ['rate>50'],                // High request rate for volume testing
        iterations: ['count>=10000'],          // Ensure all 10,000 iterations complete
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
  
  // Test data for JSONPlaceholder mock testing
  TEST_DATA: {
    // Sample posts data (simulating expenses)
    SAMPLE_POSTS: [
      { title: 'Business Trip Expense', body: 'Flight and accommodation costs for client meeting', userId: 1 },
      { title: 'Office Supplies', body: 'Stationery and equipment for Q4 projects', userId: 2 },
      { title: 'Training Course', body: 'Professional development certification course', userId: 3 }
    ],
    
    // Sample users (simulating employees)
    SAMPLE_USERS: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // JSONPlaceholder has 10 users
    
    EXPENSE_TYPES: ['Travel', 'Meals', 'Accommodation', 'Office Supplies', 'Training'],
    
    CURRENCIES: ['USD', 'EUR', 'GBP', 'RON']
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
    BASE_URL: 'https://jsonplaceholder.typicode.com',
    // JSONPlaceholder is free and reliable for testing
    TIMEOUTS: {
      DEFAULT: '10s',
      LONG: '20s',
      SHORT: '5s'
    }
  };
}

export default CONFIG;