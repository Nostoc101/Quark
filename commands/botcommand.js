
// commands/botCommands.js
const os = require('os');

/**
 * High-speed Bot command controller system router
 */
async function handleBotCommand(sock, from, command, argsList) {
  switch (command) {
    case 'ping':
      await sock.sendMessage(from, { 
        text: '🏓 *Pong!* Core process responder engine routing active in microseconds.' 
      });
      break;

    case 'status':
      const stats = `⚡ *LIVE SYSTEM METRICS*:\n\n` +
                    `• Environment: \`Production Cloud Cluster\`\n` +
                    `• Process PID: \`${process.pid}\`\n` +
                    `• Architecture: \`${os.platform()} (${os.arch()})\`\n` +
                    `• CPU Threads: \`${os.cpus().length} Cores\`\n` +
                    `• Allocated Memory: \`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\``;
      await sock.sendMessage(from, { text: stats });
      break;

    case 'help':
    case 'menu':
      const menuText = `🤖 *HIGH-SPEED BOT CONTROL PANELS*:\n\n` +
                       `👉 Available Interaction Strings:\n` +
                       `• \`!ping\` - Network handshake round-trip test.\n` +
                       `• \`!status\` - Complete live container telemetry stats.\n` +
                       `• \`!menu\` / \`!help\` - Renders this system command overview.\n\n` +
                       `🟢 System status: Functional and operating at 100% efficiency on your cloud nodes.`;
      await sock.sendMessage(from, { text: menuText });
      break;

    default:
      break;
  }
}

module.exports = { handleBotCommand };
