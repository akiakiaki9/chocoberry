'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
    FiHeart,
    FiGrid,
    FiList
} from 'react-icons/fi';
import {
    GiStrawberry,
    GiHeartWings,
    GiCrown,
    GiFlowerEmblem 
} from 'react-icons/gi';
import { FaFire, FaMagic, FaWandMagicSparkles } from 'react-icons/fa';
import { IoMdPricetag } from 'react-icons/io';
import { RiFlowerFill } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';

export default function CatalogPage() {
    const [sortBy, setSortBy] = useState('popular');
    const [priceRange, setPriceRange] = useState([0, 2000000]);
    const [showFilters, setShowFilters] = useState(true);
    const [addedToCart, setAddedToCart] = useState({});
    const [quickView, setQuickView] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [activeCategory, setActiveCategory] = useState('all');
    const [isFilterVisible, setIsFilterVisible] = useState(true);
    const filterRef = useRef(null);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (mobile) {
                setIsFilterVisible(false);
                setShowFilters(false);
            } else {
                setIsFilterVisible(true);
                setShowFilters(true);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const categories = [
        { id: 'all', name: 'Все боксы', icon: GiStrawberry, color: '#ff6b9d', emoji: '🌸' },
        { id: 'classic', name: 'Классические', icon: GiStrawberry, color: '#ff9eb5', emoji: '🍓' },
        { id: 'premium', name: 'Премиум', icon: GiCrown, color: '#ffd700', emoji: '👑' },
        { id: 'romantic', name: 'Романтические', icon: GiHeartWings, color: '#ff4d6d', emoji: '❤️' }
    ];

    const parsePrice = (priceStr) => {
        if (typeof priceStr === 'number') return priceStr;
        if (priceStr.includes('-')) {
            return parseInt(priceStr.split('-')[0]);
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
        const inPriceRange = productMinPrice <= priceRange[1] && productMaxPrice >= priceRange[0];
        const inCategory = activeCategory === 'all' || product.category === activeCategory;
        return inPriceRange && inCategory;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        const priceA = parsePrice(a.price);
        const priceB = parsePrice(b.price);

        switch (sortBy) {
            case 'price-asc': return priceA - priceB;
            case 'price-desc': return priceB - priceA;
            case 'popular':
                return (b.popularity || 0) - (a.popularity || 0);
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
        setActiveCategory('all');
    };

    const popularProductIds = [1, 2, 3, 4, 5];
    const isProductPopular = (id) => popularProductIds.includes(id);

    const toggleFilters = () => {
        setIsFilterVisible(!isFilterVisible);
        setShowFilters(!showFilters);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 25
            }
        }
    };

    return (
        <div className="catalog-page">
            {/* Hero секция */}
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
                            {['🌸', '🌷', '🌹', '🌺', '🌻', '🌼'][i % 6]}
                        </div>
                    ))}
                </div>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="catalog-hero-title">
                            Наши <span className="gold-text">боксы</span>
                            <span className="flower-decoration">🌹</span>
                        </h1>
                        <p className="catalog-hero-subtitle">
                            Свежая клубника в бельгийском шоколаде. Ручная работа.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="catalog-content">
                <div className="container">
                    {/* Верхняя панель */}
                    <div className="catalog-toolbar">
                        <div className="toolbar-left">
                            <button
                                className="filter-toggle-btn"
                                onClick={toggleFilters}
                                aria-label="Переключить фильтры"
                            >
                                <FiFilter className="filter-icon" />
                                <span>Фильтры</span>
                                <motion.span 
                                    className="filter-indicator"
                                    animate={{ rotate: isFilterVisible ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <FiChevronDown />
                                </motion.span>
                            </button>
                            <div className="view-mode-toggle">
                                <button
                                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                    onClick={() => setViewMode('grid')}
                                    aria-label="Сетка"
                                >
                                    <FiGrid />
                                </button>
                                <button
                                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                    onClick={() => setViewMode('list')}
                                    aria-label="Список"
                                >
                                    <FiList />
                                </button>
                            </div>
                        </div>
                        <div className="toolbar-right">
                            <span className="products-count">
                                Найдено: <strong>{sortedProducts.length}</strong>
                            </span>
                            <select
                                className="sort-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="popular">Популярные</option>
                                <option value="price-asc">Дешевле</option>
                                <option value="price-desc">Дороже</option>
                            </select>
                        </div>
                    </div>

                    <div className="catalog-layout">
                        {/* Фильтры */}
                        <AnimatePresence>
                            {(isFilterVisible || !isMobile) && (
                                <motion.aside 
                                    className={`catalog-filters ${showFilters ? 'active' : ''}`}
                                    ref={filterRef}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="flower-pattern-bg"></div>
                                    <div className="filters-header">
                                        <h3>
                                            <FiFilter className="header-icon" />
                                            Фильтры
                                            <GiFlowerEmblem className="header-flower" />
                                        </h3>
                                        {isMobile && (
                                            <button 
                                                className="filters-close" 
                                                onClick={toggleFilters}
                                                aria-label="Закрыть фильтры"
                                            >
                                                <FiX />
                                            </button>
                                        )}
                                    </div>

                                    <div className="filter-section">
                                        <h4>
                                            <RiFlowerFill className="section-icon" />
                                            Категории
                                        </h4>
                                        <div className="filter-categories">
                                            {categories.map((cat) => (
                                                <button
                                                    key={cat.id}
                                                    className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
                                                    onClick={() => setActiveCategory(cat.id)}
                                                    style={{
                                                        '--category-color': cat.color
                                                    }}
                                                >
                                                    <span className="category-emoji">{cat.emoji}</span>
                                                    <span className="category-name">{cat.name}</span>
                                                    <span className="category-count">
                                                        {products.filter(p => cat.id === 'all' || p.category === cat.id).length}
                                                    </span>
                                                    {activeCategory === cat.id && (
                                                        <span className="category-active-dot" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
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
                                                    onChange={(e) => {
                                                        const val = +e.target.value;
                                                        setPriceRange([val, priceRange[1]]);
                                                    }}
                                                    placeholder="От"
                                                    min="0"
                                                    max="2000000"
                                                />
                                                <span className="price-separator">—</span>
                                                <input
                                                    type="number"
                                                    value={priceRange[1]}
                                                    onChange={(e) => {
                                                        const val = +e.target.value;
                                                        setPriceRange([priceRange[0], val]);
                                                    }}
                                                    placeholder="До"
                                                    min="0"
                                                    max="2000000"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="filter-stats">
                                        <FiStar className="stats-icon" />
                                        <span>{sortedProducts.length} товаров</span>
                                        <FaMagic className="magic-icon" />
                                    </div>

                                    <button className="reset-filters" onClick={resetFilters}>
                                        <FiRefreshCw className="reset-icon" />
                                        Сбросить
                                    </button>
                                </motion.aside>
                            )}
                        </AnimatePresence>

                        {/* Товары */}
                        <div className="catalog-products">
                            {sortedProducts.length === 0 ? (
                                <motion.div 
                                    className="no-products"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="no-products-icon">🌸</div>
                                    <h3>Товары не найдены</h3>
                                    <p>Попробуйте изменить параметры фильтрации</p>
                                    <button className="btn btn-primary" onClick={resetFilters}>
                                        <FiRefreshCw className="btn-icon" />
                                        Сбросить фильтры
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    className={`products-grid ${viewMode === 'list' ? 'list-view' : ''}`}
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {sortedProducts.map((product, index) => (
                                        <motion.div
                                            key={product.id}
                                            variants={itemVariants}
                                            className="product-card-wrapper"
                                            onMouseEnter={() => setHoveredCard(product.id)}
                                            onMouseLeave={() => setHoveredCard(null)}
                                        >
                                            <Link
                                                href={`/catalog/${product.id}`}
                                                className="product-card-link"
                                            >
                                                <div className={`product-card ${hoveredCard === product.id ? 'hovered' : ''}`}>
                                                    <div className="card-flower-texture"></div>

                                                    {isProductPopular(product.id) && (
                                                        <div className="product-badge">
                                                            <FaFire className="badge-icon" />
                                                            <span>Хит</span>
                                                        </div>
                                                    )}

                                                    <div className="product-image">
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            onError={(e) => {
                                                                e.target.src = 'https://via.placeholder.com/300x300?text=Chocoberry';
                                                            }}
                                                            loading="lazy"
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
                                                            <GiFlowerEmblem />
                                                        </div>
                                                    </div>

                                                    <div className="product-info">
                                                        <h3 className="product-name">{product.name}</h3>

                                                        <div className="product-meta">
                                                            <span className="product-category">
                                                                {categories.find(c => c.id === product.category)?.emoji || '🍓'}
                                                            </span>
                                                        </div>

                                                        <div className="product-footer">
                                                            <span className="product-price">{formatPrice(product.price)}</span>
                                                            <button
                                                                className={`product-add ${addedToCart[product.id] ? 'added' : ''}`}
                                                                onClick={(e) => addToCart(product, e)}
                                                            >
                                                                <FiShoppingCart className="cart-icon" />
                                                                <span>{addedToCart[product.id] ? '✓' : ''}</span>
                                                            </button>
                                                        </div>
                                                    </div>

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
                                                                    {['🌸', '🌷', '🌹', '🌺', '🌻', '🌼'][i % 6]}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick View Modal */}
            <AnimatePresence>
                {quickView && (
                    <motion.div 
                        className="quick-view-modal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setQuickView(null)}
                    >
                        <motion.div 
                            className="quick-view-content"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <button className="modal-close" onClick={() => setQuickView(null)}>
                                <FiX />
                            </button>
                            <div className="quick-view-grid">
                                <div className="quick-view-image">
                                    <img src={quickView.image} alt={quickView.name} />
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
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}