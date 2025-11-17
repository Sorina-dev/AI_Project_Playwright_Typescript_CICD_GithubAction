/**
 * K6 Performance Test - DELETE Requests
 * JSONPlaceholder API - DELETE Operations Test Suite
 * 
 * This test suite focuses on DELETE request performance testing
 * Tests: /posts/{id} (delete posts), /users/{id} (delete users)
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { CONFIG } from '../config/config.js';

// Test configuration - focused on DELETE requests with controlled load
export const options = {
  scenarios: {
    delete_load_test: {
      executor: 'ramping-vus',
      startVUs: 2,
      stages: [
        { duration: '30s', target: 5 },   // Ramp up to 5 users over 30 seconds  
        { duration: '1m', target: 5 },    // Stay at 5 users for 1 minute
        { duration: '30s', target: 0 }    // Ramp down to 0 users over 30 seconds
      ],
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests under 2s
    http_req_failed: ['rate<0.1'],     // Error rate under 10%
  },
};

// Track deletions for reporting
let deletionStats = {
  posts: 0,
  users: 0,
  totalAttempts: 0,
  successfulDeletions: 0
};

/**
 * Setup function - runs once before the test starts
 */
export function setup() {
  console.log('🚀 Starting DELETE Requests Performance Test');
  console.log(`📍 Target: ${CONFIG.BASE_URL}`);
  console.log('🎯 Testing DELETE endpoints: /posts/{id}, /users/{id}');
  console.log('⏱️ Starting load test...\n');
  
  // Verify JSONPlaceholder connectivity
  const healthCheck = http.get(`${CONFIG.BASE_URL}/posts/1`);
  if (healthCheck.status !== 200) {
    throw new Error('❌ JSONPlaceholder API is not accessible');
  }
  
  console.log('✅ JSONPlaceholder API connectivity verified');
  console.log('ℹ️ This test will simulate deletions (JSONPlaceholder doesn\'t persist changes)');
  return { baseUrl: CONFIG.BASE_URL };
}

/**
 * Main test function - runs for each virtual user
 */
export default function () {
  const userId = Math.floor(Math.random() * 10) + 1; // Random user 1-10
  const postId = Math.floor(Math.random() * 100) + 1; // Random post 1-100
  console.log(`🗑️ VU${__VU}: Testing DELETE operations for User ${userId}, Post ${postId}`);
  
  deletionStats.totalAttempts++;

  // Test 1: Delete post (simulating expense deletion)
  const deletePostResponse = http.del(
    `${CONFIG.BASE_URL}${CONFIG.ENDPOINTS.POSTS}/${postId}`,
    null,
    {
      headers: CONFIG.HEADERS.DEFAULT,
      timeout: CONFIG.TIMEOUTS.DEFAULT,
      tags: { name: 'delete_post' }
    }
  );
  
  check(deletePostResponse, {
    '✅ Delete post status 200': (r) => r.status === 200,
    '✅ Delete post response time < 1500ms': (r) => r.timings.duration < 1500,
    '✅ Delete response is empty object': (r) => {
      try {
        const result = JSON.parse(r.body);
        return Object.keys(result).length === 0;
      } catch (e) {
        return r.body === '{}' || r.body === '';
      }
    }
  });
  
  if (deletePostResponse.status === 200) {
    deletionStats.posts++;
    deletionStats.successfulDeletions++;
    console.log(`💰 Deleted expense post with ID: ${postId}`);
  }
  
  sleep(2);
  
  // Test 2: Verify post is deleted (should return 404)
  const verifyDeleteResponse = http.get(
    `${CONFIG.BASE_URL}${CONFIG.ENDPOINTS.POSTS}/${postId}`,
    {
      headers: CONFIG.HEADERS.DEFAULT,
      timeout: CONFIG.TIMEOUTS.DEFAULT,
      tags: { name: 'verify_delete' }
    }
  );
  
  // Note: JSONPlaceholder doesn't actually delete data, so this will still return 200
  // In a real API, we would expect 404
  check(verifyDeleteResponse, {
    '✅ Verify request response time < 1000ms': (r) => r.timings.duration < 1000,
    'ℹ️ Note: JSONPlaceholder simulation (real API would return 404)': (r) => r.status === 200
  });
  
  sleep(1);
  
  // Test 3: Delete user (simulating account cleanup)
  const deleteUserResponse = http.del(
    `${CONFIG.BASE_URL}${CONFIG.ENDPOINTS.USERS}/${userId}`,
    null,
    {
      headers: CONFIG.HEADERS.DEFAULT,
      timeout: CONFIG.TIMEOUTS.DEFAULT,
      tags: { name: 'delete_user' }
    }
  );
  
  check(deleteUserResponse, {
    '✅ Delete user status 200': (r) => r.status === 200,
    '✅ Delete user response time < 1000ms': (r) => r.timings.duration < 1000,
    '✅ User delete response is empty object': (r) => {
      try {
        const result = JSON.parse(r.body);
        return Object.keys(result).length === 0;
      } catch (e) {
        return r.body === '{}' || r.body === '';
      }
    }
  });
  
  if (deleteUserResponse.status === 200) {
    deletionStats.users++;
    deletionStats.successfulDeletions++;
    console.log(`👤 Deleted user account with ID: ${userId}`);
  }
  
  sleep(1);
  
  // Test 4: Delete a different post (simulating batch cleanup)
  const alternatePostId = Math.floor(Math.random() * 50) + 51; // Different range 51-100
  const deleteBatchPostResponse = http.del(
    `${CONFIG.BASE_URL}${CONFIG.ENDPOINTS.POSTS}/${alternatePostId}`,
    null,
    {
      headers: CONFIG.HEADERS.DEFAULT,
      timeout: CONFIG.TIMEOUTS.DEFAULT,
      tags: { name: 'delete_post' }
    }
  );
  
  check(deleteBatchPostResponse, {
    '✅ Batch delete post status 200': (r) => r.status === 200,
    '✅ Batch delete response time < 1500ms': (r) => r.timings.duration < 1500,
  });
  
  if (deleteBatchPostResponse.status === 200) {
    deletionStats.posts++;
    deletionStats.successfulDeletions++;
    console.log(`📊 Batch deleted post with ID: ${alternatePostId}`);
  }
  
  sleep(1);
  console.log(`✅ VU${__VU}: Completed DELETE operations test`);
}

/**
 * Teardown function - runs once after all tests complete
 */
export function teardown(data) {
  console.log('🏁 DELETE Requests Performance Test completed');
  console.log(`📊 Deletion Statistics:`);
  console.log(`   • Posts deleted: ${deletionStats.posts}`);
  console.log(`   • Users deleted: ${deletionStats.users}`);
  console.log(`   • Total successful deletions: ${deletionStats.successfulDeletions}`);
  console.log(`   • Total deletion attempts: ${deletionStats.totalAttempts}`);
  console.log('💡 Note: JSONPlaceholder simulates deletions without persisting changes');
}