'use client';

import { useState } from 'react';
import './contacts.css';
import {
    FiMapPin,
    FiPhone,
    FiMail,
    FiClock,
    FiInstagram,
    FiSend,
    FiMessageSquare,
    FiHeart,
    FiTruck,
    FiGift,
    FiCreditCard,
    FiCheckCircle,
    FiArrowRight,
    FiFacebook,
    FiTwitter
} from 'react-icons/fi';
import {
    FaTelegram,
    FaWhatsapp,
    FaTiktok,
    FaInstagram as FaInstagramBrand,
    FaFacebookF
} from 'react-icons/fa';
import {
    IoLocationOutline,
    IoTimeOutline,
    IoCallOutline,
    IoMailOutline,
    IoLogoWhatsapp,
    IoLogoFacebook,
    IoLogoInstagram
} from 'react-icons/io5';
import { HiOutlineLocationMarker, HiOutlinePhone, HiOutlineMail } from 'react-icons/hi';
import { BsTelegram, BsWhatsapp, BsTiktok } from 'react-icons/bs';
import { MdOutlineAccessTime, MdOutlineEmail, MdOutlinePhone } from 'react-icons/md';

export default function ContactsPage() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        message: ''
    });
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [hoveredSocial, setHoveredSocial] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        setFormSubmitted(true);
        setTimeout(() => setFormSubmitted(false), 3000);
        setFormData({ name: '', phone: '', message: '' });
    };

    const shopInfo = {
        address: 'ул. Шохрух, 42, Центральный район, Бухара',
        phones: [
            { number: '+998 90 123 45 67', description: 'Бронирование и заказы', icon: <FiPhone /> },
            { number: '+998 90 123 45 68', description: 'WhatsApp', icon: <FaWhatsapp /> }
        ],
        email: 'info@chocoberry.uz',
        workHours: [
            { days: 'Понедельник - Пятница', hours: '10:00 - 22:00' },
            { days: 'Суббота - Воскресенье', hours: '11:00 - 23:00' }
        ],
        socials: [
            { name: 'Instagram', icon: <FaInstagramBrand />, url: 'https://instagram.com/chocoberry', color: '#E4405F' },
            { name: 'Telegram', icon: <FaTelegram />, url: 'https://t.me/chocoberry', color: '#0088CC' },
            { name: 'Facebook', icon: <FaFacebookF />, url: 'https://facebook.com/chocoberry', color: '#1877F2' },
            { name: 'TikTok', icon: <FaTiktok />, url: 'https://tiktok.com/@chocoberry', color: '#000000' }
        ]
    };

    const features = [
        { icon: <FiTruck />, title: 'Бесплатная доставка', desc: 'При заказе от 500 000 сум по Бухаре' },
        { icon: <FiGift />, title: 'Подарочная упаковка', desc: 'Любой бокс упакуем бесплатно' },
        { icon: <FiCreditCard />, title: 'Удобная оплата', desc: 'Наличные, карта, перевод' },
        { icon: <FiClock />, title: 'Работаем без выходных', desc: 'Всегда готовы вас принять' }
    ];

    const faqs = [
        { q: 'Как долго готовится заказ?', a: 'Обычно 20-30 минут. В выходные может быть чуть дольше.' },
        { q: 'Можно ли заказать с доставкой?', a: 'Да, доставляем по Бухаре с 10:00 до 22:00.' },
        { q: 'Как хранить боксы?', a: 'В холодильнике при +2…+6°C не более 3 дней.' },
        { q: 'Есть ли у вас подарочные сертификаты?', a: 'Да, можно приобрести в бутике или заказать онлайн.' }
    ];

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

                    <div className="hero-stats">
                        <div className="hero-stat">
                            <FiCheckCircle className="stat-icon" />
                            <span>1000+ довольных клиентов</span>
                        </div>
                        <div className="hero-stat">
                            <FiHeart className="stat-icon" />
                            <span>Ручная работа</span>
                        </div>
                        <div className="hero-stat">
                            <FiClock className="stat-icon" />
                            <span>Быстрая доставка</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Основной контент */}
            <section className="contacts-main">
                <div className="container">
                    <div className="contacts-grid">
                        {/* Левая колонка - информация */}
                        <div className="contacts-info">
                            <h2 className="info-title">
                                <FiMapPin className="title-icon" />
                                Контакты
                            </h2>

                            {/* Адрес */}
                            <div className="info-card">
                                <div className="info-icon-wrapper">
                                    <HiOutlineLocationMarker className="info-icon" />
                                </div>
                                <div className="info-content">
                                    <h3>Адрес</h3>
                                    <p>{shopInfo.address}</p>
                                    <button className="map-link" onClick={() => window.open('https://maps.google.com', '_blank')}>
                                        Открыть в картах
                                        <FiArrowRight className="link-icon" />
                                    </button>
                                </div>
                            </div>

                            {/* Телефоны */}
                            <div className="info-card">
                                <div className="info-icon-wrapper">
                                    <HiOutlinePhone className="info-icon" />
                                </div>
                                <div className="info-content">
                                    <h3>Телефоны</h3>
                                    {shopInfo.phones.map((phone, index) => (
                                        <div key={index} className="phone-item">
                                            <a href={`tel:${phone.number.replace(/\s/g, '')}`} className="phone-number">
                                                {phone.icon}
                                                <span>{phone.number}</span>
                                            </a>
                                            <span className="phone-description">{phone.description}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="info-card">
                                <div className="info-icon-wrapper">
                                    <HiOutlineMail className="info-icon" />
                                </div>
                                <div className="info-content">
                                    <h3>Email</h3>
                                    <a href={`mailto:${shopInfo.email}`} className="email-link">
                                        <FiMail className="email-icon" />
                                        {shopInfo.email}
                                    </a>
                                </div>
                            </div>

                            {/* Часы работы */}
                            <div className="info-card">
                                <div className="info-icon-wrapper">
                                    <MdOutlineAccessTime className="info-icon" />
                                </div>
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
                                            style={{
                                                backgroundColor: hoveredSocial === index ? social.color : 'rgba(255,255,255,0.05)',
                                                color: hoveredSocial === index ? '#ffffff' : '#bc8c4c'
                                            }}
                                            onMouseEnter={() => setHoveredSocial(index)}
                                            onMouseLeave={() => setHoveredSocial(null)}
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
                                <h2 className="form-title">
                                    <FiSend className="form-title-icon" />
                                    Напишите нам
                                </h2>
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
                                        <FiHeart className="input-icon" />
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
                                        <FiPhone className="input-icon" />
                                    </div>

                                    <div className="form-group">
                                        <textarea
                                            name="message"
                                            placeholder="Ваше сообщение (необязательно)"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows="4"
                                        ></textarea>
                                        <FiMessageSquare className="textarea-icon" />
                                    </div>

                                    <button type="submit" className="submit-btn">
                                        Отправить заявку
                                        <FiSend className="submit-icon" />
                                    </button>

                                    {formSubmitted && (
                                        <div className="form-success">
                                            <FiCheckCircle className="success-icon" />
                                            Спасибо! Мы свяжемся с вами скоро
                                        </div>
                                    )}

                                    <p className="form-agreement">
                                        Нажимая на кнопку, вы соглашаетесь с политикой конфиденциальности
                                    </p>
                                </form>
                            </div>

                            {/* Карта */}
                            <div className="map-card">
                                <h3 className="map-title">
                                    <IoLocationOutline className="map-title-icon" />
                                    Как добраться
                                </h3>
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
                                        loading="lazy"
                                    />
                                    <img
                                        src="https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=200"
                                        alt="Внутри бутика"
                                        loading="lazy"
                                    />
                                    <img
                                        src="https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?auto=compress&cs=tinysrgb&w=200"
                                        alt="Витрина"
                                        loading="lazy"
                                    />
                                    <img
                                        src="https://images.pexels.com/photos/5632403/pexels-photo-5632403.jpeg?auto=compress&cs=tinysrgb&w=200"
                                        alt="Золотая витрина"
                                        loading="lazy"
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
                    <h2 className="features-title">
                        Почему нам <span className="gold-text">доверяют</span>
                    </h2>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-item">
                                <div className="feature-icon-wrapper">
                                    {feature.icon}
                                </div>
                                <h3>{feature.title}</h3>
                                <p>{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ секция */}
            <section className="contacts-faq">
                <div className="container">
                    <h2 className="faq-title">
                        Часто задаваемые <span className="gold-text">вопросы</span>
                    </h2>
                    <div className="faq-grid">
                        {faqs.map((faq, index) => (
                            <div key={index} className="faq-item">
                                <h3>{faq.q}</h3>
                                <p>{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}