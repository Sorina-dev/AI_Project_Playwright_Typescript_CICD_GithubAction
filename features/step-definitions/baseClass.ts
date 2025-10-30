import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { BrowserContext, Page, LaunchOptions } from '@playwright/test';

export interface CucumberWorldConstructorParams {
  parameters: { [key: string]: any };
}

export class BaseClass extends World {
  public context!: BrowserContext;
  public page!: Page;
  public testTimestamp?: string;

  // Static browser configuration method
  public static getBrowserConfig(): LaunchOptions {
    const isCI = process.env['CI'] === 'true';
    const isDebug = process.env['DEBUG'] === 'true';
    
    return {
      headless: isCI ? true : false,  // Headless in CI, visible locally
      slowMo: isDebug ? 1000 : 3000,  // Faster in debug mode
      args: [
        '--start-maximized',
        '--no-sandbox',
        '--disable-web-security',
        '--force-device-scale-factor=1',
        '--new-window',
        '--disable-features=VizDisplayCompositor',
        '--disable-background-timer-throttling',
        '--disable-renderer-backgrounding',
        '--disable-backgrounding-occluded-windows'
      ]
    };
  }

  // Static context configuration method
  public static getContextConfig() {
    const isCI = process.env['CI'] === 'true';
    
    return {
      viewport: { width: 1920, height: 1080 },
      recordVideo: isCI ? undefined : {  // Videos only locally, not in CI
        dir: 'test-results/videos',
        size: { width: 1920, height: 1080 }
      }
    } as const;
  }

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(BaseClass);
/**
 * Class Inheritance in TypeScript/JavaScript
export - This makes the BaseClass available for import in other files
class BaseClass - Declares a new class named BaseClass
extends World - This class inherits from the World class (imported from @cucumber/cucumber)
What is World in Cucumber?
The World class is a special base class from Cucumber that provides:

Shared state between step definitions in the same scenario
Context isolation - each scenario gets its own World instance
Lifecycle management - World is created before each scenario and destroyed after
What this achieves in your code:
By extending World, your BaseClass becomes the foundation for all your Cucumber step definitions, providing:

Browser context and page management (context, page properties)
Shared configuration (browser and context settings via static methods)
Test utilities that can be accessed across all step definitions
Proper cleanup when scenarios complete
*/
//****************/
/**
 * The line public context!: BrowserContext; is a TypeScript property declaration with several important parts:

Breaking it down:
public - This is an access modifier meaning the property can be accessed from outside the class
context - The name of the property
! - This is the definite assignment assertion operator
: BrowserContext - Type annotation specifying this property will hold a BrowserContext object
The ! (Definite Assignment Assertion) Explained:
The exclamation mark tells TypeScript:

"I know this property will be assigned a value before it's used"
"Don't warn me about it being potentially undefined"
"Trust me, I'll initialize it properly elsewhere"
*/
/*********************** */
/**
 * 
 */