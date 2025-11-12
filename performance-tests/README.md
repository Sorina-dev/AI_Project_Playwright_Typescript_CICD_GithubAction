# 🚀 K6 Performance Tests - CI/CD Integration

## 📖 Overview

This directory contains K6 performance tests configured for CI/CD pipeline integration. All tests run against the **mock API server** for safe, consistent testing without affecting real systems.

## 🎯 CI/CD Pipeline Integration

### GitHub Actions Job: `k6-performance-tests`

The pipeline includes a dedicated job that:
- Runs in parallel with other test jobs (Playwright, Visual, BDD)
- Uses Ubuntu latest runner
- Installs K6 from official repository
- Executes quick load tests (2 minutes total)
- Generates HTML and JSON reports
- Uploads artifacts for 30 days retention

### Test Execution Pattern (CI)

```bash
# Quick Load Test (CI-optimized)
k6 run --stage 30s:10,1m:10,30s:0 main-performance-test.js

# Individual Test Suites
k6 run tests/get-requests.test.js
k6 run tests/post-requests.test.js  
k6 run tests/put-requests.test.js
k6 run tests/delete-requests.test.js
```

## 📊 Reports & Artifacts

### Generated Artifacts:
- **`k6-quick-report.html`** - Main performance test HTML report
- **`*-results.json`** - Individual test suite JSON results
- **`k6-summary.md`** - Test execution summary

### Artifact Storage:
- **Name**: `k6-performance-report`
- **Retention**: 30 days
- **Access**: Available in GitHub Actions run artifacts

## ⚙️ Configuration

### Mock Server (Default)
- **URL**: `https://mock-api-server.wiremockapi.cloud`
- **Environment**: Mock/Testing only
- **Safety**: No real API impact

### CI Performance Thresholds
- **Response Time**: < 2000ms (95th percentile)
- **Error Rate**: < 10%
- **Duration**: 2 minutes total (quick feedback)

## 🔧 Local Development vs CI

### Local Development:
```bash
npm run test              # Full load test (8 minutes)
npm run test:stress       # Stress test (19 minutes)  
npm run test:report       # With HTML report
```

### CI Environment:
```bash
npm run test:ci           # Quick test (2 minutes)
npm run test:ci-report    # Quick test with report
npm run test:ci-all       # Individual suites
```

## 🚨 Troubleshooting CI Issues

### Common Issues:

1. **K6 Installation Fails:**
   ```bash
   # Check K6 installation logs
   curl -s https://dl.k6.io/key.gpg | sudo apt-key add -
   ```

2. **Mock Server Unreachable:**
   ```bash
   # Verify mock server connectivity
   curl https://mock-api-server.wiremockapi.cloud/api/v1/health
   ```

3. **Test Timeout:**
   - CI timeout set to 30 minutes
   - Quick tests should complete in ~2 minutes
   - Individual suites run with `continue-on-error: true`

### Pipeline Dependencies:
- **Needs**: `build` job completion
- **Parallel**: Runs alongside other test jobs
- **Reports**: Included in `deploy-report` job

## 📈 Performance Metrics Tracking

### CI Metrics Collected:
- Response times (p95, p99)
- Error rates per endpoint
- Request rates (RPS)
- Virtual user performance
- Test duration and completion

### Historical Tracking:
- JSON results stored as artifacts
- Trends tracked across pipeline runs
- Performance regression detection

## 🔗 Integration Points

### GitHub Actions Workflow:
```yaml
k6-performance-tests:
  name: K6 Performance Tests
  needs: build
  runs-on: ubuntu-latest
  timeout-minutes: 30
```

### Artifact Collection:
```yaml
- name: Upload K6 Performance Test Reports
  uses: actions/upload-artifact@v4
  with:
    name: k6-performance-report
    retention-days: 30
```

## 🎯 Next Steps

1. **View Results**: Check pipeline artifacts after run completion
2. **Monitor Trends**: Compare performance across multiple runs
3. **Optimize Tests**: Adjust thresholds based on CI feedback
4. **Scale Testing**: Increase load patterns for staging/production

---

**🔗 Related Documentation:**
- Main README: `../docs/README.md`
- Pipeline Config: `../.github/workflows/playwright.yml`
- K6 Main Guide: `../docs/K6-Performance tests POM.md`