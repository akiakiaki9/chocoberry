'use client';

import { useState } from 'react';
import Link from 'next/link';
import { products, categories } from '../utils/data';
import './catalog.css';

export default function CatalogPage() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [sortBy, setSortBy] = useState('popular');
    const [priceRange, setPriceRange] = useState([0, 2000000]);
    const [showFilters, setShowFilters] = useState(false);
    const [addedToCart, setAddedToCart] = useState({});

    // Фильтрация товаров
    const filteredProducts = products.filter(product => {
        if (activeCategory !== 'all' && product.category !== activeCategory) return false;
        if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
        return true;
    });

    // Сортировка
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-asc': return a.price - b.price;
            case 'price-desc': return b.price - a.price;
            case 'popular': return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
            default: return 0;
        }
    });

    const addToCart = (product, e) => {
        e.preventDefault(); // Предотвращаем переход по ссылке
        e.stopPropagation(); // Останавливаем всплытие события

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
                    price: product.price,
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
            }, 1000);

        } catch (error) {
            console.error('Ошибка добавления в корзину:', error);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('uz-UZ').format(price) + ' сум';
    };

    return (
        <div className="catalog-page">
            {/* Hero секция каталога */}
            <section className="catalog-hero">
                <div className="container">
                    <h1 className="catalog-hero-title">
                        Наши <span className="gold-text">боксы</span>
                    </h1>
                    <p className="catalog-hero-subtitle">
                        Свежая клубника в бельгийском шоколаде. Ручная работа.
                    </p>
                </div>
            </section>

            <section className="catalog-content">
                <div className="container">
                    {/* Мобильная кнопка фильтра */}
                    <button
                        className="catalog-filter-toggle"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M3 6H21M6 12H18M10 18H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Фильтры и сортировка
                    </button>

                    <div className="catalog-layout">
                        {/* Боковая панель фильтров */}
                        <aside className={`catalog-filters ${showFilters ? 'active' : ''}`}>
                            <div className="filters-header">
                                <h3>Фильтры</h3>
                                <button className="filters-close" onClick={() => setShowFilters(false)}>×</button>
                            </div>

                            {/* Категории */}
                            <div className="filter-section">
                                <h4>Категории</h4>
                                <div className="filter-categories">
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
                                            onClick={() => setActiveCategory(cat.id)}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Ценовой диапазон */}
                            <div className="filter-section">
                                <h4>Цена</h4>
                                <div className="price-range">
                                    <div className="price-inputs">
                                        <input
                                            type="number"
                                            value={priceRange[0]}
                                            onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                                            placeholder="От"
                                            min="0"
                                            max="2000000"
                                        />
                                        <span>-</span>
                                        <input
                                            type="number"
                                            value={priceRange[1]}
                                            onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                                            placeholder="До"
                                            min="0"
                                            max="2000000"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Сортировка */}
                            <div className="filter-section">
                                <h4>Сортировка</h4>
                                <select
                                    className="sort-select"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="popular">Сначала популярные</option>
                                    <option value="price-asc">Сначала дешевле</option>
                                    <option value="price-desc">Сначала дороже</option>
                                </select>
                            </div>

                            {/* Количество товаров */}
                            <div className="filter-stats">
                                Найдено: {sortedProducts.length} товаров
                            </div>

                            {/* Кнопка сброса */}
                            <button
                                className="reset-filters"
                                onClick={() => {
                                    setActiveCategory('all');
                                    setPriceRange([0, 2000000]);
                                    setSortBy('popular');
                                }}
                            >
                                Сбросить фильтры
                            </button>
                        </aside>

                        {/* Сетка товаров */}
                        <div className="catalog-products">
                            {sortedProducts.length === 0 ? (
                                <div className="no-products">
                                    <img src="/images/no-results.png" alt="Нет товаров" />
                                    <h3>Товары не найдены</h3>
                                    <p>Попробуйте изменить параметры фильтрации</p>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => {
                                            setActiveCategory('all');
                                            setPriceRange([0, 2000000]);
                                            setSortBy('popular');
                                        }}
                                    >
                                        Сбросить фильтры
                                    </button>
                                </div>
                            ) : (
                                <div className="products-grid">
                                    {sortedProducts.map((product, index) => (
                                        <Link
                                            href={`/catalog/${product.id}`}
                                            key={product.id}
                                            className="product-card-link"
                                            style={{ animationDelay: `${index * 0.05}s` }}
                                        >
                                            <div className="product-card">
                                                {!product.inStock && (
                                                    <div className="product-stock-badge">Нет в наличии</div>
                                                )}
                                                {product.popular && product.inStock && (
                                                    <div className="product-badge">Хит продаж</div>
                                                )}

                                                <div className="product-image">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/300x300?text=Chocoberry';
                                                        }}
                                                    />
                                                    <button className="product-quick-view">👁️</button>
                                                </div>

                                                <div className="product-info">
                                                    <h3 className="product-name">{product.name}</h3>

                                                    <div className="product-meta">
                                                        <span className="product-weight">{product.weight}</span>
                                                        <span className="product-strawberries">🍓 {product.strawberries}</span>
                                                    </div>

                                                    <p className="product-description">{product.description}</p>

                                                    <div className="product-footer">
                                                        <span className="product-price">{formatPrice(product.price)}</span>
                                                        <button
                                                            className={`product-add ${addedToCart[product.id] ? 'added' : ''}`}
                                                            onClick={(e) => addToCart(product, e)}
                                                            disabled={!product.inStock}
                                                        >
                                                            {addedToCart[product.id] ? '✓' : 'В корзину'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}