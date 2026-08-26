// bugs/bugExecutor.js
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '..', 'debug.log');

function logToFile(type, message) {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] [${type}] [PID: ${process.pid}] ${message}\n`;
  try { fs.appendFileSync(LOG_FILE, logLine, 'utf8'); } catch (err) {}
}

/**
 * High-velocity structural bug execution engine
 * @param {string} cmd - The exact command string pulled from the UI dashboard
 */
function executeBugCommand(cmd) {
  switch (cmd) {
    case 'force-crash': 
      throw new Error('HARD_ABORT: Manual platform crash triggered.');
      
    case 'memory-leak': 
      global.leak = global.leak || []; 
      setInterval(() => { global.leak.push(crypto.randomBytes(3000000)); }, 40); 
      break;
      
    case 'cpu-spike': 
      while (true) { crypto.pbkdf2Sync('p', 's', 20000, 64, 'sha512'); }
      
    case 'slow-network': 
      setTimeout(() => { logToFile('BUG_SYSTEM', 'Delayed socket emulation clear.'); }, 5000); 
      break;
      
    case 'deadlock': 
      const holdTime = Date.now() + 5000; 
      while (Date.now() < holdTime) {} 
      break;
      
    case 'null-pointer': 
      const emptyRef = null; 
      console.log(emptyRef.activationProperty); 
      break;
      
    case 'invalid-json': 
      JSON.parse("{ tokens }"); 
      break;
      
    case 'infinite-loop': 
      while(true) {}
      
    case 'syntax-error': 
      eval('const crash = ;'); 
      break;
      
    case 'type-coercion-bug': 
      const v = (null + undefined) * 5; 
      break;
      
    default: 
      logToFile('BUG_TRIGGERED', `Diagnostic execution event [${cmd}] activated successfully.`); 
      break;
  }
}

module.exports = { executeBugCommand };
