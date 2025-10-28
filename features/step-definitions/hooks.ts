import { Before, After, BeforeAll, AfterAll, Status, ITestCaseHookParameter } from '@cucumber/cucumber';
import { BaseClass } from './baseClass';
import { chromium, Browser } from '@playwright/test';
import { browserConfig, contextConfig } from './browser-config';
import * as fs from 'fs';
import * as path from 'path';

let globalBrowser: Browser;

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
  globalBrowser = await chromium.launch(browserConfig);
  
  console.log('Global browser launched');
});

Before(async function(this: BaseClass, scenario: ITestCaseHookParameter) {
  const scenarioName = scenario.pickle.name.replace(/\s+/g, '_');
  console.log(`Starting scenario: "${scenario.pickle.name}"`);
  
  // Create browser context with video recording
  const contextOptions: any = {
    ...contextConfig
  };
  
  if (contextConfig.recordVideo) {
    contextOptions.recordVideo = {
      dir: path.join(process.cwd(), 'test-results', 'videos'),
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
  
  // Take initial screenshot
  const initialScreenshot = path.join(process.cwd(), 'test-results', 'screenshots', `${scenarioName}_start.png`);
  await this.page.screenshot({ path: initialScreenshot, fullPage: true });
  console.log(`Initial screenshot: ${initialScreenshot}`);
});

After(async function(this: BaseClass, scenario: ITestCaseHookParameter) {
  const scenarioName = scenario.pickle.name.replace(/\s+/g, '_');
  
  // Take final screenshot
  if (this.page) {
    const finalScreenshot = path.join(process.cwd(), 'test-results', 'screenshots', `${scenarioName}_end.png`);
    await this.page.screenshot({ path: finalScreenshot, fullPage: true });
    console.log(`Final screenshot: ${finalScreenshot}`);
  }
  
  // Handle test failures with comprehensive evidence capture
  if (scenario.result?.status === Status.FAILED) {
    console.log('SCENARIO FAILED - Capturing failure evidence...');
    
    if (this.page) {
      try {
        // Failure screenshot with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const failureScreenshot = path.join(
          process.cwd(), 
          'test-results', 
          'screenshots', 
          `${scenarioName}_FAILURE_${timestamp}.png`
        );
        await this.page.screenshot({ path: failureScreenshot, fullPage: true });
        
        // Save page HTML content on failure
        const pageContent = await this.page.content();
        const htmlPath = path.join(
          process.cwd(), 
          'test-results', 
          `${scenarioName}_FAILURE_${timestamp}.html`
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
  await this.page.waitForTimeout(3000);
  
  if (this.page) {
    await this.page.close();
  }
  if (this.context) {
    await this.context.close();
  }
  
  console.log(`Scenario completed: "${scenario.pickle.name}"`);
});

AfterAll(async function(): Promise<void> {
  console.log('Closing global browser...');
  if (globalBrowser) {
    await globalBrowser.close();
  }
  console.log('BDD test suite completed');
  console.log('Check test-results/ folder for screenshots and videos');
});