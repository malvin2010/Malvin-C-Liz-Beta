module.exports = {
    name: 'ping',
    description: 'Check if bot is online',
    execute: async (sock, m, args) => {
        await sock.sendMessage(m.key.remoteJid, { text: 'Pong! Malvin C Liz is online ⚡\nPowered by Handsome Tech Zimbabwe 🇿🇼' });
    }
}