import { test, expect } from '@playwright/test';
import { 
  UsersClient, 
  UserFactory, 
  LoggerUtils, 
  PerformanceUtils, 
  ValidationUtils,
  testData 
} from '../../src';

/**
 * JSONPlaceholder Users API Tests
 * 
 * Comprehensive test suite for user management operations using the new API testing framework.
 * Tests include CRUD operations, validation, error handling, and performance metrics.
 */

test.describe('📚 JSONPlaceholder Users API Tests', () => {
  let usersClient: UsersClient;

  test.beforeAll(async () => {
    LoggerUtils.setLogLevel('info');
    console.log('🚀 Starting JSONPlaceholder Users API test suite');
  });

  test.beforeEach(async ({ request }) => {
    usersClient = new UsersClient(request);
    LoggerUtils.debug('🔧 Initialized UsersClient for test');
    
    // Add small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  });

  test.describe('🔍 GET Operations - User Retrieval', () => {

    test('should retrieve all users successfully', async () => {
      const testName = 'getAllUsers';
      PerformanceUtils.startMeasurement(testName);
      
      const response = await usersClient.getAllUsers();
      PerformanceUtils.recordRequest(testName, '/users', response.responseTime, response.status === 200);
      
      // Validate response
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBeTruthy();
      expect(response.data.length).toBeGreaterThan(0);
      
      // Validate response time
      expect(response.responseTime).toBeLessThan(5000);
      
      // Validate user structure
      const firstUser = response.data[0];
      if (firstUser) {
        usersClient.validateUserStructure(firstUser);
        
        // Validate specific field types and formats
        expect(typeof firstUser.email).toBe('string');
        expect(ValidationUtils.isValidEmail(firstUser.email)).toBeTruthy();
      }
      
      PerformanceUtils.endMeasurement(testName);
      LoggerUtils.info(`✅ Retrieved ${response.data.length} users successfully`);
    });

    test('should retrieve user by valid ID', async () => {
      const userId = 1;
      const testName = 'getUserById';
      PerformanceUtils.startMeasurement(testName);
      
      const response = await usersClient.getUserById(userId);
      PerformanceUtils.recordRequest(testName, `/users/${userId}`, response.responseTime, response.status === 200);
      
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(userId);
      
      usersClient.validateUserStructure(response.data);
      
      PerformanceUtils.endMeasurement(testName);
      LoggerUtils.info(`✅ Retrieved user ${userId}: ${response.data.name}`);
    });

    test('should return 404 for non-existent user', async () => {
      const invalidUserId = 999999;
      const testName = 'getUserNotFound';
      PerformanceUtils.startMeasurement(testName);
      
      const response = await usersClient.getUserById(invalidUserId);
      PerformanceUtils.recordRequest(testName, `/users/${invalidUserId}`, response.responseTime, response.status === 404);
      
      expect(response.status).toBe(404);
      
      PerformanceUtils.endMeasurement(testName);
      LoggerUtils.info('✅ 404 error handled correctly for non-existent user');
    });

  });

  test.describe('📝 POST Operations - User Creation', () => {

    test('should create user with valid data', async () => {
      const userData = UserFactory.createUser();
      delete userData.id; // Remove ID for creation
      const testName = 'createUser';
      PerformanceUtils.startMeasurement(testName);
      
      const response = await usersClient.createUser(userData);
      PerformanceUtils.recordRequest(testName, '/users', response.responseTime, response.status === 201);
      
      expect(response.status).toBe(201);
      expect(response.data.name).toBe(userData.name);
      expect(response.data.email).toBe(userData.email);
      expect(response.data.id).toBeDefined();
      
      PerformanceUtils.endMeasurement(testName);
      LoggerUtils.info(`✅ Created user: ${response.data.name} with ID: ${response.data.id}`);
    });

    test('should create user with minimal required data', async () => {
      const minimalUserData = {
        name: 'Test User Minimal',
        email: 'minimal@example.com'
      };
      
      const response = await usersClient.createUser(minimalUserData);
      
      expect(response.status).toBe(201);
      expect(response.data.name).toBe(minimalUserData.name);
      expect(response.data.email).toBe(minimalUserData.email);
      
      LoggerUtils.info('✅ Created user with minimal data successfully');
    });

    test('should handle user creation with invalid data gracefully', async () => {
      const invalidUserData = UserFactory.createInvalidUser();
      
      try {
        const response = await usersClient.createUser(invalidUserData);
        
        // JSONPlaceholder doesn't validate data strictly, so it might still return 201
        // This test verifies our framework handles the response properly
        expect([200, 201, 400]).toContain(response.status);
        
        LoggerUtils.warn('API accepted invalid data - this is expected behavior for JSONPlaceholder');
      } catch (error) {
        LoggerUtils.error('Error during invalid data test:', error);
      }
    });

  });

  test.describe('🔄 PUT/PATCH Operations - User Updates', () => {

    test('should update user with PUT method', async () => {
      const userId = 1;
      const updatedData = UserFactory.createUser({ 
        id: userId,
        name: 'Updated User Name PUT',
        email: 'updated.put@example.com'
      });
      
      const response = await usersClient.updateUser(userId, updatedData);
      
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(userId);
      expect(response.data.name).toBe(updatedData.name);
      expect(response.data.email).toBe(updatedData.email);
      
      LoggerUtils.info(`✅ Updated user ${userId} with PUT method`);
    });

    test('should partially update user with PATCH method', async () => {
      const userId = 2;
      const partialUpdate = { 
        name: 'Partially Updated Name',
        phone: '+1-555-PATCH'
      };
      
      const response = await usersClient.patchUser(userId, partialUpdate);
      
      expect(response.status).toBe(200);
      expect(response.data.name).toBe(partialUpdate.name);
      
      LoggerUtils.info(`✅ Partially updated user ${userId} with PATCH method`);
    });

  });

  test.describe('🗑️ DELETE Operations - User Removal', () => {

    test('should delete user successfully', async () => {
      const userId = 1;
      const testName = 'deleteUser';
      PerformanceUtils.startMeasurement(testName);
      
      const response = await usersClient.deleteUser(userId);
      PerformanceUtils.recordRequest(testName, `/users/${userId}`, response.responseTime, response.status === 200);
      
      expect(response.status).toBe(200);
      
      PerformanceUtils.endMeasurement(testName);
      LoggerUtils.info(`✅ Deleted user ${userId} successfully`);
    });

  });

  test.describe('🔗 Related Data Operations', () => {

    test('should retrieve user posts', async () => {
      const userId = 1;
      
      const response = await usersClient.getUserPosts(userId);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBeTruthy();
      
      if (response.data.length > 0) {
        const firstPost = response.data[0];
        expect(firstPost).toHaveProperty('id');
        expect(firstPost).toHaveProperty('title');
        expect(firstPost).toHaveProperty('body');
        expect(firstPost).toHaveProperty('userId');
        if (firstPost) {
          expect(firstPost.userId).toBe(userId);
        }
      }
      
      LoggerUtils.info(`✅ Retrieved ${response.data.length} posts for user ${userId}`);
    });

    test('should retrieve user albums', async () => {
      const userId = 1;
      
      const response = await usersClient.getUserAlbums(userId);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBeTruthy();
      
      LoggerUtils.info(`✅ Retrieved ${response.data.length} albums for user ${userId}`);
    });

    test('should retrieve user todos', async () => {
      const userId = 1;
      
      const response = await usersClient.getUserTodos(userId);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBeTruthy();
      
      LoggerUtils.info(`✅ Retrieved ${response.data.length} todos for user ${userId}`);
    });

  });

  test.describe('📊 Performance & Load Tests', () => {

    test('should handle multiple concurrent user requests', async () => {
      const testName = 'concurrentUserRequests';
      PerformanceUtils.startMeasurement(testName);
      
      const userIds = [1, 2, 3, 4, 5];
      
      const promises = userIds.map(async (userId) => {
        const response = await usersClient.getUserById(userId);
        PerformanceUtils.recordRequest(testName, `/users/${userId}`, response.responseTime, response.status === 200);
        return response;
      });
      
      const responses = await Promise.all(promises);
      
      responses.forEach((response: any, index: number) => {
        expect(response.status).toBe(200);
        expect(response.data.id).toBe(userIds[index]);
      });
      
      const metrics = PerformanceUtils.endMeasurement(testName);
      
      // Assert performance thresholds
      expect(metrics?.averageResponseTime).toBeLessThan(3000);
      expect(metrics?.successfulRequests).toBe(userIds.length);
      
      LoggerUtils.info(`✅ Completed ${userIds.length} concurrent requests successfully`);
    });

  });

  test.describe('🛡️ Data Validation & Security', () => {

    test('should validate user data structure comprehensively', async () => {
      const response = await usersClient.getUserById(1);
      const user = response.data;
      
      // Validate required fields using our validation utility
      const validation = ValidationUtils.validateRequiredFields(user, 
        ['id', 'name', 'username', 'email']
      );
      
      expect(validation.isValid).toBeTruthy();
      
      // Validate email format
      expect(ValidationUtils.isValidEmail(user.email)).toBeTruthy();
      
      // Validate nested address structure
      if (user.address) {
        expect(user.address).toHaveProperty('street');
        expect(user.address).toHaveProperty('city');
        expect(user.address).toHaveProperty('zipcode');
        expect(user.address.geo).toHaveProperty('lat');
        expect(user.address.geo).toHaveProperty('lng');
      }
      
      LoggerUtils.info('✅ User data structure validation completed');
    });

    test('should handle special characters in user data', async () => {
      const specialCharData = UserFactory.createUser({
        name: testData.specialCharacters.unicode,
        email: 'unicode.test@example.com'
      });
      
      const response = await usersClient.createUser(specialCharData);
      
      expect([200, 201]).toContain(response.status);
      
      LoggerUtils.info('✅ Special character handling test completed');
    });

  });

  test.afterAll(async () => {
    LoggerUtils.info('🏁 JSONPlaceholder Users API test suite completed');
    PerformanceUtils.clearMetrics();
  });

});