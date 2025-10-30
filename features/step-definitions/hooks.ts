import { Before, After, BeforeAll, AfterAll, Status, ITestCaseHookParameter } from '@cucumber/cucumber';
import { BaseClass } from './baseClass';
import { chromium, Browser } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

let globalBrowser: Browser;

// Global setup before all tests creating necessary directories and launching browser
BeforeAll(async function(): Promise<void> {
  console.log('Starting BDD test suite with Cucumber and Playwright');
  
  // Create test directories for screenshots and videos
  const testResultsDir = path.join(process.cwd(), 'test-results');
  const screenshotsDir = path.join(testResultsDir, 'screenshots');
  const videosDir = path.join(testResultsDir, 'videos');
  
  [testResultsDir, screenshotsDir, videosDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
  
  // Launch global browser instance with configuration
  globalBrowser = await chromium.launch(BaseClass.getBrowserConfig());
  
  console.log('Global browser launched');
});

// Setup before each scenario: create context, page, take initial screenshot
Before({timeout: 15000}, async function(this: BaseClass, scenario: ITestCaseHookParameter) {
  const scenarioName = scenario.pickle.name.replace(/\s+/g, '_');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  console.log(`Starting scenario: "${scenario.pickle.name}"`);
  
  // Create browser context with video recording
  const contextConfig = BaseClass.getContextConfig();
  const contextOptions: any = {
    ...contextConfig
  };
  
  if (contextConfig.recordVideo) {
    // Create timestamped video directory for this scenario
    const videoDir = path.join(process.cwd(), 'test-results', 'videos', `${timestamp}_${scenarioName}`);
    contextOptions.recordVideo = {
      dir: videoDir,
      size: contextConfig.recordVideo.size
    };
  }
  
  this.context = await globalBrowser.newContext(contextOptions);
  this.page = await this.context.newPage();
  
  // Bring browser window to front
  console.log('Browser context created, bringing to front...');
  await this.page.bringToFront();
  
  console.log('Waiting for browser to be visible...');
  await this.page.waitForTimeout(3000);
  
  // Take initial screenshot with timestamp
  const initialScreenshot = path.join(process.cwd(), 'test-results', 'screenshots', `${timestamp}_${scenarioName}_start.png`);
  await this.page.screenshot({ path: initialScreenshot, fullPage: true });
  console.log(`Initial screenshot: ${initialScreenshot}`);
  
  // Store timestamp for use in After hook
  this.testTimestamp = timestamp;
});

// Teardown after each scenario: take final screenshot, attach media, handle failures, cleanup
After({timeout: 15000}, async function(this: BaseClass, scenario: ITestCaseHookParameter) {
  const scenarioName = scenario.pickle.name.replace(/\s+/g, '_');
  const timestamp = this.testTimestamp || new Date().toISOString().replace(/[:.]/g, '-');
  
  // Take final screenshot with timestamp
  if (this.page) {
    const finalScreenshot = path.join(process.cwd(), 'test-results', 'screenshots', `${timestamp}_${scenarioName}_end.png`);
    await this.page.screenshot({ path: finalScreenshot, fullPage: true });
    console.log(`Final screenshot: ${finalScreenshot}`);
    
    // Attach screenshots to Cucumber report
    const startScreenshotPath = path.join(process.cwd(), 'test-results', 'screenshots', `${timestamp}_${scenarioName}_start.png`);
    const endScreenshotPath = finalScreenshot;
    
    try {
      if (fs.existsSync(startScreenshotPath)) {
        const startScreenshot = fs.readFileSync(startScreenshotPath);
        this.attach(startScreenshot, 'image/png');
      }
      
      if (fs.existsSync(endScreenshotPath)) {
        const endScreenshot = fs.readFileSync(endScreenshotPath);
        this.attach(endScreenshot, 'image/png');
      }
      
      // Create accessible video link for Cucumber report
      const videoDir = path.join(process.cwd(), 'test-results', 'videos', `${timestamp}_${scenarioName}`);
      if (fs.existsSync(videoDir)) {
        const videoFiles = fs.readdirSync(videoDir);
        if (videoFiles.length > 0) {
          const videoFileName = videoFiles[0];
          if (videoFileName) {
            const videoPath = path.join(videoDir, videoFileName);
            
            try {
              // Format timestamp for display
              const displayTimestamp = timestamp.replace(/T/, ' ').replace(/Z$/, '').replace(/-/g, ':');
              
              // Create simple text with video information that will be readable
              const videoInfo = `🎥 VIDEO RECORDED\n` +
                `📽️ Scenario: ${scenarioName}\n` +
                `📅 Timestamp: ${displayTimestamp}\n` +
                `📁 File: ${videoFileName}\n` +
                `📂 Location: test-results/videos/${timestamp}_${scenarioName}/\n` +
                `💾 Size: ${Math.round(fs.statSync(videoPath).size / 1024)} KB\n` +
                `\n🔗 To view video: Navigate to the file location above`;
              
              this.attach(videoInfo, 'text/plain');
              
              // Also create a simple HTML file for easy video access
              const videoHtmlPath = path.join(videoDir, 'video-player.html');
              const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <title>Test Video - ${scenarioName}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        .info { background: #e3f2fd; padding: 15px; border-radius: 4px; margin-bottom: 20px; }
        video { width: 100%; max-width: 700px; }
    </style>
</head>
<body>
    <div class="container">
        <h2>🎥 Test Video</h2>
        <div class="info">
            <strong>📽️ Scenario:</strong> ${scenarioName}<br>
            <strong>📅 Timestamp:</strong> ${displayTimestamp}<br>
            <strong>📁 File:</strong> ${videoFileName}
        </div>
        <video controls>
            <source src="${videoFileName}" type="video/webm">
            Your browser does not support the video tag.
        </video>
    </div>
</body>
</html>`;
              
              fs.writeFileSync(videoHtmlPath, htmlContent);
              console.log(`� Video player HTML created: ${videoHtmlPath}`);
              
            } catch (error) {
              console.log(`Error creating video attachment: ${error}`);
              // Fallback to basic info
              const videoInfo = `🎥 VIDEO: ${videoPath}`;
              this.attach(videoInfo, 'text/plain');
            }
          }
        }
      }
    } catch (error) {
      console.log(`Error attaching media to Cucumber report: ${error}`);
    }
  }
  
  // Handle test failures with comprehensive evidence capture
  if (scenario.result?.status === Status.FAILED) {
    console.log('SCENARIO FAILED - Capturing failure evidence...');
    
    if (this.page) {
      try {
        // Failure screenshot with consistent timestamp
        const failureTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const failureScreenshot = path.join(
          process.cwd(), 
          'test-results', 
          'screenshots', 
          `${timestamp}_${scenarioName}_FAILURE_${failureTimestamp}.png`
        );
        await this.page.screenshot({ path: failureScreenshot, fullPage: true });
        
        // Save page HTML content on failure
        const pageContent = await this.page.content();
        const htmlPath = path.join(
          process.cwd(), 
          'test-results', 
          `${timestamp}_${scenarioName}_FAILURE_${failureTimestamp}.html`
        );
        fs.writeFileSync(htmlPath, pageContent);
        
        console.log(`Failure evidence captured:`);
        console.log(`   Screenshot: ${failureScreenshot}`);
        console.log(`   HTML dump: ${htmlPath}`);
        console.log(`   Current URL: ${this.page.url()}`);
        console.log(`   Video: Check test-results/videos/ folder`);
      } catch (error) {
        console.log(`Error capturing failure evidence: ${error}`);
      }
    }
  } else {
    console.log('Scenario passed successfully');
  }
  
  // Cleanup with delay to see final state
  console.log('Test completed - browser will close in 3 seconds...');
  console.log(`📹 Video saved to: test-results/videos/${timestamp}_${scenarioName}/`);
  await this.page.waitForTimeout(3000);
  
  if (this.page) {
    await this.page.close();
  }
  if (this.context) {
    await this.context.close();
  }
  
  console.log(`Scenario completed: "${scenario.pickle.name}"`);
});

// Global teardown after all tests: close browser and summarize results
AfterAll(async function(): Promise<void> {
  console.log('Closing global browser...');
  if (globalBrowser) {
    await globalBrowser.close();
  }
  console.log('BDD test suite completed');
  console.log('Check test-results/ folder for screenshots and videos');
});

/*
import * as fs from 'fs';
fs stands for "File System"
This is a Node.js built-in module for file and directory operations
import * as fs means "import everything from the 'fs' module and call it 'fs'"
Provides functions like:
fs.readFileSync() - Read files
fs.writeFileSync() - Write files
fs.existsSync() - Check if file/directory exists
fs.mkdirSync() - Create directories
fs.readdirSync() - List directory contents
import * as path from 'path';
path is a Node.js built-in module for working with file and directory paths
Handles path operations in a cross-platform way (Windows vs Unix)
import * as path imports all path utilities
Provides functions like:
path.join() - Join path segments safely
path.resolve() - Get absolute path
path.dirname() - Get directory name
path.basename() - Get file name
path.extname() - Get file extension
 */
/*
This line scenario.pickle.name.replace(/\s+/g, '_'); is a JavaScript string replacement using Regular Expression:

Breaking it down:
scenario.pickle.name - Gets the name of the Cucumber scenario
.replace() - JavaScript string method to find and replace text
/\s+/g - Regular expression pattern
'_' - Replacement string (underscore)
The Regular Expression /\s+/g explained:
/ - Start of regex pattern
\s - Matches any whitespace character (space, tab, newline, etc.)
+ - Matches one or more of the preceding character
/ - End of regex pattern
g - Global flag (replace ALL matches, not just the first one)
What it does:
Converts scenario names from human-readable format to file-system friendly format:
Examples:
 * "User logs in" -> "User_logs_in"
 */

/***
 * This line const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); creates a file-system safe timestamp by converting the current date/time into a string format suitable for filenames.

Breaking it down step by step:
1. new Date()
Creates a new JavaScript Date object with the current date and time
2. .toISOString()
Converts the date to ISO 8601 format string
Example output: "2025-10-30T14:23:45.678Z"
3. .replace(/[:.]/g, '-')
Regular expression: /[:.]/g
[:] - Character class matching colon : OR dot .
g - Global flag (replace ALL occurrences)
Replacement: '-' (hyphen)
Complete transformation example:
"2025-10-30T14:23:45.678Z" -> "2025-10-30T14-23-45-678Z"
 */

/**
 * This line const displayTimestamp = timestamp.replace(/T/, ' ').replace(/Z$/, '').replace(/-/g, ':'); converts a file-safe timestamp back to a human-readable format for display purposes.

Breaking it down step by step:
This performs 3 chained string replacements on the timestamp variable:

1. .replace(/T/, ' ')
Finds: T (the letter T)
Replaces with:   (space)
Purpose: Convert ISO date/time separator to readable space
2. .replace(/Z$/, '')
Finds: Z$ (the letter Z at the end of string)
$ means "end of string" in regex
Replaces with: '' (empty string - removes it)
Purpose: Remove timezone indicator
3. .replace(/-/g, ':')
Finds: - (hyphens) with g flag (all occurrences)
Replaces with: : (colons)
Purpose: Convert file-safe hyphens back to time colons
Complete transformation example:
"2025-10-30T14-23-45-678Z" -> "2025-10-30 14:23:45.678"
 */