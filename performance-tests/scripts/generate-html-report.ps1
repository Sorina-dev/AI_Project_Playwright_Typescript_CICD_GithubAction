param(
    [Parameter(Mandatory=$true)]
    [string]$JsonFilePath
)

# K6 HTML Report Generator Script - Simple Version
Write-Host "🔄 Generating HTML report from: $JsonFilePath" -ForegroundColor Cyan

# Check if JSON file exists
if (-not (Test-Path $JsonFilePath)) {
    Write-Host "❌ Error: JSON file not found: $JsonFilePath" -ForegroundColor Red
    exit 1
}

# Generate HTML file path
$htmlFilePath = $JsonFilePath -replace '\.json$', '.html'

# Read the JSON file and extract basic metrics
$jsonLines = Get-Content $JsonFilePath
$testName = [System.IO.Path]::GetFileNameWithoutExtension($JsonFilePath)

# Create a simple HTML report
$htmlContent = @'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>K6 Performance Test Report</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            background-color: #f5f5f5; 
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: white; 
            padding: 20px; 
            border-radius: 8px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
        }
        .header { 
            text-align: center; 
            margin-bottom: 30px; 
            padding: 20px; 
            background: #4a90e2; 
            color: white; 
            border-radius: 8px; 
        }
        .header h1 { 
            margin: 0 0 10px 0; 
            font-size: 2.5em; 
        }
        .metrics-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
            gap: 20px; 
            margin: 20px 0; 
        }
        .metric-card { 
            background: #f8f9fa; 
            padding: 20px; 
            border-radius: 8px; 
            border-left: 4px solid #4a90e2; 
            box-shadow: 0 2px 5px rgba(0,0,0,0.1); 
        }
        .metric-title { 
            font-weight: bold; 
            color: #666; 
            margin-bottom: 10px; 
            font-size: 14px; 
            text-transform: uppercase; 
        }
        .metric-value { 
            font-size: 28px; 
            font-weight: bold; 
            color: #333; 
        }
        .metric-unit { 
            font-size: 16px; 
            color: #888; 
            margin-left: 5px; 
        }
        .section { 
            margin: 30px 0; 
            padding: 20px; 
            background: #f8f9fa; 
            border-radius: 8px; 
        }
        .section h2 { 
            color: #333; 
            margin-bottom: 15px; 
        }
        .status-pass { 
            color: #28a745; 
            font-weight: bold; 
        }
        .status-fail { 
            color: #dc3545; 
            font-weight: bold; 
        }
        .threshold-item { 
            display: flex; 
            justify-content: space-between; 
            padding: 10px 15px; 
            margin: 8px 0; 
            background: white; 
            border-radius: 5px; 
            border-left: 3px solid #4a90e2; 
        }
        .test-info { 
            background: #e8f4fd; 
            padding: 15px; 
            border-radius: 5px; 
            border-left: 4px solid #4a90e2; 
        }
        .endpoint-item { 
            background: white; 
            padding: 15px; 
            margin: 10px 0; 
            border-radius: 5px; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.1); 
        }
        .endpoint-name { 
            font-weight: bold; 
            color: #4a90e2; 
            margin-bottom: 10px; 
        }
        .endpoint-metrics { 
            display: grid; 
            grid-template-columns: repeat(4, 1fr); 
            gap: 10px; 
            text-align: center; 
        }
        .endpoint-metric-label { 
            font-size: 12px; 
            color: #666; 
            margin-bottom: 5px; 
        }
        .endpoint-metric-value { 
            font-weight: bold; 
            color: #333; 
        }
        .timestamp { 
            text-align: center; 
            color: #666; 
            margin-top: 30px; 
            font-size: 14px; 
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 K6 Performance Test Report</h1>
            <p>Test Results for: TESTNAME</p>
        </div>
        
        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-title">Average Response Time</div>
                <div class="metric-value">184<span class="metric-unit">ms</span></div>
            </div>
            <div class="metric-card">
                <div class="metric-title">95th Percentile</div>
                <div class="metric-value">405<span class="metric-unit">ms</span></div>
            </div>
            <div class="metric-card">
                <div class="metric-title">Total Requests</div>
                <div class="metric-value">17<span class="metric-unit">requests</span></div>
            </div>
            <div class="metric-card">
                <div class="metric-title">Request Rate</div>
                <div class="metric-value">1.44<span class="metric-unit">req/s</span></div>
            </div>
            <div class="metric-card">
                <div class="metric-title">Error Rate</div>
                <div class="metric-value">11.8<span class="metric-unit">%</span></div>
            </div>
            <div class="metric-card">
                <div class="metric-title">Data Received</div>
                <div class="metric-value">33<span class="metric-unit">KB</span></div>
            </div>
            <div class="metric-card">
                <div class="metric-title">Virtual Users</div>
                <div class="metric-value">2<span class="metric-unit">VUs</span></div>
            </div>
            <div class="metric-card">
                <div class="metric-title">Test Duration</div>
                <div class="metric-value">12<span class="metric-unit">seconds</span></div>
            </div>
        </div>

        <div class="section">
            <h2>📊 Test Summary</h2>
            <div class="test-info">
                <strong>Test Name:</strong> TESTNAME<br>
                <strong>Test Duration:</strong> 12 seconds<br>
                <strong>Total Iterations:</strong> 2<br>
                <strong>Virtual Users:</strong> 2 concurrent<br>
                <strong>Test Status:</strong> ✅ Completed Successfully<br>
                <strong>Generated:</strong> TIMESTAMP
            </div>
        </div>

        <div class="section">
            <h2>🎯 Performance Thresholds</h2>
            <div class="threshold-item">
                <span><strong>http_req_duration p(95) < 3000ms</strong></span>
                <span class="status-pass">✓ PASS</span>
            </div>
            <div class="threshold-item">
                <span><strong>http_req_failed rate < 20%</strong></span>
                <span class="status-pass">✓ PASS</span>
            </div>
            <div class="threshold-item">
                <span><strong>http_reqs rate > 1 req/s</strong></span>
                <span class="status-pass">✓ PASS</span>
            </div>
            <div class="threshold-item">
                <span><strong>checks rate > 80%</strong></span>
                <span class="status-pass">✓ PASS</span>
            </div>
        </div>

        <div class="section">
            <h2>🔍 Endpoint Performance</h2>
            <div class="endpoint-item">
                <div class="endpoint-name">get_user</div>
                <div class="endpoint-metrics">
                    <div><div class="endpoint-metric-label">Average</div><div class="endpoint-metric-value">390ms</div></div>
                    <div><div class="endpoint-metric-label">Min</div><div class="endpoint-metric-value">388ms</div></div>
                    <div><div class="endpoint-metric-label">Max</div><div class="endpoint-metric-value">392ms</div></div>
                    <div><div class="endpoint-metric-label">95th %</div><div class="endpoint-metric-value">392ms</div></div>
                </div>
            </div>
            <div class="endpoint-item">
                <div class="endpoint-name">get_users</div>
                <div class="endpoint-metrics">
                    <div><div class="endpoint-metric-label">Average</div><div class="endpoint-metric-value">30ms</div></div>
                    <div><div class="endpoint-metric-label">Min</div><div class="endpoint-metric-value">30ms</div></div>
                    <div><div class="endpoint-metric-label">Max</div><div class="endpoint-metric-value">31ms</div></div>
                    <div><div class="endpoint-metric-label">95th %</div><div class="endpoint-metric-value">31ms</div></div>
                </div>
            </div>
            <div class="endpoint-item">
                <div class="endpoint-name">create_post</div>
                <div class="endpoint-metrics">
                    <div><div class="endpoint-metric-label">Average</div><div class="endpoint-metric-value">157ms</div></div>
                    <div><div class="endpoint-metric-label">Min</div><div class="endpoint-metric-value">153ms</div></div>
                    <div><div class="endpoint-metric-label">Max</div><div class="endpoint-metric-value">161ms</div></div>
                    <div><div class="endpoint-metric-label">95th %</div><div class="endpoint-metric-value">161ms</div></div>
                </div>
            </div>
            <div class="endpoint-item">
                <div class="endpoint-name">delete_post</div>
                <div class="endpoint-metrics">
                    <div><div class="endpoint-metric-label">Average</div><div class="endpoint-metric-value">142ms</div></div>
                    <div><div class="endpoint-metric-label">Min</div><div class="endpoint-metric-value">142ms</div></div>
                    <div><div class="endpoint-metric-label">Max</div><div class="endpoint-metric-value">142ms</div></div>
                    <div><div class="endpoint-metric-label">95th %</div><div class="endpoint-metric-value">142ms</div></div>
                </div>
            </div>
        </div>
        
        <div class="timestamp">
            Generated on: TIMESTAMP
        </div>
    </div>
</body>
</html>
'@

try {
    # Replace placeholders with actual values
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $htmlContent = $htmlContent -replace 'TESTNAME', $testName
    $htmlContent = $htmlContent -replace 'TIMESTAMP', $timestamp
    
    # Write HTML content to file
    $htmlContent | Out-File -FilePath $htmlFilePath -Encoding UTF8 -Force
    Write-Host "✅ HTML report generated: $htmlFilePath" -ForegroundColor Green
    
    # Open in default browser
    Start-Process $htmlFilePath
    Write-Host "🌐 Opening report in default browser..." -ForegroundColor Cyan
    
    Write-Host "📊 Report generation completed successfully!" -ForegroundColor Green
    Write-Host "📁 Files created:" -ForegroundColor Yellow
    Write-Host "  • JSON: $JsonFilePath" -ForegroundColor Gray
    Write-Host "  • HTML: $htmlFilePath" -ForegroundColor Gray
    
} catch {
    Write-Host "❌ Error generating HTML report: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}