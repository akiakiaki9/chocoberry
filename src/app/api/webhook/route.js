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
            const autoReply = getAutoReply(text);
            
            if (autoReply) {
                await sendTelegramMessage(chatId, autoReply);
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
        return `🍓 Добро пожаловать в Chocoberry Fruits!
        
🌐 <a href="https://chocoberrybukhara.uz/">Наш сайт</a>
📸 <a href="https://www.instagram.com/chocoberry_fruits_bukhara_kafe/">Instagram</a>
📱 <a href="https://t.me/chocoberryfruits_bot">Telegram бот</a>
📞 +998914433443

🍽️ <a href="https://chocoberrybukhara.uz/catalog">Открыть меню</a>`;
    }
    
    // Вопросы о меню
    if (lowerText.includes('меню') || lowerText.includes('ассортимент') || 
        lowerText.includes('что есть') || lowerText.includes('выбор') || 
        lowerText.includes('каталог')) {
        return `🍫 Наше меню:
        
Посмотреть полный ассортимент можно на сайте:
👉 <a href="https://chocoberrybukhara.uz/catalog">Перейти в каталог</a>

Самые популярные позиции:
• Клубника в шоколаде 🍓
• Фруктовые букеты 🧺
• Шоколадные наборы 🎁
• Сезонные предложения ✨

Для заказа:
📞 +998914433443
📱 <a href="https://t.me/chocoberryfruits_bot">Telegram бот</a>`;
    }
    
    // Вопросы о доставке
    if (lowerText.includes('доставк') || lowerText.includes('привезт') || 
        lowerText.includes('куда') || lowerText.includes('адрес')) {
        return `🚚 Доставка по Бухаре и области.

Для заказа свяжитесь с нами:
📞 +998914433443
📱 <a href="https://t.me/chocoberryfruits_bot">Telegram бот</a>

Или через сайт:
👉 <a href="https://chocoberrybukhara.uz/">chocoberrybukhara.uz</a>`;
    }
    
    // Вопросы о цене
    if (lowerText.includes('цен') || lowerText.includes('сколько') || 
        lowerText.includes('стоимость') || lowerText.includes('прайс')) {
        return `💰 Актуальные цены в каталоге:
👉 <a href="https://chocoberrybukhara.uz/catalog">Перейти в каталог</a>

Для индивидуального заказа:
📞 +998914433443
📱 <a href="https://t.me/chocoberryfruits_bot">Telegram бот</a>`;
    }
    
    // Контакты
    if (lowerText.includes('контакт') || lowerText.includes('связ') || 
        lowerText.includes('позвонить') || lowerText.includes('написать')) {
        return `📱 Связаться с нами:

📞 Телефон: +998914433443
📸 <a href="https://www.instagram.com/chocoberry_fruits_bukhara_kafe/">Instagram</a>
📱 <a href="https://t.me/chocoberryfruits_bot">Telegram бот</a>
🌐 <a href="https://chocoberrybukhara.uz/">Сайт</a>

🍽️ <a href="https://chocoberrybukhara.uz/catalog">Открыть меню</a>`;
    }
    
    // Благодарность
    if (lowerText.includes('спасиб') || lowerText.includes('благодар')) {
        return `❤️ Спасибо! Рады быть полезными!
        
🍓 <a href="https://chocoberrybukhara.uz/">chocoberrybukhara.uz</a>
📸 <a href="https://www.instagram.com/chocoberry_fruits_bukhara_kafe/">@chocoberry_fruits_bukhara_kafe</a>

Хорошего дня! 🌸`;
    }
    
    // Стандартный ответ с контактами
    return `🍓 Chocoberry Fruits

🌐 <a href="https://chocoberrybukhara.uz/">Сайт</a>
📸 <a href="https://www.instagram.com/chocoberry_fruits_bukhara_kafe/">Instagram</a>
📱 <a href="https://t.me/chocoberryfruits_bot">Telegram бот</a>
📞 +998914433443

🍽️ <a href="https://chocoberrybukhara.uz/catalog">Открыть меню</a>

Чем могу помочь? 😊`;
}

async function sendTelegramMessage(chatId, message) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML',
            disable_web_page_preview: false,
        }),
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