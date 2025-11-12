/**
 * Medical Expense Page Object for K6 Performance Tests
 * Expense Management API - Medical Expense Operations
 * 
 * This class handles medical expense-related API operations
 */

import { BasePage } from './BasePage.js';
import { CONFIG } from '../config/config.js';
import { ResponseValidator, DataGenerator } from '../utils/helpers.js';

export class MedicalExpensePage extends BasePage {
  
  /**
   * Get available amount for medical expenses
   * @param {String} token - Authentication token
   * @returns {Object} HTTP response
   */
  getAvailableAmount(token) {
    console.log('💊 Getting available medical expense amount...');
    
    const response = this.get(
      CONFIG.ENDPOINTS.MEDICAL_EXPENSES_AVAILABLE,
      this.getAuthHeaders(token)
    );
    
    ResponseValidator.validateGetResponse(response, 'Get Medical Available Amount');
    
    if (response.status === 200) {
      try {
        const amountData = JSON.parse(response.body);
        console.log(`✅ Available medical budget: ${amountData.amount || amountData.availableAmount || 'Unknown'}`);
      } catch (e) {
        console.error('❌ Failed to parse available amount data');
      }
    }
    
    return response;
  }
  
  /**
   * Create new medical expense
   * @param {String} token - Authentication token
   * @param {Object} medicalExpenseData - Medical expense data (optional, will generate random if not provided)
   * @returns {Object} HTTP response
   */
  createMedicalExpense(token, medicalExpenseData = null) {
    const medicalExpense = medicalExpenseData || DataGenerator.randomMedicalExpense();
    
    console.log(`🏥 Creating medical expense: ${medicalExpense.description} - ${medicalExpense.amount} ${medicalExpense.currency}`);
    
    const response = this.post(
      CONFIG.ENDPOINTS.MEDICAL_EXPENSES,
      medicalExpense,
      this.getAuthHeaders(token)
    );
    
    ResponseValidator.validatePostResponse(response, 'Create Medical Expense');
    
    if (response.status === 201 || response.status === 200) {
      try {
        const createdExpense = JSON.parse(response.body);
        console.log(`✅ Created medical expense with ID: ${createdExpense.id || createdExpense._id || 'Unknown'}`);
        return { ...response, createdExpense };
      } catch (e) {
        console.error('❌ Failed to parse created medical expense data');
      }
    }
    
    return response;
  }
  
  /**
   * Update medical expense
   * @param {String} token - Authentication token
   * @param {Object} updateData - Update data
   * @returns {Object} HTTP response
   */
  updateMedicalExpense(token, updateData) {
    console.log(`📝 Updating medical expense...`);
    
    const response = this.put(
      CONFIG.ENDPOINTS.MEDICAL_EXPENSES,
      updateData,
      this.getAuthHeaders(token)
    );
    
    ResponseValidator.validatePutResponse(response, 'Update Medical Expense');
    
    if (response.status === 200) {
      console.log(`✅ Successfully updated medical expense`);
    }
    
    return response;
  }
  
  /**
   * Get user's medical expenses
   * @param {String} token - Authentication token
   * @param {Object} filters - Filter parameters
   * @returns {Object} HTTP response
   */
  getUserMedicalExpenses(token, filters = {}) {
    console.log('🔍 Getting user medical expenses...');
    
    const response = this.get(
      CONFIG.ENDPOINTS.MEDICAL_EXPENSES + '/user',
      this.getAuthHeaders(token),
      filters
    );
    
    ResponseValidator.validateGetResponse(response, 'Get User Medical Expenses');
    
    if (response.status === 200) {
      try {
        const expenses = JSON.parse(response.body);
        const count = Array.isArray(expenses) ? expenses.length : expenses.count || 'Unknown';
        console.log(`✅ Retrieved ${count} medical expenses`);
      } catch (e) {
        console.error('❌ Failed to parse medical expenses data');
      }
    }
    
    return response;
  }
  
  /**
   * Delete medical expense
   * @param {String} token - Authentication token
   * @param {String} expenseId - Expense ID to delete
   * @returns {Object} HTTP response
   */
  deleteMedicalExpense(token, expenseId) {
    console.log(`🗑️ Deleting medical expense: ${expenseId}`);
    
    const response = this.delete(
      `${CONFIG.ENDPOINTS.MEDICAL_EXPENSES}/${expenseId}`,
      this.getAuthHeaders(token)
    );
    
    ResponseValidator.validateDeleteResponse(response, 'Delete Medical Expense');
    
    if (response.status === 200 || response.status === 204) {
      console.log(`✅ Successfully deleted medical expense: ${expenseId}`);
    }
    
    return response;
  }
  
  /**
   * Get medical expense budget information
   * @param {String} token - Authentication token
   * @returns {Object} HTTP response
   */
  getMedicalBudget(token) {
    console.log('💰 Getting medical expense budget...');
    
    const response = this.get(
      CONFIG.ENDPOINTS.MEDICAL_EXPENSES + '/budgets',
      this.getAuthHeaders(token)
    );
    
    ResponseValidator.validateGetResponse(response, 'Get Medical Budget');
    
    if (response.status === 200) {
      try {
        const budget = JSON.parse(response.body);
        console.log(`✅ Retrieved medical budget information`);
      } catch (e) {
        console.error('❌ Failed to parse medical budget data');
      }
    }
    
    return response;
  }
  
  /**
   * Get total available amount (including extra budget)
   * @param {String} token - Authentication token
   * @param {Object} filters - Filter parameters (year, etc.)
   * @returns {Object} HTTP response
   */
  getTotalAvailableAmount(token, filters = {}) {
    console.log('📊 Getting total available medical amount...');
    
    const response = this.get(
      CONFIG.ENDPOINTS.MEDICAL_EXPENSES + '/total-available-amount',
      this.getAuthHeaders(token),
      filters
    );
    
    ResponseValidator.validateGetResponse(response, 'Get Total Available Amount');
    
    if (response.status === 200) {
      try {
        const totalData = JSON.parse(response.body);
        console.log(`✅ Total available: ${totalData.totalAmount || 'Unknown'}`);
      } catch (e) {
        console.error('❌ Failed to parse total amount data');
      }
    }
    
    return response;
  }
}

export default MedicalExpensePage;