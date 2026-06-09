module.exports = {
    name: 'owner',
    description: 'Bot owner info',
    execute: async (sock, m, args) => {
        await sock.sendMessage(m.key.remoteJid, { text: 'Bot: Malvin C Liz\nDev: Handsome Tech\nLocation: Zimbabwe 🇿🇼' });
    }
}