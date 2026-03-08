'use client';

import { useState } from 'react';
import { products } from '@/app/utils/data';
import './catalog.css';

const CatalogPreview = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [addedToCart, setAddedToCart] = useState({});

    const categories = [
        { id: 'all', name: 'Все', icon: '🎁' },
        { id: 'classic', name: 'Классика', icon: '🍓' },
        { id: 'premium', name: 'Премиум', icon: '✨' },
        { id: 'romantic', name: 'Романтика', icon: '❤️' }
    ];

    const filteredProducts = activeCategory === 'all'
        ? products.slice(0, 4)
        : products.filter(p => p.category === activeCategory).slice(0, 4);

    // Функция добавления в корзину
    const addToCart = (product) => {
        try {
            // Получаем текущую корзину
            const savedCart = localStorage.getItem('chocoberry-cart');
            let cart = savedCart ? JSON.parse(savedCart) : [];

            // Проверяем, есть ли товар уже в корзине
            const existingItem = cart.find(item => item.id === product.id);

            if (existingItem) {
                // Увеличиваем количество
                existingItem.quantity += 1;
            } else {
                // Добавляем новый товар
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image || '/images/placeholder.jpg',
                    quantity: 1
                });
            }

            // Сохраняем в localStorage
            localStorage.setItem('chocoberry-cart', JSON.stringify(cart));

            // Обновляем счетчик в navbar - НЕМЕДЛЕННО
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

            // Создаем и диспатчим событие
            const event = new CustomEvent('cartUpdated', {
                detail: { count: totalItems }
            });
            window.dispatchEvent(event);

            console.log('Cart updated, total items:', totalItems); // Для отладки

            // Показываем анимацию добавления
            setAddedToCart(prev => ({ ...prev, [product.id]: true }));
            setTimeout(() => {
                setAddedToCart(prev => ({ ...prev, [product.id]: false }));
            }, 1000);

        } catch (error) {
            console.error('Ошибка добавления в корзину:', error);
            alert('Не удалось добавить товар в корзину');
        }
    };

    return (
        <section className="catalog-preview">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">
                        Сладкий <span className="gold-text">момент</span>
                    </h2>
                    <p className="section-subtitle">
                        Выберите идеальный бокс для себя или в подарок
                    </p>
                </div>

                {/* Категории */}
                <div className="category-tabs">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat.id)}
                        >
                            <span className="category-icon">{cat.icon}</span>
                            <span className="category-name">{cat.name}</span>
                        </button>
                    ))}
                </div>

                {/* Сетка товаров */}
                <div className="preview-grid">
                    {filteredProducts.map((product, index) => (
                        <div
                            key={product.id}
                            className="preview-card"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {product.popular && (
                                <div className="card-badge">
                                    🔥 Хит
                                </div>
                            )}

                            <div className="card-image">
                                <img
                                    src={product.image || '/images/placeholder.jpg'}
                                    alt={product.name}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/300x200?text=Chocoberry';
                                    }}
                                />
                                <div className="card-overlay">
                                    <button
                                        className="quick-view"
                                        onClick={() => alert(`${product.name}\n\n${product.description}\n\nЦена: ${product.price.toLocaleString()} сум`)}
                                    >
                                        Быстрый просмотр
                                    </button>
                                </div>
                            </div>

                            <div className="card-content">
                                <h3 className="card-title">{product.name}</h3>

                                <div className="card-features">
                                    <span className="feature">🍓 {product.strawberries} ягод</span>
                                    <span className="feature">⚖️ {product.weight}</span>
                                </div>

                                <div className="card-footer">
                                    <span className="card-price">
                                        {product.price.toLocaleString()} сум
                                    </span>
                                    <button
                                        className={`card-add ${addedToCart[product.id] ? 'added' : ''}`}
                                        onClick={() => addToCart(product)}
                                        disabled={!product.inStock}
                                        title={product.inStock ? 'Добавить в корзину' : 'Нет в наличии'}
                                    >
                                        {addedToCart[product.id] ? (
                                            <span className="check-mark">✓</span>
                                        ) : (
                                            <svg viewBox="0 0 24 24" fill="none">
                                                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Кнопка "Все боксы" */}
                <div className="catalog-action">
                    <button className="btn btn-primary">
                        Смотреть все боксы
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M5 12H19M19 12L15 8M19 12L15 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CatalogPreview;