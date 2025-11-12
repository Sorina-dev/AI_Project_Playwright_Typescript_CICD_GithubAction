/**
 * K6 Performance Test - PUT Requests
 * Expense Management API - PUT Operations Test Suite
 * 
 * This test suite focuses on PUT request performance testing
 * Tests: /expenses (update expenses), /locations (update location)
 */

import { CONFIG } from '../config/config.js';
import { getRandomAuthenticatedUser } from '../utils/auth.js';
import { ThinkTime, DataGenerator } from '../utils/helpers.js';
import ExpensePage from '../pages/ExpensePage.js';
import LocationPage from '../pages/LocationPage.js';
import MedicalExpensePage from '../pages/MedicalExpensePage.js';

// Test configuration - focused on PUT requests
export const options = CONFIG.TEST_CONFIG.DEFAULT_LOAD;

// Page objects
const expensePage = new ExpensePage();
const locationPage = new LocationPage();
const medicalExpensePage = new MedicalExpensePage();

// Store created resources for update testing
let testResourceIds = {
  expenses: [],
  locations: [],
  medicalExpenses: []
};

/**
 * Setup function - runs once before the test starts
 */
export function setup() {
  console.log('🚀 Starting PUT Requests Performance Test');
  console.log(`📍 Target: ${CONFIG.BASE_URL}`);
  console.log('🎯 Testing PUT endpoints: /expenses, /locations');
  console.log('⏱️ Starting load test...\n');
  
  // Create some test resources for updating
  const authUser = getRandomAuthenticatedUser();
  if (authUser.token) {
    console.log('🔧 Setting up test resources for updates...');
    
    try {
      // Create test expenses
      for (let i = 0; i < 3; i++) {
        const expenseResponse = expensePage.createExpense(authUser.token);
        if (expenseResponse.createdExpense && expenseResponse.createdExpense.id) {
          testResourceIds.expenses.push(expenseResponse.createdExpense.id);
        }
      }
      
      // Create test locations
      for (let i = 0; i < 2; i++) {
        const locationResponse = locationPage.createLocation(authUser.token);
        if (locationResponse.createdLocation && locationResponse.createdLocation.id) {
          testResourceIds.locations.push(locationResponse.createdLocation.id);
        }
      }
      
      console.log(`✅ Created ${testResourceIds.expenses.length} test expenses and ${testResourceIds.locations.length} test locations`);
    } catch (error) {
      console.log('ℹ️ Some test resources creation failed - will create during test execution');
    }
  }
  
  return testResourceIds;
}

/**
 * Main test function - runs for each virtual user
 */
export default function (data) {
  // Get authenticated user for this session
  const authUser = getRandomAuthenticatedUser();
  
  if (!authUser.token) {
    console.error('❌ Failed to authenticate user, skipping test iteration');
    return;
  }
  
  console.log(`👤 Running PUT requests test for user: ${authUser.user.email}`);
  
  // Test 1: Update bulk expenses
  console.log('\n--- Test 1: Update Bulk Expenses ---');
  
  // First, create some expenses to update if we don't have any
  if (testResourceIds.expenses.length === 0) {
    console.log('📝 Creating expenses for update test...');
    for (let i = 0; i < 2; i++) {
      const expenseResponse = expensePage.createExpense(authUser.token);
      if (expenseResponse.createdExpense && expenseResponse.createdExpense.id) {
        testResourceIds.expenses.push(expenseResponse.createdExpense.id);
      }
    }
    ThinkTime.medium(); // Time to create resources
  }
  
  // Update multiple expenses
  const expenseUpdates = testResourceIds.expenses.slice(0, 3).map(expenseId => ({
    id: expenseId,
    description: `Updated expense ${DataGenerator.randomString(8)}`,
    amount: DataGenerator.randomAmount(50, 400),
    currency: DataGenerator.randomArrayElement(CONFIG.TEST_DATA.CURRENCIES),
    notes: `Updated on ${new Date().toISOString()} - Performance test`,
    status: DataGenerator.randomArrayElement(['Pending', 'Submitted']),
    updatedBy: authUser.user.email,
    lastModified: new Date().toISOString()
  }));
  
  if (expenseUpdates.length > 0) {
    expensePage.updateExpenses(authUser.token, expenseUpdates);
    ThinkTime.medium(); // User reviews update results
  }
  
  // Test 2: Update individual medical expense
  console.log('\n--- Test 2: Update Medical Expense ---');
  
  // Create a medical expense first, then update it
  const medicalExpenseResponse = medicalExpensePage.createMedicalExpense(authUser.token);
  ThinkTime.short();
  
  if (medicalExpenseResponse.createdExpense && medicalExpenseResponse.createdExpense.id) {
    const medicalUpdateData = {
      id: medicalExpenseResponse.createdExpense.id,
      description: `Updated medical expense ${DataGenerator.randomString(6)}`,
      amount: DataGenerator.randomAmount(100, 600),
      currency: DataGenerator.randomArrayElement(CONFIG.TEST_DATA.CURRENCIES),
      providerName: `Updated Provider ${DataGenerator.randomString(8)}`,
      notes: `Medical expense updated on ${new Date().toISOString()}`,
      treatmentType: DataGenerator.randomArrayElement(['Consultation', 'Treatment', 'Surgery', 'Pharmacy']),
      urgency: DataGenerator.randomArrayElement(['Low', 'Medium', 'High']),
      lastModified: new Date().toISOString()
    };
    
    medicalExpensePage.updateMedicalExpense(authUser.token, medicalUpdateData);
    ThinkTime.long(); // Medical updates require careful review
  }
  
  // Test 3: Update location
  console.log('\n--- Test 3: Update Location ---');
  
  // Create a location first if we don't have any, then update it
  if (testResourceIds.locations.length === 0) {
    console.log('📝 Creating location for update test...');
    const locationResponse = locationPage.createLocation(authUser.token);
    if (locationResponse.createdLocation && locationResponse.createdLocation.id) {
      testResourceIds.locations.push(locationResponse.createdLocation.id);
    }
    ThinkTime.medium();
  }
  
  if (testResourceIds.locations.length > 0) {
    const locationId = testResourceIds.locations[0];
    const locationUpdateData = {
      id: locationId,
      name: `Updated Office ${DataGenerator.randomString(8)}`,
      address: `${DataGenerator.randomNumber(1, 999)} Updated Street, Suite ${DataGenerator.randomNumber(100, 999)}`,
      city: DataGenerator.randomArrayElement(CONFIG.TEST_DATA.LOCATIONS.CITIES),
      country: DataGenerator.randomArrayElement(CONFIG.TEST_DATA.LOCATIONS.COUNTRIES),
      postalCode: DataGenerator.randomString(6).toUpperCase(),
      phone: `+1-${DataGenerator.randomNumber(100, 999)}-${DataGenerator.randomNumber(100, 999)}-${DataGenerator.randomNumber(1000, 9999)}`,
      email: `office.${DataGenerator.randomString(6).toLowerCase()}@company.com`,
      capacity: DataGenerator.randomNumber(10, 200),
      amenities: DataGenerator.randomArrayElement([
        ['WiFi', 'Parking', 'Cafeteria'],
        ['WiFi', 'Gym', 'Meeting Rooms'],
        ['Parking', 'Restaurant', 'Security']
      ]),
      lastModified: new Date().toISOString(),
      updatedBy: authUser.user.email
    };
    
    locationPage.updateLocation(authUser.token, locationUpdateData);
    ThinkTime.medium(); // User verifies location updates
  }
  
  // Additional realistic update scenarios
  
  // Test 4: Update expense with additional attachments/details
  console.log('\n--- Test 4: Update Expense with Additional Details ---');
  
  // Create a fresh expense for detailed update
  const detailedExpenseResponse = expensePage.createExpense(authUser.token, {
    description: `Detailed expense ${DataGenerator.randomString(6)}`,
    amount: DataGenerator.randomAmount(200, 800),
    currency: DataGenerator.randomArrayElement(CONFIG.TEST_DATA.CURRENCIES),
    expenseType: DataGenerator.randomArrayElement(CONFIG.TEST_DATA.EXPENSE_TYPES),
    date: DataGenerator.randomDate(new Date(2024, 10, 1), new Date())
  });
  
  ThinkTime.short();
  
  if (detailedExpenseResponse.createdExpense && detailedExpenseResponse.createdExpense.id) {
    const detailedUpdate = [{
      id: detailedExpenseResponse.createdExpense.id,
      description: `Comprehensive update ${DataGenerator.randomString(8)}`,
      amount: DataGenerator.randomAmount(250, 900),
      notes: `Detailed expense updated with receipt and approval - ${new Date().toISOString()}`,
      receiptNumber: `RCP-${DataGenerator.randomNumber(100000, 999999)}`,
      approvalRequired: true,
      businessJustification: `Updated business justification - ${DataGenerator.randomString(20)}`,
      projectCode: `PROJ-${DataGenerator.randomNumber(1000, 9999)}`,
      department: DataGenerator.randomArrayElement(['IT', 'HR', 'Finance', 'Marketing', 'Sales']),
      costCenter: `CC-${DataGenerator.randomNumber(1000, 9999)}`,
      lastModified: new Date().toISOString()
    }];
    
    expensePage.updateExpenses(authUser.token, detailedUpdate);
    ThinkTime.long(); // Complex updates require thorough review
  }
  
  // Test 5: Batch update multiple locations
  console.log('\n--- Test 5: Batch Update Location Details ---');
  
  // Create another location for batch testing
  const locationResponse = locationPage.createLocation(authUser.token);
  ThinkTime.short();
  
  if (locationResponse.createdLocation && locationResponse.createdLocation.id) {
    // Update with operational details
    const operationalUpdate = {
      id: locationResponse.createdLocation.id,
      name: `Operations Center ${DataGenerator.randomString(6)}`,
      operatingHours: '8:00 AM - 6:00 PM',
      timezone: 'UTC',
      managerEmail: `manager.${DataGenerator.randomString(6).toLowerCase()}@company.com`,
      emergencyContact: `+1-${DataGenerator.randomNumber(100, 999)}-${DataGenerator.randomNumber(100, 999)}-${DataGenerator.randomNumber(1000, 9999)}`,
      securityLevel: DataGenerator.randomArrayElement(['Low', 'Medium', 'High', 'Restricted']),
      lastInspection: DataGenerator.randomDate(new Date(2024, 8, 1), new Date()),
      nextInspection: DataGenerator.randomDate(new Date(), new Date(2025, 5, 1)),
      lastModified: new Date().toISOString()
    };
    
    locationPage.updateLocation(authUser.token, operationalUpdate);
    ThinkTime.medium();
  }
  
  // Validation: Check updated resources
  console.log('\n--- Validation: Review Updated Resources ---');
  
  // Review updated expenses
  expensePage.getMyExpenses(authUser.token, { 
    limit: 10,
    sortBy: 'lastModified',
    order: 'desc'
  });
  ThinkTime.medium();
  
  // Review location changes if user has access
  try {
    locationPage.getLocations(authUser.token, { 
      limit: 5,
      includeRecentlyModified: true 
    });
  } catch (error) {
    console.log('ℹ️ Location listing might be restricted for this user');
  }
  ThinkTime.short();
  
  console.log(`✅ Completed PUT requests test cycle for ${authUser.user.email}\n`);
}

/**
 * Teardown function - runs once after the test ends
 */
export function teardown(data) {
  console.log('\n🏁 PUT Requests Performance Test Completed');
  console.log('📈 Check the summary report above for detailed metrics');
  console.log('🔍 Key endpoints tested:');
  console.log('   • PUT /api/v1/expenses (bulk expense updates)');
  console.log('   • PUT /api/v1/locations (location updates)');
  console.log('   • PUT /api/v1/medical-expenses (medical expense updates)');
  console.log('📊 Test scenarios covered:');
  console.log('   • Bulk expense updates');
  console.log('   • Individual medical expense updates');
  console.log('   • Location information updates');
  console.log('   • Detailed expense modifications');
  console.log('   • Operational location updates');
  console.log(`📝 Test resources used: ${data.expenses.length} expenses + ${data.locations.length} locations`);
  
  // Note: In a real environment, cleanup of test data would be performed
  console.log('ℹ️ Note: Test resource cleanup would be performed here in a real scenario');
}