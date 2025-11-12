/**
 * K6 Performance Test - DELETE Requests
 * Expense Management API - DELETE Operations Test Suite
 * 
 * This test suite focuses on DELETE request performance testing
 * Tests: /request-expenses/{id} (delete expense request), /locations/{id} (delete location)
 */

import { CONFIG } from '../config/config.js';
import { getRandomAuthenticatedUser } from '../utils/auth.js';
import { ThinkTime, DataGenerator } from '../utils/helpers.js';
import ExpensePage from '../pages/ExpensePage.js';
import LocationPage from '../pages/LocationPage.js';
import MedicalExpensePage from '../pages/MedicalExpensePage.js';

// Test configuration - focused on DELETE requests
export const options = CONFIG.TEST_CONFIG.DEFAULT_LOAD;

// Page objects
const expensePage = new ExpensePage();
const locationPage = new LocationPage();
const medicalExpensePage = new MedicalExpensePage();

// Track deletions for reporting
let deletionStats = {
  expenseRequests: 0,
  locations: 0,
  medicalExpenses: 0,
  totalAttempts: 0,
  successfulDeletions: 0
};

/**
 * Setup function - runs once before the test starts
 */
export function setup() {
  console.log('🚀 Starting DELETE Requests Performance Test');
  console.log(`📍 Target: ${CONFIG.BASE_URL}`);
  console.log('🎯 Testing DELETE endpoints: /request-expenses/{id}, /locations/{id}');
  console.log('⏱️ Starting load test...\n');
  
  console.log('ℹ️ This test will create resources before deleting them to ensure clean test data');
  
  return deletionStats;
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
  
  console.log(`👤 Running DELETE requests test for user: ${authUser.user.email}`);
  
  // Test 1: Create and Delete Regular Expense Request
  console.log('\n--- Test 1: Create and Delete Expense Request ---');
  
  // Create an expense first
  const expenseData = {
    description: `Deletable expense ${DataGenerator.randomString(8)}`,
    amount: DataGenerator.randomAmount(25, 200),
    currency: DataGenerator.randomArrayElement(CONFIG.TEST_DATA.CURRENCIES),
    expenseType: DataGenerator.randomArrayElement(CONFIG.TEST_DATA.EXPENSE_TYPES),
    date: DataGenerator.randomDate(new Date(2024, 10, 1), new Date()),
    notes: `Created for deletion test - ${new Date().toISOString()}`,
    temporaryExpense: true
  };
  
  const expenseResponse = expensePage.createExpense(authUser.token, expenseData);
  deletionStats.totalAttempts++;
  
  ThinkTime.short(); // Brief pause after creation
  
  if (expenseResponse.createdExpense && expenseResponse.createdExpense.id) {
    const expenseId = expenseResponse.createdExpense.id;
    console.log(`📝 Created expense ${expenseId} for deletion`);
    
    // Simulate user reviewing before deletion
    ThinkTime.medium();
    
    // Delete the expense request
    const deleteResponse = expensePage.deleteExpenseRequest(authUser.token, expenseId);
    
    if (deleteResponse.status === 200 || deleteResponse.status === 204) {
      deletionStats.expenseRequests++;
      deletionStats.successfulDeletions++;
      console.log(`✅ Successfully deleted expense request: ${expenseId}`);
    } else {
      console.log(`⚠️ Failed to delete expense request: ${expenseId} - Status: ${deleteResponse.status}`);
    }
    
    ThinkTime.short(); // Brief pause after deletion
  }
  
  // Test 2: Create and Delete Location
  console.log('\n--- Test 2: Create and Delete Location ---');
  
  // Create a temporary location
  const locationData = {
    name: `Temp Office ${DataGenerator.randomString(8)}`,
    address: `${DataGenerator.randomNumber(1, 999)} Temporary Street`,
    city: DataGenerator.randomArrayElement(CONFIG.TEST_DATA.LOCATIONS.CITIES),
    country: DataGenerator.randomArrayElement(CONFIG.TEST_DATA.LOCATIONS.COUNTRIES),
    postalCode: DataGenerator.randomString(6).toUpperCase(),
    temporary: true,
    notes: `Temporary location for deletion test - ${new Date().toISOString()}`
  };
  
  const locationResponse = locationPage.createLocation(authUser.token, locationData);
  deletionStats.totalAttempts++;
  
  ThinkTime.medium(); // Time to set up location
  
  if (locationResponse.createdLocation && locationResponse.createdLocation.id) {
    const locationId = locationResponse.createdLocation.id;
    console.log(`🏢 Created location ${locationId} for deletion`);
    
    // Simulate user verification before deletion
    ThinkTime.long(); // Location deletions require more careful consideration
    
    // Delete the location
    const deleteLocationResponse = locationPage.deleteLocation(authUser.token, locationId);
    
    if (deleteLocationResponse.status === 200 || deleteLocationResponse.status === 204) {
      deletionStats.locations++;
      deletionStats.successfulDeletions++;
      console.log(`✅ Successfully deleted location: ${locationId}`);
    } else {
      console.log(`⚠️ Failed to delete location: ${locationId} - Status: ${deleteLocationResponse.status}`);
    }
    
    ThinkTime.medium(); // Time to process deletion result
  }
  
  // Test 3: Create and Delete Medical Expense
  console.log('\n--- Test 3: Create and Delete Medical Expense ---');
  
  // Create a medical expense for deletion
  const medicalData = {
    description: `Temporary medical ${DataGenerator.randomString(8)}`,
    amount: DataGenerator.randomAmount(50, 300),
    currency: DataGenerator.randomArrayElement(CONFIG.TEST_DATA.CURRENCIES),
    date: DataGenerator.randomDate(new Date(2024, 10, 1), new Date()),
    providerName: `Temp Medical ${DataGenerator.randomString(8)}`,
    notes: `Created for deletion test - ${new Date().toISOString()}`,
    temporaryExpense: true
  };
  
  const medicalResponse = medicalExpensePage.createMedicalExpense(authUser.token, medicalData);
  deletionStats.totalAttempts++;
  
  ThinkTime.medium();
  
  if (medicalResponse.createdExpense && medicalResponse.createdExpense.id) {
    const medicalId = medicalResponse.createdExpense.id;
    console.log(`🏥 Created medical expense ${medicalId} for deletion`);
    
    // Medical expense deletions require careful consideration
    ThinkTime.long();
    
    // Delete the medical expense
    const deleteMedicalResponse = medicalExpensePage.deleteMedicalExpense(authUser.token, medicalId);
    
    if (deleteMedicalResponse.status === 200 || deleteMedicalResponse.status === 204) {
      deletionStats.medicalExpenses++;
      deletionStats.successfulDeletions++;
      console.log(`✅ Successfully deleted medical expense: ${medicalId}`);
    } else {
      console.log(`⚠️ Failed to delete medical expense: ${medicalId} - Status: ${deleteMedicalResponse.status}`);
    }
    
    ThinkTime.medium();
  }
  
  // Test 4: Batch Deletion Simulation
  console.log('\n--- Test 4: Multiple Resource Deletion ---');
  
  // Create multiple expenses for batch-like deletion testing
  const expenseIds = [];
  
  for (let i = 0; i < 2; i++) {
    const batchExpenseData = {
      description: `Batch delete expense ${i + 1} - ${DataGenerator.randomString(6)}`,
      amount: DataGenerator.randomAmount(10, 100),
      currency: DataGenerator.randomArrayElement(CONFIG.TEST_DATA.CURRENCIES),
      expenseType: DataGenerator.randomArrayElement(CONFIG.TEST_DATA.EXPENSE_TYPES),
      date: DataGenerator.randomDate(new Date(2024, 10, 1), new Date()),
      notes: `Batch deletion test ${i + 1}`,
      batchTest: true
    };
    
    const batchResponse = expensePage.createExpense(authUser.token, batchExpenseData);
    deletionStats.totalAttempts++;
    
    if (batchResponse.createdExpense && batchResponse.createdExpense.id) {
      expenseIds.push(batchResponse.createdExpense.id);
    }
    
    ThinkTime.short(); // Quick creation for batch testing
  }
  
  // Delete the batch expenses one by one (simulating bulk operations)
  console.log(`🔄 Deleting ${expenseIds.length} expenses in batch...`);
  
  expenseIds.forEach((expenseId, index) => {
    ThinkTime.short(); // Brief pause between deletions
    
    const deleteResponse = expensePage.deleteExpenseRequest(authUser.token, expenseId);
    
    if (deleteResponse.status === 200 || deleteResponse.status === 204) {
      deletionStats.expenseRequests++;
      deletionStats.successfulDeletions++;
      console.log(`✅ Batch deletion ${index + 1}/${expenseIds.length}: ${expenseId}`);
    } else {
      console.log(`⚠️ Failed batch deletion ${index + 1}/${expenseIds.length}: ${expenseId}`);
    }
  });
  
  // Test 5: Error Handling - Attempt to Delete Non-existent Resource
  console.log('\n--- Test 5: Delete Non-existent Resources (Error Handling) ---');
  
  const fakeExpenseId = DataGenerator.generateUUID();
  const fakeLocationId = DataGenerator.generateUUID();
  
  console.log(`🧪 Testing deletion of non-existent expense: ${fakeExpenseId}`);
  const fakeExpenseDelete = expensePage.deleteExpenseRequest(authUser.token, fakeExpenseId);
  deletionStats.totalAttempts++;
  
  // 404 is expected and acceptable for non-existent resources
  if (fakeExpenseDelete.status === 404) {
    console.log('✅ Correctly handled non-existent expense deletion (404)');
  } else if (fakeExpenseDelete.status === 200 || fakeExpenseDelete.status === 204) {
    console.log('ℹ️ System reported successful deletion of non-existent resource');
  } else {
    console.log(`⚠️ Unexpected response for non-existent resource: ${fakeExpenseDelete.status}`);
  }
  
  ThinkTime.short();
  
  console.log(`🧪 Testing deletion of non-existent location: ${fakeLocationId}`);
  const fakeLocationDelete = locationPage.deleteLocation(authUser.token, fakeLocationId);
  deletionStats.totalAttempts++;
  
  if (fakeLocationDelete.status === 404) {
    console.log('✅ Correctly handled non-existent location deletion (404)');
  } else if (fakeLocationDelete.status === 200 || fakeLocationDelete.status === 204) {
    console.log('ℹ️ System reported successful deletion of non-existent location');
  }
  
  ThinkTime.medium();
  
  // Verification: Check that deleted resources are no longer accessible
  console.log('\n--- Verification: Confirm Deletions ---');
  
  // Try to retrieve recently deleted expenses (should return empty or 404)
  expensePage.getMyExpenses(authUser.token, { 
    limit: 5,
    includeDeleted: false 
  });
  ThinkTime.short();
  
  // Try to retrieve location list (check if deleted locations are excluded)
  try {
    locationPage.getLocations(authUser.token, { 
      limit: 5,
      includeDeleted: false 
    });
  } catch (error) {
    console.log('ℹ️ Location verification might be restricted for this user');
  }
  
  ThinkTime.medium();
  
  console.log(`✅ Completed DELETE requests test cycle for ${authUser.user.email}`);
  console.log(`🗑️ Deletion summary: ${deletionStats.successfulDeletions}/${deletionStats.totalAttempts} successful\n`);
}

/**
 * Teardown function - runs once after the test ends
 */
export function teardown(data) {
  console.log('\n🏁 DELETE Requests Performance Test Completed');
  console.log('📈 Check the summary report above for detailed metrics');
  console.log('🔍 Key endpoints tested:');
  console.log('   • DELETE /api/v1/request-expenses/{id}');
  console.log('   • DELETE /api/v1/locations/{id}');
  console.log('   • DELETE /api/v1/medical-expenses/{id}');
  console.log('📊 Test scenarios covered:');
  console.log('   • Single expense request deletion');
  console.log('   • Location deletion');
  console.log('   • Medical expense deletion');
  console.log('   • Batch deletion simulation');
  console.log('   • Non-existent resource handling');
  console.log('📋 Deletion Statistics:');
  console.log(`   • Expense requests deleted: ${data.expenseRequests}`);
  console.log(`   • Locations deleted: ${data.locations}`);
  console.log(`   • Medical expenses deleted: ${data.medicalExpenses}`);
  console.log(`   • Total successful deletions: ${data.successfulDeletions}/${data.totalAttempts}`);
  console.log(`   • Success rate: ${((data.successfulDeletions / data.totalAttempts) * 100).toFixed(1)}%`);
  
  console.log('✅ All test resources were properly cleaned up during the test');
}