'use client';

import { useState, useEffect, useCallback } from 'react';
import Cart from '../cart/Cart';
import './navbar.css';
import Link from 'next/link';
import { FiPhone, FiShoppingCart, FiX, FiHeart } from 'react-icons/fi';
import { GiHamburgerMenu } from 'react-icons/gi';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const updateCartCount = useCallback(() => {
        try {
            const savedCart = localStorage.getItem('chocoberry-cart');
            if (savedCart) {
                const items = JSON.parse(savedCart);
                const count = items.reduce((sum, item) => sum + item.quantity, 0);
                setCartCount(count);
            } else {
                setCartCount(0);
            }
        } catch (error) {
            console.error('Ошибка загрузки корзины:', error);
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        updateCartCount();
    }, [updateCartCount]);

    useEffect(() => {
        const handleCartUpdate = (e) => {
            setCartCount(e.detail.count);
        };

        const handleStorageChange = (e) => {
            if (e.key === 'chocoberry-cart') {
                updateCartCount();
            }
        };

        window.addEventListener('cartUpdated', handleCartUpdate);
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [updateCartCount]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    const openCart = () => {
        setIsCartOpen(true);
        if (isOpen) setIsOpen(false);
    };

    const closeCart = () => {
        setIsCartOpen(false);
        updateCartCount();
    };

    const menuItems = [
        { href: '/catalog', label: 'Каталог' },
        { href: '/gallery', label: 'Галерея' },
        { href: '/contacts', label: 'Контакты' },
    ];

    return (
        <>
            <nav 
                className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="navbar-container">
                    <Link href="/" className="navbar-logo">
                        <div className="logo-wrapper">
                            <img
                                src="/images/logo.png"
                                alt="Chocoberry Logo"
                                className="logo-image"
                            />
                            <div className="logo-glow"></div>
                        </div>
                        <span className="logo-text">
                            Choco<span className="logo-highlight">berry</span>
                        </span>
                    </Link>

                    <ul className="navbar-menu">
                        {menuItems.map((item) => (
                            <li key={item.href} className="menu-item">
                                <Link href={item.href} className="menu-link">
                                    {item.label}
                                    <span className="menu-link-underline"></span>
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="navbar-right">
                        <a href="tel:+998914433443" className="navbar-phone">
                            <FiPhone className="phone-icon" />
                            <span className="phone-number">+998 91 443 34 43</span>
                        </a>

                        <button className="navbar-cart" onClick={openCart}>
                            <FiShoppingCart className="cart-icon" />
                            <AnimatePresence>
                                {cartCount > 0 && (
                                    <motion.span
                                        key="badge"
                                        className="cart-badge"
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        exit={{ scale: 0, rotate: 180 }}
                                        transition={{ 
                                            type: "spring",
                                            stiffness: 500,
                                            damping: 15
                                        }}
                                    >
                                        {cartCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>

                        <button
                            className={`burger-menu ${isOpen ? 'active' : ''}`}
                            onClick={toggleMenu}
                            aria-label="Меню"
                        >
                            <div className="burger-line"></div>
                            <div className="burger-line"></div>
                            <div className="burger-line"></div>
                        </button>
                    </div>
                </div>
            </nav>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            className="menu-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeMenu}
                            transition={{ duration: 0.3 }}
                        />

                        <motion.div
                            className="mobile-menu"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ 
                                type: "spring",
                                stiffness: 300,
                                damping: 30
                            }}
                        >
                            <div className="mobile-menu-container">
                                <button 
                                    className="mobile-close-btn" 
                                    onClick={closeMenu} 
                                    aria-label="Закрыть меню"
                                >
                                    <FiX className="mobile-close-icon" />
                                </button>

                                <ul className="mobile-menu-list">
                                    {menuItems.map((item, index) => (
                                        <motion.li
                                            key={item.href}
                                            className="mobile-menu-item"
                                            initial={{ opacity: 0, x: 50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 + 0.2 }}
                                        >
                                            <Link 
                                                href={item.href} 
                                                className="mobile-menu-link"
                                                onClick={closeMenu}
                                            >
                                                {item.label}
                                            </Link>
                                        </motion.li>
                                    ))}
                                </ul>

                                <motion.div 
                                    className="mobile-menu-footer"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <a href="tel:+998914433443" className="mobile-phone">
                                        <FiPhone className="mobile-phone-icon" />
                                        +998 91 443 34 43
                                    </a>
                                    <button className="mobile-cart" onClick={openCart}>
                                        <FiShoppingCart className="mobile-cart-icon" />
                                        Корзина
                                        <span className="mobile-cart-badge">
                                            {cartCount}
                                        </span>
                                    </button>
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <Cart isOpen={isCartOpen} onClose={closeCart} />
        </>
    );
};

export default Navbar;