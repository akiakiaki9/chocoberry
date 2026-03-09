'use client';

import './footer.css';
import {
    FaInstagram,
    FaTelegram,
    FaFacebookF,
    FaTiktok,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaEnvelope,
    FaClock,
    FaArrowUp
} from 'react-icons/fa';
import { HiOutlineLocationMarker, HiOutlinePhone, HiOutlineMail } from 'react-icons/hi';
import { IoLogoInstagram, IoLogoTiktok } from 'react-icons/io5';
import { FiClock, FiArrowUp } from 'react-icons/fi';
import { useState, useEffect } from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 500);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const socialLinks = [
        { id: 'insta', icon: <FaInstagram />, url: '#', color: '#E4405F' },
        { id: 'tg', icon: <FaTelegram />, url: '#', color: '#0088cc' },
        { id: 'fb', icon: <FaFacebookF />, url: '#', color: '#1877F2' },
        { id: 'tiktok', icon: <FaTiktok />, url: '#', color: '#000000' }
    ];

    return (
        <footer className="footer">
            <div className="footer-main">
                <div className="container">
                    <div className="footer-grid">
                        {/* Колонка 1: Лого и описание */}
                        <div className="footer-col">
                            <div className="footer-logo">
                                <span className="logo-text">Choco</span>
                                <span className="logo-highlight">berry</span>
                            </div>
                            <p className="footer-description">
                                Первый клубничный бутик в Бухаре. Создаём боксы премиум-класса из свежей клубники и бельгийского шоколада.
                            </p>
                            <div className="footer-social">
                                {socialLinks.map(social => (
                                    <a
                                        key={social.id}
                                        href={social.url}
                                        className="social-link"
                                        aria-label={social.id}
                                        style={{ '--social-color': social.color }}
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Колонка 2: Меню */}
                        <div className="footer-col">
                            <h3 className="footer-title">Меню</h3>
                            <ul className="footer-links">
                                <li><a href="#about">О нас</a></li>
                                <li><a href="#catalog">Каталог</a></li>
                                <li><a href="#gallery">Галерея</a></li>
                                <li><a href="#reviews">Отзывы</a></li>
                                <li><a href="#contacts">Контакты</a></li>
                            </ul>
                        </div>

                        {/* Колонка 3: Категории */}
                        <div className="footer-col">
                            <h3 className="footer-title">Категории</h3>
                            <ul className="footer-links">
                                <li><a href="#">Классические боксы</a></li>
                                <li><a href="#">Премиум боксы</a></li>
                                <li><a href="#">Романтические</a></li>
                                <li><a href="#">Семейные</a></li>
                                <li><a href="#">Luxury коллекция</a></li>
                            </ul>
                        </div>

                        {/* Колонка 4: Контакты */}
                        <div className="footer-col">
                            <h3 className="footer-title">Контакты</h3>
                            <ul className="footer-contact">
                                <li>
                                    <FaMapMarkerAlt className="contact-icon" />
                                    <span>ул. Шохрух, 42, Бухара</span>
                                </li>
                                <li>
                                    <FaPhoneAlt className="contact-icon" />
                                    <a href="tel:+998901234567">+998 90 123 45 67</a>
                                </li>
                                <li>
                                    <FaEnvelope className="contact-icon" />
                                    <a href="mailto:info@chocoberry.uz">info@chocoberry.uz</a>
                                </li>
                                <li>
                                    <FaClock className="contact-icon" />
                                    <span>Ежедневно: 10:00 - 22:00</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Нижняя часть футера */}
            <div className="footer-bottom">
                <div className="container">
                    <div className="footer-bottom-content">
                        <p className="copyright">
                            © {currentYear} Chocoberry. Первый клубничный бутик в Бухаре
                        </p>
                        <div className="footer-bottom-links">
                            <a href="#">Политика конфиденциальности</a>
                            <a href="#">Условия доставки</a>
                            <a href="#">Договор оферты</a>
                        </div>
                        <p className="developer">
                            Разработка сайта: <a href="https://akbarsoft.uz">Akbar Soft</a>
                        </p>
                    </div>
                </div>
            </div>

            {/* Кнопка наверх */}
            <button
                className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
                onClick={scrollToTop}
                aria-label="Наверх"
            >
                <FaArrowUp />
            </button>
        </footer>
    );
};

export default Footer;