module.exports = {
    name: 'menu',
    description: 'Show command list',
    execute: async (sock, m, args) => {
        const text = `*Malvin C Liz Bot*\nPowered by Handsome Tech Zimbabwe\n\n*!ping* - Status\n*!owner* - Bot info\n*!runtime* - Uptime\n\nAdd more commands in /commands/`;
        await sock.sendMessage(m.key.remoteJid, { text });
    }
}