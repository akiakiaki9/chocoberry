'use client';

import './contacts.css';
import {
    FiMapPin,
    FiHeart
} from 'react-icons/fi';
import {
    IoTimeOutline,
} from 'react-icons/io5';
import { FaTelegram, FaInstagram } from 'react-icons/fa';
import { HiOutlineLocationMarker, HiOutlinePhone } from 'react-icons/hi';
import { useState } from 'react';

const Contacts = () => {
    const [hoveredSocial, setHoveredSocial] = useState(null);
    const [imageErrors, setImageErrors] = useState({});

    const socialLinks = [
        {
            id: 'insta',
            icon: <FaInstagram />,
            color: '#E4405F',
            name: 'Instagram',
            url: 'https://www.instagram.com/chocoberry_fruits_bukhara_kafe?igsh=MTk1emh4dDk4ZHJ4eA%3D%3D'
        },
        {
            id: 'tg',
            icon: <FaTelegram />,
            color: '#0088cc',
            name: 'Telegram',
            url: 'https://t.me/chocoberry_fruits_bukhara'
        },
    ];

    // Функция для получения правильного пути к изображению
    const getImagePath = (imagePath) => {
        if (!imagePath) return '/images/placeholder.png';
        
        if (imagePath.startsWith('/')) {
            return imagePath;
        }
        
        if (imagePath.startsWith('images/')) {
            return '/' + imagePath;
        }
        
        if (imagePath.startsWith('data/images/')) {
            return '/' + imagePath;
        }
        
        return '/' + imagePath;
    };

    // Обработчик ошибок загрузки изображений
    const handleImageError = (id) => {
        setImageErrors(prev => ({ ...prev, [id]: true }));
    };

    const galleryImages = [
        { id: 1, src: '/images/data/images/45.png', alt: 'Фасад бутика', icon: <FiMapPin /> },
        { id: 2, src: '/images/data/images/42.png', alt: 'Внутри бутика', icon: <FiHeart /> },
        { id: 3, src: '/images/data/images/41.png', alt: 'Витрина', icon: <FiMapPin /> }
    ];

    return (
        <section className="contacts" id="contacts">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">
                        Где <span className="gold-text">нас найти</span>
                    </h2>
                    <p className="section-subtitle">
                        Приходите в гости или заказывайте с доставкой
                    </p>
                </div>

                <div className="contacts-grid">
                    {/* Информация */}
                    <div className="contacts-info">
                        <div className="contacts-card">
                            <h3>
                                <FiHeart className="title-icon" />
                                Бутик в Бухаре
                            </h3>

                            <div className="contact-item">
                                <div className="contact-icon-wrapper">
                                    <HiOutlineLocationMarker className="contact-icon" />
                                </div>
                                <div className="contact-content">
                                    <strong>Адрес:</strong>
                                    <p>Ашхобот 2v, Бухара</p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <div className="contact-icon-wrapper">
                                    <HiOutlinePhone className="contact-icon" />
                                </div>
                                <div className="contact-content">
                                    <strong>Телефон:</strong>
                                    <p>
                                        <a href="tel:+998914433443" className="contact-link">+998 91 443 34 43</a>
                                    </p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <div className="contact-icon-wrapper">
                                    <IoTimeOutline className="contact-icon" />
                                </div>
                                <div className="contact-content">
                                    <strong>Часы работы:</strong>
                                    <p>Ежедневно: 10:00 - 22:00</p>
                                </div>
                            </div>

                            <div className="contacts-social">
                                <h4>Мы в соцсетях</h4>
                                <div className="social-links">
                                    {socialLinks.map(social => (
                                        <a
                                            key={social.id}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="social-link"
                                            aria-label={social.name}
                                            style={{
                                                backgroundColor: hoveredSocial === social.id ? social.color : '#f5f5f5',
                                                color: hoveredSocial === social.id ? '#fff' : '#2d2a24'
                                            }}
                                            onMouseEnter={() => setHoveredSocial(social.id)}
                                            onMouseLeave={() => setHoveredSocial(null)}
                                        >
                                            {social.icon}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Карта */}
                    <div className="contacts-map">
                        <div className="map-container">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d6132.868239647303!2d64.446026!3d39.774812!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMznCsDQ2JzI5LjMiTiA2NMKwMjYnNDUuNyJF!5e0!3m2!1sru!2s!4v1774271769866!5m2!1sru!2s"
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
                            {galleryImages.map((img) => {
                                const imageSrc = imageErrors[img.id] 
                                    ? '/images/placeholder.png' 
                                    : getImagePath(img.src);

                                return (
                                    <div key={img.id} className="gallery-item">
                                        <img
                                            src={imageSrc}
                                            alt={img.alt}
                                            loading="lazy"
                                            onError={() => handleImageError(img.id)}
                                        />
                                        <div className="gallery-overlay">
                                            <span className="overlay-icon">{img.icon}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contacts;