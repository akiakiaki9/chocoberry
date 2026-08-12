// scripts/set-webhook.js
// Запустить: node scripts/set-webhook.js

const https = require('https');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN';
const WEBHOOK_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chocoberrybukhara.uz';
const WEBHOOK_PATH = '/api/webhook';

const url = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${WEBHOOK_URL}${WEBHOOK_PATH}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log('Webhook response:', JSON.parse(data));
    });
}).on('error', (err) => {
    console.error('Error setting webhook:', err);
});

// Для удаления вебхука:
// https://api.telegram.org/bot${BOT_TOKEN}/deleteWebhook