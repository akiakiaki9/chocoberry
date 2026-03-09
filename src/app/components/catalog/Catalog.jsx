'use client';

import { useState } from 'react';
import { products } from '@/app/utils/data';
import './catalog.css';
import {
    FiShoppingCart,
    FiChevronRight,
    FiHeart,
    FiEye,
    FiCheck
} from 'react-icons/fi';
import { GiStrawberry } from "react-icons/gi";
import { GiChocolateBar } from "react-icons/gi";
import { GiCrowNest } from "react-icons/gi";
import { GiHeartWings } from "react-icons/gi";
import { GiGiftOfKnowledge } from "react-icons/gi";
import { IoMdStar } from 'react-icons/io';
import { FaFire } from 'react-icons/fa';
import Link from 'next/link';

const CatalogPreview = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [addedToCart, setAddedToCart] = useState({});
    const [wishlist, setWishlist] = useState({});

    const categories = [
        { id: 'all', name: 'Все', icon: <GiGiftOfKnowledge /> },
        { id: 'classic', name: 'Классика', icon: <GiStrawberry /> },
        { id: 'premium', name: 'Премиум', icon: <GiCrowNest /> },
        { id: 'romantic', name: 'Романтика', icon: <GiHeartWings /> }
    ];

    const filteredProducts = activeCategory === 'all'
        ? products.slice(0, 4)
        : products.filter(p => p.category === activeCategory).slice(0, 4);

    // Функция добавления в корзину
    const addToCart = (product, e) => {
        e.preventDefault(); // Предотвращаем переход по ссылке
        e.stopPropagation(); // Останавливаем всплытие события

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
            }, 1500);

        } catch (error) {
            console.error('Ошибка добавления в корзину:', error);
            alert('Не удалось добавить товар в корзину');
        }
    };

    // Функция добавления в избранное
    const toggleWishlist = (productId, e) => {
        e.preventDefault();
        e.stopPropagation();
        setWishlist(prev => ({ ...prev, [productId]: !prev[productId] }));
    };

    // Функция быстрого просмотра
    const quickView = (product, e) => {
        e.preventDefault();
        e.stopPropagation();
        alert(`${product.name}\n\n${product.description}\n\nЦена: ${product.price.toLocaleString()} сум`);
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
                        <Link
                            key={product.id}
                            href={`/catalog/${product.id}`}
                            className="preview-card-link"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="preview-card">
                                {product.popular && (
                                    <div className="card-badge">
                                        <FaFire className="badge-icon" />
                                        <span>Хит продаж</span>
                                    </div>
                                )}

                                {product.premium && (
                                    <div className="card-badge premium">
                                        <GiCrowNest className="badge-icon" />
                                        <span>Премиум</span>
                                    </div>
                                )}

                                <button
                                    className={`wishlist-btn ${wishlist[product.id] ? 'active' : ''}`}
                                    onClick={(e) => toggleWishlist(product.id, e)}
                                    aria-label="Добавить в избранное"
                                >
                                    <FiHeart className={`wishlist-icon ${wishlist[product.id] ? 'filled' : ''}`} />
                                </button>

                                <div className="card-image">
                                    <img
                                        src={product.image || '/images/placeholder.jpg'}
                                        alt={product.name}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/300x200?text=Chocoberry';
                                        }}
                                        loading="lazy"
                                    />
                                    <div className="card-overlay">
                                        <button
                                            className="quick-view"
                                            onClick={(e) => quickView(product, e)}
                                        >
                                            <FiEye className="quick-view-icon" />
                                            <span>Быстрый просмотр</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="card-content">
                                    <div className="card-header">
                                        <h3 className="card-title">{product.name}</h3>
                                        {product.rating && (
                                            <div className="card-rating">
                                                <IoMdStar className="star-icon" />
                                                <span>{product.rating}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="card-features">
                                        <span className="feature">
                                            <GiStrawberry className="feature-icon" />
                                            {product.strawberries} ягод
                                        </span>
                                        <span className="feature">
                                            <GiChocolateBar className="feature-icon" />
                                            {product.weight}
                                        </span>
                                    </div>

                                    <div className="card-footer">
                                        <div className="price-section">
                                            {product.oldPrice && (
                                                <span className="old-price">
                                                    {product.oldPrice.toLocaleString()} сум
                                                </span>
                                            )}
                                            <span className="card-price">
                                                {product.price.toLocaleString()} сум
                                            </span>
                                        </div>
                                        <button
                                            className={`card-add ${addedToCart[product.id] ? 'added' : ''}`}
                                            onClick={(e) => addToCart(product, e)}
                                            disabled={!product.inStock}
                                            title={product.inStock ? 'Добавить в корзину' : 'Нет в наличии'}
                                        >
                                            {addedToCart[product.id] ? (
                                                <FiCheck className="check-icon" />
                                            ) : (
                                                <FiShoppingCart className="cart-icon" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Кнопка "Все боксы" */}
                <div className="catalog-action">
                    <Link href='/catalog' className="btn btn-primary">
                        <span>Смотреть все боксы</span>
                        <FiChevronRight className="btn-icon" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CatalogPreview;