/**
 * K6 Performance Test - POST Requests
 * JSONPlaceholder API - POST Operations Test Suite
 * 
 * This test suite focuses on POST request performance testing
 * Tests: /posts (create posts/expenses), /comments (add comments)
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { CONFIG } from '../config/config.js';

// Test configuration - focused on POST requests
export const options = {
  scenarios: {
    post_load_test: {
      executor: 'ramping-vus',
      stages: [
        { duration: '30s', target: 5 },    // Ramp up to 5 users
        { duration: '1m', target: 10 },    // Scale to 10 users
        { duration: '30s', target: 0 },    // Ramp down
      ],
    }
  },
  thresholds: {
    http_req_duration: ['p(95)<2000'],     // 95% of requests should be below 2000ms
    http_req_failed: ['rate<0.1'],         // Less than 10% of requests should fail
    http_reqs: ['rate>2'],                 // Should generate more than 2 requests per second
    checks: ['rate>0.9'],                  // 90% of checks should pass
    
    // Individual endpoint thresholds
    'http_req_duration{name:create_post}': ['p(95)<1500'],
    'http_req_duration{name:create_comment}': ['p(95)<1000'],
  }
};

// Store created IDs for reference (JSONPlaceholder always returns ID 101 for new posts)
let createdPostIds = [];

/**
 * Setup function - runs once before the test starts
 */
export function setup() {
  console.log('🚀 Starting POST Requests Performance Test');
  console.log(`📍 Target: ${CONFIG.BASE_URL}`);
  console.log('🎯 Testing POST endpoints: /posts, /comments');
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
  console.log(`📝 VU${__VU}: Testing POST operations as User ID: ${userId}`);

  // Test 1: Create new post (expense)
  const postData = {
    title: `Business Expense Report - User ${userId} - ${new Date().toISOString().split('T')[0]}`,
    body: `Travel and office supplies expense. Amount: $${Math.floor(Math.random() * 800) + 100}. Category: Business Travel. Submitted by automated performance test.`,
    userId: userId
  };
  
  const createPostResponse = http.post(
    `${CONFIG.BASE_URL}${CONFIG.ENDPOINTS.POSTS}`,
    JSON.stringify(postData),
    {
      headers: CONFIG.HEADERS.DEFAULT,
      timeout: CONFIG.TIMEOUTS.DEFAULT,
      tags: { name: 'create_post' }
    }
  );
  
  check(createPostResponse, {
    '✅ Create post status 201': (r) => r.status === 201,
    '✅ Create post response time < 1500ms': (r) => r.timings.duration < 1500,
    '✅ Created post has ID': (r) => {
      try {
        const post = JSON.parse(r.body);
        return post.id && post.id > 0;
      } catch (e) {
        return false;
      }
    },
    '✅ Created post has correct title': (r) => {
      try {
        const post = JSON.parse(r.body);
        return post.title && post.title.includes('Business Expense');
      } catch (e) {
        return false;
      }
    },
  });
  
  let createdPostId = null;
  if (createPostResponse.status === 201) {
    try {
      const post = JSON.parse(createPostResponse.body);
      createdPostId = post.id;
      createdPostIds.push(createdPostId);
      console.log(`� Created expense post with ID: ${createdPostId}`);
    } catch (e) {
      console.error('❌ Failed to parse created post response');
    }
  }
  
  sleep(2);
  
  // Test 2: Create comment (expense note/approval)
  const commentData = {
    postId: createdPostId || 1, // Use created post ID or default to 1
    name: `Manager Review - User ${userId}`,
    email: `manager${userId}@company.com`,
    body: `Expense approved. All receipts verified. Amount within budget limits. Processed by: Manager ${userId}.`
  };
  
  const createCommentResponse = http.post(
    `${CONFIG.BASE_URL}${CONFIG.ENDPOINTS.COMMENTS}`,
    JSON.stringify(commentData),
    {
      headers: CONFIG.HEADERS.DEFAULT,
      timeout: CONFIG.TIMEOUTS.DEFAULT,
      tags: { name: 'create_comment' }
    }
  );
  
  check(createCommentResponse, {
    '✅ Create comment status 201': (r) => r.status === 201,
    '✅ Create comment response time < 1000ms': (r) => r.timings.duration < 1000,
    '✅ Created comment has ID': (r) => {
      try {
        const comment = JSON.parse(r.body);
        return comment.id && comment.id > 0;
      } catch (e) {
        return false;
      }
    },
    '✅ Created comment has correct content': (r) => {
      try {
        const comment = JSON.parse(r.body);
        return comment.body && comment.body.includes('approved');
      } catch (e) {
        return false;
      }
    },
  });
  
  if (createCommentResponse.status === 201) {
    try {
      const comment = JSON.parse(createCommentResponse.body);
      console.log(`💬 Created expense comment with ID: ${comment.id}`);
    } catch (e) {
      console.error('❌ Failed to parse created comment response');
    }
  }
  
  sleep(1);
  
  // Test 3: Create another post with different data
  const secondPostData = {
    title: `Monthly Report - User ${userId} - ${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
    body: `Monthly expense summary. Total: $${Math.floor(Math.random() * 1200) + 200}. Categories: Travel, Meals, Office supplies. Requires management approval.`,
    userId: userId
  };
  
  const createSecondPostResponse = http.post(
    `${CONFIG.BASE_URL}${CONFIG.ENDPOINTS.POSTS}`,
    JSON.stringify(secondPostData),
    {
      headers: CONFIG.HEADERS.DEFAULT,
      timeout: CONFIG.TIMEOUTS.DEFAULT,
      tags: { name: 'create_post' }
    }
  );
  
  check(createSecondPostResponse, {
    '✅ Create second post status 201': (r) => r.status === 201,
    '✅ Second post response time < 1500ms': (r) => r.timings.duration < 1500,
    '✅ Second post has ID': (r) => {
      try {
        const post = JSON.parse(r.body);
        return post.id && post.id > 0;
      } catch (e) {
        return false;
      }
    },
  });
  
  if (createSecondPostResponse.status === 201) {
    try {
      const post = JSON.parse(createSecondPostResponse.body);
      console.log(`📊 Created monthly report post with ID: ${post.id}`);
    } catch (e) {
      console.error('❌ Failed to parse second post response');
    }
  }
  
  sleep(1);
  console.log(`✅ VU${__VU}: Completed POST operations test`);
}

/**
 * Teardown function - runs once after all tests complete
 */
export function teardown(data) {
  console.log('🏁 POST Requests Performance Test completed');
  console.log(`📊 Created ${createdPostIds.length} posts during testing`);
  console.log('💡 Note: JSONPlaceholder doesn\'t persist data, so cleanup is not required');
}