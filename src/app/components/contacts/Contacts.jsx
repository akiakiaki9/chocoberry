'use client';

import './contacts.css';
import {
    FiMapPin,
    FiPhone,
    FiClock,
    FiMail,
    FiInstagram,
    FiSend,
    FiMessageSquare,
    FiHeart
} from 'react-icons/fi';
import {
    IoLogoWhatsapp,
    IoLogoPinterest,
    IoLocationOutline,
    IoTimeOutline,
    IoMailOutline,
    IoCallOutline
} from 'react-icons/io5';
import { FaTelegram, FaInstagram, FaWhatsapp, FaPinterest } from 'react-icons/fa';
import { HiOutlineLocationMarker, HiOutlinePhone, HiOutlineMail } from 'react-icons/hi';
import { useState } from 'react';

const Contacts = () => {
    const [hoveredSocial, setHoveredSocial] = useState(null);

    const socialLinks = [
        { id: 'insta', icon: <FaInstagram />, color: '#E4405F', name: 'Instagram' },
        { id: 'tg', icon: <FaTelegram />, color: '#0088cc', name: 'Telegram' },
        { id: 'wa', icon: <FaWhatsapp />, color: '#25D366', name: 'WhatsApp' },
        { id: 'pin', icon: <FaPinterest />, color: '#BD081C', name: 'Pinterest' }
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
                                    <p>ул. Шохрух, 42<br />Центральный район</p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <div className="contact-icon-wrapper">
                                    <HiOutlinePhone className="contact-icon" />
                                </div>
                                <div className="contact-content">
                                    <strong>Телефон:</strong>
                                    <p>
                                        <a href="tel:+998901234567" className="contact-link">+998 90 123 45 67</a><br />
                                        <a href="tel:+998901234568" className="contact-link">+998 90 123 45 68</a>
                                    </p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <div className="contact-icon-wrapper">
                                    <IoTimeOutline className="contact-icon" />
                                </div>
                                <div className="contact-content">
                                    <strong>Часы работы:</strong>
                                    <p>Ежедневно: 10:00 - 22:00<br />Без выходных</p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <div className="contact-icon-wrapper">
                                    <HiOutlineMail className="contact-icon" />
                                </div>
                                <div className="contact-content">
                                    <strong>Email:</strong>
                                    <p>
                                        <a href="mailto:info@chocoberry.uz" className="contact-link">info@chocoberry.uz</a>
                                    </p>
                                </div>
                            </div>

                            <div className="contacts-social">
                                <h4>Мы в соцсетях</h4>
                                <div className="social-links">
                                    {socialLinks.map(social => (
                                        <a
                                            key={social.id}
                                            href="#"
                                            className="social-link"
                                            aria-label={social.name}
                                            style={{
                                                backgroundColor: hoveredSocial === social.id ? social.color : 'var(--bg-gray)',
                                                color: hoveredSocial === social.id ? '#fff' : 'var(--black)'
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
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124456.78901234567!2d64.416666!3d39.766666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDQ2JzAwLjAiTiA2NMKwMjUnMDAuMCJF!5e0!3m2!1sru!2s!4v1234567890"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                title="Карта бутика"
                            ></iframe>
                        </div>

                        {/* Фото бутика */}
                        <div className="map-gallery">
                            <div className="gallery-item">
                                <img
                                    src="https://images.unsplash.com/photo-1528696892704-5e1122855e49?q=80&w=800&auto=format&fit=crop"
                                    alt="Фасад бутика"
                                    loading="lazy"
                                />
                                <div className="gallery-overlay">
                                    <FiMapPin className="overlay-icon" />
                                </div>
                            </div>
                            <div className="gallery-item">
                                <img
                                    src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop"
                                    alt="Внутри бутика"
                                    loading="lazy"
                                />
                                <div className="gallery-overlay">
                                    <FiHeart className="overlay-icon" />
                                </div>
                            </div>
                            <div className="gallery-item">
                                <img
                                    src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=800&auto=format&fit=crop"
                                    alt="Витрина"
                                    loading="lazy"
                                />
                                <div className="gallery-overlay">
                                    <FiMapPin className="overlay-icon" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contacts;