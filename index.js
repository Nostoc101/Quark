// index.js
const cluster = require('cluster');
const os = require('os');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { default: makeWASocket, useMultiFileAuthState, delay } = require('@whiskeysockets/baileys');
const pino = require('pino');

// Decoupled File Imports
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
      if (!msg || !msg[0] || !msg[0].message || msg[0].key.fromMe) return;

      const singleMsg = msg[0];
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

if (cluster.isMaster && !command) {
  const numCPUs = os.cpus().length;
  console.log(`[MASTER PIPELINE OPERATIONAL] PID: ${process.pid} | Cores: ${numCPUs}`);
  
  for (let i = 0; i < Math.min(numCPUs, 2); i++) { cluster.fork(); }
  cluster.on('exit', () => { cluster.fork(); });

  // Terminal Matrix UI Control Server
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
    console.log(`Matrix Dashboard UI online on port ${PORT}`);
  });

  initializeWhatsAppBot();
} else {
  process.on('uncaughtException', (err) => { logToFile('UNCAUGHT_FAULT', err.stack); process.exit(1); });
  process.on('unhandledRejection', (reason) => { logToFile('UNHANDLED_PROMISE', String(reason)); });
  if (command) executeBugCommand(command);
}
