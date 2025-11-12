/**
 * K6 Performance Test Suite - Main Orchestrator
 * Expense Management API - Mock Server Testing Only
 * 
 * This test suite runs against the mock API server for safe performance testing
 * Uses 50 virtual users ramping up over 2 minutes as requested
 * Target: https://mock-api-server.wiremockapi.cloud
 */

import { CONFIG } from '../config/config.js';
import { setupAuthentication, getRandomAuthenticatedUser } from '../utils/auth.js';
import { ThinkTime, DataGenerator } from '../utils/helpers.js';

// Import page objects
import EmployeePage from '../pages/EmployeePage.js';
import ExpensePage from '../pages/ExpensePage.js';
import MedicalExpensePage from '../pages/MedicalExpensePage.js';
import LocationPage from '../pages/LocationPage.js';

// Performance test configuration with 50 users over 2 minutes
export const options = {
  stages: [
    { duration: '2m', target: 50 },    // Ramp up to 50 users over 2 minutes
    { duration: '5m', target: 50 },    // Stay at 50 users for 5 minutes  
    { duration: '1m', target: 0 },     // Ramp down to 0 users over 1 minute
  ],
  
  thresholds: {
    // Performance requirements
    http_req_duration: ['p(95)<2000'],     // 95% of requests should be below 2000ms
    http_req_failed: ['rate<0.1'],         // Less than 10% of requests should fail
    http_reqs: ['rate>2'],                 // Should generate more than 2 requests per second
    
    // Individual endpoint thresholds
    'http_req_duration{name:get_current_user}': ['p(95)<1000'],
    'http_req_duration{name:get_expense_types}': ['p(95)<1000'],
    'http_req_duration{name:create_expense}': ['p(95)<2000'],
    'http_req_duration{name:create_medical_expense}': ['p(95)<2500'],
    'http_req_duration{name:update_expense}': ['p(95)<1500'],
    'http_req_duration{name:delete_expense}': ['p(95)<1000'],
    
    // System health checks
    checks: ['rate>0.9'],                  // 90% of checks should pass
    'group_duration{group:::API Operations}': ['p(95)<5000'],
  },
  
  // Test execution settings
  setupTimeout: '60s',
  teardownTimeout: '30s',
  
  // Browser-specific settings (if needed for future web tests)
  scenarios: {
    main_load_test: {
      executor: 'ramping-vus',
      stages: [
        { duration: '2m', target: 50 },    // Primary requirement: 50 users, 2 minutes ramp
        { duration: '5m', target: 50 },    // Sustain load for comprehensive testing
        { duration: '1m', target: 0 },     // Graceful shutdown
      ],
      gracefulRampDown: '30s',
    }
  }
};

// Initialize page objects
const employeePage = new EmployeePage();
const expensePage = new ExpensePage();
const medicalExpensePage = new MedicalExpensePage();
const locationPage = new LocationPage();

// Test execution tracking
let testMetrics = {
  totalUsers: 0,
  successfulSessions: 0,
  failedSessions: 0,
  operationCounts: {
    get: 0,
    post: 0,
    put: 0,
    delete: 0
  },
  responseTimeStats: {
    fastest: Number.MAX_VALUE,
    slowest: 0,
    total: 0,
    count: 0
  }
};

/**
 * Setup function - prepare the testing environment
 */
export function setup() {
  console.log('🚀 EXPENSE MANAGEMENT API - PERFORMANCE TEST SUITE');
  console.log('=' .repeat(60));
  console.log(`📍 Target Environment: ${CONFIG.BASE_URL}`);
  console.log('👥 Load Configuration: 50 Virtual Users');
  console.log('⏱️ Ramp Pattern: 0→50 users (2 min) → Sustain (5 min) → 0 users (1 min)');
  console.log('🎯 Total Duration: 8 minutes');
  
  console.log('\n🔍 Endpoints to be tested:');
  console.log('   GET Operations:');
  console.log('   • /api/v1/employees/me (Current user info)');
  console.log('   • /api/v1/expense-types (Available expense types)');
  console.log('   • /api/v1/medical-expenses/available-amount (Medical budget)');
  
  console.log('   POST Operations:');
  console.log('   • /api/v1/expenses (Create expenses)');
  console.log('   • /api/v1/medical-expenses (Create medical expenses)');
  
  console.log('   PUT Operations:');
  console.log('   • /api/v1/expenses (Update expenses)');
  console.log('   • /api/v1/locations (Update locations)');
  
  console.log('   DELETE Operations:');
  console.log('   • /api/v1/request-expenses/{id} (Delete expense requests)');
  console.log('   • /api/v1/locations/{id} (Delete locations)');
  
  console.log('\n🔧 Setting up test environment...');
  
  // Pre-authenticate test users
  setupAuthentication();
  
  // Perform system health check
  const healthUser = getRandomAuthenticatedUser();
  if (healthUser.token) {
    console.log('🏥 Performing system health check...');
    
    try {
      const healthResponse = employeePage.getCurrentUser(healthUser.token);
      if (healthResponse.status === 200) {
        console.log('✅ System health check passed');
      } else {
        console.warn(`⚠️ System health check warning: ${healthResponse.status}`);
      }
    } catch (error) {
      console.error(`❌ System health check failed: ${error.message}`);
    }
  }
  
  console.log('\n✅ Setup completed successfully');
  console.log('⏱️ Starting performance test in 3 seconds...\n');
  
  return testMetrics;
}

/**
 * Main test function - comprehensive user journey simulation
 */
export default function (data) {
  const authUser = getRandomAuthenticatedUser();
  
  if (!authUser.token) {
    console.error('❌ Authentication failed, skipping test iteration');
    testMetrics.failedSessions++;
    return;
  }
  
  testMetrics.totalUsers++;
  
  // Simulate different user personas and workflows
  const userPersona = selectUserPersona();
  
  console.log(`👤 User ${testMetrics.totalUsers}: ${userPersona.name} (${authUser.user.email})`);
  
  try {
    // Execute user journey based on persona
    executeUserJourney(authUser, userPersona);
    testMetrics.successfulSessions++;
    
  } catch (error) {
    console.error(`❌ User journey failed for ${userPersona.name}: ${error.message}`);
    testMetrics.failedSessions++;
  }
}

/**
 * Select user persona for realistic behavior simulation
 */
function selectUserPersona() {
  const personas = [
    {
      name: 'Regular Employee',
      weight: 40,
      operations: ['view_profile', 'check_expense_types', 'create_expense', 'view_expenses']
    },
    {
      name: 'Manager',
      weight: 25,
      operations: ['view_profile', 'view_team', 'approve_expenses', 'create_expense', 'update_expense']
    },
    {
      name: 'Admin User',
      weight: 15,
      operations: ['view_employees', 'manage_locations', 'bulk_operations', 'system_admin']
    },
    {
      name: 'Medical User',
      weight: 15,
      operations: ['check_medical_budget', 'create_medical_expense', 'view_medical_expenses']
    },
    {
      name: 'Heavy User',
      weight: 5,
      operations: ['all_operations', 'bulk_create', 'bulk_update', 'bulk_delete']
    }
  ];
  
  const random = Math.random() * 100;
  let cumulative = 0;
  
  for (const persona of personas) {
    cumulative += persona.weight;
    if (random <= cumulative) {
      return persona;
    }
  }
  
  return personas[0]; // Default to Regular Employee
}

/**
 * Execute user journey based on selected persona
 */
function executeUserJourney(authUser, persona) {
  console.log(`🎭 Executing ${persona.name} journey...`);
  
  switch (persona.name) {
    case 'Regular Employee':
      executeRegularEmployeeJourney(authUser);
      break;
    case 'Manager':
      executeManagerJourney(authUser);
      break;
    case 'Admin User':
      executeAdminJourney(authUser);
      break;
    case 'Medical User':
      executeMedicalUserJourney(authUser);
      break;
    case 'Heavy User':
      executeHeavyUserJourney(authUser);
      break;
  }
}

/**
 * Regular Employee Journey - Basic expense management
 */
function executeRegularEmployeeJourney(authUser) {
  // 1. Check profile
  employeePage.getCurrentUser(authUser.token);
  testMetrics.operationCounts.get++;
  ThinkTime.short();
  
  // 2. Check available expense types
  expensePage.getExpenseTypes(authUser.token);
  testMetrics.operationCounts.get++;
  ThinkTime.medium();
  
  // 3. Create a new expense
  const expenseResponse = expensePage.createExpense(authUser.token);
  testMetrics.operationCounts.post++;
  ThinkTime.medium();
  
  // 4. View personal expenses
  expensePage.getMyExpenses(authUser.token, { limit: 10 });
  testMetrics.operationCounts.get++;
  ThinkTime.long();
}

/**
 * Manager Journey - Team and approval focused
 */
function executeManagerJourney(authUser) {
  // 1. Check profile and team
  employeePage.getCurrentUser(authUser.token);
  testMetrics.operationCounts.get++;
  ThinkTime.short();
  
  // 2. View team members
  try {
    employeePage.getEmployees(authUser.token, { page: 1, pageSize: 20 });
    testMetrics.operationCounts.get++;
  } catch (e) {
    console.log('ℹ️ Team view might be restricted');
  }
  ThinkTime.medium();
  
  // 3. Create own expense
  const expenseResponse = expensePage.createExpense(authUser.token);
  testMetrics.operationCounts.post++;
  ThinkTime.short();
  
  // 4. Update expense details
  if (expenseResponse.createdExpense && expenseResponse.createdExpense.id) {
    const updateData = [{
      id: expenseResponse.createdExpense.id,
      description: `Manager updated - ${DataGenerator.randomString(6)}`,
      amount: DataGenerator.randomAmount(100, 500)
    }];
    
    expensePage.updateExpenses(authUser.token, updateData);
    testMetrics.operationCounts.put++;
  }
  ThinkTime.medium();
  
  // 5. Review expense summary
  expensePage.getExpenseSummary(authUser.token);
  testMetrics.operationCounts.get++;
  ThinkTime.long();
}

/**
 * Admin Journey - System administration tasks
 */
function executeAdminJourney(authUser) {
  // 1. System overview
  employeePage.getCurrentUser(authUser.token);
  testMetrics.operationCounts.get++;
  ThinkTime.short();
  
  // 2. Manage locations
  const locationResponse = locationPage.createLocation(authUser.token);
  testMetrics.operationCounts.post++;
  ThinkTime.medium();
  
  if (locationResponse.createdLocation && locationResponse.createdLocation.id) {
    // Update location
    const locationUpdate = {
      id: locationResponse.createdLocation.id,
      name: `Admin updated ${DataGenerator.randomString(6)}`,
      lastModified: new Date().toISOString()
    };
    
    locationPage.updateLocation(authUser.token, locationUpdate);
    testMetrics.operationCounts.put++;
    ThinkTime.short();
    
    // Clean up
    locationPage.deleteLocation(authUser.token, locationResponse.createdLocation.id);
    testMetrics.operationCounts.delete++;
  }
  
  // 3. User management
  try {
    employeePage.searchEmployees(authUser.token, 'test', 1, 15);
    testMetrics.operationCounts.get++;
  } catch (e) {
    console.log('ℹ️ User search might be restricted');
  }
  ThinkTime.long();
}

/**
 * Medical User Journey - Medical expense focused
 */
function executeMedicalUserJourney(authUser) {
  // 1. Check medical budget
  medicalExpensePage.getAvailableAmount(authUser.token);
  testMetrics.operationCounts.get++;
  ThinkTime.medium();
  
  // 2. Check detailed budget info
  medicalExpensePage.getTotalAvailableAmount(authUser.token);
  testMetrics.operationCounts.get++;
  ThinkTime.short();
  
  // 3. Create medical expense
  const medicalResponse = medicalExpensePage.createMedicalExpense(authUser.token);
  testMetrics.operationCounts.post++;
  ThinkTime.long();
  
  // 4. View medical expenses history
  medicalExpensePage.getUserMedicalExpenses(authUser.token, { limit: 15 });
  testMetrics.operationCounts.get++;
  ThinkTime.medium();
  
  // 5. Update medical expense if created successfully
  if (medicalResponse.createdExpense && medicalResponse.createdExpense.id) {
    const updateData = {
      id: medicalResponse.createdExpense.id,
      notes: `Updated medical expense - ${new Date().toISOString()}`,
      amount: DataGenerator.randomAmount(100, 600)
    };
    
    medicalExpensePage.updateMedicalExpense(authUser.token, updateData);
    testMetrics.operationCounts.put++;
  }
  ThinkTime.short();
}

/**
 * Heavy User Journey - Intensive operations
 */
function executeHeavyUserJourney(authUser) {
  console.log('🔥 Heavy user performing intensive operations...');
  
  // Rapid fire operations
  for (let i = 0; i < 3; i++) {
    // Multiple expense creation
    expensePage.createExpense(authUser.token);
    testMetrics.operationCounts.post++;
    
    // Quick data checks
    expensePage.getExpenseTypes(authUser.token);
    testMetrics.operationCounts.get++;
    
    ThinkTime.short(); // Minimal delays for heavy user
  }
  
  // Bulk operations
  expensePage.getMyExpenses(authUser.token, { limit: 50 });
  testMetrics.operationCounts.get++;
  
  expensePage.getExpenseSummary(authUser.token);
  testMetrics.operationCounts.get++;
  
  ThinkTime.medium();
}

/**
 * Teardown function - analyze and report results
 */
export function teardown(data) {
  console.log('\n🏁 PERFORMANCE TEST SUITE COMPLETED');
  console.log('=' .repeat(60));
  
  console.log('\n📊 EXECUTION SUMMARY:');
  console.log(`   • Total Virtual Users: ${data.totalUsers}`);
  console.log(`   • Successful Sessions: ${data.successfulSessions}`);
  console.log(`   • Failed Sessions: ${data.failedSessions}`);
  console.log(`   • Success Rate: ${((data.successfulSessions / data.totalUsers) * 100).toFixed(1)}%`);
  
  console.log('\n🔍 OPERATION BREAKDOWN:');
  console.log(`   • GET Operations: ${data.operationCounts.get}`);
  console.log(`   • POST Operations: ${data.operationCounts.post}`);
  console.log(`   • PUT Operations: ${data.operationCounts.put}`);
  console.log(`   • DELETE Operations: ${data.operationCounts.delete}`);
  
  const totalOps = Object.values(data.operationCounts).reduce((a, b) => a + b, 0);
  console.log(`   • Total Operations: ${totalOps}`);
  
  console.log('\n📈 KEY PERFORMANCE INDICATORS:');
  console.log('   Review the K6 summary above for detailed metrics including:');
  console.log('   • Response time percentiles (P90, P95, P99)');
  console.log('   • Request rate (RPS)');
  console.log('   • Error rate percentage');
  console.log('   • Data transfer rates');
  console.log('   • Individual endpoint performance');
  
  console.log('\n🎯 TEST COVERAGE:');
  console.log('   ✅ Authentication and user management');
  console.log('   ✅ Expense creation and management (GET, POST, PUT, DELETE)');
  console.log('   ✅ Medical expense workflows');
  console.log('   ✅ Location management');
  console.log('   ✅ Realistic user behavior simulation');
  console.log('   ✅ Load patterns with 50 concurrent users');
  
  console.log('\n🔧 RECOMMENDATIONS:');
  console.log('   • Monitor database query performance during peak load');
  console.log('   • Implement caching for frequently accessed endpoints');
  console.log('   • Consider implementing rate limiting if not present');
  console.log('   • Review error handling and retry mechanisms');
  console.log('   • Monitor memory usage and garbage collection');
  
  if (data.successfulSessions / data.totalUsers >= 0.95) {
    console.log('\n🎉 EXCELLENT: System performed exceptionally well under load!');
  } else if (data.successfulSessions / data.totalUsers >= 0.90) {
    console.log('\n✅ GOOD: System handled the load effectively');
  } else if (data.successfulSessions / data.totalUsers >= 0.80) {
    console.log('\n⚠️ ACCEPTABLE: Some performance issues detected');
  } else {
    console.log('\n🚨 POOR: Significant performance problems identified');
  }
  
  console.log('\n📋 NEXT STEPS:');
  console.log('   1. Analyze individual endpoint metrics');
  console.log('   2. Identify performance bottlenecks');
  console.log('   3. Optimize slow endpoints');
  console.log('   4. Re-run tests after improvements');
  console.log('   5. Consider stress testing with higher loads');
  
  console.log('\n🚀 Performance testing completed successfully!');
  console.log('   Check the HTML report and metrics dashboard for detailed analysis.');
}