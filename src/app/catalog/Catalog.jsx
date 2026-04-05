'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { products } from '../utils/data1';
import './catalog.css';
import {
    FiFilter,
    FiX,
    FiChevronDown,
    FiShoppingCart,
    FiEye,
    FiStar,
    FiRefreshCw,
    FiHeart
} from 'react-icons/fi';
import {
    GiStrawberry,
    GiHeartWings,
    GiCrown,
    GiFlowerEmblem 
} from 'react-icons/gi';
import { FaFire, FaMagic } from 'react-icons/fa';
import { FaWandMagicSparkles } from "react-icons/fa6";
import { IoMdPricetag } from 'react-icons/io';
import { RiFlowerFill } from 'react-icons/ri';

export default function CatalogPage() {
    const [sortBy, setSortBy] = useState('popular');
    const [priceRange, setPriceRange] = useState([0, 2000000]);
    const [showFilters, setShowFilters] = useState(true);
    const [addedToCart, setAddedToCart] = useState({});
    const [quickView, setQuickView] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [hoveredCard, setHoveredCard] = useState(null);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
            if (window.innerWidth > 768) {
                setShowFilters(true);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const categories = [
        { id: 'all', name: 'Все боксы', icon: GiStrawberry, color: '#ff6b9d' },
        { id: 'classic', name: 'Классические', icon: GiStrawberry, color: '#ff9eb5' },
        { id: 'premium', name: 'Премиум', icon: GiCrown, color: '#ff6b9d' },
        { id: 'romantic', name: 'Романтические', icon: GiHeartWings, color: '#ff4d6d' }
    ];

    const parsePrice = (priceStr) => {
        if (typeof priceStr === 'number') return priceStr;
        if (priceStr.includes('-')) {
            const [min, max] = priceStr.split('-').map(p => parseInt(p));
            return min;
        }
        return parseInt(priceStr);
    };

    const getMinPrice = (priceStr) => {
        if (typeof priceStr === 'number') return priceStr;
        if (priceStr.includes('-')) {
            return parseInt(priceStr.split('-')[0]);
        }
        return parseInt(priceStr);
    };

    const getMaxPrice = (priceStr) => {
        if (typeof priceStr === 'number') return priceStr;
        if (priceStr.includes('-')) {
            return parseInt(priceStr.split('-')[1]);
        }
        return parseInt(priceStr);
    };

    const filteredProducts = products.filter(product => {
        const productMinPrice = getMinPrice(product.price);
        const productMaxPrice = getMaxPrice(product.price);

        if (product.price.includes('-')) {
            return productMinPrice <= priceRange[1] && productMaxPrice >= priceRange[0];
        } else {
            return productMinPrice >= priceRange[0] && productMinPrice <= priceRange[1];
        }
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        const priceA = parsePrice(a.price);
        const priceB = parsePrice(b.price);

        switch (sortBy) {
            case 'price-asc': return priceA - priceB;
            case 'price-desc': return priceB - priceA;
            case 'popular':
                return a.id - b.id;
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
            }, 1000);

        } catch (error) {
            console.error('Ошибка добавления в корзину:', error);
        }
    };

    const formatPrice = (price) => {
        if (price.includes('-')) {
            const [min, max] = price.split('-').map(p => parseInt(p));
            return `${new Intl.NumberFormat('uz-UZ').format(min)} - ${new Intl.NumberFormat('uz-UZ').format(max)} сум`;
        }
        return new Intl.NumberFormat('uz-UZ').format(parseInt(price)) + ' сум';
    };

    const resetFilters = () => {
        setPriceRange([0, 2000000]);
        setSortBy('popular');
    };

    const popularProductIds = [1, 2, 3, 4, 5];
    const isProductPopular = (id) => popularProductIds.includes(id);

    // Генерация случайных цветов для лепестков
    const getRandomPetalPosition = (index) => {
        const positions = [
            { top: '10%', left: '5%', rotation: 0, delay: 0 },
            { top: '20%', right: '3%', rotation: 45, delay: 0.5 },
            { bottom: '15%', left: '8%', rotation: -30, delay: 1 },
            { bottom: '25%', right: '6%', rotation: 60, delay: 1.5 },
            { top: '30%', left: '15%', rotation: 90, delay: 2 },
            { bottom: '20%', right: '12%', rotation: -45, delay: 2.5 }
        ];
        return positions[index % positions.length];
    };

    return (
        <div className="catalog-page">
            {/* Hero секция с цветочной текстурой */}
            <section className="catalog-hero">
                <div className="flower-texture-overlay"></div>
                <div className="floating-petals">
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className="petal"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${8 + Math.random() * 7}s`,
                                transform: `rotate(${Math.random() * 360}deg)`
                            }}
                        >
                            🌸
                        </div>
                    ))}
                </div>
                <div className="container">
                    <h1 className="catalog-hero-title">
                        Наши <span className="gold-text">боксы</span>
                        <span className="flower-decoration">🌹</span>
                    </h1>
                    <p className="catalog-hero-subtitle">
                        Свежая клубника в бельгийском шоколаде. Ручная работа.
                    </p>
                    <div className="hero-flowers">
                        <RiFlowerFill className="hero-flower flower-1" />
                        <GiFlowerEmblem  className="hero-flower flower-2" />
                        <RiFlowerFill className="hero-flower flower-3" />
                    </div>
                </div>
            </section>

            <section className="catalog-content">
                <div className="container">
                    {isMobile && (
                        <button
                            className="catalog-filter-toggle"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <FiFilter className="filter-icon" />
                            <span>{showFilters ? 'Скрыть фильтры' : 'Показать фильтры'}</span>
                            <FiChevronDown className={`chevron-icon ${showFilters ? 'rotated' : ''}`} />
                        </button>
                    )}

                    <div className="catalog-layout">
                        <aside className={`catalog-filters ${showFilters ? 'active' : ''}`}>
                            <div className="flower-pattern-bg"></div>
                            <div className="filters-header">
                                <h3>
                                    <FiFilter className="header-icon" />
                                    Фильтры
                                    <GiFlowerEmblem  className="header-flower" />
                                </h3>
                                {isMobile && (
                                    <button className="filters-close" onClick={() => setShowFilters(false)}>
                                        <FiX />
                                    </button>
                                )}
                            </div>

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

                            <div className="filter-stats">
                                <FiStar className="stats-icon" />
                                <span>Найдено: {sortedProducts.length} товаров</span>
                                <FaMagic className="magic-icon" />
                            </div>

                            <button className="reset-filters" onClick={resetFilters}>
                                <FiRefreshCw className="reset-icon" />
                                Сбросить фильтры
                            </button>
                        </aside>

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
                                            onMouseEnter={() => setHoveredCard(product.id)}
                                            onMouseLeave={() => setHoveredCard(null)}
                                        >
                                            <div className={`product-card ${hoveredCard === product.id ? 'hovered' : ''}`}>
                                                <div className="card-flower-texture"></div>

                                                {isProductPopular(product.id) && (
                                                    <div className="product-badge">
                                                        <FaFire className="badge-icon" />
                                                        <span>Хит продаж</span>
                                                        <FaWandMagicSparkles className="sparkle-icon" />
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
                                                    <div className="image-overlay-flower">
                                                        <GiFlowerEmblem  />
                                                    </div>
                                                </div>

                                                <div className="product-info">
                                                    <h3 className="product-name">
                                                        {product.name}
                                                        <FiHeart className="product-heart" />
                                                    </h3>

                                                    <div className="product-footer">
                                                        <span className="product-price">{formatPrice(product.price)}</span>
                                                        <button
                                                            className={`product-add ${addedToCart[product.id] ? 'added' : ''}`}
                                                            onClick={(e) => addToCart(product, e)}
                                                        >
                                                            <FiShoppingCart className="cart-icon" />
                                                            <span>{addedToCart[product.id] ? 'Добавлено' : 'В корзину'}</span>
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Плавающие цветочки при наведении */}
                                                {hoveredCard === product.id && (
                                                    <div className="floating-flowers">
                                                        {[...Array(6)].map((_, i) => (
                                                            <div
                                                                key={i}
                                                                className="floating-flower"
                                                                style={{
                                                                    left: `${Math.random() * 100}%`,
                                                                    top: `${Math.random() * 100}%`,
                                                                    animationDelay: `${i * 0.1}s`
                                                                }}
                                                            >
                                                                {i % 2 === 0 ? '🌸' : '🌷'}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {quickView && (
                <div className="quick-view-modal" onClick={() => setQuickView(null)}>
                    <div className="quick-view-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-flower-bg"></div>
                        <button className="modal-close" onClick={() => setQuickView(null)}>
                            <FiX />
                        </button>
                        <div className="quick-view-grid">
                            <div className="quick-view-image">
                                <img src={quickView.image} alt={quickView.name} />
                                <div className="image-flower-overlay">
                                    <RiFlowerFill />
                                </div>
                            </div>
                            <div className="quick-view-info">
                                <h2>{quickView.name}</h2>
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