import { APIRequestContext, expect } from '@playwright/test';
import { 
  User, 
  Post, 
  Comment, 
  CreateUserRequest, 
  UpdateUserRequest, 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest,
  ApiResponse,
  PaginatedResponse
} from '../data/models';

/**
 * Base API Client Class
 * 
 * Provides common functionality for all API clients including:
 * - Request/Response logging
 * - Error handling
 * - Response validation
 * - Performance metrics
 */
export class BaseApiClient {
  protected request: APIRequestContext;
  protected baseUrl: string;

  constructor(request: APIRequestContext, baseUrl: string) {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  /**
   * Makes a GET request with error handling and logging
   */
  protected async get<T>(endpoint: string, options: any = {}): Promise<ApiResponse<T>> {
    const startTime = performance.now();
    
    try {
      console.log(`🔍 GET ${this.baseUrl}${endpoint}`);
      
      const response = await this.request.get(`${this.baseUrl}${endpoint}`, options);
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      const responseBody = await response.json();
      
      console.log(`✅ GET ${endpoint} - Status: ${response.status()}, Time: ${responseTime.toFixed(2)}ms`);
      
      return {
        status: response.status(),
        data: responseBody,
        headers: response.headers(),
        responseTime
      };
    } catch (error) {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      console.error(`❌ GET ${endpoint} failed after ${responseTime.toFixed(2)}ms:`, error);
      throw error;
    }
  }

  /**
   * Makes a POST request with error handling and logging
   */
  protected async post<T>(endpoint: string, data: any, options: any = {}): Promise<ApiResponse<T>> {
    const startTime = performance.now();
    
    try {
      console.log(`📝 POST ${this.baseUrl}${endpoint}`);
      console.log('Request Data:', JSON.stringify(data, null, 2));
      
      const response = await this.request.post(`${this.baseUrl}${endpoint}`, {
        data,
        ...options
      });
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      const responseBody = await response.json();
      
      console.log(`✅ POST ${endpoint} - Status: ${response.status()}, Time: ${responseTime.toFixed(2)}ms`);
      
      return {
        status: response.status(),
        data: responseBody,
        headers: response.headers(),
        responseTime
      };
    } catch (error) {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      console.error(`❌ POST ${endpoint} failed after ${responseTime.toFixed(2)}ms:`, error);
      throw error;
    }
  }

  /**
   * Makes a PUT request with error handling and logging
   */
  protected async put<T>(endpoint: string, data: any, options: any = {}): Promise<ApiResponse<T>> {
    const startTime = performance.now();
    
    try {
      console.log(`🔄 PUT ${this.baseUrl}${endpoint}`);
      console.log('Request Data:', JSON.stringify(data, null, 2));
      
      const response = await this.request.put(`${this.baseUrl}${endpoint}`, {
        data,
        ...options
      });
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      const responseBody = await response.json();
      
      console.log(`✅ PUT ${endpoint} - Status: ${response.status()}, Time: ${responseTime.toFixed(2)}ms`);
      
      return {
        status: response.status(),
        data: responseBody,
        headers: response.headers(),
        responseTime
      };
    } catch (error) {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      console.error(`❌ PUT ${endpoint} failed after ${responseTime.toFixed(2)}ms:`, error);
      throw error;
    }
  }

  /**
   * Makes a PATCH request with error handling and logging
   */
  protected async patch<T>(endpoint: string, data: any, options: any = {}): Promise<ApiResponse<T>> {
    const startTime = performance.now();
    
    try {
      console.log(`🔄 PATCH ${this.baseUrl}${endpoint}`);
      console.log('Request Data:', JSON.stringify(data, null, 2));
      
      const response = await this.request.patch(`${this.baseUrl}${endpoint}`, {
        data,
        ...options
      });
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      const responseBody = await response.json();
      
      console.log(`✅ PATCH ${endpoint} - Status: ${response.status()}, Time: ${responseTime.toFixed(2)}ms`);
      
      return {
        status: response.status(),
        data: responseBody,
        headers: response.headers(),
        responseTime
      };
    } catch (error) {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      console.error(`❌ PATCH ${endpoint} failed after ${responseTime.toFixed(2)}ms:`, error);
      throw error;
    }
  }

  /**
   * Makes a DELETE request with error handling and logging
   */
  protected async delete<T>(endpoint: string, options: any = {}): Promise<ApiResponse<T>> {
    const startTime = performance.now();
    
    try {
      console.log(`🗑️ DELETE ${this.baseUrl}${endpoint}`);
      
      const response = await this.request.delete(`${this.baseUrl}${endpoint}`, options);
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      let responseBody;
      try {
        responseBody = await response.json();
      } catch {
        responseBody = {}; // Some DELETE requests return empty response
      }
      
      console.log(`✅ DELETE ${endpoint} - Status: ${response.status()}, Time: ${responseTime.toFixed(2)}ms`);
      
      return {
        status: response.status(),
        data: responseBody,
        headers: response.headers(),
        responseTime
      };
    } catch (error) {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      console.error(`❌ DELETE ${endpoint} failed after ${responseTime.toFixed(2)}ms:`, error);
      throw error;
    }
  }

  /**
   * Validates response status code
   */
  protected validateStatus(response: ApiResponse<any>, expectedStatus: number): void {
    expect(response.status).toBe(expectedStatus);
  }

  /**
   * Validates response contains required fields
   */
  protected validateResponseStructure(data: any, requiredFields: string[]): void {
    for (const field of requiredFields) {
      expect(data).toHaveProperty(field);
    }
  }

  /**
   * Validates response time is within acceptable limits
   */
  protected validateResponseTime(responseTime: number, maxTime: number = 5000): void {
    expect(responseTime).toBeLessThan(maxTime);
  }
}

/**
 * JSONPlaceholder Users API Client
 * 
 * Provides methods for interacting with the users endpoint of JSONPlaceholder API
 */
export class UsersClient extends BaseApiClient {
  constructor(request: APIRequestContext) {
    super(request, 'https://jsonplaceholder.typicode.com');
  }

  /**
   * Get all users
   */
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    return await this.get<User[]>('/users');
  }

  /**
   * Get user by ID
   */
  async getUserById(id: number): Promise<ApiResponse<User>> {
    return await this.get<User>(`/users/${id}`);
  }

  /**
   * Create a new user
   */
  async createUser(userData: Partial<User>): Promise<ApiResponse<User>> {
    return await this.post<User>('/users', userData);
  }

  /**
   * Update user by ID
   */
  async updateUser(id: number, userData: Partial<User>): Promise<ApiResponse<User>> {
    return await this.put<User>(`/users/${id}`, userData);
  }

  /**
   * Partially update user by ID
   */
  async patchUser(id: number, userData: Partial<User>): Promise<ApiResponse<User>> {
    return await this.patch<User>(`/users/${id}`, userData);
  }

  /**
   * Delete user by ID
   */
  async deleteUser(id: number): Promise<ApiResponse<any>> {
    return await this.delete(`/users/${id}`);
  }

  /**
   * Get user posts
   */
  async getUserPosts(userId: number): Promise<ApiResponse<Post[]>> {
    return await this.get<Post[]>(`/users/${userId}/posts`);
  }

  /**
   * Get user albums
   */
  async getUserAlbums(userId: number): Promise<ApiResponse<any[]>> {
    return await this.get<any[]>(`/users/${userId}/albums`);
  }

  /**
   * Get user todos
   */
  async getUserTodos(userId: number): Promise<ApiResponse<any[]>> {
    return await this.get<any[]>(`/users/${userId}/todos`);
  }

  /**
   * Validate user data structure
   */
  validateUserStructure(user: User): void {
    const requiredFields = ['id', 'name', 'username', 'email', 'address', 'phone', 'website', 'company'];
    this.validateResponseStructure(user, requiredFields);
    
    // Validate nested objects
    if (user.address) {
      expect(user.address).toHaveProperty('street');
      expect(user.address).toHaveProperty('city');
      expect(user.address).toHaveProperty('zipcode');
      expect(user.address.geo).toHaveProperty('lat');
      expect(user.address.geo).toHaveProperty('lng');
    }
    
    if (user.company) {
      expect(user.company).toHaveProperty('name');
      expect(user.company).toHaveProperty('catchPhrase');
      expect(user.company).toHaveProperty('bs');
    }
  }
}

/**
 * JSONPlaceholder Posts API Client
 * 
 * Provides methods for interacting with the posts endpoint of JSONPlaceholder API
 */
export class PostsClient extends BaseApiClient {
  constructor(request: APIRequestContext) {
    super(request, 'https://jsonplaceholder.typicode.com');
  }

  /**
   * Get all posts
   */
  async getAllPosts(): Promise<ApiResponse<Post[]>> {
    return await this.get<Post[]>('/posts');
  }

  /**
   * Get post by ID
   */
  async getPostById(id: number): Promise<ApiResponse<Post>> {
    return await this.get<Post>(`/posts/${id}`);
  }

  /**
   * Create a new post
   */
  async createPost(postData: Partial<Post>): Promise<ApiResponse<Post>> {
    return await this.post<Post>('/posts', postData);
  }

  /**
   * Update post by ID
   */
  async updatePost(id: number, postData: Partial<Post>): Promise<ApiResponse<Post>> {
    return await this.put<Post>(`/posts/${id}`, postData);
  }

  /**
   * Partially update post by ID
   */
  async patchPost(id: number, postData: Partial<Post>): Promise<ApiResponse<Post>> {
    return await this.patch<Post>(`/posts/${id}`, postData);
  }

  /**
   * Delete post by ID
   */
  async deletePost(id: number): Promise<ApiResponse<any>> {
    return await this.delete(`/posts/${id}`);
  }

  /**
   * Get post comments
   */
  async getPostComments(postId: number): Promise<ApiResponse<Comment[]>> {
    return await this.get<Comment[]>(`/posts/${postId}/comments`);
  }

  /**
   * Get comments for a post using query parameter
   */
  async getCommentsByPostId(postId: number): Promise<ApiResponse<Comment[]>> {
    return await this.get<Comment[]>(`/comments?postId=${postId}`);
  }

  /**
   * Validate post data structure
   */
  validatePostStructure(post: Post): void {
    const requiredFields = ['id', 'title', 'body', 'userId'];
    this.validateResponseStructure(post, requiredFields);
  }
}

/**
 * ReqRes API Client
 * 
 * Provides methods for interacting with the ReqRes API for user management and authentication
 */
export class ReqResClient extends BaseApiClient {
  constructor(request: APIRequestContext) {
    super(request, 'https://reqres.in/api');
  }

  /**
   * Get paginated list of users
   */
  async getUsers(page: number = 1): Promise<ApiResponse<PaginatedResponse<User>>> {
    return await this.get<PaginatedResponse<User>>(`/users?page=${page}`);
  }

  /**
   * Get single user by ID
   */
  async getUser(id: number): Promise<ApiResponse<{ data: User }>> {
    return await this.get<{ data: User }>(`/users/${id}`);
  }

  /**
   * Create a new user
   */
  async createUser(userData: CreateUserRequest): Promise<ApiResponse<CreateUserRequest & { id: string; createdAt: string }>> {
    return await this.post<CreateUserRequest & { id: string; createdAt: string }>('/users', userData);
  }

  /**
   * Update user by ID
   */
  async updateUser(id: number, userData: UpdateUserRequest): Promise<ApiResponse<UpdateUserRequest & { updatedAt: string }>> {
    return await this.put<UpdateUserRequest & { updatedAt: string }>(`/users/${id}`, userData);
  }

  /**
   * Partially update user by ID
   */
  async patchUser(id: number, userData: Partial<UpdateUserRequest>): Promise<ApiResponse<Partial<UpdateUserRequest> & { updatedAt: string }>> {
    return await this.patch<Partial<UpdateUserRequest> & { updatedAt: string }>(`/users/${id}`, userData);
  }

  /**
   * Delete user by ID
   */
  async deleteUser(id: number): Promise<ApiResponse<any>> {
    return await this.delete(`/users/${id}`);
  }

  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return await this.post<AuthResponse>('/login', credentials);
  }

  /**
   * Register user
   */
  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return await this.post<AuthResponse>('/register', userData);
  }

  /**
   * Get delayed response (for testing timeouts)
   */
  async getDelayedUsers(delay: number = 3): Promise<ApiResponse<PaginatedResponse<User>>> {
    return await this.get<PaginatedResponse<User>>(`/users?delay=${delay}`);
  }

  /**
   * Get list of resources
   */
  async getResources(): Promise<ApiResponse<PaginatedResponse<any>>> {
    return await this.get<PaginatedResponse<any>>('/unknown');
  }

  /**
   * Get single resource by ID
   */
  async getResource(id: number): Promise<ApiResponse<{ data: any }>> {
    return await this.get<{ data: any }>(`/unknown/${id}`);
  }

  /**
   * Validate ReqRes user structure
   */
  validateReqResUserStructure(user: any): void {
    const requiredFields = ['id', 'email', 'first_name', 'last_name', 'avatar'];
    this.validateResponseStructure(user, requiredFields);
  }

  /**
   * Validate paginated response structure
   */
  validatePaginatedResponse(response: PaginatedResponse<any>): void {
    const requiredFields = ['page', 'per_page', 'total', 'total_pages', 'data'];
    this.validateResponseStructure(response, requiredFields);
    expect(Array.isArray(response.data)).toBeTruthy();
  }
}