'use client';

import { useState } from 'react';
import Link from 'next/link';
import { products, categories } from '../utils/data';
import './catalog.css';
import {
    FiFilter,
    FiX,
    FiChevronDown,
    FiShoppingCart,
    FiEye,
    FiStar,
    FiArrowUp,
    FiRefreshCw
} from 'react-icons/fi';
import {
    GiStrawberry,
    GiChocolateBar,
    GiHeartWings,
    GiCrown,
    GiWeight
} from 'react-icons/gi';
import { FaFire } from 'react-icons/fa';
import { IoMdPricetag } from 'react-icons/io';

export default function CatalogPage() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [sortBy, setSortBy] = useState('popular');
    const [priceRange, setPriceRange] = useState([0, 2000000]);
    const [showFilters, setShowFilters] = useState(false);
    const [addedToCart, setAddedToCart] = useState({});
    const [quickView, setQuickView] = useState(null);

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

    const resetFilters = () => {
        setActiveCategory('all');
        setPriceRange([0, 2000000]);
        setSortBy('popular');
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
                        <FiFilter className="filter-icon" />
                        <span>Фильтры и сортировка</span>
                        <FiChevronDown className={`chevron-icon ${showFilters ? 'rotated' : ''}`} />
                    </button>

                    <div className="catalog-layout">
                        {/* Боковая панель фильтров */}
                        <aside className={`catalog-filters ${showFilters ? 'active' : ''}`}>
                            <div className="filters-header">
                                <h3>
                                    <FiFilter className="header-icon" />
                                    Фильтры
                                </h3>
                                <button className="filters-close" onClick={() => setShowFilters(false)}>
                                    <FiX />
                                </button>
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
                                            {cat.id === 'classic' && <GiStrawberry className="category-icon" />}
                                            {cat.id === 'premium' && <GiCrown className="category-icon" />}
                                            {cat.id === 'romantic' && <GiHeartWings className="category-icon" />}
                                            <span>{cat.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Ценовой диапазон */}
                            <div className="filter-section">
                                <h4>
                                    <IoMdPricetag className="section-icon" />
                                    Цена
                                </h4>
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
                                        <span className="price-separator">—</span>
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

                            {/* Статистика */}
                            <div className="filter-stats">
                                <FiStar className="stats-icon" />
                                <span>Найдено: {sortedProducts.length} товаров</span>
                            </div>

                            {/* Кнопка сброса */}
                            <button className="reset-filters" onClick={resetFilters}>
                                <FiRefreshCw className="reset-icon" />
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
                                    <button className="btn btn-primary" onClick={resetFilters}>
                                        <FiRefreshCw className="btn-icon" />
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
                                                    <div className="product-badge">
                                                        <FaFire className="badge-icon" />
                                                        <span>Хит продаж</span>
                                                    </div>
                                                )}

                                                <div className="product-image">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/300x300?text=Chocoberry';
                                                        }}
                                                    />
                                                    <button
                                                        className="product-quick-view"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setQuickView(product);
                                                        }}
                                                    >
                                                        <FiEye />
                                                    </button>
                                                </div>

                                                <div className="product-info">
                                                    <h3 className="product-name">{product.name}</h3>

                                                    <div className="product-meta">
                                                        <span className="product-weight">
                                                            <GiWeight className="meta-icon" />
                                                            {product.weight}
                                                        </span>
                                                        <span className="product-strawberries">
                                                            <GiStrawberry className="meta-icon" />
                                                            {product.strawberries}
                                                        </span>
                                                    </div>

                                                    <p className="product-description">{product.description}</p>

                                                    <div className="product-footer">
                                                        <span className="product-price">{formatPrice(product.price)}</span>
                                                        <button
                                                            className={`product-add ${addedToCart[product.id] ? 'added' : ''}`}
                                                            onClick={(e) => addToCart(product, e)}
                                                            disabled={!product.inStock}
                                                        >
                                                            <FiShoppingCart className="cart-icon" />
                                                            <span>{addedToCart[product.id] ? 'Добавлено' : 'В корзину'}</span>
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

            {/* Quick View Modal */}
            {quickView && (
                <div className="quick-view-modal" onClick={() => setQuickView(null)}>
                    <div className="quick-view-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setQuickView(null)}>
                            <FiX />
                        </button>
                        <div className="quick-view-grid">
                            <div className="quick-view-image">
                                <img src={quickView.image} alt={quickView.name} />
                            </div>
                            <div className="quick-view-info">
                                <h2>{quickView.name}</h2>
                                <p className="quick-view-description">{quickView.description}</p>
                                <div className="quick-view-details">
                                    <span><GiWeight /> {quickView.weight}</span>
                                    <span><GiStrawberry /> {quickView.strawberries}</span>
                                </div>
                                <div className="quick-view-price">{formatPrice(quickView.price)}</div>
                                <button
                                    className="btn btn-primary quick-view-add"
                                    onClick={(e) => {
                                        addToCart(quickView, e);
                                        setQuickView(null);
                                    }}
                                >
                                    <FiShoppingCart />
                                    Добавить в корзину
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}