const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');  

const Timeout = 25000;
const client = new Client();

let qrCodeCheck = false;
let TimeoutId;

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true})
    console.log('QR RECEIVED', qr);
    qrCodeCheck = true;
});

client.on('ready', () => {
    console.log('Client is ready!');
    clearTimeout(TimeoutId);
    client.sendMessage('number@c.us', 'message1')
        .then(() => {
            console.log('sent successfully!')
        })

        .catch( error => {
            console.error('failed to send', error);
        });
});

client.on('message', msg => {
    if (msg.body === '!ping') {
        msg.reply('pong');
    }
});

client.on('authentication_failure', (session) => {
    console.error('Auth failed!', session);
});

client.on('disconnect', (reason) => {
    console.log('Client disconnected. Reason:', reason);
    console.log('Connection state:', client.ws.readyState); 
});

client.initialize();

TimeoutId = setTimeout(() => {
    console.log(`Couldn't scan QR code in time for (${Timeout / 1000} seconds)`);
    client.emit('authentication_failure', 'Timeout: No scan detected');
}, Timeout);
