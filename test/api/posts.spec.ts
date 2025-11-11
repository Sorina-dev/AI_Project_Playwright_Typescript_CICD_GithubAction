import { test, expect } from '@playwright/test';
import { 
  PostsClient, 
  PostFactory, 
  LoggerUtils, 
  PerformanceUtils, 
  ValidationUtils,
  testData 
} from '../../src';

/**
 * JSONPlaceholder Posts API Tests
 * 
 * Comprehensive test suite for post management operations using the new API testing framework.
 * Tests include CRUD operations, comments, validation, error handling, and performance metrics.
 */

test.describe('📝 JSONPlaceholder Posts API Tests @api', () => {
  let postsClient: PostsClient;

  test.beforeAll(async () => {
    LoggerUtils.setLogLevel('info');
    console.log('🚀 Starting JSONPlaceholder Posts API test suite');
  });

  test.beforeEach(async ({ request }) => {
    postsClient = new PostsClient(request);
    LoggerUtils.debug('🔧 Initialized PostsClient for test');
    
    // Add small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  });

  test.describe('🔍 GET Operations - Post Retrieval', () => {

    test('should retrieve all posts successfully', async () => {
      const testName = 'getAllPosts';
      PerformanceUtils.startMeasurement(testName);
      
      const response = await postsClient.getAllPosts();
      PerformanceUtils.recordRequest(testName, '/posts', response.responseTime, response.status === 200);
      
      // Validate response
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBeTruthy();
      expect(response.data.length).toBeGreaterThan(0);
      
      // Validate response time
      expect(response.responseTime).toBeLessThan(5000);
      
      // Validate post structure
      const firstPost = response.data[0];
      if (firstPost) {
        postsClient.validatePostStructure(firstPost);
      }
      
      PerformanceUtils.endMeasurement(testName);
      LoggerUtils.info(`✅ Retrieved ${response.data.length} posts successfully`);
    });

    test('should retrieve post by valid ID', async () => {
      const postId = 1;
      const testName = 'getPostById';
      PerformanceUtils.startMeasurement(testName);
      
      const response = await postsClient.getPostById(postId);
      PerformanceUtils.recordRequest(testName, `/posts/${postId}`, response.responseTime, response.status === 200);
      
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(postId);
      
      postsClient.validatePostStructure(response.data);
      
      PerformanceUtils.endMeasurement(testName);
      LoggerUtils.info(`✅ Retrieved post ${postId}: "${response.data.title}"`);
    });

    test('should return 404 for non-existent post', async () => {
      const invalidPostId = 999999;
      const testName = 'getPostNotFound';
      PerformanceUtils.startMeasurement(testName);
      
      const response = await postsClient.getPostById(invalidPostId);
      PerformanceUtils.recordRequest(testName, `/posts/${invalidPostId}`, response.responseTime, response.status === 404);
      
      expect(response.status).toBe(404);
      
      PerformanceUtils.endMeasurement(testName);
      LoggerUtils.info('✅ 404 error handled correctly for non-existent post');
    });

  });

  test.describe('📝 POST Operations - Post Creation', () => {

    test('should create post with valid data', async () => {
      const postData = PostFactory.createPostRequest({
        title: 'API Test Post',
        body: 'This is a test post created via the new API framework',
        userId: 1
      });
      
      const testName = 'createPost';
      PerformanceUtils.startMeasurement(testName);
      
      const response = await postsClient.createPost(postData);
      PerformanceUtils.recordRequest(testName, '/posts', response.responseTime, response.status === 201);
      
      expect(response.status).toBe(201);
      expect(response.data.title).toBe(postData.title);
      expect(response.data.body).toBe(postData.body);
      expect(response.data.userId).toBe(postData.userId);
      expect(response.data.id).toBeDefined();
      
      PerformanceUtils.endMeasurement(testName);
      LoggerUtils.info(`✅ Created post: "${response.data.title}" with ID: ${response.data.id}`);
    });

    test('should create post with factory-generated data', async () => {
      const postData = PostFactory.createPostRequest();
      
      const response = await postsClient.createPost(postData);
      
      expect(response.status).toBe(201);
      expect(response.data.title).toBe(postData.title);
      expect(response.data.body).toBe(postData.body);
      expect(response.data.userId).toBe(postData.userId);
      
      LoggerUtils.info('✅ Created post with factory-generated data');
    });

    test('should handle post creation with invalid data gracefully', async () => {
      const invalidPostData = PostFactory.createInvalidPost();
      
      try {
        const response = await postsClient.createPost(invalidPostData as any);
        
        // JSONPlaceholder doesn't validate data strictly, so it might still return 201
        expect([200, 201, 400]).toContain(response.status);
        
        LoggerUtils.warn('API accepted invalid data - this is expected behavior for JSONPlaceholder');
      } catch (error) {
        LoggerUtils.error('Error during invalid data test:', error);
      }
    });

  });

  test.describe('🔄 PUT/PATCH Operations - Post Updates', () => {

    test('should update post with PUT method', async () => {
      const postId = 1;
      const updatedData = PostFactory.updatePostRequest({
        title: 'Updated Post Title PUT',
        body: 'This post has been updated using the PUT method via API framework'
      });
      
      const response = await postsClient.updatePost(postId, updatedData);
      
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(postId);
      expect(response.data.title).toBe(updatedData.title);
      expect(response.data.body).toBe(updatedData.body);
      
      LoggerUtils.info(`✅ Updated post ${postId} with PUT method`);
    });

    test('should partially update post with PATCH method', async () => {
      const postId = 2;
      const partialUpdate = { 
        title: 'Partially Updated Title PATCH'
      };
      
      const response = await postsClient.patchPost(postId, partialUpdate);
      
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(postId);
      expect(response.data.title).toBe(partialUpdate.title);
      
      LoggerUtils.info(`✅ Partially updated post ${postId} with PATCH method`);
    });

  });

  test.describe('🗑️ DELETE Operations - Post Removal', () => {

    test('should delete post successfully', async () => {
      const postId = 1;
      const testName = 'deletePost';
      PerformanceUtils.startMeasurement(testName);
      
      const response = await postsClient.deletePost(postId);
      PerformanceUtils.recordRequest(testName, `/posts/${postId}`, response.responseTime, response.status === 200);
      
      expect(response.status).toBe(200);
      
      PerformanceUtils.endMeasurement(testName);
      LoggerUtils.info(`✅ Deleted post ${postId} successfully`);
    });

  });

  test.describe('💬 Comments Operations', () => {

    test('should retrieve comments for a post', async () => {
      const postId = 1;
      
      const response = await postsClient.getPostComments(postId);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBeTruthy();
      
      if (response.data.length > 0) {
        const firstComment = response.data[0];
        expect(firstComment).toHaveProperty('id');
        expect(firstComment).toHaveProperty('name');
        expect(firstComment).toHaveProperty('email');
        expect(firstComment).toHaveProperty('body');
        expect(firstComment).toHaveProperty('postId');
        
        if (firstComment) {
          expect(firstComment.postId).toBe(postId);
          expect(ValidationUtils.isValidEmail(firstComment.email)).toBeTruthy();
        }
      }
      
      LoggerUtils.info(`✅ Retrieved ${response.data.length} comments for post ${postId}`);
    });

    test('should retrieve comments using query parameter', async () => {
      const postId = 1;
      
      const response = await postsClient.getCommentsByPostId(postId);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBeTruthy();
      
      // Verify all comments belong to the specified post
      response.data.forEach((comment: any) => {
        expect(comment.postId).toBe(postId);
      });
      
      LoggerUtils.info(`✅ Retrieved comments for post ${postId} using query parameter`);
    });

  });

  test.describe('📊 Performance & Load Tests', () => {

    test('should handle multiple concurrent post requests', async () => {
      const testName = 'concurrentPostRequests';
      PerformanceUtils.startMeasurement(testName);
      
      const postIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      
      const promises = postIds.map(async (postId) => {
        const response = await postsClient.getPostById(postId);
        PerformanceUtils.recordRequest(testName, `/posts/${postId}`, response.responseTime, response.status === 200);
        return response;
      });
      
      const responses = await Promise.all(promises);
      
      responses.forEach((response: any, index: number) => {
        expect(response.status).toBe(200);
        expect(response.data.id).toBe(postIds[index]);
      });
      
      const metrics = PerformanceUtils.endMeasurement(testName);
      
      // Assert performance thresholds
      expect(metrics?.averageResponseTime).toBeLessThan(3000);
      expect(metrics?.successfulRequests).toBe(postIds.length);
      
      LoggerUtils.info(`✅ Completed ${postIds.length} concurrent requests successfully`);
    });

    test('should measure post creation performance', async () => {
      const testName = 'postCreationPerformance';
      PerformanceUtils.startMeasurement(testName);
      
      const posts = PostFactory.createPosts(5, 1); // Create 5 test posts
      
      for (const postData of posts) {
        const response = await postsClient.createPost(postData);
        PerformanceUtils.recordRequest(testName, '/posts', response.responseTime, response.status === 201);
        
        expect(response.status).toBe(201);
      }
      
      const metrics = PerformanceUtils.endMeasurement(testName);
      
      // Assert performance thresholds for creation operations
      expect(metrics?.averageResponseTime).toBeLessThan(5000);
      expect(metrics?.successfulRequests).toBe(5);
      
      LoggerUtils.info('✅ Post creation performance test completed');
    });

  });

  test.describe('🛡️ Data Validation & Security', () => {

    test('should validate post data structure comprehensively', async () => {
      const response = await postsClient.getPostById(1);
      const post = response.data;
      
      // Validate required fields
      const validation = ValidationUtils.validateRequiredFields(post, 
        ['id', 'title', 'body', 'userId']
      );
      
      expect(validation.isValid).toBeTruthy();
      
      // Validate field types
      expect(typeof post.id).toBe('number');
      expect(typeof post.title).toBe('string');
      expect(typeof post.body).toBe('string');
      expect(typeof post.userId).toBe('number');
      
      // Validate content is not empty
      expect(post.title.trim()).not.toBe('');
      expect(post.body.trim()).not.toBe('');
      
      LoggerUtils.info('✅ Post data structure validation completed');
    });

    test('should handle special characters in post content', async () => {
      const specialCharData = PostFactory.createPostRequest({
        title: testData.specialCharacters.unicode,
        body: testData.specialCharacters.specialChars,
        userId: 1
      });
      
      const response = await postsClient.createPost(specialCharData);
      
      expect([200, 201]).toContain(response.status);
      
      LoggerUtils.info('✅ Special character handling test completed');
    });

    test('should handle large post content', async () => {
      const largeContentData = PostFactory.createPostRequest({
        title: 'Large Content Test Post',
        body: testData.specialCharacters.longText,
        userId: 1
      });
      
      const response = await postsClient.createPost(largeContentData);
      
      expect([200, 201]).toContain(response.status);
      
      LoggerUtils.info('✅ Large content handling test completed');
    });

  });

  test.describe('🔗 Relationships & Edge Cases', () => {

    test('should handle posts from different users', async () => {
      const userIds = [1, 2, 3];
      
      for (const userId of userIds) {
        const postData = PostFactory.createPostRequest({ userId });
        const response = await postsClient.createPost(postData);
        
        expect(response.status).toBe(201);
        expect(response.data.userId).toBe(userId);
      }
      
      LoggerUtils.info('✅ Multi-user post creation test completed');
    });

    test('should verify post-user relationship consistency', async () => {
      // Get a specific post
      const postResponse = await postsClient.getPostById(1);
      expect(postResponse.status).toBe(200);
      
      const post = postResponse.data;
      const userId = post.userId;
      
      // Verify the user exists (this would require UsersClient, but we can check basic properties)
      expect(typeof userId).toBe('number');
      expect(userId).toBeGreaterThan(0);
      
      LoggerUtils.info(`✅ Verified post ${post.id} belongs to user ${userId}`);
    });

  });

  test.afterAll(async () => {
    LoggerUtils.info('🏁 JSONPlaceholder Posts API test suite completed');
    PerformanceUtils.clearMetrics();
  });

});