#!/usr/bin/env node

/**
 * SSL Auto Health Check Script
 * Automatically detects and monitors HTTPS development servers
 */

const https = require('https');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);
const interval = parseInt(process.argv[2]) || 1000;

const defaultPorts = [5173, 3000, 8080, 4000, 5000];
let currentPort = 5173;
let isHealthy = false;
let consecutiveFailures = 0;
let startTime = Date.now();

const checkServer = (port) => {
  return new Promise((resolve) => {
    const req = https.get(`https://localhost:${port}`, (res) => {
      resolve({ healthy: true, status: res.statusCode, port });
    });

    req.on('error', (err) => {
      resolve({ healthy: false, error: err.code, port });
    });

    req.setTimeout(3000, () => {
      req.destroy();
      resolve({ healthy: false, error: 'timeout', port });
    });
  });
};

const findActiveServer = async () => {
  for (const port of defaultPorts) {
    try {
      const result = await checkServer(port);
      if (result.healthy) {
        return result.port;
      }
    } catch (error) {
      // Continue to next port
    }
  }
  return null;
};

const startMonitoring = async (port) => {
  console.log(`🔍 Starting SSL health check for: https://localhost:${port}`);
  console.log(`⏱️  Check interval: ${interval}ms`);
  console.log(`🚀 Press Ctrl+C to stop\n`);

  setInterval(async () => {
    const result = await checkServer(port);
    
    if (result.healthy) {
      if (!isHealthy) {
        const uptime = Date.now() - startTime;
        console.log(`✅ Server is healthy! (${result.status}) - Port: ${port} - Uptime: ${formatUptime(uptime)}`);
        isHealthy = true;
        consecutiveFailures = 0;
      }
    } else {
      consecutiveFailures++;
      const uptime = Date.now() - startTime;
      
      if (consecutiveFailures === 1) {
        console.log(`❌ Server is down! (${result.error}) - Port: ${port}`);
        console.log(`⏱️  Started monitoring at: ${new Date(startTime).toLocaleTimeString()}`);
      } else {
        console.log(`❌ Still down... (${consecutiveFailures} consecutive failures) - Port: ${port} - Uptime: ${formatUptime(uptime)}`);
      }
      
      isHealthy = false;
    }
  }, interval);
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
  console.log(`\n🛑 SSL health check stopped - Total uptime: ${formatUptime(uptime)}`);
  process.exit(0);
};

// Handle graceful shutdown
process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);

// Main execution
const main = async () => {
  console.log('🔍 Auto-detecting HTTPS development server...');
  
  const activePort = await findActiveServer();
  
  if (activePort) {
    console.log(`✅ Found active server on port ${activePort}`);
    await startMonitoring(activePort);
  } else {
    console.log('❌ No active HTTPS development server found');
    console.log('💡 Make sure to run: npm run dev:ssl');
    process.exit(1);
  }
};

main().catch((error) => {
  console.error('💥 Error starting health check:', error.message);
  process.exit(1);
});
