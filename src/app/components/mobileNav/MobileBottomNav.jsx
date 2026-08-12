'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './MobileBottomNav.css';

const MobileBottomNav = ({ onCartOpen }) => {
    const pathname = usePathname();
    const [cartCount, setCartCount] = useState(0);

    // Следим за количеством товаров в корзине
    useEffect(() => {
        const updateCartCount = () => {
            try {
                const savedCart = localStorage.getItem('chocoberry-cart');
                if (savedCart) {
                    const items = JSON.parse(savedCart);
                    const total = items.reduce((sum, item) => sum + item.quantity, 0);
                    setCartCount(total);
                } else {
                    setCartCount(0);
                }
            } catch (error) {
                console.error('Ошибка загрузки корзины:', error);
            }
        };

        updateCartCount();

        // Слушаем событие обновления корзины
        window.addEventListener('cartUpdated', updateCartCount);
        window.addEventListener('storage', updateCartCount);

        return () => {
            window.removeEventListener('cartUpdated', updateCartCount);
            window.removeEventListener('storage', updateCartCount);
        };
    }, []);

    const isActive = (path) => {
        return pathname === path;
    };

    return (
        <nav className="mobile-bottom-nav">
            {/* Кнопка Меню - ссылка на каталог */}
            <Link 
                href="/catalog" 
                className={`nav-item ${isActive('/catalog') ? 'active' : ''}`}
                aria-label="Каталог"
            >
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M3 9L12 3L21 9L12 15L3 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 15L12 21L21 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 9V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M21 9V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M12 9V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>Меню</span>
            </Link>

            {/* Кнопка Корзина - ОТКРЫВАЕТ КОРЗИНУ (НЕ ССЫЛКА) */}
            <button 
                className="nav-item cart-btn" 
                onClick={onCartOpen}
                aria-label="Корзина"
            >
                <div className="cart-icon-wrapper">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M8 22C8.55228 22 9 21.5523 9 21C9 20.4477 8.55228 20 8 20C7.44772 20 7 20.4477 7 21C7 21.5523 7.44772 22 8 22Z" stroke="currentColor" strokeWidth="2"/>
                        <path d="M19 22C19.5523 22 20 21.5523 20 21C20 20.4477 19.5523 20 19 20C18.4477 20 18 20.4477 18 21C18 21.5523 18.4477 22 19 22Z" stroke="currentColor" strokeWidth="2"/>
                        <path d="M2 2H5L7.5 15H19" stroke="currentColor" strokeWidth="2"/>
                        <path d="M7.5 15H19L21 6H5.5" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    {cartCount > 0 && (
                        <span className="cart-badge">{cartCount}</span>
                    )}
                </div>
                <span>Корзина</span>
            </button>

            {/* Кнопка Контакты - ссылка на страницу контактов */}
            <Link 
                href="/contacts" 
                className={`nav-item ${isActive('/contacts') ? 'active' : ''}`}
                aria-label="Контакты"
            >
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Контакты</span>
            </Link>
        </nav>
    );
};

export default MobileBottomNav;