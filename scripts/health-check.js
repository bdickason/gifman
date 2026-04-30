#!/usr/bin/env node

/**
 * Health check script for development server
 * Monitors server availability and provides status updates
 */

const http = require('http');
const https = require('https');

const url = process.argv[2];
const interval = parseInt(process.argv[3]) || 1000;

if (!url) {
  console.error('Usage: node health-check.js <url> [interval]');
  console.error('Example: node health-check.js http://localhost:5173 1000');
  process.exit(1);
}

const isHttps = url.startsWith('https://');
const client = isHttps ? https : http;

let isHealthy = false;
let consecutiveFailures = 0;
let startTime = Date.now();

const checkHealth = () => {
  const req = client.get(url, (res) => {
    if (res.statusCode === 200) {
      if (!isHealthy) {
        const uptime = Date.now() - startTime;
        console.log(`✅ Server is healthy! (${res.statusCode}) - Uptime: ${formatUptime(uptime)}`);
        isHealthy = true;
        consecutiveFailures = 0;
      }
    } else {
      console.log(`⚠️  Server responded with status: ${res.statusCode}`);
      isHealthy = false;
    }
  });

  req.on('error', (err) => {
    consecutiveFailures++;
    const uptime = Date.now() - startTime;
    
    if (consecutiveFailures === 1) {
      console.log(`❌ Server is down! (${err.code || err.message})`);
      console.log(`⏱️  Started monitoring at: ${new Date(startTime).toLocaleTimeString()}`);
    } else {
      console.log(`❌ Still down... (${consecutiveFailures} consecutive failures) - Uptime: ${formatUptime(uptime)}`);
    }
    
    isHealthy = false;
  });

  req.setTimeout(5000, () => {
    req.destroy();
    console.log('⏰ Request timeout');
    isHealthy = false;
  });
};

const formatUptime = (ms) => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

const handleExit = () => {
  const uptime = Date.now() - startTime;
  console.log(`\n🛑 Health check stopped - Total uptime: ${formatUptime(uptime)}`);
  process.exit(0);
};

// Handle graceful shutdown
process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);

console.log(`🔍 Starting health check for: ${url}`);
console.log(`⏱️  Check interval: ${interval}ms`);
console.log(`🚀 Press Ctrl+C to stop\n`);

// Start health checks
setInterval(checkHealth, interval);
checkHealth(); // Initial check
