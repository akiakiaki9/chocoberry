// app/api/order/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const orderData = await request.json();

        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatIds = process.env.TELEGRAM_CHAT_IDS?.split(',').filter(id => id.trim()) || [];

        console.log('=== ORDER API DEBUG ===');
        console.log('Bot Token exists:', !!botToken);
        console.log('Chat IDs:', chatIds);
        console.log('Site URL:', process.env.NEXT_PUBLIC_SITE_URL);
        console.log('Order data:', JSON.stringify(orderData, null, 2));

        if (!botToken) {
            console.error('❌ TELEGRAM_BOT_TOKEN is not configured');
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Telegram bot token not configured',
                    details: 'Please set TELEGRAM_BOT_TOKEN in environment variables'
                },
                { status: 500 }
            );
        }

        if (chatIds.length === 0) {
            console.error('❌ TELEGRAM_CHAT_IDS is not configured');
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Telegram chat IDs not configured',
                    details: 'Please set TELEGRAM_CHAT_IDS in environment variables'
                },
                { status: 500 }
            );
        }

        const message = formatOrderMessage(orderData);

        const sendPromises = chatIds.map(chatId => 
            sendTelegramMessage(botToken, chatId.trim(), message)
        );

        const results = await Promise.allSettled(sendPromises);
        
        const failed = results.filter(r => r.status === 'rejected');
        if (failed.length > 0) {
            console.error('❌ Some messages failed to send:', failed);
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Failed to send to some admins',
                    details: failed.map(f => f.reason?.message || 'Unknown error')
                },
                { status: 500 }
            );
        }

        console.log('✅ Order sent successfully to all admins');
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('❌ Error processing order:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Internal server error',
                details: error.message 
            },
            { status: 500 }
        );
    }
}

function formatOrderMessage(orderData) {
    const { customer, items, total, timestamp } = orderData;
    
    const orderDate = new Date(timestamp);
    const formattedDate = orderDate.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    const formattedTime = orderDate.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    let message = '🛍️ <b>НОВЫЙ ЗАКАЗ!</b>\n\n';
    message += `👤 <b>Имя:</b> ${customer.name}\n`;
    message += `📱 <b>Телефон:</b> ${customer.phone}\n`;
    message += `📍 <b>Адрес:</b> ${customer.location.address || 'Не указан'}\n`;
    message += `📌 <b>Координаты:</b> ${customer.location.lat}, ${customer.location.lng}\n\n`;
    
    message += '<b>🛒 Товары:</b>\n';
    items.forEach((item, index) => {
        const totalPrice = item.price * item.quantity;
        const imageUrl = item.image ? `${process.env.NEXT_PUBLIC_SITE_URL}${item.image}` : '';
        
        let itemLine = `${index + 1}. ${item.name} x${item.quantity}`;
        
        if (imageUrl) {
            itemLine += ` (<a href="${imageUrl}">📸 ФОТО</a>)`;
        }
        
        itemLine += ` = ${totalPrice} сум`;
        message += itemLine + '\n';
    });
    
    message += `\n💰 <b>Итого:</b> ${total} сум\n`;
    message += `🕐 <b>Дата:</b> ${formattedDate}\n`;
    message += `⏰ <b>Время:</b> ${formattedTime}\n\n`;
    
    const { lat, lng, address } = customer.location;
    const fullAddress = address || `${lat}, ${lng}`;
    const fullAddressEncoded = encodeURIComponent(fullAddress);
    
    // Ссылки на 3 карты
    const yandexMapsUrl = `https://yandex.uz/maps/?rtext=~${lat},${lng}&rtt=auto&z=16`;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    const twoGisUrl = `https://2gis.uz/route/geo/${lng},${lat}/0/построить-маршрут?m=${lng}%2C${lat}%2F16`;
    
    message += '<b>🗺️ Построить маршрут:</b>\n';
    message += `• <a href="${yandexMapsUrl}">🗺️ Яндекс Карты</a>\n`;
    message += `• <a href="${googleMapsUrl}">🗺️ Google Maps</a>\n`;
    message += `• <a href="${twoGisUrl}">🗺️ 2ГИС</a>\n`;

    return message;
}

async function sendTelegramMessage(botToken, chatId, message) {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    try {
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

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ Telegram API error:', data);
            throw new Error(`Telegram API error: ${data.description || 'Unknown error'}`);
        }

        console.log(`✅ Message sent to chat ${chatId}`);
        return data;
    } catch (error) {
        console.error(`❌ Failed to send to chat ${chatId}:`, error);
        throw error;
    }
}