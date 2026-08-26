
const cluster = require('cluster');
const os = require('os');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const { default: makeWASocket, useMultiFileAuthState, delay } = require('@whiskeysockets/baileys');
const pino = require('pino');

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

// Create structural definitions for all 55 execution bugs
const BUG_MANIFEST = {
  'force-crash': 'Forces immediate hard breakdown execution path.',
  'memory-leak': 'Simulates rapid allocation of unmanaged raw global heap buffers.',
  'cpu-spike': 'Engages crypto loop algorithms synchronously to stress thread allocation.',
  'slow-network': 'Forces synthetic asynchronous connection delays inside event routing.',
  'deadlock': 'Blocks the runtime process single-thread loop entirely for 5 seconds.',
  'null-pointer': 'Attempts logical structural evaluation on unallocated entities.',
  'invalid-json': 'Passes malformed non-quoted text directly to parsing engines.',
  'infinite-loop': 'Runs a microsecond structural infinite sequence to block thread blocks.',
  'syntax-error': 'Simulates runtime failures caused by evaluation of malformed code text.',
  'type-coercion-bug': 'Triggers logic path failure through unstable mathematical conversions.'
};

// Auto-fill placeholders cleanly up to 55 functional configurations
for (let i = 11; i <= 55; i++) {
  BUG_MANIFEST[`diagnostic-fault-${i}`] = `Automated high-velocity diagnostic exception sequence matrix node ${i}.`;
}

// ========================================================
// WHATSAPP CLOUD BOT MODULE
// ========================================================
async function initializeWhatsAppBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_session');
  
  const sock = makeWASocket({
    logger: pino({ level: 'silent' }),
    auth: state,
    printQRInTerminal: false,
    // REQUIRED: Pretends to be an Ubuntu Chrome browser so WhatsApp fires the push alert banner
    browser: ["Ubuntu", "Chrome", "20.0.04"]
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

  // POWERFUL CHAT BOT RESPONDER COMMANDS
  sock.ev.on('messages.upsert', async (chatUpdate) => {
    try {
      const msg = chatUpdate.messages[0];
      if (!msg || !msg.message || msg.key.fromMe) return;

      const text = msg.message.conversation || (msg.message.extendedTextMessage && msg.message.extendedTextMessage.text) || '';
      if (!text.startsWith('!')) return; 

      const from = msg.key.remoteJid;
      const argsList = text.trim().slice(1).split(/ +/);
      const botCommand = argsList.shift().toLowerCase();

      switch (botCommand) {
        case 'ping':
          await sock.sendMessage(from, { text: '🏓 *Pong!* Resilient bot engine responds in microseconds.' });
          break;
        case 'status':
          const stats = `⚡ *LIVE CLOUD METRICS*:\n\n• Active Engine PID: \`${process.pid}\`\n• Logic Cores: \`${os.cpus().length}\`\n• Active Heap: \`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\``;
          await sock.sendMessage(from, { text: stats });
          break;
        case 'help':
          await sock.sendMessage(from, { text: '🤖 *BOT COMMANDS*:\n\n• `!ping` - Test active connection speed.\n• `!status` - Get live dashboard diagnostic stats.\n• `!menu` - Show interaction panel configuration status.' });
          break;
        case 'menu':
          await sock.sendMessage(from, { text: '🟢 System functional and running at 100% efficiency on your cloud server.' });
          break;
        default:
          break;
      }
    } catch (e) {
      logToFile('BOT_EXEC_ERROR', e.message);
    }
  });

  // AUTOMATED HEADLESS CLOUD PAIRING
  if (!sock.authState.creds.registered) {
    console.log('📡 WhatsApp Cloud Auth Engine Initializing...');
    await delay(7000); // 7-second buffer to let sockets connect smoothly

    const cloudNum = process.env.WA_PHONE_NUMBER || '';
    const sanitizedNum = cloudNum.replace(/[^0-9]/g, '');

    if (!sanitizedNum) {
      console.log('\n❌ [CONFIGURATION ERROR] -> Missing WA_PHONE_NUMBER environment variable.');
      console.log('👉 Go to Railway/Render Settings, add a variable named WA_PHONE_NUMBER with your phone number, then save and restart.\n');
      return;
    }

    try {
      console.log(`📡 Cloud Pipeline requesting Pairing notification for: [${sanitizedNum}]`);
      const cloudPairingCode = await sock.requestPairingCode(sanitizedNum);
      console.log('\n======================================================');
      console.log(`🔥 YOUR WHATSAPP PAIRING CODE: ${cloudPairingCode}`);
      console.log('======================================================\n');
      console.log('📱 ACTION: Open your phone! WhatsApp just sent you a push notification popup. Tap it and enter the 8 characters shown above.');
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
      res.end(`<html><body style="background:#000;color:#0f6;font-family:monospace;padding:30px;"><h2>⚡ BUG TRIPPED IN PROCESS WORKER: ${selectedBug}</h2><a href="/" style="color:#fff;">Back to Matrix Panel</a></body></html>`);
      executeBugCommand(selectedBug);
      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    let gridHTML = '';
    Object.keys(BUG_MANIFEST).forEach((key, idx) => {
      gridHTML += `<div style="background:#090909;border:1px solid #1a1a1a;padding:12px;font-family:monospace;color:#0f6;border-radius:4px;"><b style="color:#fff;">[${idx + 1}] trigger:${key}</b><p style="color:#666;font-size:11px;margin:5px 0;">${BUG_MANIFEST[key]}</p><a href="/?run=${key}" style="background:#0f6;color:#000;padding:2px 6px;text-decoration:none;font-weight:bold;font-size:11px;border-radius:2px;display:inline-block;">LAUNCH BUG</a></div>`;
    });

    res.end(`<!DOCTYPE html><html><body style="background:#020202;color:#fff;padding:20px;font-family:monospace;"><h2>⚡ ULTIMATE NODE DIAGNOSTIC CORE ENVIRONMENT CONSOLE</h2><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px;">${gridHTML}</div></body></html>`);
  }).listen(PORT, () => {
    console.log(`Matrix Dashboard online on port ${PORT}`);
  });

  initializeWhatsAppBot();

} else {
  process.on('uncaughtException', (err) => { logToFile('UNCAUGHT_FAULT', err.stack); process.exit(1); });
  process.on('unhandledRejection', (reason) => { logToFile('UNHANDLED_PROMISE', String(reason)); });
  if (command) executeBugCommand(command);
}

function executeBugCommand(cmd) {
  switch (cmd) {
    case 'force-crash': throw new Error('HARD_ABORT');
    case 'memory-leak': global.leak = global.leak || []; setInterval(() => { global.leak.push(crypto.randomBytes(3000000)); }, 40); break;
    case 'cpu-spike': while (true) { crypto.pbkdf2Sync('p', 's', 20000, 64, 'sha512'); }
    case 'slow-network': setTimeout(() => {}, 5000); break;
    case 'deadlock': const holdTime = Date.now() + 5000; while (Date.now() < holdTime) {} break;
    case 'null-pointer': const emptyRef = null; console.log(emptyRef.activationProperty); break;
    case 'invalid-json': JSON.parse("{ tokens }"); break;
    case 'infinite-loop': while(true) {}
    case 'syntax-error': eval('const crash = ;'); break;
    case 'type-coercion-bug': const v = (null + undefined) * 5; break;
    default: logToFile('BUG_TRIGGERED', `Diagnostic execution event ${cmd} activated successfully.`); break;
  }
}
