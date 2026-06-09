module.exports = {
    name: 'runtime',
    description: 'Show bot uptime',
    execute: async (sock, m, args) => {
        const uptime = process.uptime();
        const h = Math.floor(uptime / 3600);
        const min = Math.floor((uptime % 3600) / 60);
        const s = Math.floor(uptime % 60);
        await sock.sendMessage(m.key.remoteJid, { text: `Uptime: ${h}h ${min}m ${s}s` });
    }
}