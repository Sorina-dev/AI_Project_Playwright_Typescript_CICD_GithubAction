# Grafana + K6 Performance Monitoring Setup

## 🚀 Quick Start Guide

### 1. Start Monitoring Stack
```bash
# From performance-tests directory
npm run grafana:start

# Or manually:
cd grafana-stack
docker-compose up -d
```

### 2. Access Grafana Dashboard
- **URL**: http://localhost:3000
- **Username**: admin
- **Password**: admin123

### 3. Run K6 Tests with Grafana
```bash
# Main test with Grafana monitoring
npm run test:grafana

# Load test with Grafana
npm run test:load:grafana

# Stress test with Grafana
npm run test:stress:grafana
```

## 📊 What You Get

### Real-Time Dashboards
- **Virtual Users**: Live count of active test users
- **Request Rate**: Requests per second (RPS) 
- **Response Times**: P50, P95, P99 percentiles over time
- **Error Rates**: Failed request percentages
- **HTTP Status**: 2xx, 4xx, 5xx distribution

### Pre-configured Dashboard Panels
1. **Performance Overview** - Key metrics at a glance
2. **Response Time Trends** - How performance changes over test duration  
3. **Load Pattern Visualization** - User ramp-up and ramp-down
4. **Error Analysis** - Error types and frequency
5. **Test Progress** - Completion percentage for volume tests

## 🛠️ Setup Details

### Services Included
- **InfluxDB** (Port 8086): Time-series database for K6 metrics
- **Grafana** (Port 3000): Visualization and dashboards
- **Prometheus** (Port 9090): Alternative metrics storage (optional)

### Data Flow
```
K6 Tests → InfluxDB → Grafana Dashboards
          ↘ Prometheus ↗ (alternative path)
```

### File Structure
```
grafana-stack/
├── docker-compose.yml           # Main stack definition
├── grafana/
│   ├── provisioning/
│   │   ├── datasources/         # Auto-configure InfluxDB connection
│   │   └── dashboards/          # Auto-import dashboards
│   └── dashboards/
│       └── k6-expense-management.json  # Custom expense dashboard
└── README.md                    # This file
```

## 🎯 Custom Metrics for Expense Management

### Business Metrics Tracked
- **Employee Operations**: Profile views, updates
- **Expense Operations**: CRUD operation success rates
- **Manager Workflow**: Approval process metrics
- **Data Volume**: Records processed per operation type

### Test Scenario Metrics
- **Regular Employee (40%)**: Basic expense management
- **Manager (25%)**: Team oversight and approvals
- **Admin (15%)**: System administration
- **Heavy User (5%)**: Intensive operations

## 📈 Dashboard Usage

### During Tests
- Watch real-time metrics as test runs
- Identify performance bottlenecks immediately
- Monitor user ramp-up patterns
- Track error spikes and their timing

### After Tests  
- Compare test runs over time
- Analyze performance trends
- Share results with team via dashboard links
- Export charts for reports

## 🔧 Management Commands

```bash
#navigate to performance tests
cd performance-tests

# Start monitoring stack
npm run grafana:start

# Check status
npm run grafana:status

# Stop monitoring stack
npm run grafana:stop

# View logs
cd grafana-stack && docker-compose logs -f grafana
cd grafana-stack && docker-compose logs -f influxdb
```

## 🌐 Alternative Options

### Option 1: K6 Cloud (Managed)
```bash
# Sign up at k6.io/cloud  
k6 cloud main-performance-test.js
```

### Option 2: Grafana Cloud (Free Tier)
```bash
# Sign up at grafana.com
# Configure cloud endpoints in tests
```

### Option 3: Local Prometheus Setup
```bash
# Use Prometheus instead of InfluxDB
k6 run --out experimental-prometheus-rw=http://localhost:9090/api/v1/write main-performance-test.js
```

## 🎯 Benefits

### For Developers
- **Real-time feedback** during test development
- **Visual debugging** of performance issues  
- **Historical comparison** of test runs

### For Teams
- **Shared dashboards** for stakeholder reviews
- **Executive reporting** with visual metrics
- **Trend analysis** across releases

### For Operations
- **Capacity planning** with visual load patterns
- **Performance baselines** for production comparison
- **Alert setup** for threshold violations

---

**🚀 Ready to visualize your K6 performance tests with beautiful Grafana dashboards!**