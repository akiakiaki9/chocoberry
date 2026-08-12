'use client';

import { useState, useEffect, useCallback } from 'react';
import './cart.css';
import { motion, AnimatePresence } from 'framer-motion';
import OrderModal from './OrderModal';

const Cart = ({ isOpen, onClose }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [imageErrors, setImageErrors] = useState({});

    const loadCart = useCallback(() => {
        try {
            const savedCart = localStorage.getItem('chocoberry-cart');
            if (savedCart) {
                const items = JSON.parse(savedCart);
                setCartItems(items);

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
    }, []);

    useEffect(() => {
        if (isOpen) {
            loadCart();
            setImageErrors({});
        }
    }, [isOpen, loadCart]);

    const saveCart = useCallback((newCart) => {
        localStorage.setItem('chocoberry-cart', JSON.stringify(newCart));
        setCartItems(newCart);

        const totalItems = newCart.reduce((sum, item) => sum + item.quantity, 0);
        window.dispatchEvent(new CustomEvent('cartUpdated', {
            detail: { count: totalItems }
        }));
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

    const getTotalItems = useCallback(() => {
        return cartItems.reduce((sum, item) => sum + item.quantity, 0);
    }, [cartItems]);

    const getTotalPrice = useCallback(() => {
        return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }, [cartItems]);

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

    const handleCheckout = () => {
        setShowOrderModal(true);
    };

    const handleOrderSuccess = (orderData) => {
        // Очищаем корзину
        saveCart([]);
        setShowOrderModal(false);
        onClose();
        
        // Показываем уведомление
        alert('Спасибо за заказ! Наш менеджер свяжется с вами в ближайшее время.');
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('uz-UZ').format(price) + ' сум';
    };

    const handleImageError = (itemId) => {
        setImageErrors(prev => ({ ...prev, [itemId]: true }));
    };

    const getImagePath = (imagePath) => {
        if (!imagePath) return '/images/placeholder.png';
        if (imagePath.startsWith('/')) return imagePath;
        if (imagePath.startsWith('images/')) return '/' + imagePath;
        return '/' + imagePath;
    };

    // Анимации
    const drawerVariants = {
        hidden: { x: '100%' },
        visible: {
            x: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        },
        exit: {
            x: '100%',
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        }
    };

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 25
            }
        },
        exit: {
            opacity: 0,
            x: -20,
            transition: { duration: 0.2 }
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <motion.div
                className="cart-overlay"
                onClick={onClose}
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            />

            <motion.div
                className="cart-drawer"
                variants={drawerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                {/* Header */}
                <div className="cart-header">
                    <h2 className="cart-title">
                        Корзина
                        {cartItems.length > 0 && (
                            <span className="cart-count">{getTotalItems()} товара</span>
                        )}
                    </h2>
                    <button className="cart-close" onClick={onClose} aria-label="Закрыть корзину">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
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
                            <p className="empty-cart-subtext">Добавьте вкусные боксы с клубникой</p>
                            <button className="empty-cart-btn" onClick={onClose}>
                                Перейти в каталог
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="cart-items">
                                <AnimatePresence>
                                    {cartItems.map((item) => {
                                        const imageSrc = imageErrors[item.id]
                                            ? '/images/placeholder.png'
                                            : getImagePath(item.image);

                                        return (
                                            <motion.div
                                                key={item.id}
                                                className="cart-item"
                                                variants={itemVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                layout
                                            >
                                                <div className="item-image">
                                                    <img
                                                        src={imageSrc}
                                                        alt={item.name}
                                                        onError={() => handleImageError(item.id)}
                                                        loading="lazy"
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
                                                                aria-label="Уменьшить количество"
                                                            >
                                                                −
                                                            </button>
                                                            <span className="quantity">{item.quantity}</span>
                                                            <button
                                                                className="quantity-btn"
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                aria-label="Увеличить количество"
                                                            >
                                                                +
                                                            </button>
                                                        </div>

                                                        <button
                                                            className="remove-item"
                                                            onClick={() => removeItem(item.id)}
                                                            aria-label="Удалить товар"
                                                        >
                                                            <svg viewBox="0 0 24 24" fill="none">
                                                                <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                                <path d="M19 6V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V6M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6" stroke="currentColor" strokeWidth="2" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>

                            <div className="cart-footer">
                                <div className="cart-total">
                                    <span>Итого:</span>
                                    <span className="total-price">{formatPrice(getTotalPrice())}</span>
                                </div>

                                <div className="cart-buttons">
                                    <button className="checkout-btn" onClick={handleCheckout}>
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
            </motion.div>

            {/* Order Modal - НОВАЯ МОДАЛКА */}
            <OrderModal
                isOpen={showOrderModal}
                onClose={() => setShowOrderModal(false)}
                cartItems={cartItems}
                totalPrice={getTotalPrice()}
                onOrderSuccess={handleOrderSuccess}
            />
        </>
    );
};

export default Cart;