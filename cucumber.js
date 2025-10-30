module.exports = {
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
  parallel: 1,
  timeout: 60000
};
