'use client';

import { useState } from 'react';
import './contacts.css';

export default function ContactsPage() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        message: ''
    });
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Здесь будет отправка формы
        console.log('Form submitted:', formData);
        setFormSubmitted(true);
        setTimeout(() => setFormSubmitted(false), 3000);
    };

    const shopInfo = {
        address: 'ул. Шохрух, 42, Центральный район, Бухара',
        phones: [
            { number: '+998 90 123 45 67', description: 'Бронирование и заказы' },
            { number: '+998 90 123 45 68', description: 'WhatsApp' }
        ],
        email: 'info@chocoberry.uz',
        workHours: [
            { days: 'Понедельник - Пятница', hours: '10:00 - 22:00' },
            { days: 'Суббота - Воскресенье', hours: '11:00 - 23:00' }
        ],
        socials: [
            { name: 'Instagram', icon: '📷', url: 'https://instagram.com/chocoberry', color: '#E4405F' },
            { name: 'Telegram', icon: '📱', url: 'https://t.me/chocoberry', color: '#0088CC' },
            { name: 'Facebook', icon: '📘', url: 'https://facebook.com/chocoberry', color: '#1877F2' },
            { name: 'TikTok', icon: '🎵', url: 'https://tiktok.com/@chocoberry', color: '#000000' }
        ]
    };

    return (
        <div className="contacts-page">
            {/* Hero секция */}
            <section className="contacts-hero">
                <div className="container">
                    <h1 className="contacts-hero-title">
                        Свяжитесь <span className="gold-text">с нами</span>
                    </h1>
                    <p className="contacts-hero-subtitle">
                        Мы всегда рады ответить на ваши вопросы и принять заказы
                    </p>
                </div>
            </section>

            {/* Основной контент */}
            <section className="contacts-main">
                <div className="container">
                    <div className="contacts-grid">
                        {/* Левая колонка - информация */}
                        <div className="contacts-info">
                            <h2 className="info-title">Контакты</h2>

                            {/* Адрес */}
                            <div className="info-card">
                                <div className="info-icon">📍</div>
                                <div className="info-content">
                                    <h3>Адрес</h3>
                                    <p>{shopInfo.address}</p>
                                    <button className="map-link" onClick={() => window.open('https://maps.google.com', '_blank')}>
                                        Открыть в картах →
                                    </button>
                                </div>
                            </div>

                            {/* Телефоны */}
                            <div className="info-card">
                                <div className="info-icon">📞</div>
                                <div className="info-content">
                                    <h3>Телефоны</h3>
                                    {shopInfo.phones.map((phone, index) => (
                                        <div key={index} className="phone-item">
                                            <a href={`tel:${phone.number.replace(/\s/g, '')}`} className="phone-number">
                                                {phone.number}
                                            </a>
                                            <span className="phone-description">{phone.description}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="info-card">
                                <div className="info-icon">✉️</div>
                                <div className="info-content">
                                    <h3>Email</h3>
                                    <a href={`mailto:${shopInfo.email}`} className="email-link">
                                        {shopInfo.email}
                                    </a>
                                </div>
                            </div>

                            {/* Часы работы */}
                            <div className="info-card">
                                <div className="info-icon">⏰</div>
                                <div className="info-content">
                                    <h3>Часы работы</h3>
                                    {shopInfo.workHours.map((item, index) => (
                                        <div key={index} className="hours-item">
                                            <span className="hours-days">{item.days}:</span>
                                            <span className="hours-time">{item.hours}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Социальные сети */}
                            <div className="social-card">
                                <h3>Мы в соцсетях</h3>
                                <div className="social-links">
                                    {shopInfo.socials.map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="social-link"
                                            style={{ '--social-color': social.color }}
                                        >
                                            <span className="social-icon">{social.icon}</span>
                                            <span className="social-name">{social.name}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Правая колонка - форма и карта */}
                        <div className="contacts-right">
                            {/* Форма обратной связи */}
                            <div className="contact-form-card">
                                <h2 className="form-title">Напишите нам</h2>
                                <p className="form-subtitle">
                                    Оставьте заявку и мы перезвоним в течение 15 минут
                                </p>

                                <form onSubmit={handleSubmit} className="contact-form">
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Ваше имя"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="Номер телефона"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <textarea
                                            name="message"
                                            placeholder="Ваше сообщение (необязательно)"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows="4"
                                        ></textarea>
                                    </div>

                                    <button type="submit" className="submit-btn">
                                        Отправить заявку
                                    </button>

                                    {formSubmitted && (
                                        <div className="form-success">
                                            ✓ Спасибо! Мы свяжемся с вами скоро
                                        </div>
                                    )}

                                    <p className="form-agreement">
                                        Нажимая на кнопку, вы соглашаетесь с политикой конфиденциальности
                                    </p>
                                </form>
                            </div>

                            {/* Карта */}
                            <div className="map-card">
                                <h3 className="map-title">Как добраться</h3>
                                <div className="map-container">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124456.78901234567!2d64.416666!3d39.766666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDQ2JzAwLjAiTiA2NMKwMjUnMDAuMCJF!5e0!3m2!1sru!2s!4v1234567890"
                                        width="100%"
                                        height="300"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        title="Карта бутика"
                                    ></iframe>
                                </div>

                                {/* Фото бутика */}
                                <div className="map-gallery">
                                    <img
                                        src="https://images.pexels.com/photos/5632398/pexels-photo-5632398.jpeg?auto=compress&cs=tinysrgb&w=200"
                                        alt="Фасад бутика"
                                    />
                                    <img
                                        src="https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=200"
                                        alt="Внутри бутика"
                                    />
                                    <img
                                        src="https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?auto=compress&cs=tinysrgb&w=200"
                                        alt="Витрина"
                                    />
                                    <img
                                        src="https://images.pexels.com/photos/5632403/pexels-photo-5632403.jpeg?auto=compress&cs=tinysrgb&w=200"
                                        alt="Золотая витрина"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Секция с преимуществами */}
            <section className="contacts-features">
                <div className="container">
                    <h2 className="features-title">Почему нам доверяют</h2>
                    <div className="features-grid">
                        <div className="feature-item">
                            <div className="feature-icon">🚚</div>
                            <h3>Бесплатная доставка</h3>
                            <p>При заказе от 500 000 сум по Бухаре</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">🎁</div>
                            <h3>Подарочная упаковка</h3>
                            <p>Любой бокс упакуем бесплатно</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">💳</div>
                            <h3>Удобная оплата</h3>
                            <p>Наличные, карта, перевод</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">⏰</div>
                            <h3>Работаем без выходных</h3>
                            <p>Всегда готовы вас принять</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ секция */}
            <section className="contacts-faq">
                <div className="container">
                    <h2 className="faq-title">Часто задаваемые вопросы</h2>
                    <div className="faq-grid">
                        <div className="faq-item">
                            <h3>Как долго готовится заказ?</h3>
                            <p>Обычно 20-30 минут. В выходные может быть чуть дольше.</p>
                        </div>
                        <div className="faq-item">
                            <h3>Можно ли заказать с доставкой?</h3>
                            <p>Да, доставляем по Бухаре с 10:00 до 22:00.</p>
                        </div>
                        <div className="faq-item">
                            <h3>Как хранить боксы?</h3>
                            <p>В холодильнике при +2…+6°C не более 3 дней.</p>
                        </div>
                        <div className="faq-item">
                            <h3>Есть ли у вас подарочные сертификаты?</h3>
                            <p>Да, можно приобрести в бутике или заказать онлайн.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}