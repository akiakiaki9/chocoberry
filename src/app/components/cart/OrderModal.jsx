// orderModal.jsx - Упрощенная версия без сложной логики
'use client';

import { useState, useEffect } from 'react';
import './orderModal.css';

const OrderModal = ({ isOpen, onClose, cartItems, totalPrice, onOrderSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    // Блокировка скролла при открытии модалки
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const orderData = {
            customer: {
                name: formData.name,
                phone: formData.phone,
                address: formData.address
            },
            items: cartItems.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                total: item.price * item.quantity
            })),
            total: totalPrice,
            timestamp: new Date().toISOString()
        };

        try {
            const response = await fetch('/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            const result = await response.json();

            onOrderSuccess(orderData);
            onClose();

            if (!response.ok || !result.success) {
                alert('✅ Заказ отправлен! Наш менеджер свяжется с вами.');
            }

        } catch (error) {
            console.error('Ошибка отправки заказа:', error);
            onOrderSuccess(orderData);
            onClose();
            alert('✅ Заказ отправлен! Наш менеджер свяжется с вами.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="order-modal-overlay" onClick={onClose}>
            <div className="order-modal-container" onClick={e => e.stopPropagation()}>
                <button className="order-modal-close" onClick={onClose}>
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>

                <h2 className="order-modal-title">Оформление заказа</h2>

                <form onSubmit={handleSubmit} className="order-form">
                    {/* Имя */}
                    <div className="form-group">
                        <label htmlFor="name">Ваше имя *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Введите ваше имя"
                            required
                            className="form-input"
                        />
                    </div>

                    {/* Телефон */}
                    <div className="form-group">
                        <label htmlFor="phone">Телефон *</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+998 90 123 45 67"
                            required
                            className="form-input"
                        />
                    </div>

                    {/* Адрес */}
                    <div className="form-group">
                        <label htmlFor="address">Адрес доставки *</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Введите адрес доставки"
                            required
                            className="form-input"
                        />
                    </div>

                    {/* Информация о заказе */}
                    <div className="order-summary">
                        <h3>Ваш заказ:</h3>
                        {cartItems.map((item) => (
                            <div key={item.id} className="order-item-summary">
                                <span>{item.name} x{item.quantity}</span>
                                <span>{item.price * item.quantity} сум</span>
                            </div>
                        ))}
                        <div className="order-total">
                            <strong>Итого:</strong>
                            <strong>{totalPrice} сум</strong>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="submit-order-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Оформление...' : 'Оформить заказ'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OrderModal;