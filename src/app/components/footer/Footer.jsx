'use client';

import './footer.css';
import {
    FaInstagram,
    FaTelegram,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaClock,
    FaArrowUp,
    FaHeart
} from 'react-icons/fa';
import { FiChevronRight } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [hoveredSocial, setHoveredSocial] = useState(null);

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 500);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const socialLinks = [
        { id: 'insta', icon: <FaInstagram />, url: 'https://www.instagram.com/chocoberry_fruits_bukhara_kafe?igsh=MTk1emh4dDk4ZHJ4eA%3D%3D', color: '#E4405F', label: 'Instagram' },
        { id: 'tg', icon: <FaTelegram />, url: 'https://t.me/chocoberry_fruits_bukhara', color: '#0088cc', label: 'Telegram' }
    ];

    const menuLinks = [
        { href: '/catalog', label: 'Каталог' },
        { href: '/gallery', label: 'Галерея' },
        { href: '/contacts', label: 'Контакты' }
    ];

    const footerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 25
            }
        }
    };

    const socialVariants = {
        idle: { scale: 1, y: 0 },
        hover: (color) => ({
            scale: 1.15,
            y: -5,
            backgroundColor: color,
            boxShadow: `0 10px 30px ${color}40`,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 20
            }
        })
    };

    const backToTopVariants = {
        hidden: { 
            opacity: 0, 
            scale: 0.8,
            y: 20
        },
        visible: { 
            opacity: 1, 
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 500,
                damping: 30
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            y: 20,
            transition: {
                duration: 0.3
            }
        }
    };

    return (
        <footer className="footer">
            <div className="footer-main">
                <div className="container">
                    <motion.div 
                        className="footer-grid"
                        variants={footerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {/* Колонка 1: Лого и описание */}
                        <motion.div className="footer-col" variants={itemVariants}>
                            <div className="footer-logo">
                                <span className="logo-text">Choco</span>
                                <span className="logo-highlight">berry</span>
                                <span className="logo-dot">🍓</span>
                            </div>
                            <p className="footer-description">
                                Первый клубничный бутик в Бухаре. Создаём боксы премиум-класса 
                                из свежей клубники и бельгийского шоколада.
                            </p>
                            <div className="footer-social">
                                {socialLinks.map(social => (
                                    <motion.a
                                        key={social.id}
                                        href={social.url}
                                        className="social-link"
                                        aria-label={social.label}
                                        variants={socialVariants}
                                        initial="idle"
                                        whileHover="hover"
                                        custom={social.color}
                                        onHoverStart={() => setHoveredSocial(social.id)}
                                        onHoverEnd={() => setHoveredSocial(null)}
                                        style={{
                                            '--social-color': social.color
                                        }}
                                    >
                                        {social.icon}
                                        <motion.span 
                                            className="social-tooltip"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ 
                                                opacity: hoveredSocial === social.id ? 1 : 0,
                                                y: hoveredSocial === social.id ? 0 : 10
                                            }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {social.label}
                                        </motion.span>
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>

                        {/* Колонка 2: Меню */}
                        <motion.div className="footer-col" variants={itemVariants}>
                            <h3 className="footer-title">Меню</h3>
                            <ul className="footer-links">
                                {menuLinks.map((link, index) => (
                                    <motion.li 
                                        key={link.href}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <a href={link.href}>
                                            <FiChevronRight className="link-icon" />
                                            {link.label}
                                        </a>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Колонка 3: Контакты */}
                        <motion.div className="footer-col" variants={itemVariants}>
                            <h3 className="footer-title">Контакты</h3>
                            <ul className="footer-contact">
                                <motion.li 
                                    whileHover={{ x: 5 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                >
                                    <FaMapMarkerAlt className="contact-icon" />
                                    <span>Ашхобот 2v, Бухара</span>
                                </motion.li>
                                <motion.li 
                                    whileHover={{ x: 5 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                >
                                    <FaPhoneAlt className="contact-icon" />
                                    <a href="tel:+998914433443">+998 91 443 34 43</a>
                                </motion.li>
                                <motion.li 
                                    whileHover={{ x: 5 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                >
                                    <FaClock className="contact-icon" />
                                    <span>Ежедневно: 10:00 - 22:00</span>
                                </motion.li>
                            </ul>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Нижняя часть футера */}
            <div className="footer-bottom">
                <div className="container">
                    <div className="footer-bottom-content">
                        <p className="copyright">
                            © {currentYear} Chocoberry. 
                            <span className="copyright-heart">
                                <FaHeart />
                            </span>
                            Первый клубничный бутик в Бухаре
                        </p>
                        <p className="developer">
                            Разработка сайта: 
                            <a href="https://akbarsoft.uz" target="_blank" rel="noopener noreferrer">
                                Akbar Soft
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            {/* Кнопка наверх */}
            <AnimatePresence>
                {showBackToTop && (
                    <motion.button
                        className="back-to-top"
                        onClick={scrollToTop}
                        aria-label="Наверх"
                        variants={backToTopVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        whileHover={{ 
                            scale: 1.1,
                            boxShadow: "0 8px 30px rgba(188, 140, 76, 0.4)"
                        }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FaArrowUp />
                        <span className="back-to-top-label">Наверх</span>
                    </motion.button>
                )}
            </AnimatePresence>
        </footer>
    );
};

export default Footer;