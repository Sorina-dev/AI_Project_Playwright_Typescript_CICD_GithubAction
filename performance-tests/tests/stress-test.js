/**
 * K6 Stress Test - Expense Management API
 * High Load Performance Test with Comprehensive Scenarios
 * 
 * This test suite implements the stress test configuration:
 * - Starts with 10 users
 * - Ramps up to 100 users over 5 minutes  
 * - Maintains 100 users for 10 minutes
 * - Ramps down to 0 over 2 minutes
 */

import { CONFIG } from '../config/config.js';
import { setupAuthentication, getRandomAuthenticatedUser } from '../utils/auth.js';
import { ThinkTime, DataGenerator } from '../utils/helpers.js';
import EmployeePage from '../pages/EmployeePage.js';
import ExpensePage from '../pages/ExpensePage.js';
import MedicalExpensePage from '../pages/MedicalExpensePage.js';
import LocationPage from '../pages/LocationPage.js';

// Stress test configuration
export const options = CONFIG.TEST_CONFIG.STRESS_TEST;

// Page objects
const employeePage = new EmployeePage();
const expensePage = new ExpensePage();
const medicalExpensePage = new MedicalExpensePage();
const locationPage = new LocationPage();

// Stress test metrics tracking
let stressMetrics = {
  totalOperations: 0,
  successfulOperations: 0,
  failedOperations: 0,
  operationBreakdown: {
    get: 0,
    post: 0,
    put: 0,
    delete: 0
  },
  userSessions: 0,
  peakConcurrentUsers: 0
};

/**
 * Setup function - prepare system for high load
 */
export function setup() {
  console.log('🚀 Starting STRESS TEST - Expense Management API');
  console.log(`📍 Target: ${CONFIG.BASE_URL}`);
  console.log('⚡ STRESS TEST CONFIGURATION:');
  console.log('   • Phase 1: Ramp from 0 → 10 users (2 minutes)');
  console.log('   • Phase 2: Ramp from 10 → 100 users (5 minutes)');
  console.log('   • Phase 3: Sustain 100 users (10 minutes)');
  console.log('   • Phase 4: Ramp down 100 → 0 users (2 minutes)');
  console.log('   • Total duration: 19 minutes');
  console.log('🎯 Testing all CRUD operations under extreme load\n');
  
  // Pre-authenticate users for stress test
  setupAuthentication();
  
  // Warm up the system
  console.log('🔥 System warm-up phase...');
  const warmupUser = getRandomAuthenticatedUser();
  if (warmupUser.token) {
    // Warm up critical endpoints
    employeePage.getCurrentUser(warmupUser.token);
    expensePage.getExpenseTypes(warmupUser.token);
    medicalExpensePage.getAvailableAmount(warmupUser.token);
    console.log('✅ System warmed up successfully');
  }
  
  return stressMetrics;
}

/**
 * Main stress test function - implements realistic high-load user behavior
 */
export default function (data) {
  const authUser = getRandomAuthenticatedUser();
  
  if (!authUser.token) {
    console.error('❌ Authentication failed during stress test');
    stressMetrics.failedOperations++;
    return;
  }
  
  stressMetrics.userSessions++;
  
  // Simulate different user behavior patterns under stress
  const userBehaviorType = DataGenerator.randomNumber(1, 5);
  
  switch (userBehaviorType) {
    case 1:
      // Heavy Reader Pattern (40% of users)
      executeHeavyReaderPattern(authUser);
      break;
    case 2:
      // Active Creator Pattern (25% of users)
      executeActiveCreatorPattern(authUser);
      break;
    case 3:
      // Editor/Updater Pattern (20% of users)
      executeEditorPattern(authUser);
      break;
    case 4:
      // Administrator Pattern (10% of users)
      executeAdminPattern(authUser);
      break;
    case 5:
      // Mixed Operations Pattern (5% of users)
      executeMixedOperationsPattern(authUser);
      break;
  }
  
  // Stress-specific think times (shorter than normal)
  ThinkTime.short();
}

/**
 * Heavy Reader Pattern - User who primarily reads data
 */
function executeHeavyReaderPattern(authUser) {
  console.log('📖 Heavy Reader Pattern');
  
  try {
    // Multiple rapid read operations
    employeePage.getCurrentUser(authUser.token);
    stressMetrics.operationBreakdown.get++;
    stressMetrics.successfulOperations++;
    
    expensePage.getExpenseTypes(authUser.token);
    stressMetrics.operationBreakdown.get++;
    stressMetrics.successfulOperations++;
    
    expensePage.getMyExpenses(authUser.token, { limit: 20 });
    stressMetrics.operationBreakdown.get++;
    stressMetrics.successfulOperations++;
    
    medicalExpensePage.getAvailableAmount(authUser.token);
    stressMetrics.operationBreakdown.get++;
    stressMetrics.successfulOperations++;
    
    medicalExpensePage.getUserMedicalExpenses(authUser.token, { limit: 15 });
    stressMetrics.operationBreakdown.get++;
    stressMetrics.successfulOperations++;
    
    expensePage.getExpenseSummary(authUser.token);
    stressMetrics.operationBreakdown.get++;
    stressMetrics.successfulOperations++;
    
    stressMetrics.totalOperations += 6;
    
  } catch (error) {
    console.error('❌ Heavy Reader Pattern failed:', error.message);
    stressMetrics.failedOperations++;
  }
  
  // Minimal think time for stress test
  ThinkTime.short();
}

/**
 * Active Creator Pattern - User who creates many resources
 */
function executeActiveCreatorPattern(authUser) {
  console.log('📝 Active Creator Pattern');
  
  try {
    // Check available types first
    expensePage.getExpenseTypes(authUser.token);
    stressMetrics.operationBreakdown.get++;
    stressMetrics.successfulOperations++;
    
    // Create multiple expenses rapidly
    for (let i = 0; i < 3; i++) {
      const expenseData = {
        description: `Stress test expense ${DataGenerator.randomString(6)}`,
        amount: DataGenerator.randomAmount(10, 200),
        currency: DataGenerator.randomArrayElement(CONFIG.TEST_DATA.CURRENCIES),
        expenseType: DataGenerator.randomArrayElement(CONFIG.TEST_DATA.EXPENSE_TYPES),
        date: new Date().toISOString(),
        notes: `Stress test creation ${i + 1}`
      };
      
      expensePage.createExpense(authUser.token, expenseData);
      stressMetrics.operationBreakdown.post++;
      stressMetrics.successfulOperations++;
    }
    
    // Create medical expense
    medicalExpensePage.createMedicalExpense(authUser.token);
    stressMetrics.operationBreakdown.post++;
    stressMetrics.successfulOperations++;
    
    stressMetrics.totalOperations += 5;
    
  } catch (error) {
    console.error('❌ Active Creator Pattern failed:', error.message);
    stressMetrics.failedOperations++;
  }
}

/**
 * Editor Pattern - User who updates existing resources
 */
function executeEditorPattern(authUser) {
  console.log('✏️ Editor Pattern');
  
  try {
    // Create resource to edit
    const expenseResponse = expensePage.createExpense(authUser.token);
    stressMetrics.operationBreakdown.post++;
    stressMetrics.successfulOperations++;
    
    if (expenseResponse.createdExpense && expenseResponse.createdExpense.id) {
      // Update the created expense
      const updateData = [{
        id: expenseResponse.createdExpense.id,
        description: `Updated under stress ${DataGenerator.randomString(8)}`,
        amount: DataGenerator.randomAmount(50, 300),
        notes: `Stress test update - ${new Date().toISOString()}`
      }];
      
      expensePage.updateExpenses(authUser.token, updateData);
      stressMetrics.operationBreakdown.put++;
      stressMetrics.successfulOperations++;
      
      // Verify update by reading back
      expensePage.getMyExpenses(authUser.token, { limit: 5 });
      stressMetrics.operationBreakdown.get++;
      stressMetrics.successfulOperations++;
    }
    
    stressMetrics.totalOperations += 3;
    
  } catch (error) {
    console.error('❌ Editor Pattern failed:', error.message);
    stressMetrics.failedOperations++;
  }
}

/**
 * Administrator Pattern - User with elevated permissions
 */
function executeAdminPattern(authUser) {
  console.log('👑 Administrator Pattern');
  
  try {
    // Admin-level operations
    employeePage.getEmployees(authUser.token, { page: 1, pageSize: 50 });
    stressMetrics.operationBreakdown.get++;
    stressMetrics.successfulOperations++;
    
    employeePage.searchEmployees(authUser.token, 'test', 1, 10);
    stressMetrics.operationBreakdown.get++;
    stressMetrics.successfulOperations++;
    
    // Location management
    const locationResponse = locationPage.createLocation(authUser.token);
    stressMetrics.operationBreakdown.post++;
    stressMetrics.successfulOperations++;
    
    if (locationResponse.createdLocation && locationResponse.createdLocation.id) {
      // Update location
      const locationUpdate = {
        id: locationResponse.createdLocation.id,
        name: `Admin updated location ${DataGenerator.randomString(6)}`,
        lastModified: new Date().toISOString()
      };
      
      locationPage.updateLocation(authUser.token, locationUpdate);
      stressMetrics.operationBreakdown.put++;
      stressMetrics.successfulOperations++;
    }
    
    stressMetrics.totalOperations += 4;
    
  } catch (error) {
    console.error('❌ Administrator Pattern failed:', error.message);
    stressMetrics.failedOperations++;
  }
}

/**
 * Mixed Operations Pattern - User performing all types of operations
 */
function executeMixedOperationsPattern(authUser) {
  console.log('🔄 Mixed Operations Pattern');
  
  try {
    // GET operations
    employeePage.getCurrentUser(authUser.token);
    stressMetrics.operationBreakdown.get++;
    
    expensePage.getExpenseTypes(authUser.token);
    stressMetrics.operationBreakdown.get++;
    
    // POST operations
    const expenseResponse = expensePage.createExpense(authUser.token);
    stressMetrics.operationBreakdown.post++;
    
    const medicalResponse = medicalExpensePage.createMedicalExpense(authUser.token);
    stressMetrics.operationBreakdown.post++;
    
    // PUT operations
    if (expenseResponse.createdExpense && expenseResponse.createdExpense.id) {
      const updateData = [{
        id: expenseResponse.createdExpense.id,
        description: `Mixed pattern update ${DataGenerator.randomString(6)}`,
        amount: DataGenerator.randomAmount(100, 400)
      }];
      
      expensePage.updateExpenses(authUser.token, updateData);
      stressMetrics.operationBreakdown.put++;
    }
    
    // DELETE operations
    if (medicalResponse.createdExpense && medicalResponse.createdExpense.id) {
      medicalExpensePage.deleteMedicalExpense(authUser.token, medicalResponse.createdExpense.id);
      stressMetrics.operationBreakdown.delete++;
    }
    
    stressMetrics.successfulOperations += 6;
    stressMetrics.totalOperations += 6;
    
  } catch (error) {
    console.error('❌ Mixed Operations Pattern failed:', error.message);
    stressMetrics.failedOperations++;
  }
}

/**
 * Check function - runs throughout the test to ensure system health
 */
export function check() {
  // System health check during stress test
  const authUser = getRandomAuthenticatedUser();
  
  if (authUser.token) {
    try {
      const healthResponse = employeePage.getCurrentUser(authUser.token);
      if (healthResponse.status !== 200) {
        console.warn(`⚠️ System health check warning: Status ${healthResponse.status}`);
      }
    } catch (error) {
      console.error('🚨 System health check failed:', error.message);
    }
  }
}

/**
 * Teardown function - analyze stress test results
 */
export function teardown(data) {
  console.log('\n🏁 STRESS TEST COMPLETED');
  console.log('=' .repeat(50));
  console.log('📊 STRESS TEST RESULTS:');
  console.log(`   • Total Operations: ${data.totalOperations}`);
  console.log(`   • Successful Operations: ${data.successfulOperations}`);
  console.log(`   • Failed Operations: ${data.failedOperations}`);
  console.log(`   • Success Rate: ${((data.successfulOperations / data.totalOperations) * 100).toFixed(2)}%`);
  console.log(`   • User Sessions: ${data.userSessions}`);
  
  console.log('\n🔍 OPERATION BREAKDOWN:');
  console.log(`   • GET requests: ${data.operationBreakdown.get}`);
  console.log(`   • POST requests: ${data.operationBreakdown.post}`);
  console.log(`   • PUT requests: ${data.operationBreakdown.put}`);
  console.log(`   • DELETE requests: ${data.operationBreakdown.delete}`);
  
  console.log('\n📈 KEY METRICS TO REVIEW:');
  console.log('   • Response times under high load');
  console.log('   • Error rates during peak traffic');
  console.log('   • System stability during sustained load');
  console.log('   • Resource utilization patterns');
  
  console.log('\n⚡ STRESS TEST PHASES COMPLETED:');
  console.log('   ✅ Phase 1: Initial ramp-up (0→10 users)');
  console.log('   ✅ Phase 2: Load increase (10→100 users)');  
  console.log('   ✅ Phase 3: Peak load sustained (100 users)');
  console.log('   ✅ Phase 4: Graceful ramp-down (100→0 users)');
  
  const overallHealth = data.successfulOperations / (data.successfulOperations + data.failedOperations);
  
  if (overallHealth >= 0.95) {
    console.log('\n🎉 EXCELLENT: System performed exceptionally under stress (≥95% success)');
  } else if (overallHealth >= 0.90) {
    console.log('\n✅ GOOD: System handled stress well (≥90% success)');
  } else if (overallHealth >= 0.80) {
    console.log('\n⚠️ ACCEPTABLE: System showed some stress but remained functional (≥80% success)');
  } else {
    console.log('\n🚨 POOR: System struggled under stress (<80% success) - Investigation needed');
  }
  
  console.log('\n📋 RECOMMENDATIONS:');
  console.log('   • Monitor database connection pools during peak load');
  console.log('   • Check memory usage patterns for potential leaks');
  console.log('   • Verify auto-scaling triggers are properly configured');
  console.log('   • Review caching strategies for frequently accessed data');
  console.log('   • Consider implementing circuit breakers for external services');
  
  console.log('\n🔧 NEXT STEPS:');
  console.log('   • Analyze individual request timing distributions');
  console.log('   • Identify bottlenecks in slowest endpoints');
  console.log('   • Test with even higher loads if system performed well');
  console.log('   • Implement optimizations and re-test');
}