'use client';

import { useState, useEffect } from 'react';
import './cart.css';

const Cart = ({ isOpen, onClose }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Загрузка корзины из localStorage
    const loadCart = () => {
        try {
            const savedCart = localStorage.getItem('chocoberry-cart');
            if (savedCart) {
                const items = JSON.parse(savedCart);
                setCartItems(items);

                // Обновляем счетчик в navbar при загрузке
                const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
                window.dispatchEvent(new CustomEvent('cartUpdated', {
                    detail: { count: totalItems }
                }));
            } else {
                setCartItems([]);
            }
        } catch (error) {
            console.error('Ошибка загрузки корзины:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            loadCart(); // Перезагружаем при открытии
        }
    }, [isOpen]);

    // Сохранение корзины в localStorage и обновление счетчика
    const saveCart = (newCart) => {
        localStorage.setItem('chocoberry-cart', JSON.stringify(newCart));
        setCartItems(newCart);

        // Немедленно обновляем счетчик
        const totalItems = newCart.reduce((sum, item) => sum + item.quantity, 0);
        window.dispatchEvent(new CustomEvent('cartUpdated', {
            detail: { count: totalItems }
        }));
    };

    // Блокировка скролла при открытой корзине
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

    const getTotalItems = () => {
        return cartItems.reduce((sum, item) => sum + item.quantity, 0);
    };

    const getTotalPrice = () => {
        return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeItem(productId);
            return;
        }

        const updatedCart = cartItems.map(item =>
            item.id === productId
                ? { ...item, quantity: newQuantity }
                : item
        );
        saveCart(updatedCart);
    };

    const removeItem = (productId) => {
        const updatedCart = cartItems.filter(item => item.id !== productId);
        saveCart(updatedCart);
    };

    const clearCart = () => {
        if (window.confirm('Очистить корзину?')) {
            saveCart([]);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('uz-UZ', {
            style: 'currency',
            currency: 'UZS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="cart-overlay" onClick={onClose} />
            <div className="cart-drawer">
                <div className="cart-header">
                    <h2 className="cart-title">
                        Корзина
                        {cartItems.length > 0 && (
                            <span className="cart-count">{getTotalItems()} товара</span>
                        )}
                    </h2>
                    <button className="cart-close" onClick={onClose}>
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                <div className="cart-content">
                    {isLoading ? (
                        <div className="cart-loading">
                            <div className="loading-spinner"></div>
                        </div>
                    ) : cartItems.length === 0 ? (
                        <div className="cart-empty">
                            <svg className="empty-cart-icon" viewBox="0 0 24 24" fill="none">
                                <path d="M8 22C8.55228 22 9 21.5523 9 21C9 20.4477 8.55228 20 8 20C7.44772 20 7 20.4477 7 21C7 21.5523 7.44772 22 8 22Z" stroke="currentColor" strokeWidth="2" />
                                <path d="M19 22C19.5523 22 20 21.5523 20 21C20 20.4477 19.5523 20 19 20C18.4477 20 18 20.4477 18 21C18 21.5523 18.4477 22 19 22Z" stroke="currentColor" strokeWidth="2" />
                                <path d="M2 2H5L7.5 15H19" stroke="currentColor" strokeWidth="2" />
                                <path d="M7.5 15H19L21 6H5.5" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            <p className="empty-cart-text">Корзина пуста</p>
                            <p className="empty-cart-subtext">Добавьте боксы с клубникой</p>
                            <button className="empty-cart-btn" onClick={onClose}>Перейти в каталог</button>
                        </div>
                    ) : (
                        <>
                            <div className="cart-items">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="cart-item">
                                        <div className="item-image">
                                            <img
                                                src={item.image || '/images/placeholder.jpg'}
                                                alt={item.name}
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/100x100?text=🍓';
                                                }}
                                            />
                                        </div>

                                        <div className="item-details">
                                            <h3 className="item-name">{item.name}</h3>
                                            <p className="item-price">{formatPrice(item.price)}</p>

                                            <div className="item-actions">
                                                <div className="quantity-control">
                                                    <button
                                                        className="quantity-btn"
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    >
                                                        −
                                                    </button>
                                                    <span className="quantity">{item.quantity}</span>
                                                    <button
                                                        className="quantity-btn"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <button
                                                    className="remove-item"
                                                    onClick={() => removeItem(item.id)}
                                                    title="Удалить"
                                                >
                                                    <svg viewBox="0 0 24 24" fill="none">
                                                        <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                        <path d="M19 6V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V6M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6" stroke="currentColor" strokeWidth="2" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="cart-footer">
                                <div className="cart-total">
                                    <span>Итого:</span>
                                    <span className="total-price">{formatPrice(getTotalPrice())}</span>
                                </div>

                                <div className="cart-buttons">
                                    <button className="checkout-btn">
                                        Оформить заказ
                                    </button>
                                    <button className="clear-cart-btn" onClick={clearCart}>
                                        Очистить
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Cart;