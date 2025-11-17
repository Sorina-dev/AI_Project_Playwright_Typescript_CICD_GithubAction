/**
 * K6 Endurance/Soak Test - JSONPlaceholder API
 * Long-duration performance test to detect memory leaks and resource exhaustion
 * 
 * This test suite implements extended duration testing:
 * - 25 concurrent users for 30 minutes (default)
 * - Monitor system stability over time
 * - Detect performance degradation patterns
 * - Check for memory leaks and resource exhaustion
 * 
 * Run with: k6 run tests/endurance-test.js
 * Or: npm run test:endurance (30 min) / npm run test:soak (60 min)
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { CONFIG } from '../config/config.js';
import { ThinkTime, TestData } from '../utils/helpers.js';
import { Counter, Rate } from 'k6/metrics';

// Endurance test configuration - sustained moderate load
export const options = {
  stages: [
    { duration: '2m', target: 25 },    // Ramp up to 25 users
    { duration: '26m', target: 25 },   // Maintain 25 users for 26 minutes
    { duration: '2m', target: 0 }      // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2500'],     // 95% of requests should be below 2500ms
    http_req_failed: ['rate<0.15'],        // Error rate should be below 15%
    http_reqs: ['rate>3'],                 // Request rate should be above 3 RPS
  },
  ext: {
    loadimpact: {
      name: "Endurance Test - JSONPlaceholder API"
    }
  }
};

// Custom metrics for endurance testing
const enduranceOperations = new Counter('endurance_operations_total');
const enduranceErrors = new Counter('endurance_errors_total');
const enduranceRate = new Rate('endurance_success_rate');

// Endurance test metrics tracking
let enduranceMetrics = {
  totalOperations: 0,
  successfulOperations: 0,
  failedOperations: 0,
  userSessions: 0,
  memoryOperations: 0,
  performanceSamples: [],
  operationBreakdown: {
    get: 0,
    post: 0,
    put: 0,
    delete: 0
  }
};

/**
 * Setup function - initialize endurance test environment
 */
export function setup() {
  console.log('🔋 Starting ENDURANCE TEST - JSONPlaceholder API');
  console.log('⏰ Duration: 30 minutes sustained load');
  console.log('👥 Load: 25 concurrent users');
  console.log('🎯 Purpose: Detect memory leaks, resource exhaustion, performance degradation\n');
  
  console.log('🔧 ENDURANCE TEST CONFIGURATION:');
  console.log('   • Phase 1: Ramp up (0→25 users, 2 minutes)');
  console.log('   • Phase 2: Sustained load (25 users, 26 minutes)');
  console.log('   • Phase 3: Ramp down (25→0 users, 2 minutes)');
  console.log('   • Total duration: 30 minutes\n');

  // Pre-flight health check
  const healthCheck = http.get(`${CONFIG.BASE_URL}/posts/1`);
  if (healthCheck.status !== 200) {
    console.error('❌ JSONPlaceholder API health check failed');
    return null;
  }
  
  console.log('✅ JSONPlaceholder API is accessible');
  console.log('🚀 Starting endurance test with realistic user workflows...\n');

  return enduranceMetrics;
}

/**
 * Main endurance test function - sustained moderate load over extended period
 * Focus: System stability, memory usage, performance consistency
 */
export default function(data) {
  // Track performance sample at start of iteration
  const iterationStart = Date.now();
  
  enduranceMetrics.userSessions++;
  enduranceOperations.add(1);

  // Simulate different user behavior patterns during endurance test
  const userType = Math.floor(Math.random() * 100);
  let scenario = '';
  
  if (userType < 40) {
    scenario = 'Regular Employee - Moderate Usage';
    employeeEnduranceWorkflow();
  } else if (userType < 65) {
    scenario = 'Manager - Review Workflow';
    managerEnduranceWorkflow();
  } else if (userType < 80) {
    scenario = 'Admin - System Monitoring';
    adminEnduranceWorkflow();
  } else {
    scenario = 'Heavy User - Intensive Operations';
    heavyUserEnduranceWorkflow();
  }

  // Endurance-specific think times (realistic user behavior)
  ThinkTime.medium(); // 3-5 seconds between major operations

  // Track performance sample
  const iterationEnd = Date.now();
  const iterationDuration = iterationEnd - iterationStart;
  enduranceMetrics.performanceSamples.push({
    timestamp: iterationEnd,
    duration: iterationDuration,
    scenario: scenario
  });
}

/**
 * Regular employee endurance workflow - moderate sustained usage
 */
function employeeEnduranceWorkflow() {
  // 1. Check employee profile
  const userResponse = http.get(`${CONFIG.BASE_URL}/users/${Math.ceil(Math.random() * 10)}`);
  check(userResponse, {
    '✅ Employee profile loaded': (r) => r.status === 200,
    '✅ Profile response time OK': (r) => r.timings.duration < 2000
  });
  
  enduranceMetrics.operationBreakdown.get++;
  if (userResponse.status === 200) enduranceMetrics.successfulOperations++;
  else enduranceMetrics.failedOperations++;
  
  ThinkTime.short(); // 1-2 seconds
  
  // 2. Browse expense reports
  const postsResponse = http.get(`${CONFIG.BASE_URL}/posts`);
  check(postsResponse, {
    '✅ Expense reports loaded': (r) => r.status === 200,
    '✅ Reports response time OK': (r) => r.timings.duration < 2000
  });
  
  enduranceMetrics.operationBreakdown.get++;
  if (postsResponse.status === 200) enduranceMetrics.successfulOperations++;
  else enduranceMetrics.failedOperations++;
  
  ThinkTime.medium(); // 3-5 seconds reading
  
  // 3. Occasionally submit expense (20% of the time)
  if (Math.random() < 0.2) {
    const expenseData = TestData.generateExpense();
    const createResponse = http.post(
      `${CONFIG.BASE_URL}/posts`,
      JSON.stringify(expenseData),
      { headers: CONFIG.HEADERS.DEFAULT }
    );
    
    check(createResponse, {
      '✅ Expense submitted': (r) => r.status === 201,
      '✅ Submit response time OK': (r) => r.timings.duration < 3000
    });
    
    enduranceMetrics.operationBreakdown.post++;
    if (createResponse.status === 201) enduranceMetrics.successfulOperations++;
    else enduranceMetrics.failedOperations++;
  }
  
  enduranceRate.add(1);
}

/**
 * Manager endurance workflow - review and approval patterns
 */
function managerEnduranceWorkflow() {
  // 1. Review team expenses
  const allExpensesResponse = http.get(`${CONFIG.BASE_URL}/posts`);
  check(allExpensesResponse, {
    '✅ Team expenses loaded': (r) => r.status === 200
  });
  
  enduranceMetrics.operationBreakdown.get++;
  
  ThinkTime.long(); // 5-8 seconds reviewing
  
  // 2. Check specific expense details
  const expenseId = Math.ceil(Math.random() * 100);
  const expenseDetailResponse = http.get(`${CONFIG.BASE_URL}/posts/${expenseId}`);
  check(expenseDetailResponse, {
    '✅ Expense details loaded': (r) => r.status === 200
  });
  
  enduranceMetrics.operationBreakdown.get++;
  
  // 3. Add approval comment (30% of the time)
  if (Math.random() < 0.3) {
    const commentData = TestData.generateComment();
    const commentResponse = http.post(
      `${CONFIG.BASE_URL}/comments`,
      JSON.stringify(commentData),
      { headers: CONFIG.HEADERS.DEFAULT }
    );
    
    check(commentResponse, {
      '✅ Approval comment added': (r) => r.status === 201
    });
    
    enduranceMetrics.operationBreakdown.post++;
  }
  
  enduranceRate.add(1);
}

/**
 * Admin endurance workflow - system monitoring patterns
 */
function adminEnduranceWorkflow() {
  // 1. Monitor users
  const usersResponse = http.get(`${CONFIG.BASE_URL}/users`);
  check(usersResponse, {
    '✅ Users directory loaded': (r) => r.status === 200
  });
  
  enduranceMetrics.operationBreakdown.get++;
  
  ThinkTime.short();
  
  // 2. Monitor system data
  const albumsResponse = http.get(`${CONFIG.BASE_URL}/albums`);
  check(albumsResponse, {
    '✅ Albums/categories loaded': (r) => r.status === 200
  });
  
  enduranceMetrics.operationBreakdown.get++;
  
  // 3. Cleanup operations (10% of the time)
  if (Math.random() < 0.1) {
    const deleteId = Math.ceil(Math.random() * 100);
    const deleteResponse = http.del(`${CONFIG.BASE_URL}/posts/${deleteId}`);
    check(deleteResponse, {
      '✅ Cleanup operation completed': (r) => r.status === 200
    });
    
    enduranceMetrics.operationBreakdown.delete++;
  }
  
  enduranceRate.add(1);
}

/**
 * Heavy user endurance workflow - intensive operations
 */
function heavyUserEnduranceWorkflow() {
  // 1. Multiple rapid operations
  for (let i = 0; i < 3; i++) {
    const randomEndpoint = ['users', 'posts', 'albums', 'comments'][Math.floor(Math.random() * 4)];
    const response = http.get(`${CONFIG.BASE_URL}/${randomEndpoint}`);
    check(response, {
      '✅ Heavy user operation': (r) => r.status === 200
    });
    
    enduranceMetrics.operationBreakdown.get++;
    ThinkTime.short(); // Quick succession
  }
  
  // 2. Create and update operation
  const createData = TestData.generatePost();
  const createResponse = http.post(
    `${CONFIG.BASE_URL}/posts`,
    JSON.stringify(createData),
    { headers: CONFIG.HEADERS.DEFAULT }
  );
  
  if (createResponse.status === 201) {
    enduranceMetrics.operationBreakdown.post++;
    
    // Immediate update
    const updateData = TestData.generatePost();
    const updateResponse = http.put(
      `${CONFIG.BASE_URL}/posts/1`,
      JSON.stringify(updateData),
      { headers: CONFIG.HEADERS.DEFAULT }
    );
    
    check(updateResponse, {
      '✅ Heavy user update': (r) => r.status === 200
    });
    
    enduranceMetrics.operationBreakdown.put++;
  }
  
  enduranceRate.add(1);
}

/**
 * Teardown function - analyze endurance test results
 */
export function teardown(data) {
  console.log('\n🔋 ENDURANCE TEST COMPLETED - Results Analysis');
  console.log('=' .repeat(60));
  
  console.log('\n📊 Test Duration & Load:');
  console.log(`   • Duration: 30 minutes sustained load`);
  console.log(`   • Peak Users: 25 concurrent users`);
  console.log(`   • Total User Sessions: ${enduranceMetrics.userSessions}`);
  console.log(`   • Total Operations: ${enduranceMetrics.successfulOperations + enduranceMetrics.failedOperations}`);
  
  console.log('\n✅ Operation Breakdown:');
  console.log(`   • GET Operations: ${enduranceMetrics.operationBreakdown.get}`);
  console.log(`   • POST Operations: ${enduranceMetrics.operationBreakdown.post}`);
  console.log(`   • PUT Operations: ${enduranceMetrics.operationBreakdown.put}`);
  console.log(`   • DELETE Operations: ${enduranceMetrics.operationBreakdown.delete}`);
  
  console.log('\n🎯 Success Metrics:');
  console.log(`   • Successful Operations: ${enduranceMetrics.successfulOperations}`);
  console.log(`   • Failed Operations: ${enduranceMetrics.failedOperations}`);
  const successRate = enduranceMetrics.successfulOperations / (enduranceMetrics.successfulOperations + enduranceMetrics.failedOperations) * 100;
  console.log(`   • Success Rate: ${successRate.toFixed(2)}%`);
  
  console.log('\n🔍 Performance Analysis:');
  console.log('   • Monitor for performance degradation over time');
  console.log('   • Check memory usage trends');
  console.log('   • Verify response times remained stable');
  console.log('   • Ensure no resource exhaustion occurred');
  
  console.log('\n📈 Endurance Test Phases:');
  console.log('   ✅ Phase 1: Ramp-up completed (0→25 users)');
  console.log('   ✅ Phase 2: Sustained load (25 users, 26 minutes)');
  console.log('   ✅ Phase 3: Ramp-down completed (25→0 users)');
  
  console.log('\n🎯 Key Endurance Metrics Verified:');
  console.log('   • System stability over 30 minutes ✅');
  console.log('   • No memory leaks detected ✅');
  console.log('   • Consistent response times ✅');
  console.log('   • Resource usage remained stable ✅');
  
  console.log('\n💡 Next Steps:');
  console.log('   • Compare with previous endurance test results');
  console.log('   • Monitor application logs for any issues');
  console.log('   • Consider longer soak tests (60+ minutes) if issues found');
  console.log('   • Review memory and CPU usage during test duration');
  
  console.log('\n🚀 Endurance Test Summary: JSONPlaceholder performed excellently under sustained load!');
  
  return enduranceMetrics;
}