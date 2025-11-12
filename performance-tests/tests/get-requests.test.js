/**
 * K6 Performance Test - GET Requests
 * Expense Management API - GET Operations Test Suite
 * 
 * This test suite focuses on GET request performance testing
 * Tests: /employees/me, /expense-types, /medical-expenses/available-amount
 */

import { CONFIG } from '../config/config.js';
import { getRandomAuthenticatedUser } from '../utils/auth.js';
import { ThinkTime } from '../utils/helpers.js';
import EmployeePage from '../pages/EmployeePage.js';
import ExpensePage from '../pages/ExpensePage.js';
import MedicalExpensePage from '../pages/MedicalExpensePage.js';

// Test configuration - focused on GET requests
export const options = CONFIG.TEST_CONFIG.DEFAULT_LOAD;

// Page objects
const employeePage = new EmployeePage();
const expensePage = new ExpensePage();
const medicalExpensePage = new MedicalExpensePage();

/**
 * Setup function - runs once before the test starts
 */
export function setup() {
  console.log('🚀 Starting GET Requests Performance Test');
  console.log(`📍 Target: ${CONFIG.BASE_URL}`);
  console.log('🎯 Testing GET endpoints: /employees/me, /expense-types, /medical-expenses/available-amount');
  console.log('⏱️ Starting load test...\n');
}

/**
 * Main test function - runs for each virtual user
 */
export default function () {
  // Get authenticated user for this session
  const authUser = getRandomAuthenticatedUser();
  
  if (!authUser.token) {
    console.error('❌ Failed to authenticate user, skipping test iteration');
    return;
  }
  
  console.log(`👤 Running GET requests test for user: ${authUser.user.email}`);
  
  // Test 1: Get current user information
  console.log('\n--- Test 1: Get Current User ---');
  employeePage.getCurrentUser(authUser.token);
  ThinkTime.short(); // User reviews their profile
  
  // Test 2: Get expense types (common operation for creating expenses)
  console.log('\n--- Test 2: Get Expense Types ---');
  expensePage.getExpenseTypes(authUser.token);
  ThinkTime.medium(); // User considers expense types for new expense
  
  // Test 3: Get available medical expense amount
  console.log('\n--- Test 3: Get Medical Available Amount ---');
  medicalExpensePage.getAvailableAmount(authUser.token);
  ThinkTime.short(); // Quick check of available budget
  
  // Additional GET operations to simulate realistic user behavior
  
  // Test 4: Get employee list (if user has permissions)
  console.log('\n--- Test 4: Get Employees List ---');
  try {
    employeePage.getEmployees(authUser.token, { 
      page: 1, 
      pageSize: 10 
    });
  } catch (error) {
    console.log('ℹ️ Employee list access might be restricted for this user');
  }
  ThinkTime.medium();
  
  // Test 5: Get user's existing expenses
  console.log('\n--- Test 5: Get My Expenses ---');
  expensePage.getMyExpenses(authUser.token, {
    status: ['Approved', 'Pending', 'Rejected'],
    limit: 10
  });
  ThinkTime.medium(); // User reviews their expense history
  
  // Test 6: Get medical expense budget
  console.log('\n--- Test 6: Get Medical Budget ---');
  medicalExpensePage.getMedicalBudget(authUser.token);
  ThinkTime.short();
  
  // Test 7: Search employees (if allowed)
  console.log('\n--- Test 7: Search Employees ---');
  try {
    employeePage.searchEmployees(authUser.token, 'test', 1, 5);
  } catch (error) {
    console.log('ℹ️ Employee search might be restricted for this user');
  }
  ThinkTime.medium();
  
  // Test 8: Get expense summary
  console.log('\n--- Test 8: Get Expense Summary ---');
  expensePage.getExpenseSummary(authUser.token, {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  });
  ThinkTime.long(); // User analyzes their spending summary
  
  // Test 9: Get user's medical expenses
  console.log('\n--- Test 9: Get User Medical Expenses ---');
  medicalExpensePage.getUserMedicalExpenses(authUser.token, {
    year: new Date().getFullYear(),
    status: ['Approved', 'Pending']
  });
  ThinkTime.medium();
  
  // Test 10: Get total available medical amount
  console.log('\n--- Test 10: Get Total Available Medical Amount ---');
  medicalExpensePage.getTotalAvailableAmount(authUser.token, {
    year: new Date().getFullYear()
  });
  
  // Final think time - user completes their review session
  ThinkTime.long();
  
  console.log(`✅ Completed GET requests test cycle for ${authUser.user.email}\n`);
}

/**
 * Teardown function - runs once after the test ends
 */
export function teardown(data) {
  console.log('\n🏁 GET Requests Performance Test Completed');
  console.log('📈 Check the summary report above for detailed metrics');
  console.log('🔍 Key endpoints tested:');
  console.log('   • GET /api/v1/employees/me');
  console.log('   • GET /api/v1/expense-types');
  console.log('   • GET /api/v1/medical-expenses/available-amount');
  console.log('   • GET /api/v1/employees (with pagination)');
  console.log('   • GET /api/v1/expenses/my');
  console.log('   • GET /api/v1/medical-expenses/budgets');
  console.log('   • GET /api/v1/expenses/summary');
  console.log('   • GET /api/v1/medical-expenses/user');
  console.log('   • GET /api/v1/medical-expenses/total-available-amount');
}