// app/api/webhook/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        
        // Обработка входящего сообщения
        if (body.message) {
            const chatId = body.message.chat.id;
            const text = body.message.text || '';
            
            // Автоответчик
            const reply = getAutoReply(text);
            
            if (reply) {
                await sendTelegramMessage(chatId, reply.text, reply.buttons);
            }
        }
        
        return NextResponse.json({ ok: true });
        
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { ok: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

function getAutoReply(text) {
    const lowerText = text.toLowerCase();
    
    // Приветствие
    if (lowerText.includes('привет') || lowerText.includes('здравствуй') || lowerText.includes('hi') || lowerText.includes('hello')) {
        return {
            text: `🍓 Добро пожаловать в Chocoberry Fruits!
        
🌐 <a href="https://chocoberrybukhara.uz/">Наш сайт</a>
📸 <a href="https://www.instagram.com/chocoberry_fruits_bukhara_kafe/">Instagram</a>
📱 <a href="https://t.me/chocoberryfruits_bot">Telegram бот</a>
📞 +998914433443`,
            buttons: [
                [
                    { text: '🍽️ Открыть меню', url: 'https://chocoberrybukhara.uz/catalog' },
                    { text: '📞 Сделать заказ', url: 'https://t.me/chocoberryfruits_bot' }
                ]
            ]
        };
    }
    
    // Вопросы о меню
    if (lowerText.includes('меню') || lowerText.includes('ассортимент') || 
        lowerText.includes('что есть') || lowerText.includes('выбор') || 
        lowerText.includes('каталог')) {
        return {
            text: `🍫 Наше меню:
        
Посмотреть полный ассортимент можно на сайте:
👉 <a href="https://chocoberrybukhara.uz/catalog">Перейти в каталог</a>

Самые популярные позиции:
• Клубника в шоколаде 🍓
• Фруктовые букеты 🧺
• Шоколадные наборы 🎁
• Сезонные предложения ✨

Для заказа:
📞 +998914433443
📱 <a href="https://t.me/chocoberryfruits_bot">Telegram бот</a>`,
            buttons: [
                [
                    { text: '🍽️ Открыть меню', url: 'https://chocoberrybukhara.uz/catalog' },
                    { text: '📞 Сделать заказ', url: 'https://t.me/chocoberryfruits_bot' }
                ]
            ]
        };
    }
    
    // Вопросы о доставке
    if (lowerText.includes('доставк') || lowerText.includes('привезт') || 
        lowerText.includes('куда') || lowerText.includes('адрес')) {
        return {
            text: `🚚 Доставка по Бухаре и области.

Для заказа свяжитесь с нами:
📞 +998914433443
📱 <a href="https://t.me/chocoberryfruits_bot">Telegram бот</a>

Или через сайт:
👉 <a href="https://chocoberrybukhara.uz/">chocoberrybukhara.uz</a>`,
            buttons: [
                [
                    { text: '🍽️ Открыть меню', url: 'https://chocoberrybukhara.uz/catalog' },
                    { text: '📞 Сделать заказ', url: 'https://t.me/chocoberryfruits_bot' }
                ]
            ]
        };
    }
    
    // Вопросы о цене
    if (lowerText.includes('цен') || lowerText.includes('сколько') || 
        lowerText.includes('стоимость') || lowerText.includes('прайс')) {
        return {
            text: `💰 Актуальные цены в каталоге:
👉 <a href="https://chocoberrybukhara.uz/catalog">Перейти в каталог</a>

Для индивидуального заказа:
📞 +998914433443
📱 <a href="https://t.me/chocoberryfruits_bot">Telegram бот</a>`,
            buttons: [
                [
                    { text: '🍽️ Открыть меню', url: 'https://chocoberrybukhara.uz/catalog' },
                    { text: '📞 Сделать заказ', url: 'https://t.me/chocoberryfruits_bot' }
                ]
            ]
        };
    }
    
    // Контакты
    if (lowerText.includes('контакт') || lowerText.includes('связ') || 
        lowerText.includes('позвонить') || lowerText.includes('написать')) {
        return {
            text: `📱 Связаться с нами:

📞 Телефон: +998914433443
📸 <a href="https://www.instagram.com/chocoberry_fruits_bukhara_kafe/">Instagram</a>
📱 <a href="https://t.me/chocoberryfruits_bot">Telegram бот</a>
🌐 <a href="https://chocoberrybukhara.uz/">Сайт</a>`,
            buttons: [
                [
                    { text: '🍽️ Открыть меню', url: 'https://chocoberrybukhara.uz/catalog' },
                    { text: '📞 Сделать заказ', url: 'https://t.me/chocoberryfruits_bot' }
                ]
            ]
        };
    }
    
    // Благодарность
    if (lowerText.includes('спасиб') || lowerText.includes('благодар')) {
        return {
            text: `❤️ Спасибо! Рады быть полезными!
        
🍓 <a href="https://chocoberrybukhara.uz/">chocoberrybukhara.uz</a>
📸 <a href="https://www.instagram.com/chocoberry_fruits_bukhara_kafe/">@chocoberry_fruits_bukhara_kafe</a>

Хорошего дня! 🌸`,
            buttons: [
                [
                    { text: '🍽️ Открыть меню', url: 'https://chocoberrybukhara.uz/catalog' },
                    { text: '📞 Сделать заказ', url: 'https://t.me/chocoberryfruits_bot' }
                ]
            ]
        };
    }
    
    // Стандартный ответ с контактами
    return {
        text: `🍓 Chocoberry Fruits

🌐 <a href="https://chocoberrybukhara.uz/">Сайт</a>
📸 <a href="https://www.instagram.com/chocoberry_fruits_bukhara_kafe/">Instagram</a>
📱 <a href="https://t.me/chocoberryfruits_bot">Telegram бот</a>
📞 +998914433443

Чем могу помочь? 😊`,
        buttons: [
            [
                { text: '🍽️ Открыть меню', url: 'https://chocoberrybukhara.uz/catalog' },
                { text: '📞 Сделать заказ', url: 'https://t.me/chocoberryfruits_bot' }
            ]
        ]
    };
}

async function sendTelegramMessage(chatId, message, buttons = null) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const payload = {
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: false,
    };
    
    // Добавляем кнопки если есть
    if (buttons && buttons.length > 0) {
        payload.reply_markup = {
            inline_keyboard: buttons
        };
    }
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    return response.json();
}

// GET для проверки вебхука
export async function GET(request) {
    return NextResponse.json({
        status: 'Webhook is working',
        webhook_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhook`,
        bot_username: process.env.TELEGRAM_BOT_USERNAME || 'chocoberryfruits_bot'
    });
}