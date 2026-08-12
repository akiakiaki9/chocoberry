// app/api/order/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const orderData = await request.json();

        // Получаем данные из env
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatIds = process.env.TELEGRAM_CHAT_IDS?.split(',') || [];

        if (!botToken || chatIds.length === 0) {
            console.error('Telegram credentials not configured');
            return NextResponse.json(
                { success: false, error: 'Telegram not configured' },
                { status: 500 }
            );
        }

        // Формируем сообщение
        const message = formatOrderMessage(orderData);

        // Отправляем всем админам
        const sendPromises = chatIds.map(chatId => 
            sendTelegramMessage(botToken, chatId, message)
        );

        await Promise.all(sendPromises);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error processing order:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

function formatOrderMessage(orderData) {
    const { customer, items, total, timestamp } = orderData;
    
    let message = '🛍️ <b>НОВЫЙ ЗАКАЗ!</b>\n\n';
    message += `👤 <b>Имя:</b> ${customer.name}\n`;
    message += `📱 <b>Телефон:</b> ${customer.phone}\n`;
    message += `📍 <b>Адрес:</b> ${customer.location.address}\n`;
    message += `📌 <b>Координаты:</b> ${customer.location.lat}, ${customer.location.lng}\n\n`;
    
    // Товары с фото сразу рядом
    message += '<b>🛒 Товары:</b>\n';
    items.forEach((item, index) => {
        const totalPrice = item.price * item.quantity;
        const imageUrl = item.image ? `${process.env.NEXT_PUBLIC_SITE_URL}${item.image}` : '';
        
        // Формат: 1. Клубника в шоколаде x2 (ФОТО) = 120000 сум
        let itemLine = `${index + 1}. ${item.name} x${item.quantity}`;
        
        // Добавляем фото если есть
        if (imageUrl) {
            itemLine += ` (<a href="${imageUrl}">📸 ФОТО</a>)`;
        }
        
        itemLine += ` = ${totalPrice} сум`;
        message += itemLine + '\n';
    });
    
    message += `\n💰 <b>Итого:</b> ${total} сум\n`;
    message += `🕐 <b>Время:</b> ${new Date(timestamp).toLocaleString('ru-RU')}\n\n`;
    
    // Ссылки на карты
    const { lat, lng } = customer.location;
    message += '<b>🗺️ Построить маршрут:</b>\n';
    message += `• <a href="https://taxi.yandex.ru/?rtext=~${lat},${lng}">🚕 Яндекс Такси</a>\n`;
    message += `• <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}">🗺️ Google Maps</a>\n`;
    message += `• <a href="https://yandex.uz/maps/?pt=${lng},${lat}&z=16">🗺️ Яндекс Карты</a>\n`;

    return message;
}

async function sendTelegramMessage(botToken, chatId, message) {
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

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Telegram API error: ${JSON.stringify(error)}`);
    }

    return response.json();
}