/**
 * Test data for login functionality
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

export const validCredentials: LoginCredentials = {
  username: 'tomsmith',
  password: 'SuperSecretPassword!'
};

export const invalidCredentials: LoginCredentials[] = [
  {
    username: 'invalid',
    password: 'invalid'
  },
  {
    username: '',
    password: ''
  },
  {
    username: 'tomsmith',
    password: 'wrongpassword'
  }
];

/**
 * Test data for URLs
 */
export const testUrls = {
  playwright: {
    home: 'https://playwright.dev/',
    docs: 'https://playwright.dev/docs/intro'
  },
  internetHeroku: {
    base: 'https://the-internet.herokuapp.com',
    login: 'https://the-internet.herokuapp.com/login',
    dropdown: 'https://the-internet.herokuapp.com/dropdown',
    fileUpload: 'https://the-internet.herokuapp.com/upload'
  }
};

/**
 * Expected messages for validation
 */
export const expectedMessages = {
  login: {
    success: 'You logged into a secure area!',
    invalidUsername: 'Your username is invalid!',
    invalidPassword: 'Your password is invalid!'
  },
  navigation: {
    playwrightTitle: 'Playwright'
  }
};

/**
 * Test timeouts and delays
 */
export const testConfig = {
  timeouts: {
    short: 5000,
    medium: 10000,
    long: 30000
  },
  delays: {
    short: 500,
    medium: 1000,
    long: 2000
  }
};