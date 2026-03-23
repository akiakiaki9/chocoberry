'use client';

import { useState } from 'react';
import { products } from '@/app/utils/data1';
import './catalog.css';
import {
    FiShoppingCart,
    FiChevronRight,
    FiHeart,
    FiEye,
    FiCheck
} from 'react-icons/fi';
import { GiStrawberry } from "react-icons/gi";
import { GiCrowNest } from "react-icons/gi";
import { GiHeartWings } from "react-icons/gi";
import { GiGiftOfKnowledge } from "react-icons/gi";
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

    // Берем первые 4 товара для превью
    const previewProducts = products.slice(0, 4);

    // Функция для парсинга цены (поддержка диапазонов)
    const parsePrice = (priceStr) => {
        if (typeof priceStr === 'number') return priceStr;
        if (priceStr.includes('-')) {
            return parseInt(priceStr.split('-')[0]);
        }
        return parseInt(priceStr);
    };

    // Форматирование цены для отображения
    const formatPrice = (price) => {
        if (price.includes('-')) {
            const [min, max] = price.split('-').map(p => parseInt(p));
            return `${new Intl.NumberFormat('uz-UZ').format(min)} - ${new Intl.NumberFormat('uz-UZ').format(max)} сум`;
        }
        return new Intl.NumberFormat('uz-UZ').format(parseInt(price)) + ' сум';
    };

    // Определяем популярные товары (первые 3)
    const popularProductIds = [1, 2, 3];
    const isProductPopular = (id) => popularProductIds.includes(id);

    // Функция добавления в корзину
    const addToCart = (product, e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const savedCart = localStorage.getItem('chocoberry-cart');
            let cart = savedCart ? JSON.parse(savedCart) : [];

            const existingItem = cart.find(item => item.id === product.id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: parsePrice(product.price),
                    priceRaw: product.price,
                    image: product.image || '/images/placeholder.jpg',
                    quantity: 1
                });
            }

            localStorage.setItem('chocoberry-cart', JSON.stringify(cart));

            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            window.dispatchEvent(new CustomEvent('cartUpdated', {
                detail: { count: totalItems }
            }));

            setAddedToCart(prev => ({ ...prev, [product.id]: true }));
            setTimeout(() => {
                setAddedToCart(prev => ({ ...prev, [product.id]: false }));
            }, 1500);

        } catch (error) {
            console.error('Ошибка добавления в корзину:', error);
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
        alert(`${product.name}\n\nЦена: ${formatPrice(product.price)}`);
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
                    {previewProducts.map((product, index) => (
                        <Link
                            key={product.id}
                            href={`/catalog/${product.id}`}
                            className="preview-card-link"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="preview-card">
                                {isProductPopular(product.id) && (
                                    <div className="card-badge">
                                        <FaFire className="badge-icon" />
                                        <span>Хит продаж</span>
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
                                        src={product.image}
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
                                    </div>

                                    <div className="card-footer">
                                        <div className="price-section">
                                            <span className="card-price">
                                                {formatPrice(product.price)}
                                            </span>
                                        </div>
                                        <button
                                            className={`card-add ${addedToCart[product.id] ? 'added' : ''}`}
                                            onClick={(e) => addToCart(product, e)}
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