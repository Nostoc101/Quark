// index.js
const cluster = require('cluster');
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

function logToFile(type, message) {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] [${type}] [PID: ${process.pid}] ${message}\n`;
  try { fs.appendFileSync(LOG_FILE, logLine, 'utf8'); } catch (err) {}
}

const args = {};
process.argv.slice(2).forEach(arg => {
  const [key, value] = arg.replace(/^--/, '').split('=');
  args[key] = value;
});
const command = args.cmd;

// ========================================================
// WHATSAPP CLOUD BOT MODULE
// ========================================================
async function initializeWhatsAppBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_session');
  
  const sock = makeWASocket({
    logger: pino({ level: 'silent' }),
    auth: state,
    printQRInTerminal: false,
    browser: ["Ubuntu", "Chrome", "20.0.04"] // Standard browser spoofing to guarantee phone notification
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const reason = lastDisconnect?.error?.output?.statusCode;
      if (reason !== 401) {
        console.log('🔄 Reconnecting WhatsApp Engine...');
        initializeWhatsAppBot();
      }
    } else if (connection === 'open') {
      console.log('✅ WhatsApp Engine Linked and Operating Online!');
    }
  });

  sock.ev.on('messages.upsert', async (chatUpdate) => {
    try {
      const msg = chatUpdate.messages;
      if (!msg || !msg.message || msg.key.fromMe) return;

      const text = msg.message.conversation || (msg.message.extendedTextMessage && msg.message.extendedTextMessage.text) || '';
      if (!text.startsWith('!')) return; 

      const from = msg.key.remoteJid;
      const argsList = text.trim().slice(1).split(/ +/);
      const botCommand = argsList.shift().toLowerCase();

      await handleBotCommand(sock, from, botCommand, argsList);
    } catch (e) {
      logToFile('BOT_EXEC_ERROR', e.message);
    }
  });

  if (!sock.authState.creds.registered) {
    console.log('📡 WhatsApp Cloud Auth Engine Initializing...');
    await delay(7000); 

    const cloudNum = process.env.WA_PHONE_NUMBER || '';
    const sanitizedNum = cloudNum.replace(/[^0-9]/g, '');

    if (!sanitizedNum) {
      console.log('\n❌ [CONFIGURATION ERROR] -> Missing WA_PHONE_NUMBER environment variable.');
      return;
    }

    try {
      console.log(`📡 Cloud Pipeline requesting Pairing notification for: [${sanitizedNum}]`);
      const cloudPairingCode = await sock.requestPairingCode(sanitizedNum);
      console.log('\n======================================================');
      console.log(`🔥 YOUR WHATSAPP PAIRING CODE: ${cloudPairingCode}`);
      console.log('======================================================\n');
    } catch (err) {
      console.error('❌ Cloud Pairing Generation Fault:', err.message);
    }
  }
}

// ========================================================
// CORE RECOVERY CLUSTER LAYER (SELF HEALING SYSTEM)
// ========================================================
if (cluster.isMaster && !command) {
  const numCPUs = os.cpus().length;
  console.log(`[MASTER PIPELINE OPERATIONAL] PID: ${process.pid} | Cores: ${numCPUs}`);
  
  for (let i = 0; i < Math.min(numCPUs, 2); i++) { cluster.fork(); }
  cluster.on('exit', () => { cluster.fork(); });

  // Terminal Matrix Screen Web Layout
  http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const selectedBug = url.searchParams.get('run');

    if (selectedBug && BUG_MANIFEST[selectedBug]) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`<html><body style="background:#050507;color:#ff3333;font-family:monospace;padding:30px;"><h2>⚔️ DIABLO ATTACK INJECTED: ${selectedBug}</h2><a href="/" style="color:#f0f0f0;">Back to Sanctum Panel</a></body></html>`);
      executeBugCommand(selectedBug);
      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    let gridHTML = '';
    Object.keys(BUG_MANIFEST).forEach((key, idx) => {
      gridHTML += `<div class="bug-card"><b style="color:#f0f0f0;">[${idx + 1}] trigger:${key}</b><p>${BUG_MANIFEST[key]}</p><a href="/?run=${key}" class="btn-launch">LAUNCH BUG</a></div>`;
    });

    res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>😈 DIABLO CORE RESILIENCE PANEL</title>
      <style>
        body {
          background-color: #050507;
          color: #d12222;
          font-family: 'Courier New', Courier, monospace;
          margin: 0;
          padding: 25px;
        }
        h2 {
          color: #ff3333;
          border-bottom: 2px solid #5a0c0c;
          padding-bottom: 15px;
          text-shadow: 0 0 10px rgba(255, 51, 51, 0.4);
          letter-spacing: 2px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 15px;
          position: relative;
          z-index: 2;
        }
        .bug-card {
          background: #0d0d12;
          border: 1px solid #3a0a0a;
          padding: 15px;
          border-radius: 4px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0,0,0,0.6);
        }
        .bug-card:hover {
          border-color: #ff3333;
          box-shadow: 0 0 15px rgba(255, 51, 51, 0.2);
        }
        .bug-card b {
          color: #f0f0f0;
          font-size: 13px;
        }
        .bug-card p {
          color: #888282;
          font-size: 11px;
          margin: 8px 0 12px 0;
          line-height: 1.4;
        }
        .btn-launch {
          background: #4a0808;
          color: #ff9999;
          padding: 5px 12px;
          text-decoration: none;
          font-weight: bold;
          font-size: 11px;
          border: 1px solid #8a1212;
          border-radius: 2px;
          display: inline-block;
          letter-spacing: 1px;
          transition: 0.2s;
        }
        .btn-launch:hover {
          background: #ff3333;
          color: #000;
          box-shadow: 0 0 10px #ff3333;
        }
        .diablo-bg {
          position: fixed;
          bottom: 10px;
          right: 20px;
          font-size: 140px;
          color: rgba(255, 0, 0, 0.03);
          user-select: none;
          z-index: 1;
          font-family: serif;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="diablo-bg">DIABLO</div>
      <h2>🔥 ⚔️ DIABLO AUTOMATED DIAGNOSTIC CORE ENVIRONMENT CONSOLE</h2>
      <div class="container">${gridHTML}</div>
    </body>
    </html>
    `);
  }).listen(PORT, () => {
    console.log(`Matrix Dashboard UI online on port ${PORT}`);
  });

  initializeWhatsAppBot();
} else {
  process.on('uncaughtException', (err) => { logToFile('UNCAUGHT_FAULT', err.stack); process.exit(1); });
  process.on('unhandledRejection', (reason) => { logToFile('UNHANDLED_PROMISE', String(reason)); });
  if (command) executeBugCommand(command);
}

console.log("🛡️ High-velocity cluster environment safeguards fully initialized.");
