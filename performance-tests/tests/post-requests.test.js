/**
 * K6 Performance Test - POST Requests
 * Expense Management API - POST Operations Test Suite
 * 
 * This test suite focuses on POST request performance testing
 * Tests: /expenses (create expense), /medical-expenses (create medical expense)
 */

import { CONFIG } from '../config/config.js';
import { getRandomAuthenticatedUser } from '../utils/auth.js';
import { ThinkTime, DataGenerator } from '../utils/helpers.js';
import ExpensePage from '../pages/ExpensePage.js';
import MedicalExpensePage from '../pages/MedicalExpensePage.js';

// Test configuration - focused on POST requests
export const options = CONFIG.TEST_CONFIG.DEFAULT_LOAD;

// Page objects
const expensePage = new ExpensePage();
const medicalExpensePage = new MedicalExpensePage();

// Store created IDs for cleanup (in real scenario)
let createdExpenseIds = [];
let createdMedicalExpenseIds = [];

/**
 * Setup function - runs once before the test starts
 */
export function setup() {
  console.log('🚀 Starting POST Requests Performance Test');
  console.log(`📍 Target: ${CONFIG.BASE_URL}`);
  console.log('🎯 Testing POST endpoints: /expenses, /medical-expenses');
  console.log('⏱️ Starting load test...\n');
  
  // Pre-warm the system by getting expense types
  const authUser = getRandomAuthenticatedUser();
  if (authUser.token) {
    console.log('🔧 Pre-warming system...');
    expensePage.getExpenseTypes(authUser.token);
    console.log('✅ System pre-warmed');
  }
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
  
  console.log(`👤 Running POST requests test for user: ${authUser.user.email}`);
  
  // Simulate user workflow: Check available types/budgets before creating expenses
  
  // Pre-check 1: Get expense types (realistic user behavior)
  console.log('\n--- Pre-check: Get Expense Types ---');
  expensePage.getExpenseTypes(authUser.token);
  ThinkTime.medium(); // User reviews available expense types
  
  // Pre-check 2: Check available medical budget
  console.log('\n--- Pre-check: Get Medical Budget ---');
  medicalExpensePage.getAvailableAmount(authUser.token);
  ThinkTime.short(); // Quick budget check
  
  // Test 1: Create regular expense
  console.log('\n--- Test 1: Create Regular Expense ---');
  const expenseData = {
    description: `Business expense ${DataGenerator.randomString(6)}`,
    amount: DataGenerator.randomAmount(25, 300),
    currency: DataGenerator.randomArrayElement(CONFIG.TEST_DATA.CURRENCIES),
    expenseType: DataGenerator.randomArrayElement(CONFIG.TEST_DATA.EXPENSE_TYPES),
    date: DataGenerator.randomDate(new Date(2024, 10, 1), new Date()), // November 2024 onwards
    category: 'Business',
    notes: `Performance test expense created at ${new Date().toISOString()}`,
    receiptRequired: Math.random() > 0.5,
    projectCode: `PROJ-${DataGenerator.randomNumber(1000, 9999)}`
  };
  
  const expenseResponse = expensePage.createExpense(authUser.token, expenseData);
  
  if (expenseResponse.createdExpense && expenseResponse.createdExpense.id) {
    createdExpenseIds.push(expenseResponse.createdExpense.id);
  }
  
  ThinkTime.medium(); // User reviews created expense
  
  // Test 2: Create medical expense
  console.log('\n--- Test 2: Create Medical Expense ---');
  const medicalExpenseData = {
    description: `Medical treatment ${DataGenerator.randomString(6)}`,
    amount: DataGenerator.randomAmount(50, 800),
    currency: DataGenerator.randomArrayElement(CONFIG.TEST_DATA.CURRENCIES),
    date: DataGenerator.randomDate(new Date(2024, 10, 1), new Date()),
    providerName: `Medical Center ${DataGenerator.randomString(8)}`,
    treatmentType: DataGenerator.randomArrayElement(['Consultation', 'Treatment', 'Surgery', 'Pharmacy', 'Laboratory']),
    notes: `Medical expense for performance testing - ${new Date().toISOString()}`,
    patientName: `Test Patient ${DataGenerator.randomString(6)}`,
    diagnosis: `Test diagnosis ${DataGenerator.randomString(8)}`
  };
  
  const medicalResponse = medicalExpensePage.createMedicalExpense(authUser.token, medicalExpenseData);
  
  if (medicalResponse.createdExpense && medicalResponse.createdExpense.id) {
    createdMedicalExpenseIds.push(medicalResponse.createdExpense.id);
  }
  
  ThinkTime.long(); // User carefully reviews medical expense details
  
  // Additional realistic POST operations
  
  // Test 3: Create another expense with different category
  console.log('\n--- Test 3: Create Travel Expense ---');
  const travelExpense = {
    description: `Travel expense ${DataGenerator.randomString(6)}`,
    amount: DataGenerator.randomAmount(100, 500),
    currency: DataGenerator.randomArrayElement(CONFIG.TEST_DATA.CURRENCIES),
    expenseType: 'Travel',
    date: DataGenerator.randomDate(new Date(2024, 10, 1), new Date()),
    category: 'Travel',
    destination: `${DataGenerator.randomArrayElement(CONFIG.TEST_DATA.LOCATIONS.CITIES)}`,
    purpose: 'Business meeting',
    notes: `Travel expense for client meeting - ${DataGenerator.randomString(10)}`,
    mileage: DataGenerator.randomNumber(50, 500)
  };
  
  expensePage.createExpense(authUser.token, travelExpense);
  ThinkTime.medium();
  
  // Test 4: Create office supplies expense (different workflow)
  console.log('\n--- Test 4: Create Office Supplies Expense ---');
  const officeExpense = {
    description: `Office supplies ${DataGenerator.randomString(6)}`,
    amount: DataGenerator.randomAmount(10, 150),
    currency: DataGenerator.randomArrayElement(CONFIG.TEST_DATA.CURRENCIES),
    expenseType: 'Office Supplies',
    date: DataGenerator.randomDate(new Date(2024, 10, 1), new Date()),
    category: 'Office',
    vendor: `Office Store ${DataGenerator.randomString(6)}`,
    notes: `Supplies for team - ${DataGenerator.randomString(8)}`,
    urgency: DataGenerator.randomArrayElement(['Low', 'Medium', 'High'])
  };
  
  expensePage.createExpense(authUser.token, officeExpense);
  ThinkTime.short();
  
  // Test 5: Create another medical expense (different treatment type)
  console.log('\n--- Test 5: Create Pharmacy Medical Expense ---');
  const pharmacyExpense = {
    description: `Pharmacy prescription ${DataGenerator.randomString(6)}`,
    amount: DataGenerator.randomAmount(20, 200),
    currency: DataGenerator.randomArrayElement(CONFIG.TEST_DATA.CURRENCIES),
    date: DataGenerator.randomDate(new Date(2024, 10, 1), new Date()),
    providerName: `Pharmacy ${DataGenerator.randomString(8)}`,
    treatmentType: 'Pharmacy',
    notes: `Prescription medication - ${DataGenerator.randomString(10)}`,
    prescriptionNumber: `RX-${DataGenerator.randomNumber(100000, 999999)}`,
    medicationName: `Medication ${DataGenerator.randomString(8)}`
  };
  
  medicalExpensePage.createMedicalExpense(authUser.token, pharmacyExpense);
  ThinkTime.medium();
  
  // Simulate user reviewing their submissions
  console.log('\n--- Post-creation Review ---');
  expensePage.getMyExpenses(authUser.token, { limit: 5 });
  ThinkTime.short();
  
  medicalExpensePage.getUserMedicalExpenses(authUser.token, { limit: 5 });
  ThinkTime.medium();
  
  console.log(`✅ Completed POST requests test cycle for ${authUser.user.email}`);
  console.log(`📝 Created expenses this session: ${createdExpenseIds.length} regular + ${createdMedicalExpenseIds.length} medical\n`);
}

/**
 * Teardown function - runs once after the test ends
 */
export function teardown(data) {
  console.log('\n🏁 POST Requests Performance Test Completed');
  console.log('📈 Check the summary report above for detailed metrics');
  console.log('🔍 Key endpoints tested:');
  console.log('   • POST /api/v1/expenses (regular expenses)');
  console.log('   • POST /api/v1/medical-expenses (medical expenses)');
  console.log('📊 Test scenarios covered:');
  console.log('   • Business expense creation');
  console.log('   • Medical expense creation');
  console.log('   • Travel expense creation');
  console.log('   • Office supplies expense creation');
  console.log('   • Pharmacy expense creation');
  console.log(`📝 Total expenses created: ${createdExpenseIds.length + createdMedicalExpenseIds.length}`);
  
  // Note: In a real environment, you might want to clean up created test data
  if (createdExpenseIds.length > 0 || createdMedicalExpenseIds.length > 0) {
    console.log('ℹ️ Note: Test data cleanup would be performed here in a real scenario');
  }
}