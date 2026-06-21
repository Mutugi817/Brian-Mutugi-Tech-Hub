import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import pino from 'pino';

export class WhatsAppClient {
    constructor(config = {}) {
        this.connectionType = config.connectionType || 'qr';
        this.phoneNumber = config.phoneNumber || '';
        this.authFolder = config.authFolder || 'auth_info_baileys';
        this.sock = null;
        this.logger = pino({ level: 'silent' });
    }

    async connect() {
        const { state, saveCreds } = await useMultiFileAuthState(this.authFolder);

        this.sock = makeWASocket({
            logger: this.logger,
            printQRInTerminal: this.connectionType === 'qr',
            auth: state,
        });

        this.sock.ev.on('creds.update', saveCreds);

        this.sock.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect } = update;
            
            if (connection === 'close') {
                const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
                if (shouldReconnect) this.connect();
            } else if (connection === 'open') {
                console.log(`Connection established using ${this.connectionType} mode.`);
            }
        });

        // Handle pairing code logic
        if (this.connectionType === 'pairing' && !this.sock.authState.creds.registered) {
            this._handlePairing();
        }
    }

    async _handlePairing() {
        // Use a small delay to ensure the socket is initialized
        setTimeout(async () => {
            if (this.phoneNumber) {
                const code = await this.sock.requestPairingCode(this.phoneNumber);
                console.log(`\n[!] Pairing Code: ${code}\n`);
            } else {
                console.error("Phone number required for pairing mode.");
            }
        }, 3000);
    }

    async sendMessage(remoteJid, message) {
        if (!this.sock) throw new Error("Socket is not initialized. Call connect() first.");
        
        const jid = remoteJid.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        return await this.sock.sendMessage(jid, { text: message });
    }
}


export const WAClient = new WhatsAppClient({
    connectionType: 'pairing',
    phoneNumber: process.env.ADMIN_PHONE
});

