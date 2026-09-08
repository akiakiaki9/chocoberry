'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
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
    FiGrid,
    FiList,
    FiArrowRight
} from 'react-icons/fi';
import { GiFlowerEmblem } from 'react-icons/gi';
import { FaFire } from 'react-icons/fa';

export default function CatalogPage() {
    // Состояния
    const [sortBy, setSortBy] = useState('price-asc');
    const [priceRange, setPriceRange] = useState([0, 2000000]);
    const [showFilters, setShowFilters] = useState(true);
    const [addedToCart, setAddedToCart] = useState({});
    const [quickView, setQuickView] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [viewMode, setViewMode] = useState('grid');

    // Определение мобильного устройства
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (mobile) setShowFilters(false);
            else setShowFilters(true);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Блокировка скролла при открытой модалке
    useEffect(() => {
        if (quickView) {
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = '5px'; // Компенсация скролла
        } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, [quickView]);

    // Вспомогательные функции
    const parsePrice = useCallback((price) => {
        if (typeof price === 'number') return price;
        if (typeof price === 'string' && price.includes('-')) {
            return parseInt(price.split('-')[0]);
        }
        return parseInt(price);
    }, []);

    const getMinPrice = useCallback((price) => {
        if (typeof price === 'number') return price;
        if (typeof price === 'string' && price.includes('-')) {
            return parseInt(price.split('-')[0]);
        }
        return parseInt(price);
    }, []);

    const getMaxPrice = useCallback((price) => {
        if (typeof price === 'number') return price;
        if (typeof price === 'string' && price.includes('-')) {
            return parseInt(price.split('-')[1]);
        }
        return parseInt(price);
    }, []);

    // Фильтрация и сортировка
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const minPrice = getMinPrice(product.price);
            const maxPrice = getMaxPrice(product.price);
            return minPrice <= priceRange[1] && maxPrice >= priceRange[0];
        });
    }, [priceRange, getMinPrice, getMaxPrice]);

    const sortedProducts = useMemo(() => {
        return [...filteredProducts]
            .sort((a, b) => b.id - a.id)
            .sort((a, b) => {
                const priceA = parsePrice(a.price);
                const priceB = parsePrice(b.price);
                return sortBy === 'price-asc' ? priceA - priceB : priceB - priceA;
            });
    }, [filteredProducts, sortBy, parsePrice]);

    // Добавление в корзину
    const addToCart = useCallback((product, e) => {
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
            }, 800);

        } catch (error) {
            console.error('Ошибка добавления в корзину:', error);
        }
    }, [parsePrice]);

    // Форматирование цены
    const formatPrice = useCallback((price) => {
        if (typeof price === 'string' && price.includes('-')) {
            const [min, max] = price.split('-').map(p => parseInt(p));
            return `${new Intl.NumberFormat('uz-UZ').format(min)} - ${new Intl.NumberFormat('uz-UZ').format(max)} сум`;
        }
        return new Intl.NumberFormat('uz-UZ').format(parseInt(price)) + ' сум';
    }, []);

    const resetFilters = useCallback(() => {
        setPriceRange([0, 2000000]);
        setSortBy('price-asc');
    }, []);

    const toggleFilters = useCallback(() => {
        setShowFilters(prev => !prev);
    }, []);

    const openQuickView = useCallback((product, e) => {
        e.preventDefault();
        e.stopPropagation();
        setQuickView(product);
    }, []);

    const closeQuickView = useCallback(() => {
        setQuickView(null);
    }, []);

    // Популярные товары
    const popularProductIds = useMemo(() => [1, 2, 3, 4, 5], []);
    const isProductPopular = useCallback((id) => popularProductIds.includes(id), [popularProductIds]);

    // Компонент карточки товара
    const ProductCard = useCallback(({ product }) => {
        const isPopular = isProductPopular(product.id);
        const isAdded = addedToCart[product.id];

        return (
            <div className="product-card">
                {isPopular && (
                    <div className="product-badge">
                        <FaFire />
                        <span>Хит</span>
                    </div>
                )}

                <div className="product-image">
                    <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                    />
                    <button
                        className="product-quick-view"
                        onClick={(e) => openQuickView(product, e)}
                        aria-label="Быстрый просмотр"
                    >
                        <FiEye />
                    </button>
                </div>

                <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>

                    <div className="product-footer">
                        <span className="product-price">{formatPrice(product.price)}</span>
                        <button
                            className={`product-add ${isAdded ? 'added' : ''}`}
                            onClick={(e) => addToCart(product, e)}
                            aria-label="Добавить в корзину"
                        >
                            <FiShoppingCart />
                            {isAdded && <span>✓</span>}
                        </button>
                    </div>

                    <Link
                        href={`/catalog/${product.id}`}
                        className="product-details-link"
                    >
                        <span>Подробнее</span>
                        <FiArrowRight />
                    </Link>
                </div>
            </div>
        );
    }, [addedToCart, addToCart, formatPrice, isProductPopular, openQuickView]);

    // Компонент фильтров
    const FiltersPanel = useCallback(() => (
        <aside className={`catalog-filters ${showFilters ? 'active' : ''}`}>
            <div className="filters-header">
                <h3>
                    <FiFilter />
                    Фильтры
                    <GiFlowerEmblem />
                </h3>
                {isMobile && (
                    <button className="filters-close" onClick={toggleFilters}>
                        <FiX />
                    </button>
                )}
            </div>

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

            <div className="filter-stats">
                <FiStar />
                <span>{sortedProducts.length} товаров</span>
            </div>

            <button className="reset-filters" onClick={resetFilters}>
                <FiRefreshCw />
                Сбросить
            </button>
        </aside>
    ), [showFilters, isMobile, priceRange, sortedProducts.length, toggleFilters, resetFilters]);

    return (
        <div className="catalog-page">
            {/* Hero секция */}
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

            {/* Основной контент */}
            <section className="catalog-content">
                <div className="container">
                    {/* Toolbar */}
                    <div className="catalog-toolbar">
                        <div className="toolbar-left">
                            <button
                                className="filter-toggle-btn"
                                onClick={toggleFilters}
                                aria-label="Переключить фильтры"
                            >
                                <FiFilter />
                                <span>Фильтры</span>
                                <FiChevronDown className={showFilters ? 'rotated' : ''} />
                            </button>
                            <div className="view-mode-toggle">
                                <button
                                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                    onClick={() => setViewMode('grid')}
                                >
                                    <FiGrid />
                                </button>
                                <button
                                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                    onClick={() => setViewMode('list')}
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
                                <option value="price-asc">Сначала дешевые</option>
                                <option value="price-desc">Сначала дорогие</option>
                            </select>
                        </div>
                    </div>

                    {/* Layout */}
                    <div className="catalog-layout">
                        {/* Фильтры */}
                        {(showFilters || !isMobile) && <FiltersPanel />}

                        {/* Товары */}
                        <div className="catalog-products">
                            {sortedProducts.length === 0 ? (
                                <div className="no-products">
                                    <div className="no-products-icon">🌸</div>
                                    <h3>Товары не найдены</h3>
                                    <p>Попробуйте изменить параметры фильтрации</p>
                                    <button className="btn btn-primary" onClick={resetFilters}>
                                        <FiRefreshCw />
                                        Сбросить фильтры
                                    </button>
                                </div>
                            ) : (
                                <div className={`products-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
                                    {sortedProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick View Modal */}
            {quickView && (
                <div className="quick-view-modal" onClick={closeQuickView}>
                    <div className="quick-view-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeQuickView}>
                            <FiX />
                        </button>
                        <div className="quick-view-grid">
                            <div className="quick-view-image">
                                <img src={quickView.image} alt={quickView.name} />
                            </div>
                            <div className="quick-view-info">
                                <h2>{quickView.name}</h2>
                                <div className="quick-view-price">{formatPrice(quickView.price)}</div>
                                <div className="quick-view-actions">
                                    <button
                                        className="btn btn-primary quick-view-add"
                                        onClick={(e) => {
                                            addToCart(quickView, e);
                                            closeQuickView();
                                        }}
                                    >
                                        <FiShoppingCart />
                                        Добавить в корзину
                                    </button>
                                    <Link
                                        href={`/catalog/${quickView.id}`}
                                        className="btn btn-secondary quick-view-details"
                                        onClick={closeQuickView}
                                    >
                                        Подробнее
                                        <FiArrowRight />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}