'use client';

import './contacts.css';
import {
    FiMapPin,
    FiPhone,
    FiClock,
    FiHeart,
    FiTruck,
    FiGift,
    FiCreditCard,
    FiCheckCircle,
    FiArrowRight,
} from 'react-icons/fi';
import {
    FaTelegram,
    FaInstagram as FaInstagramBrand,
} from 'react-icons/fa';
import {
    IoLocationOutline
} from 'react-icons/io5';
import { HiOutlineLocationMarker, HiOutlinePhone } from 'react-icons/hi';
import { MdOutlineAccessTime } from 'react-icons/md';
import { useState } from 'react';

export default function ContactsPage() {
    const [hoveredSocial, setHoveredSocial] = useState(null);

    const shopInfo = {
        address: 'Ашхобот 2v, Бухара',
        phones: [
            { number: '+998 91 443 34 43', description: 'Бронирование и заказы', icon: <FiPhone /> },
        ],
        workHours: [
            { days: 'Ежедневно', hours: '10:00 - 00:00' },
        ],
        socials: [
            { name: 'Instagram', icon: <FaInstagramBrand />, url: 'https://www.instagram.com/chocoberry_fruits_bukhara_kafe?igsh=MTk1emh4dDk4ZHJ4eA%3D%3D', color: '#E4405F' },
            { name: 'Telegram', icon: <FaTelegram />, url: 'https://t.me/chocoberry_fruits_bukhara', color: '#0088CC' },
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
        { q: 'Можно ли заказать с доставкой?', a: 'Да, доставляем по Бухаре с 10:00 до 0:00.' },
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

                        {/* Правая колонка - карта */}
                        <div className="contacts-right">
                            {/* Карта */}
                            <div className="map-card">
                                <h3 className="map-title">
                                    <IoLocationOutline className="map-title-icon" />
                                    Как добраться
                                </h3>
                                <div className="map-container">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d6132.868239647303!2d64.446026!3d39.774812!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMznCsDQ2JzI5LjMiTiA2NMKwMjYnNDUuNyJF!5e0!3m2!1sru!2s!4v1774271769866!5m2!1sru!2s"
                                        width="100%"
                                        height="400"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        title="Карта бутика"
                                    ></iframe>
                                </div>

                                {/* Фото бутика */}
                                <div className="map-gallery">
                                    <img
                                        src="/images/data/images/45.png"
                                        alt="Фасад бутика"
                                        loading="lazy"
                                    />
                                    <img
                                        src="/images/data/images/42.png"
                                        alt="Внутри бутика"
                                        loading="lazy"
                                    />
                                    <img
                                        src="/images/data/images/41.png"
                                        alt="Витрина"
                                        loading="lazy"
                                    />
                                    <img
                                        src="/images/data/images/40.png"
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