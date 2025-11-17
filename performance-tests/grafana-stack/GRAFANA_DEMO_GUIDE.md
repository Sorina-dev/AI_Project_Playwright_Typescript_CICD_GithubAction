# Steps to run it

🚨 Important Notes:
InfluxDB and Grafana start together with docker-compose up -d
No need to start them separately
Grafana is pre-configured with InfluxDB data source
Data flows: K6 → InfluxDB → Grafana → Live Dashboard
Use port 3001 for Grafana (not 3000 as in some docs)

🎯 The Correct Order:
✅ Start Docker: docker-compose up -d (starts InfluxDB + Grafana)
✅ Access Grafana: http://localhost:3001 (login admin/admin123)
✅ Run K6 Test: k6 run --out influxdb=http://localhost:8086/k6 tests/your-test.js
✅ Watch Live Data: In Grafana dashboard/explore view


Step 1: Start Docker Stack 🐳
```powershell
# Navigate to grafana stack directory
cd C:\Users\sorina.cristian\AI_Project_Playwright_Typescript_CICD_GithubAction\performance-tests\grafana-stack

# Start all containers (InfluxDB, Grafana, Prometheus)
docker-compose up -d
```
✅ Verify containers are running:
```powershell
docker ps | Select-String "k6-"
```
You should see:

k6-influxdb (port 8086)
k6-grafana (port 3001)
k6-prometheus (port 9090)

✅Step 2: Access Grafana Dashboard 🖥️
Open browser: http://localhost:3001
Login credentials:
Username: admin
Password: admin123
✅Step 3: Verify Data Source (First Time Only) ⚙️
Click gear icon ⚙️ (Configuration) → Data Sources
Should see "InfluxDB-K6" already configured
Click "Test & Save" → Should show green "Data source is working"
✅Step 4: Run K6 Test with InfluxDB Output 🚀
```powershell
# Navigate back to performance tests
cd C:\Users\sorina.cristian\AI_Project_Playwright_Typescript_CICD_GithubAction\performance-tests

# Run any test with Grafana output
k6 run --out influxdb=http://localhost:8086/k6 tests/get-requests.test.js
```
✅ You should see in K6 output:
output: InfluxDBv1 (http://localhost:8086/k6)  ← Data flowing to Grafana!



# 🎯 Grafana Real-Time Monitoring: Complete Step-by-Step Guide

This guide shows you **exactly** how to see live performance monitoring with Grafana while K6 tests are running.

## 📋 Prerequisites Check
- ✅ Docker Desktop installed and running
- ✅ K6 installed and working  
- ✅ Grafana stack containers running (`docker ps` shows k6-grafana, k6-influxdb)
- ✅ Performance tests ready

---

## 🚀 PART 1: Access Grafana Dashboard

### **Step 1: Open Grafana in Browser**
1. **Open your web browser**
2. **Navigate to:** `http://localhost:3001` 
3. **You should see**: Grafana login page

### **Step 2: Login to Grafana**
1. **Username:** `admin`
2. **Password:** `admin123` 
3. **Click "Sign In"**
4. **You should see**: Grafana home dashboard

### for 1st time
Configure InfluxDB Data Source
Once you successfully log in, you'll need to add the InfluxDB data source:

After logging in, click the gear icon ⚙️ (Configuration)
Click "Data Sources"
Click "Add Data Source"
Select "InfluxDB"
Configure with these settings:
URL: http://k6-influxdb:8086
Database: k6
User: admin
Password: admin123
Click "Save & Test" - should show green "Data source is working"

### **Step 3: Verify Data Source Connection**
1. **Click the gear icon** ⚙️ in left sidebar (Configuration)
2. **Click "Data Sources"**
3. **You should see "InfluxDB"** in the list
4. **Click on "InfluxDB"** 
5. **Scroll down and click "Test & Save"**
6. **You should see**: "Data source is working" (green checkmark)

---

## 🚀 PART 2: Start K6 Test for Live Data

### **Step 4: Run K6 Test with Grafana Output**

Open PowerShell and run:
```powershell
# Navigate to performance tests directory
cd "C:\Users\sorina.cristian\AI_Project_Playwright_Typescript_CICD_GithubAction\performance-tests"

# Run GET requests test with live monitoring
k6 run --out influxdb=http://localhost:8086/k6 ".\tests\get-requests.test.js"
```

**✅ You should see:**
```
         /\      Grafana   /‾‾/  
    /\  /  \     |\  __   /  /   
   /  \/    \    | |/ /  /   ‾‾\ 
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/ 

     execution: local
        script: .\tests\get-requests.test.js
        output: InfluxDBv1 (http://localhost:8086)  ← This means data is flowing to Grafana!

INFO[0000] 🚀 Starting GET Requests Performance Test
INFO[0000] 📍 Target: https://jsonplaceholder.typicode.com
INFO[0000] ✅ JSONPlaceholder API connectivity verified
```

**Keep this test running** while you follow the next steps in Grafana!

---

## 🚀 PART 3: See Real-Time Data in Grafana

### **Step 5: Explore Live Metrics**
1. **Go back to Grafana browser tab**
2. **Click the compass icon** 🧭 in left sidebar (**Explore**)
3. **Select "InfluxDB"** from the dropdown at the top
4. **In the query box, enter:**
   ```sql
   SELECT mean("value") FROM "http_req_duration" 
   WHERE time > now() - 2m 
   GROUP BY time(5s) fill(null)
   ```
5. **Click the blue "Run Query" button**
6. **🎉 You should see a live graph** with response times updating every 5 seconds!

### **Step 6: Try Different Live Queries**

#### Request Rate (Requests per Second):
```sql
SELECT count("value") FROM "http_reqs" 
WHERE time > now() - 2m 
GROUP BY time(5s) fill(null)
```

#### Virtual Users Count:
```sql
SELECT last("value") FROM "vus" 
WHERE time > now() - 2m 
GROUP BY time(5s) fill(null)
```

#### Error Rate Percentage:
```sql
SELECT mean("value")*100 FROM "http_req_failed" 
WHERE time > now() - 2m 
GROUP BY time(5s) fill(null)

-- Virtual Users (concurrent connections)
SELECT last("value") FROM "vus" WHERE $timeFilter

-- Iterations per second  
SELECT mean("value") FROM "iterations" WHERE $timeFilter GROUP BY time($__interval)

-- Data transfer rates
SELECT mean("value") FROM "data_received" WHERE $timeFilter GROUP BY time($__interval)
SELECT mean("value") FROM "data_sent" WHERE $timeFilter GROUP BY time($__interval)

-- Response times (this is what you want to focus on)
SELECT mean("value") FROM "http_req_duration" WHERE $timeFilter GROUP BY time($__interval)

-- Request rate (load on server)
SELECT count("value") FROM "http_reqs" WHERE $timeFilter GROUP BY time($__interval) 

-- Error rate (server stress indicator)
SELECT mean("value")*100 FROM "http_req_failed" WHERE $timeFilter GROUP BY time($__interval)

-- Connection times (server responsiveness)
SELECT mean("value") FROM "http_req_connecting" WHERE $timeFilter GROUP BY time($__interval)
SELECT mean("value") FROM "http_req_waiting" WHERE $timeFilter GROUP BY time($__interval)

--Server Load Indicator (Request Rate)
SELECT count("value") FROM "http_reqs" 
WHERE $timeFilter 
GROUP BY time($__interval) fill(null)

-- Average response time (server performance under load)
SELECT mean("value") FROM "http_req_duration" 
WHERE $timeFilter 
GROUP BY time($__interval) fill(null)

-- 95th percentile (worst-case performance)
SELECT percentile("value", 95) FROM "http_req_duration" 
WHERE $timeFilter 
GROUP BY time($__interval) fill(null)

-- Error rate (server overload indicator)
SELECT mean("value")*100 FROM "http_req_failed" 
WHERE $timeFilter 
GROUP BY time($__interval) fill(null)

-- Connection failures (server capacity issues)
SELECT mean("value") FROM "http_req_connecting" 
WHERE $timeFilter 
GROUP BY time($__interval) fill(null)

-- Data received per second (server output capacity)
SELECT mean("value") FROM "data_received" 
WHERE $timeFilter 
GROUP BY time($__interval) fill(null)

-- Requests per endpoint
SELECT count("value") FROM "http_reqs" 
WHERE $timeFilter 
GROUP BY "name", time($__interval) fill(null)



**🔄 Each query shows live updating data** from your running K6 test!

---

## 🚀 PART 4: Create Real-Time Dashboard

### **Step 7: Build Your Performance Dashboard**
1. **Click the "+" icon** in left sidebar  
2. **Select "Create" → "Dashboard"**
3. **Click "Add Panel"**

#### Panel 1: Response Times
1. **Query field:**
   ```sql
   SELECT mean("value") FROM "http_req_duration" 
   WHERE $timeFilter GROUP BY time($__interval) fill(null)
   ```
2. **Panel Title:** "Response Times (ms)"
3. **Right sidebar** → **Field** → **Unit** → **Time** → **milliseconds (ms)**
4. **Click "Apply"**

#### Panel 2: Request Rate  
1. **Click "Add Panel"** button
2. **Query field:**
   ```sql
   SELECT count("value") FROM "http_reqs" 
   WHERE $timeFilter GROUP BY time($__interval) fill(null)
   ```
3. **Panel Title:** "Requests per Second"
4. **Unit:** "Per Second" → "requests/sec"
5. **Click "Apply"**

#### Panel 3: Virtual Users (Live Counter)
1. **Add Panel** → **Visualization** → **Stat** 
2. **Query:**
   ```sql
   SELECT last("value") FROM "vus" 
   WHERE $timeFilter GROUP BY time($__interval) fill(null)
   ```
3. **Panel Title:** "Active Virtual Users"
4. **Click "Apply"**

#### Panel 4: Success Rate
1. **Add Panel**
2. **Query:**
   ```sql
   SELECT (1-mean("value"))*100 FROM "http_req_failed" 
   WHERE $timeFilter GROUP BY time($__interval) fill(null)
   ```
3. **Panel Title:** "Success Rate (%)"
4. **Unit:** "Percent (0-100)"
5. **Click "Apply"**

### **Step 8: Enable Auto-Refresh**
1. **Click the refresh icon** ↻ in top-right corner
2. **Select "5s"** for 5-second auto-refresh
3. **🎉 Dashboard now updates automatically** every 5 seconds!

### **Step 9: Save Your Dashboard**
1. **Click the disk icon** 💾 in top toolbar
2. **Name:** "K6 Live Performance Monitoring"
3. **Click "Save"**

---

## 🎯 What You Should See Live

### **While K6 Test is Running:**

✅ **Response Times Panel**: Line graph showing average response times  
✅ **Requests/Second Panel**: Bar chart showing request throughput  
✅ **Virtual Users Panel**: Number showing current active users (1-7)  
✅ **Success Rate Panel**: Percentage (should be ~100%)  

### **Real-Time Behavior:**
- 📊 **Graphs update every 5 seconds** with fresh data
- 🔄 **Counters change** as virtual users ramp up/down  
- 📈 **Lines move** showing performance trends
- ⚡ **Zero delay** - see performance issues immediately

---

## 🚀 PART 5: Advanced Real-Time Features

### **Step 10: Time Range Selection**
1. **Click time range** in top-right (e.g., "Last 6 hours")
2. **Select "Last 5 minutes"** for focused real-time view
3. **Toggle "Auto"** to keep time window moving forward

### **Step 11: Set Performance Alerts** (Optional)
1. **Edit any panel** 
2. **Alert tab** → **Create Alert**
3. **Condition**: "IS ABOVE 1000" (for 1-second response time threshold)
4. **Notification**: Add email/Slack webhook
5. **🚨 Get alerted** when performance degrades in real-time!

### **Step 12: Multiple Test Monitoring**
Run different tests to see different patterns:

#### Quick Stress Test:
```powershell
k6 run --out influxdb=http://localhost:8086/k6 ".\tests\stress-test.js"
```
**👀 Watch:** Response times spike during stress phases

#### Long Endurance Test:
```powershell  
k6 run --out influxdb=http://localhost:8086/k6 ".\tests\endurance-test.js"
```
**👀 Watch:** 30-minute stability patterns

---

## 🎯 Troubleshooting Real-Time View

### **No Data Appearing?**
1. ✅ **Check test is running**: Look for K6 console output
2. ✅ **Verify time range**: Set to "Last 5 minutes"
3. ✅ **Check query**: Run in Explore first
4. ✅ **Refresh dashboard**: Click refresh icon

### **Data Too Slow?**  
1. 🔄 **Increase refresh rate**: Set to 1s or 5s
2. ⏱️ **Narrow time range**: "Last 2 minutes" instead of "Last 1 hour"
3. 📊 **Simplify queries**: Remove complex aggregations

### **Performance Issues?**
1. 💾 **Close other browser tabs** (Grafana can be resource-intensive)  
2. 🔧 **Increase Docker memory**: Docker Desktop → Settings → Resources
3. ⚡ **Use Chrome/Edge**: Better performance than Firefox

---

## 🏆 Success Checklist

By the end, you should have:

- ✅ **Live updating graphs** showing performance metrics
- ✅ **Auto-refreshing dashboard** (every 5 seconds)  
- ✅ **Multiple panels** tracking different metrics
- ✅ **Real-time alerts** setup (optional)
- ✅ **Understanding** of how to monitor performance live

**🎉 You now have professional-grade real-time performance monitoring!**

---

## ⚡ Quick Reference Commands

```powershell
# Access Grafana
http://localhost:3001 (admin/admin123)

# Start live monitoring test
k6 run --out influxdb=http://localhost:8086/k6 ".\tests\get-requests.test.js"

# Basic real-time query
SELECT mean("value") FROM "http_req_duration" WHERE time > now() - 2m GROUP BY time(5s)

# Stop containers when done
cd grafana-stack && docker-compose down
```

**🚀 Ready to monitor performance like a pro!**
```bash
# Go back to performance-tests directory  
cd ..
npm run test:grafana
```

**What happens:**
- ✅ K6 sends metrics to InfluxDB (localhost:8086)
- ✅ Grafana reads from InfluxDB and shows real-time charts
- ✅ You see live performance data updating every few seconds

### **Step 6: Watch the Magic! 🎉**

**In Grafana dashboard you'll see:**
- 📊 **Virtual Users**: Live count (starts at 0, ramps up to 50, back to 0)
- ⚡ **Request Rate**: Requests per second in real-time
- ❌ **Error Rate**: Percentage of failed requests  
- ⏱️ **Response Times**: P50, P95, P99 percentiles
- 📈 **Live Charts**: Performance metrics updating during the test

## 🎯 What to Look For

### **During Test Startup (0-60 seconds):**
- Virtual Users: 0 → 50 (gradual increase)
- Request Rate: 0 → 20+ requests/second
- Response Times: Should stay under 1000ms
- Error Rate: Should remain close to 0%

### **During Peak Load (60-240 seconds):**
- Virtual Users: Steady at 50
- Request Rate: Consistent 20-30 RPS
- Response Times: Stable performance
- HTTP Status: Mostly 200s (green)

### **During Ramp Down (240-300 seconds):**
- Virtual Users: 50 → 0 (gradual decrease)
- Request Rate: Decreases to 0
- Charts show complete test cycle

## 🔧 Troubleshooting

### **If Grafana doesn't start:**
```bash
# Check Docker status
docker ps

# View logs
docker-compose logs grafana
docker-compose logs influxdb
```

### **If no data appears in Grafana:**
1. Check data source connection (InfluxDB should be connected)
2. Verify K6 is sending to correct InfluxDB URL
3. Check time range in dashboard (last 5 minutes)

### **If browser can't connect:**
- Wait 30 seconds after starting docker-compose
- Try: http://127.0.0.1:3000 instead of localhost
- Check Windows Firewall isn't blocking port 3000

## 📊 Dashboard Tour

### **Top Row - Key Metrics:**
1. **Virtual Users** - Current active users (should match test pattern)
2. **Request Rate** - RPS (requests per second)
3. **Error Rate %** - Failed requests percentage  
4. **Response Time P95** - 95th percentile response time

### **Charts Row:**
1. **Response Times Over Time** - Shows P50, P95, P99 trends
2. **Virtual Users Over Time** - User ramp pattern visualization

### **Analysis Row:**  
1. **HTTP Status Codes** - Pie chart of 200, 404, 500 responses
2. **Request Rate Trend** - RPS over test duration
3. **Test Progress** - Completion percentage for long tests

## 🎯 Demo Script

### **What to Say/Do:**
1. **"Let's see K6 performance testing with real-time monitoring"**
2. **Start the test**: `npm run test:grafana`  
3. **Switch to Grafana**: Show live updating dashboard
4. **Point out metrics**: "Watch the virtual users ramp up... see response times... error rate staying low..."
5. **Highlight trends**: "This chart shows how performance changes during the load test"
6. **Show test completion**: "Now users are ramping down... test complete!"

### **Key Talking Points:**
- ✅ **Real-time visibility** into performance during tests
- ✅ **Professional dashboards** for stakeholder presentations  
- ✅ **Historical comparison** between different test runs
- ✅ **Alert capabilities** when performance degrades
- ✅ **Team collaboration** with shared dashboards

---

## ⚡ Quick Commands Summary

```bash
# Start monitoring
cd grafana-stack && docker-compose up -d

# Run test with Grafana
cd .. && npm run test:grafana

# Access dashboard  
# Browser: http://localhost:3000 (admin/admin123)

# Stop monitoring
cd grafana-stack && docker-compose down
```

**🚀 Ready to see beautiful real-time performance monitoring in action!**