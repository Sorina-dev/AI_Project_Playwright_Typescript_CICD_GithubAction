import { 
  User, 
  Post, 
  Comment, 
  CreateUserRequest, 
  UpdateUserRequest, 
  CreatePostRequest, 
  UpdatePostRequest,
  LoginRequest,
  RegisterRequest,
  Address,
  Company
} from '../models';

/**
 * Test Data Factory Classes
 * 
 * These factories provide methods to generate test data for API testing.
 * They ensure consistent, valid test data while allowing customization.
 */

export class UserFactory {
  private static userCounter = 1;

  /**
   * Creates a valid user object for testing
   */
  static createUser(overrides: Partial<User> = {}): User {
    const defaultUser: User = {
      id: this.userCounter++,
      name: `Test User ${this.userCounter}`,
      username: `testuser${this.userCounter}`,
      email: `testuser${this.userCounter}@example.com`,
      phone: `+1-555-${String(this.userCounter).padStart(4, '0')}`,
      website: `testuser${this.userCounter}.com`,
      address: this.createAddress(),
      company: this.createCompany(),
    };

    return { ...defaultUser, ...overrides };
  }

  /**
   * Creates a user creation request payload
   */
  static createUserRequest(overrides: Partial<CreateUserRequest> = {}): CreateUserRequest {
    const defaultRequest: CreateUserRequest = {
      name: `API Test User ${Date.now()}`,
      job: 'Quality Assurance Engineer',
      email: `apitest${Date.now()}@example.com`,
    };

    return { ...defaultRequest, ...overrides };
  }

  /**
   * Creates a user update request payload
   */
  static updateUserRequest(overrides: Partial<UpdateUserRequest> = {}): UpdateUserRequest {
    const defaultRequest: UpdateUserRequest = {
      name: `Updated User ${Date.now()}`,
      job: 'Senior QA Engineer',
      email: `updated${Date.now()}@example.com`,
    };

    return { ...defaultRequest, ...overrides };
  }

  /**
   * Creates an address object
   */
  static createAddress(overrides: Partial<Address> = {}): Address {
    const defaultAddress: Address = {
      street: '123 Test Street',
      suite: 'Suite 100',
      city: 'Test City',
      zipcode: '12345-6789',
      geo: {
        lat: '40.7128',
        lng: '-74.0060'
      }
    };

    return { ...defaultAddress, ...overrides };
  }

  /**
   * Creates a company object
   */
  static createCompany(overrides: Partial<Company> = {}): Company {
    const defaultCompany: Company = {
      name: 'Test Corporation',
      catchPhrase: 'Quality through automation',
      bs: 'automated testing solutions'
    };

    return { ...defaultCompany, ...overrides };
  }

  /**
   * Creates multiple users for bulk testing
   */
  static createUsers(count: number, overrides: Partial<User> = {}): User[] {
    return Array.from({ length: count }, (_, index) => 
      this.createUser({ 
        ...overrides, 
        name: `Bulk User ${index + 1}`,
        email: `bulkuser${index + 1}@example.com`
      })
    );
  }

  /**
   * Creates a user with invalid data for negative testing
   */
  static createInvalidUser(): Partial<User> {
    return {
      name: '', // Invalid: empty name
      email: 'invalid-email', // Invalid: malformed email
      phone: '123', // Invalid: too short
    };
  }
}

export class PostFactory {
  private static postCounter = 1;

  /**
   * Creates a valid post object for testing
   */
  static createPost(overrides: Partial<Post> = {}): Post {
    const defaultPost: Post = {
      id: this.postCounter++,
      title: `Test Post ${this.postCounter}`,
      body: `This is a test post created for API testing purposes. Post number ${this.postCounter}.`,
      userId: 1,
    };

    return { ...defaultPost, ...overrides };
  }

  /**
   * Creates a post creation request payload
   */
  static createPostRequest(overrides: Partial<CreatePostRequest> = {}): CreatePostRequest {
    const defaultRequest: CreatePostRequest = {
      title: `API Test Post ${Date.now()}`,
      body: `This post was created via API testing at ${new Date().toISOString()}`,
      userId: 1,
    };

    return { ...defaultRequest, ...overrides };
  }

  /**
   * Creates a post update request payload
   */
  static updatePostRequest(overrides: Partial<UpdatePostRequest> = {}): UpdatePostRequest {
    const defaultRequest: UpdatePostRequest = {
      title: `Updated Post ${Date.now()}`,
      body: `This post was updated via API testing at ${new Date().toISOString()}`,
    };

    return { ...defaultRequest, ...overrides };
  }

  /**
   * Creates multiple posts for bulk testing
   */
  static createPosts(count: number, userId: number = 1): Post[] {
    return Array.from({ length: count }, (_, index) => 
      this.createPost({ 
        title: `Bulk Post ${index + 1}`,
        body: `This is bulk post number ${index + 1} for testing.`,
        userId 
      })
    );
  }

  /**
   * Creates a post with invalid data for negative testing
   */
  static createInvalidPost(): Partial<CreatePostRequest> {
    return {
      title: '', // Invalid: empty title
      body: '', // Invalid: empty body
      userId: 0, // Invalid: non-existent user
    };
  }
}

export class CommentFactory {
  private static commentCounter = 1;

  /**
   * Creates a valid comment object for testing
   */
  static createComment(overrides: Partial<Comment> = {}): Comment {
    const defaultComment: Comment = {
      id: this.commentCounter++,
      name: `Test Comment ${this.commentCounter}`,
      email: `commenter${this.commentCounter}@example.com`,
      body: `This is a test comment created for API testing. Comment number ${this.commentCounter}.`,
      postId: 1,
    };

    return { ...defaultComment, ...overrides };
  }

  /**
   * Creates multiple comments for a post
   */
  static createComments(count: number, postId: number = 1): Comment[] {
    return Array.from({ length: count }, (_, index) => 
      this.createComment({ 
        name: `Comment ${index + 1} on Post ${postId}`,
        email: `commenter${index + 1}@example.com`,
        body: `This is comment number ${index + 1} on post ${postId}.`,
        postId 
      })
    );
  }
}

export class AuthFactory {
  /**
   * Creates valid login credentials
   */
  static createLoginRequest(overrides: Partial<LoginRequest> = {}): LoginRequest {
    const defaultLogin: LoginRequest = {
      email: 'eve.holt@reqres.in',
      password: 'cityslicka',
    };

    return { ...defaultLogin, ...overrides };
  }

  /**
   * Creates valid registration data
   */
  static createRegisterRequest(overrides: Partial<RegisterRequest> = {}): RegisterRequest {
    const defaultRegister: RegisterRequest = {
      email: 'eve.holt@reqres.in',
      password: 'pistol',
    };

    return { ...defaultRegister, ...overrides };
  }

  /**
   * Creates invalid login credentials for negative testing
   */
  static createInvalidLoginRequest(): Partial<LoginRequest> {
    return {
      email: 'peter@klaven', // Missing password
    };
  }

  /**
   * Creates invalid registration data for negative testing
   */
  static createInvalidRegisterRequest(): Partial<RegisterRequest> {
    return {
      email: 'sydney@fife', // Missing password
    };
  }

  /**
   * Creates multiple test accounts
   */
  static createTestAccounts(): LoginRequest[] {
    return [
      { email: 'eve.holt@reqres.in', password: 'cityslicka' },
      { email: 'george.bluth@reqres.in', password: 'testpass123' },
      { email: 'janet.weaver@reqres.in', password: 'securepass456' },
    ];
  }
}

export class TestDataHelper {
  /**
   * Generates a random email address
   */
  static randomEmail(domain: string = 'example.com'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    return `test${timestamp}${random}@${domain}`;
  }

  /**
   * Generates a random string of specified length
   */
  static randomString(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generates a random number within range
   */
  static randomNumber(min: number = 1, max: number = 1000): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Generates a random phone number
   */
  static randomPhoneNumber(): string {
    const areaCode = this.randomNumber(200, 999);
    const exchange = this.randomNumber(200, 999);
    const number = this.randomNumber(1000, 9999);
    return `+1-${areaCode}-${exchange}-${number}`;
  }

  /**
   * Generates a past date within specified days
   */
  static pastDate(daysAgo: number = 30): string {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString();
  }

  /**
   * Generates a future date within specified days
   */
  static futureDate(daysFromNow: number = 30): string {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString();
  }

  /**
   * Creates test data with specified size for performance testing
   */
  static createLargePayload(sizeInKB: number = 100): object {
    const targetSize = sizeInKB * 1024; // Convert to bytes
    const baseObject = { data: [] as string[] };
    const sampleString = 'A'.repeat(1000); // 1KB string
    
    while (JSON.stringify(baseObject).length < targetSize) {
      baseObject.data.push(sampleString);
    }
    
    return baseObject;
  }

  /**
   * Sanitizes test data by removing sensitive information
   */
  static sanitizeForLogging(data: any): any {
    const sanitized = JSON.parse(JSON.stringify(data));
    
    // Remove sensitive fields
    const sensitiveFields = ['password', 'token', 'authorization', 'secret', 'key'];
    
    const sanitizeRecursive = (obj: any): any => {
      if (typeof obj !== 'object' || obj === null) return obj;
      
      for (const key in obj) {
        if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
          obj[key] = '***REDACTED***';
        } else if (typeof obj[key] === 'object') {
          sanitizeRecursive(obj[key]);
        }
      }
      return obj;
    };
    
    return sanitizeRecursive(sanitized);
  }
}