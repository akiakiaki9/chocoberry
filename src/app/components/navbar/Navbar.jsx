'use client';

import { useState, useEffect } from 'react';
import Cart from '../cart/Cart';
import './navbar.css';
import Link from 'next/link';
import { FiPhone, FiShoppingCart, FiX } from 'react-icons/fi';
import { GiHamburgerMenu } from 'react-icons/gi';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Функция для обновления счетчика из localStorage
    const updateCartCount = () => {
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
    };

    // Загружаем при монтировании
    useEffect(() => {
        updateCartCount();
    }, []);

    // Слушаем события обновления корзины
    useEffect(() => {
        const handleCartUpdate = (e) => {
            console.log('Cart updated event received:', e.detail);
            setCartCount(e.detail.count);
        };

        // Также слушаем storage события (для других вкладок)
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
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
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
        updateCartCount(); // Обновляем при закрытии на всякий случай
    };

    return (
        <>
            <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
                <div className="navbar-container">
                    <a href="/" className="navbar-logo">
                        {/* Добавляем логотип слева от текста */}
                        <img
                            src="/images/logo.png"
                            alt="Chocoberry Logo"
                            className="logo-image"
                        />
                        <span className="logo-text">Choco<span className="logo-highlight">berry</span></span>
                    </a>

                    <ul className="navbar-menu">
                        <li className="menu-item">
                            <Link href="/catalog" className="menu-link">Каталог</Link>
                        </li>
                        <li className="menu-item">
                            <Link href="/gallery" className="menu-link">Галерея</Link>
                        </li>
                        <li className="menu-item">
                            <Link href="/contacts" className="menu-link">Контакты</Link>
                        </li>
                    </ul>

                    <div className="navbar-right">
                        <a href="tel:+998914433443" className="navbar-phone">
                            <FiPhone className="phone-icon" />
                            <span className="phone-number">+998 91 443 34 43</span>
                        </a>

                        <button className="navbar-cart" onClick={openCart}>
                            <FiShoppingCart className="cart-icon" />
                            {cartCount > 0 && (
                                <span className="cart-badge">{cartCount}</span>
                            )}
                        </button>

                        <button
                            className={`burger-menu ${isOpen ? 'active' : ''}`}
                            onClick={toggleMenu}
                            aria-label="Меню"
                        >
                            {isOpen ? <FiX className="close-icon" /> : <GiHamburgerMenu className="burger-icon" />}
                        </button>
                    </div>
                </div>
            </nav>

            <div className={`mobile-menu ${isOpen ? 'active' : ''}`}>
                <div className="mobile-menu-container">
                    {/* Кнопка закрытия в мобильном меню */}
                    <button className="mobile-close-btn" onClick={closeMenu} aria-label="Закрыть меню">
                        <FiX className="mobile-close-icon" />
                    </button>

                    <ul className="mobile-menu-list">
                        <li className="mobile-menu-item">
                            <a href="#catalog" className="mobile-menu-link" onClick={closeMenu}>Каталог</a>
                        </li>
                        <li className="mobile-menu-item">
                            <a href="#gallery" className="mobile-menu-link" onClick={closeMenu}>Галерея</a>
                        </li>
                        <li className="mobile-menu-item">
                            <a href="#contacts" className="mobile-menu-link" onClick={closeMenu}>Контакты</a>
                        </li>
                    </ul>

                    <div className="mobile-menu-footer">
                        <a href="tel:+998914433443" className="mobile-phone">
                            <FiPhone className="mobile-phone-icon" />
                            +998 91 443 34 43
                        </a>
                        <button className="mobile-cart" onClick={openCart}>
                            <FiShoppingCart className="mobile-cart-icon" />
                            Корзина
                            {cartCount > 0 && (
                                <span className="mobile-cart-badge">{cartCount}</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="menu-overlay" onClick={closeMenu}></div>
            )}

            <Cart isOpen={isCartOpen} onClose={closeCart} />
        </>
    );
};

export default Navbar;