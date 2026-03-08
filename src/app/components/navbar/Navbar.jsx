'use client';

import { useState, useEffect } from 'react';
import Cart from '../cart/Cart';
import './navbar.css';
import Link from 'next/link';

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
                        <span className="logo-text">Choco</span>
                        <span className="logo-highlight">berry</span>
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
                        <a href="tel:+998901234567" className="navbar-phone">
                            <svg className="phone-icon" viewBox="0 0 24 24" fill="none">
                                <path d="M22 16.92V19C22.001 19.7906 21.816 20.5714 21.4614 21.2747C21.1068 21.978 20.5946 22.5813 19.9709 23.0325C19.3473 23.4837 18.6327 23.7678 17.8807 23.8603C17.1287 23.9529 16.3651 23.8513 15.66 23.564C13.0533 22.5347 10.6448 21.0545 8.54002 19.18C6.55402 17.396 4.96804 15.23 3.87002 12.83C3.55063 12.1183 3.42325 11.336 3.50001 10.5604C3.57677 9.78483 3.85523 9.04307 4.30635 8.40732C4.75747 7.77156 5.36438 7.26496 6.06659 6.93852C6.76879 6.61209 7.54166 6.47727 8.31002 6.54601C8.84746 6.59444 9.36241 6.78452 9.80002 7.09456C10.2376 7.4046 10.5825 7.82318 10.8 8.30801L12.26 11.41C12.46 11.84 12.57 12.31 12.57 12.79C12.57 13.27 12.46 13.74 12.26 14.17C12.15 14.4 12 14.62 11.82 14.82C11.67 15.01 11.5 15.18 11.32 15.34C11.139 15.497 10.986 15.682 10.87 15.89C10.754 16.098 10.694 16.324 10.694 16.555C10.694 16.786 10.754 17.012 10.87 17.22C11.184 17.842 11.629 18.386 12.17 18.81C12.711 19.234 13.336 19.527 14 19.67C14.272 19.73 14.554 19.75 14.832 19.73C15.11 19.71 15.382 19.65 15.64 19.56C15.899 19.47 16.141 19.34 16.356 19.18C16.571 19.02 16.756 18.83 16.9 18.62C17.055 18.407 17.186 18.177 17.29 17.934C17.394 17.691 17.47 17.438 17.516 17.179C17.562 16.92 17.578 16.657 17.562 16.395C17.546 16.133 17.5 15.875 17.42 15.626L17 14.42C16.92 14.162 16.893 13.89 16.922 13.622C16.951 13.354 17.034 13.096 17.166 12.864C17.299 12.631 17.477 12.429 17.689 12.273C17.901 12.117 18.142 12.01 18.397 11.96C19.125 11.801 19.887 11.9 20.54 12.24C21.211 12.575 21.765 13.106 22.12 13.76C22.472 14.408 22.611 15.155 22.51 15.89L22 16.92Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="phone-number">+998 90 123 45 67</span>
                        </a>

                        <button className="navbar-cart" onClick={openCart}>
                            <svg className="cart-icon" viewBox="0 0 24 24" fill="none">
                                <path d="M8 22C8.55228 22 9 21.5523 9 21C9 20.4477 8.55228 20 8 20C7.44772 20 7 20.4477 7 21C7 21.5523 7.44772 22 8 22Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M19 22C19.5523 22 20 21.5523 20 21C20 20.4477 19.5523 20 19 20C18.4477 20 18 20.4477 18 21C18 21.5523 18.4477 22 19 22Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 2H5L7.5 15H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M7.5 15H19L21 6H5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="cart-badge">{cartCount}</span>
                            )}
                        </button>

                        <button
                            className={`burger-menu ${isOpen ? 'active' : ''}`}
                            onClick={toggleMenu}
                            aria-label="Меню"
                        >
                            <span className="burger-line"></span>
                            <span className="burger-line"></span>
                            <span className="burger-line"></span>
                        </button>
                    </div>
                </div>
            </nav>

            <div className={`mobile-menu ${isOpen ? 'active' : ''}`}>
                <div className="mobile-menu-container">
                    <ul className="mobile-menu-list">
                        <li className="mobile-menu-item">
                            <a href="#about" className="mobile-menu-link" onClick={closeMenu}>О нас</a>
                        </li>
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
                        <a href="tel:+998901234567" className="mobile-phone">
                            <svg className="mobile-phone-icon" viewBox="0 0 24 24" fill="none">
                                <path d="M22 16.92V19C22.001 19.7906 21.816 20.5714 21.4614 21.2747C21.1068 21.978 20.5946 22.5813 19.9709 23.0325C19.3473 23.4837 18.6327 23.7678 17.8807 23.8603C17.1287 23.9529 16.3651 23.8513 15.66 23.564C13.0533 22.5347 10.6448 21.0545 8.54002 19.18C6.55402 17.396 4.96804 15.23 3.87002 12.83C3.55063 12.1183 3.42325 11.336 3.50001 10.5604C3.57677 9.78483 3.85523 9.04307 4.30635 8.40732C4.75747 7.77156 5.36438 7.26496 6.06659 6.93852C6.76879 6.61209 7.54166 6.47727 8.31002 6.54601C8.84746 6.59444 9.36241 6.78452 9.80002 7.09456C10.2376 7.4046 10.5825 7.82318 10.8 8.30801L12.26 11.41C12.46 11.84 12.57 12.31 12.57 12.79C12.57 13.27 12.46 13.74 12.26 14.17C12.15 14.4 12 14.62 11.82 14.82C11.67 15.01 11.5 15.18 11.32 15.34C11.139 15.497 10.986 15.682 10.87 15.89C10.754 16.098 10.694 16.324 10.694 16.555C10.694 16.786 10.754 17.012 10.87 17.22C11.184 17.842 11.629 18.386 12.17 18.81C12.711 19.234 13.336 19.527 14 19.67C14.272 19.73 14.554 19.75 14.832 19.73C15.11 19.71 15.382 19.65 15.64 19.56C15.899 19.47 16.141 19.34 16.356 19.18C16.571 19.02 16.756 18.83 16.9 18.62C17.055 18.407 17.186 18.177 17.29 17.934C17.394 17.691 17.47 17.438 17.516 17.179C17.562 16.92 17.578 16.657 17.562 16.395C17.546 16.133 17.5 15.875 17.42 15.626L17 14.42C16.92 14.162 16.893 13.89 16.922 13.622C16.951 13.354 17.034 13.096 17.166 12.864C17.299 12.631 17.477 12.429 17.689 12.273C17.901 12.117 18.142 12.01 18.397 11.96C19.125 11.801 19.887 11.9 20.54 12.24C21.211 12.575 21.765 13.106 22.12 13.76C22.472 14.408 22.611 15.155 22.51 15.89L22 16.92Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            +998 90 123 45 67
                        </a>
                        <button className="mobile-cart" onClick={openCart}>
                            <svg className="mobile-cart-icon" viewBox="0 0 24 24" fill="none">
                                <path d="M8 22C8.55228 22 9 21.5523 9 21C9 20.4477 8.55228 20 8 20C7.44772 20 7 20.4477 7 21C7 21.5523 7.44772 22 8 22Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M19 22C19.5523 22 20 21.5523 20 21C20 20.4477 19.5523 20 19 20C18.4477 20 18 20.4477 18 21C18 21.5523 18.4477 22 19 22Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 2H5L7.5 15H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M7.5 15H19L21 6H5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
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