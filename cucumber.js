module.exports = {
  default: {
    paths: ['features/*.feature'],
    require: ['features/step-definitions/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'json:test-results/cucumber-report.json',
      'html:test-results/cucumber-report.html'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    worldParameters: {
      playwright: {
        browserName: 'chromium',
        headless: false,  // Browser window visible
        slowMo: 3000,     // 3 second delay between actions (same as visibility test)
        devtools: false,  // No devtools - clean browser view
        timeout: 30000,   // 30 second timeout
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
      }
    },
    parallel: 1,
    timeout: 60000,    // 60 second timeout for each step
    publishQuiet: true,
  }
};