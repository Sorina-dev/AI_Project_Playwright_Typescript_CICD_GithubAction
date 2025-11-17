/**
 * K6 Performance Test - PUT Requests
 * JSONPlaceholder API - PUT Operations Test Suite
 * 
 * This test suite focuses on PUT request performance testing
 * Tests: /posts (update posts), /users (update user info)
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { CONFIG } from '../config/config.js';

// Test configuration - focused on PUT requests with moderate load
export const options = {
  scenarios: {
    put_load_test: {
      executor: 'ramping-vus',
      startVUs: 3,
      stages: [
        { duration: '30s', target: 8 },  // Ramp up to 8 users over 30 seconds
        { duration: '1m', target: 8 },   // Stay at 8 users for 1 minute
        { duration: '30s', target: 0 }   // Ramp down to 0 users over 30 seconds
      ],
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests under 2s
    http_req_failed: ['rate<0.1'],     // Error rate under 10%
  },
};

// Store updated resource info for tracking
let updatedResourceIds = [];

/**
 * Setup function - runs once before the test starts
 */
export function setup() {
  console.log('🚀 Starting PUT Requests Performance Test');
  console.log(`📍 Target: ${CONFIG.BASE_URL}`);
  console.log('🎯 Testing PUT endpoints: /posts, /users');
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
  const postId = Math.floor(Math.random() * 100) + 1; // Random post 1-100
  console.log(`📝 VU${__VU}: Testing PUT operations for User ${userId}, Post ${postId}`);

  // Test 1: Update existing post (simulating expense update)
  const updatedPostData = {
    id: postId,
    title: `Updated Business Expense - User ${userId} - ${new Date().toISOString().split('T')[0]}`,
    body: `Updated expense details. New amount: $${Math.floor(Math.random() * 900) + 200}. Category: Business Operations. Status: Updated by automated test.`,
    userId: userId
  };
  
  const updatePostResponse = http.put(
    `${CONFIG.BASE_URL}${CONFIG.ENDPOINTS.POSTS}/${postId}`,
    JSON.stringify(updatedPostData),
    {
      headers: CONFIG.HEADERS.DEFAULT,
      timeout: CONFIG.TIMEOUTS.DEFAULT,
      tags: { name: 'update_post' }
    }
  );
  
  check(updatePostResponse, {
    '✅ Update post status 200': (r) => r.status === 200,
    '✅ Update post response time < 1500ms': (r) => r.timings.duration < 1500,
    '✅ Updated post has correct ID': (r) => {
      try {
        const post = JSON.parse(r.body);
        return post.id === postId;
      } catch (e) {
        return false;
      }
    },
    '✅ Updated post has new title': (r) => {
      try {
        const post = JSON.parse(r.body);
        return post.title && post.title.includes('Updated Business Expense');
      } catch (e) {
        return false;
      }
    },
  });
  
  if (updatePostResponse.status === 200) {
    try {
      const post = JSON.parse(updatePostResponse.body);
      updatedResourceIds.push(post.id);
      console.log(`💰 Updated expense post with ID: ${post.id}`);
    } catch (e) {
      console.error('❌ Failed to parse updated post response');
    }
  }
  
  sleep(2);
  
  // Test 2: Update user information (simulating profile update)
  const updatedUserData = {
    id: userId,
    name: `Updated Employee ${userId}`,
    username: `employee${userId}_updated`,
    email: `employee${userId}@company-updated.com`,
    address: {
      street: `${Math.floor(Math.random() * 9999)} Business Ave`,
      suite: `Suite ${Math.floor(Math.random() * 500) + 100}`,
      city: 'Business City',
      zipcode: `${Math.floor(Math.random() * 90000) + 10000}`,
      geo: {
        lat: (Math.random() * 180 - 90).toFixed(6),
        lng: (Math.random() * 360 - 180).toFixed(6)
      }
    },
    phone: `1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
    website: `employee${userId}-updated.com`,
    company: {
      name: `Updated Company ${userId}`,
      catchPhrase: 'Excellence in updated operations',
      bs: 'updated business solutions'
    }
  };
  
  const updateUserResponse = http.put(
    `${CONFIG.BASE_URL}${CONFIG.ENDPOINTS.USERS}/${userId}`,
    JSON.stringify(updatedUserData),
    {
      headers: CONFIG.HEADERS.DEFAULT,
      timeout: CONFIG.TIMEOUTS.DEFAULT,
      tags: { name: 'update_user' }
    }
  );
  
  check(updateUserResponse, {
    '✅ Update user status 200': (r) => r.status === 200,
    '✅ Update user response time < 1000ms': (r) => r.timings.duration < 1000,
    '✅ Updated user has correct ID': (r) => {
      try {
        const user = JSON.parse(r.body);
        return user.id === userId;
      } catch (e) {
        return false;
      }
    },
    '✅ Updated user has new email': (r) => {
      try {
        const user = JSON.parse(r.body);
        return user.email && user.email.includes('company-updated.com');
      } catch (e) {
        return false;
      }
    },
  });
  
  if (updateUserResponse.status === 200) {
    try {
      const user = JSON.parse(updateUserResponse.body);
      console.log(`👤 Updated employee profile for User ID: ${user.id}`);
    } catch (e) {
      console.error('❌ Failed to parse updated user response');
    }
  }
  
  sleep(1);
  
  // Test 3: Update another post with different data (simulating different expense type)
  const alternatePostId = Math.floor(Math.random() * 50) + 51; // Different range 51-100
  const updatedTravelExpense = {
    id: alternatePostId,
    title: `Updated Travel Expense - User ${userId} - Week ${Math.floor(Math.random() * 52) + 1}`,
    body: `Travel expense updated. Destination changed. New total: $${Math.floor(Math.random() * 700) + 150}. Hotel and transportation costs updated.`,
    userId: userId
  };
  
  const updateTravelResponse = http.put(
    `${CONFIG.BASE_URL}${CONFIG.ENDPOINTS.POSTS}/${alternatePostId}`,
    JSON.stringify(updatedTravelExpense),
    {
      headers: CONFIG.HEADERS.DEFAULT,
      timeout: CONFIG.TIMEOUTS.DEFAULT,
      tags: { name: 'update_post' }
    }
  );
  
  check(updateTravelResponse, {
    '✅ Update travel expense status 200': (r) => r.status === 200,
    '✅ Travel expense response time < 1500ms': (r) => r.timings.duration < 1500,
    '✅ Updated travel expense has ID': (r) => {
      try {
        const post = JSON.parse(r.body);
        return post.id === alternatePostId;
      } catch (e) {
        return false;
      }
    },
  });
  
  if (updateTravelResponse.status === 200) {
    try {
      const post = JSON.parse(updateTravelResponse.body);
      console.log(`🚗 Updated travel expense with ID: ${post.id}`);
    } catch (e) {
      console.error('❌ Failed to parse travel expense response');
    }
  }
  
  sleep(1);
  console.log(`✅ VU${__VU}: Completed PUT operations test`);
}

/**
 * Teardown function - runs once after all tests complete
 */
export function teardown(data) {
  console.log('🏁 PUT Requests Performance Test completed');
  console.log(`📊 Updated ${updatedResourceIds.length} resources during testing`);
  console.log('💡 Note: JSONPlaceholder doesn\'t persist data, so updates are simulated');
}