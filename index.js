// index.js
const os = require('os');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { default: makeWASocket, useMultiFileAuthState, delay } = require('@whiskeysockets/baileys');
const pino = require('pino');

// Clean decoupled file imports
const { handleBotCommand } = require('./commands/botCommands');
const { BUG_MANIFEST } = require('./bugs/bugManifest');
const { executeBugCommand } = require('./bugs/bugExecutor');

const LOG_FILE = path.join(__dirname, 'debug.log');
const PORT = process.env.PORT || 3000;

// Global live pointer to show tracking states on your visual dashboard screen
let globalLivePairingCode = "WAITING FOR VARIABLE...";
let whatsappEngineStatus = "INITIALIZING CORE SANCTUM...";

function logToFile(type, message) {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] [${type}] [PID: ${process.pid}] ${message}\n`;
  try { fs.appendFileSync(LOG_FILE, logLine, 'utf8'); } catch (err) {}
}

// Global safety isolation shields to capture dashboard runtime shocks
process.on('uncaughtException', (err) => { 
  logToFile('UNCAUGHT_FAULT', err.stack); 
  console.error('🛡️ Sanctum Intercepted Runtime Error:', err.message);
});

process.on('unhandledRejection', (reason) => { 
  logToFile('UNHANDLED_PROMISE', String(reason)); 
  console.error('🛡️ Sanctum Intercepted Promise Rejection:', reason);
});

// Categorize your bug arrays into dangerous and non-dangerous tiers for visual styling differentiation
const DANGEROUS_BUGS = [
  'force-crash', 'memory-leak', 'cpu-spike', 'deadlock', 'infinite-loop',
  'stack-overflow', 'v8-heap-exhaust', 'buffer-alloc-error', 'heap-buffer-overflow', 'segmentation-fault'
];

// ========================================================
// WHATSAPP CLOUD BOT MODULE WITH LIVE WEB CODES TELEMETRY
// ========================================================
async function initializeWhatsAppBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_session');
  
  const sock = makeWASocket({
    logger: pino({ level: 'silent' }),
    auth: state,
    printQRInTerminal: false,
    browser: ["Ubuntu", "Chrome", "20.0.04"] 
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const reason = lastDisconnect?.error?.output?.statusCode;
      whatsappEngineStatus = "CONNECTION_COLLAPSED [RETRIES EN-ROUTE]";
      if (reason !== 401) {
        console.log('🔄 Reconnecting WhatsApp Engine...');
        setTimeout(() => initializeWhatsAppBot(), 5000);
      }
    } else if (connection === 'open') {
      whatsappEngineStatus = "CONNECTED TO SANCTUM [LIVE]";
      globalLivePairingCode = "LINK COMPLETED SUCCESSFULLY";
      console.log('✅ WhatsApp Engine Linked and Operating Online!');
    }
  });

  sock.ev.on('messages.upsert', async (chatUpdate) => {
    try {
      if (!chatUpdate.messages || chatUpdate.messages.length === 0) return;
      const singleMsg = chatUpdate.messages[0];
      if (!singleMsg.message || singleMsg.key.fromMe) return;

      const text = singleMsg.message.conversation || (singleMsg.message.extendedTextMessage && singleMsg.message.extendedTextMessage.text) || '';
      if (!text.startsWith('!')) return; 

      const from = singleMsg.key.remoteJid;
      const argsList = text.trim().slice(1).split(/ +/);
      const botCommand = argsList.shift().toLowerCase();

      await handleBotCommand(sock, from, botCommand, argsList);
    } catch (e) {
      logToFile('BOT_EXEC_ERROR', e.message);
    }
  });

  if (!sock.authState.creds.registered) {
    whatsappEngineStatus = "GENERATING PAIRING SIGNAL...";
    await delay(7000); 

    const cloudNum = process.env.WA_PHONE_NUMBER || '';
    const sanitizedNum = cloudNum.replace(/[^0-9]/g, '');

    if (!sanitizedNum) {
      whatsappEngineStatus = "CONFIGURATION FAILURE: MISSING PHONE VARIABLE";
      globalLivePairingCode = "SET WA_PHONE_NUMBER IN CLOUD PANEL";
      console.log('\n❌ [CONFIGURATION ERROR] -> Missing WA_PHONE_NUMBER environment variable.');
      return;
    }

    try {
      console.log(`📡 Cloud Pipeline requesting Pairing notification for: [${sanitizedNum}]`);
      const cloudPairingCode = await sock.requestPairingCode(sanitizedNum);
      // EXPORT TO DASHBOARD VIEW: Intercept pairing code string and pipe into state memory array
      globalLivePairingCode = cloudPairingCode;
      whatsappEngineStatus = "AWAITING AUTHENTICATION INPUT...";
      console.log('\n======================================================');
      console.log(`🔥 YOUR WHATSAPP PAIRING CODE: ${cloudPairingCode}`);
      console.log('======================================================\n');
    } catch (err) {
      console.error('❌ Cloud Pairing Generation Fault:', err.message);
      whatsappEngineStatus = "GENERATION INTERRUPTION ENCOUNTERED";
    }
  }
}

// ========================================================
// SINGLE PORT HTTP DIABLO PAIRING DASHBOARD PANEL
// ========================================================
http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const selectedBug = url.searchParams.get('run');

  if (selectedBug && BUG_MANIFEST[selectedBug]) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<html><body style="background:#050507;color:#ff3333;font-family:monospace;padding:30px;text-align:center;"><h2>⚔️ DIABLO ATTACK INJECTED INTO SERVER BLOCKS: ${selectedBug}</h2><p style="color:#aaa;">Core loop processing context execution state running. Server is evaluating faults.</p><br/><a href="/" style="color:#f0f0f0;background:#4a0808;padding:8px 15px;text-decoration:none;border:1px solid #ff3333;font-weight:bold;">Return to Dashboard Sanctum</a></body></html>`);
    
    setTimeout(() => executeBugCommand(selectedBug), 50);
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html' });
  
  let dangerousGridHTML = '';
  let standardGridHTML = '';
  
  Object.keys(BUG_MANIFEST).forEach((key, idx) => {
    const isDangerous = DANGEROUS_BUGS.includes(key);
    const cardMarkup = `
      <div class="bug-card ${isDangerous ? 'tier-danger' : 'tier-standard'}">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <b class="bug-title">[${String(idx + 1).padStart(2, '0')}] trigger:${key}</b>
          <span class="badge">${isDangerous ? 'CRITICAL FAULT' : 'SYSTEM ANOMALY'}</span>
        </div>
        <p class="bug-desc">${BUG_MANIFEST[key]}</p>
        <a href="/?run=${key}" class="btn-launch">LAUNCH BUG AT ATOMS</a>
      </div>
    `;
    
    if (isDangerous) {
      dangerousGridHTML += cardMarkup;
    } else {
      standardGridHTML += cardMarkup;
    }
  });

  res.end(`
  <!DOCTYPE html>
  <html>
  <head>
    <title>😈 DIABLO PAIRING & CONSOLE RIG</title>
    <style>
      body {
        background-color: #040406;
        color: #d12222;
        font-family: 'Courier New', Courier, monospace;
        margin: 0;
        padding: 25px;
      }
      h2, h3 {
        color: #ff3333;
        text-shadow: 0 0 10px rgba(255, 51, 51, 0.3);
        letter-spacing: 2px;
        margin-top: 0;
      }
      h2 {
        border-bottom: 2px solid #4a0808;
        padding-bottom: 15px;
      }
      h3 {
        border-bottom: 1px solid #220505;
        padding-bottom: 8px;
        margin-top: 30px;
        font-size: 16px;
        letter-spacing: 1px;
      }
      /* DIABLO PAIRING HUB DESIGN */
      .pairing-hub {
        background: #09090e;
        border: 2px dashed #ff3333;
        border-radius: 6px;
        padding: 20px;
        margin-bottom: 30px;
        box-shadow: inset 0 0 20px rgba(255,0,0,0.15);
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 15px;
      }
      .pairing-status-box {
        color: #aaa;
        font-size: 13px;
        line-height: 1.6;
      }
      .pairing-status-box span {
        font-weight: bold;
      }
      .code-display-frame {
        background: #140404;
        border: 2px solid #ff3333;
        padding: 15px 30px;
        font-size: 32px;
        font-weight: bold;
        color: #ff3333;
        letter-spacing: 4px;
        text-shadow: 0 0 15px rgba(255, 51, 51, 0.7);
        border-radius: 4px;
        text-align: center;
        box-shadow: 0 0 10px rgba(255,0,0,0.3);
      }
      .container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 15px;
        position: relative;
        z-index: 2;
      }
      .bug-card {
        background: #0b0b10;
        padding: 15px;
        border-radius: 4px;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 6px rgba(0,0,0,0.5);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .tier-danger {
        border: 1px solid #5a0c0c;
      }
      .tier-danger:hover {
        border-color: #ff3333;
        box-shadow: 0 0 15px rgba(255, 51, 51, 0.3);
        transform: translateY(-2px);
      }
      .tier-danger .badge {
        background: #ff3333;
        color: #000;
        font-size: 9px;
        font-weight: bold;
        padding: 1px 5px;
        border-radius: 2px;
      }
      .tier-standard {
        border: 1px solid #1a1a24;
      }
      .tier-standard:hover {
        border-color: #a3a3c2;
        box-shadow: 0 0 12px rgba(163, 163, 194, 0.15);
        transform: translateY(-2px);
      }
      .tier-standard .badge {
        background: #2a2a3a;
        color: #a3a3c2;
        font-size: 9px;
        font-weight: bold;
        padding: 1px 5px;
        border-radius: 2px;
      }
      .bug-title {
        font-size: 13px;
