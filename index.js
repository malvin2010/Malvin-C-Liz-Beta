const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers } = require('@whiskeysockets/baileys');
const express = require('express');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

// Load commands
const commands = new Map();
const commandsPath = path.join(__dirname, 'commands');
fs.readdirSync(commandsPath).filter(f => f.endsWith('.js')).forEach(file => {
    const command = require(path.join(commandsPath, file));
    commands.set(command.name, command);
});

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: 'silent' }),
        browser: Browsers.macOS('Malvin C Liz')
    });

    app.post('/api/request-pair', async (req, res) => {
        const { phone } = req.body;
        if (!phone) return res.json({ error: 'Phone number required' });
        try {
            if (!sock.authState.creds.registered) {
                const code = await sock.requestPairingCode(phone);
                res.json({ code });
            } else {
                res.json({ error: 'Already paired' });
            }
        } catch (e) {
            res.json({ error: e.message });
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Connection closed. Reconnecting:', shouldReconnect);
            if (shouldReconnect) startBot();
        } else if (connection === 'open') {
            console.log('Malvin C Liz | Powered by Handsome Tech Zimbabwe 🇿🇼 | Connected');
        }
    });

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0];
        if (!m.message || m.key.fromMe) return;
        
        const body = m.message.conversation || m.message.extendedTextMessage?.text || '';
        if (!body.startsWith('.')) return;
        
        const args = body.slice(1).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = commands.get(commandName);
        
        if (!command) return;
        try {
            await command.execute(sock, m, args);
        } catch (e) {
            console.log(e);
            await sock.sendMessage(m.key.remoteJid, { text: 'Error executing command.' });
        }
    });
}

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
startBot();
