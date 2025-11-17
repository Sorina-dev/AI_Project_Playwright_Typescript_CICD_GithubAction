/**
 * K6 Performance Test - GET Requests
 * JSONPlaceholder API - GET Operations Test Suite
 * 
 * This test suite focuses on GET request performance testing
 * Tests: /users, /posts, /albums, /comments endpoints
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { CONFIG } from '../config/config.js';

// Test configuration - focused on GET requests with moderate load
export const options = {
  scenarios: {
    get_load_test: {
      executor: 'ramping-vus',
      startVUs: 3,
      stages: [
        { duration: '30s', target: 7 },   // Ramp up to 7 users over 30 seconds
        { duration: '1m', target: 7 },    // Stay at 7 users for 1 minute  
        { duration: '30s', target: 0 }    // Ramp down to 0 users over 30 seconds
      ],
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<1500'], // 95% of requests under 1.5s
    http_req_failed: ['rate<0.1'],     // Error rate under 10%
  },
};

/**
 * Setup function - runs once before the test starts
 */
export function setup() {
  console.log('🚀 Starting GET Requests Performance Test');
  console.log(`📍 Target: ${CONFIG.BASE_URL}`);
  console.log('🎯 Testing GET endpoints: /users, /posts, /albums, /comments');
  console.log('⏱️ Starting load test...\n');
  
  // Verify JSONPlaceholder connectivity
  const healthCheck = http.get(`${CONFIG.BASE_URL}/posts/1`);
  if (healthCheck.status !== 200) {
    throw new Error('❌ JSONPlaceholder API is not accessible');
  }
  
  console.log('✅ JSONPlaceholder API connectivity verified');
  return { baseUrl: CONFIG.BASE_URL };
}

/**
 * Main test function - runs for each virtual user
 */
export default function () {
  const userId = Math.floor(Math.random() * 10) + 1; // Random user 1-10
  console.log(`📋 VU${__VU}: Testing GET operations for User ID: ${userId}`);

  // Test 1: Get all users (employee directory)
  const getAllUsersResponse = http.get(
    `${CONFIG.BASE_URL}${CONFIG.ENDPOINTS.USERS}`,
    {
      headers: CONFIG.HEADERS.DEFAULT,
      timeout: CONFIG.TIMEOUTS.DEFAULT,
      tags: { name: 'get_users' }
    }
  );
  
  check(getAllUsersResponse, {
    '✅ Get all users status 200': (r) => r.status === 200,
    '✅ Get all users response time < 1000ms': (r) => r.timings.duration < 1000,
    '✅ Users list contains data': (r) => {
      try {
        const users = JSON.parse(r.body);
        return Array.isArray(users) && users.length > 0;
      } catch (e) {
        return false;
      }
    },
  });
  
  console.log(`👥 Employee directory loaded: ${getAllUsersResponse.body ? JSON.parse(getAllUsersResponse.body).length : 0} employees`);
  
  sleep(1);
  
  // Test 2: Get specific user details (employee profile)
  const getUserResponse = http.get(
    `${CONFIG.BASE_URL}${CONFIG.ENDPOINTS.USERS}/${userId}`,
    {
      headers: CONFIG.HEADERS.DEFAULT,
      timeout: CONFIG.TIMEOUTS.DEFAULT,
      tags: { name: 'get_user' }
    }
  );
  
  check(getUserResponse, {
    '✅ Get user status 200': (r) => r.status === 200,
    '✅ Get user response time < 800ms': (r) => r.timings.duration < 800,
    '✅ User has valid structure': (r) => {
      try {
        const user = JSON.parse(r.body);
        return user.id && user.name && user.email;
      } catch (e) {
        return false;
      }
    },
  });
  
  console.log(`👤 Employee profile retrieved for User ID: ${userId}`);
  
  sleep(1);
  
  // Test 3: Get all posts (expense reports)
  const getPostsResponse = http.get(
    `${CONFIG.BASE_URL}${CONFIG.ENDPOINTS.POSTS}`,
    {
      headers: CONFIG.HEADERS.DEFAULT,
      timeout: CONFIG.TIMEOUTS.DEFAULT,
      tags: { name: 'get_posts' }
    }
  );
  
  check(getPostsResponse, {
    '✅ Get posts status 200': (r) => r.status === 200,
    '✅ Get posts response time < 1000ms': (r) => r.timings.duration < 1000,
    '✅ Posts list contains data': (r) => {
      try {
        const posts = JSON.parse(r.body);
        return Array.isArray(posts) && posts.length > 0;
      } catch (e) {
        return false;
      }
    },
  });
  
  console.log(`📄 Expense reports loaded: ${getPostsResponse.body ? JSON.parse(getPostsResponse.body).length : 0} reports`);
  
  sleep(1);
  
  // Test 4: Get albums (expense categories)
  const getAlbumsResponse = http.get(
    `${CONFIG.BASE_URL}${CONFIG.ENDPOINTS.ALBUMS}`,
    {
      headers: CONFIG.HEADERS.DEFAULT,
      timeout: CONFIG.TIMEOUTS.DEFAULT,
      tags: { name: 'get_albums' }
    }
  );
  
  check(getAlbumsResponse, {
    '✅ Get albums status 200': (r) => r.status === 200,
    '✅ Get albums response time < 800ms': (r) => r.timings.duration < 800,
    '✅ Albums list contains data': (r) => {
      try {
        const albums = JSON.parse(r.body);
        return Array.isArray(albums) && albums.length > 0;
      } catch (e) {
        return false;
      }
    },
  });
  
  console.log(`📋 Expense categories loaded: ${getAlbumsResponse.body ? JSON.parse(getAlbumsResponse.body).length : 0} categories`);
  
  sleep(1);
  
  // Test 5: Get comments (expense notes/approvals)
  const getCommentsResponse = http.get(
    `${CONFIG.BASE_URL}${CONFIG.ENDPOINTS.COMMENTS}`,
    {
      headers: CONFIG.HEADERS.DEFAULT,
      timeout: CONFIG.TIMEOUTS.DEFAULT,
      tags: { name: 'get_comments' }
    }
  );
  
  check(getCommentsResponse, {
    '✅ Get comments status 200': (r) => r.status === 200,
    '✅ Get comments response time < 1000ms': (r) => r.timings.duration < 1000,
    '✅ Comments list contains data': (r) => {
      try {
        const comments = JSON.parse(r.body);
        return Array.isArray(comments) && comments.length > 0;
      } catch (e) {
        return false;
      }
    },
  });
  
  console.log(`💬 Expense comments loaded: ${getCommentsResponse.body ? JSON.parse(getCommentsResponse.body).length : 0} comments`);
  
  sleep(1);
  console.log(`✅ VU${__VU}: Completed GET operations test`);
}

/**
 * Teardown function - runs once after all tests complete
 */
export function teardown(data) {
  console.log('🏁 GET Requests Performance Test completed');
  console.log('📊 Test covered all major GET endpoints for expense management system');
  console.log('💡 Note: JSONPlaceholder provides reliable test data for consistent results');
}