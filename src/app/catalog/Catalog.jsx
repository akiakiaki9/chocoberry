'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import { products, drinks } from '../utils/data1';
import './catalog.css';
import {
    FiFilter,
    FiX,
    FiChevronDown,
    FiChevronLeft,
    FiChevronRight,
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

// Явные категории
const CATEGORIES = [
    { id: 'heart', name: 'Клубничное сердце', image: '/images/data/images-bg/1.JPEG' },
    { id: 'box', name: 'Клубничный бокс', image: '/images/data/images-bg/2.JPEG' },
    { id: 'basket', name: 'Клубничная корзина', image: '/images/data/images-bg/27.PNG' },
    { id: 'dessert', name: 'Десерты', image: '/images/data/images-bg/63.JPEG' },
    { id: 'drinks', name: 'Напитки', image: '/images/drinks/1.png' },
];

// Определяем категорию по названию товара
const getProductCategory = (name) => {
    const n = name.toLowerCase();

    // Напитки — только точные слова (границы слов), чтобы "шоколаде" не попадало
    if (/\b(капучино|эспрессо|американо|латте|кола|фанта|спрайт)\b/.test(n)) return 'drinks';
    if (n.includes('напит')) return 'drinks';

    if (n.includes('сердце')) return 'heart';
    if (n.includes('корзин')) return 'basket';
    if (n.includes('бокс')) return 'box';
    if (n.includes('десерт') || n.includes('меренг') || n.includes('карамельн')) return 'dessert';

    return 'dessert';
};

// Объединяем товары и напитки, добавляя поле category и isDrink
const allItems = [
    ...products.map(p => ({ ...p, category: getProductCategory(p.name), isDrink: false })),
    ...drinks.map(d => ({ ...d, category: 'drinks', isDrink: true })),
];

// Категории с количеством
const buildCategories = () => {
    return CATEGORIES.map(cat => ({
        ...cat,
        count: allItems.filter(item => item.category === cat.id).length,
    })).filter(cat => cat.count > 0);
};

export default function CatalogPage() {
    // Состояния
    const [sortBy, setSortBy] = useState('price-asc');
    const [priceRange, setPriceRange] = useState([0, 2000000]);
    const [showFilters, setShowFilters] = useState(true);
    const [addedToCart, setAddedToCart] = useState({});
    const [quickView, setQuickView] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [activeCategory, setActiveCategory] = useState('all');

    // Карусель
    const carouselRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // Категории
    const categories = useMemo(() => buildCategories(), []);

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
            document.body.style.paddingRight = '5px';
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

    // Фильтрация
    const filteredProducts = useMemo(() => {
        return allItems.filter(product => {
            const minPrice = getMinPrice(product.price);
            const maxPrice = getMaxPrice(product.price);
            const matchPrice = minPrice <= priceRange[1] && maxPrice >= priceRange[0];
            const matchCategory = activeCategory === 'all' || product.category === activeCategory;
            return matchPrice && matchCategory;
        });
    }, [priceRange, activeCategory, getMinPrice, getMaxPrice]);

    // Сортировка: сначала еда (по цене), потом напитки
    const sortedProducts = useMemo(() => {
        return [...filteredProducts].sort((a, b) => {
            // 1. Напитки всегда в конце
            if (a.isDrink !== b.isDrink) return a.isDrink ? 1 : -1;

            // 2. Внутри группы — по выбранной сортировке
            const priceA = parsePrice(a.price);
            const priceB = parsePrice(b.price);
            if (sortBy === 'price-asc') return priceA - priceB;
            if (sortBy === 'price-desc') return priceB - priceA;

            return priceA - priceB;
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
        setActiveCategory('all');
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

    // Карусель: проверка скролла
    const updateScrollButtons = useCallback(() => {
        const el = carouselRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 5);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
    }, []);

    useEffect(() => {
        const el = carouselRef.current;
        if (!el) return;
        updateScrollButtons();
        el.addEventListener('scroll', updateScrollButtons);
        window.addEventListener('resize', updateScrollButtons);
        return () => {
            el.removeEventListener('scroll', updateScrollButtons);
            window.removeEventListener('resize', updateScrollButtons);
        };
    }, [updateScrollButtons, categories.length]);

    const scrollCarousel = useCallback((dir) => {
        const el = carouselRef.current;
        if (!el) return;
        const amount = el.clientWidth * 0.8;
        el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
    }, []);

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

    // Компонент карусели категорий
    const CategoriesCarousel = useCallback(() => (
        <div className="categories-carousel-wrapper">
            <button
                className={`carousel-arrow left ${!canScrollLeft ? 'disabled' : ''}`}
                onClick={() => scrollCarousel('left')}
                aria-label="Прокрутить влево"
            >
                <FiChevronLeft />
            </button>

            <div className="categories-carousel" ref={carouselRef}>
                <button
                    className={`category-card ${activeCategory === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveCategory('all')}
                >
                    <div className="category-image">
                        <div className="category-all-icon">🌸</div>
                    </div>
                    <span className="category-name">Все</span>
                    <span className="category-count">{allItems.length}</span>
                </button>

                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        className={`category-card ${activeCategory === cat.id ? 'active' : ''}`}
                        onClick={() => setActiveCategory(cat.id)}
                    >
                        <div className="category-image">
                            <img src={cat.image} alt={cat.name} loading="lazy" />
                        </div>
                        <span className="category-name">{cat.name}</span>
                        <span className="category-count">{cat.count}</span>
                    </button>
                ))}
            </div>

            <button
                className={`carousel-arrow right ${!canScrollRight ? 'disabled' : ''}`}
                onClick={() => scrollCarousel('right')}
                aria-label="Прокрутить вправо"
            >
                <FiChevronRight />
            </button>
        </div>
    ), [categories, activeCategory, canScrollLeft, canScrollRight, scrollCarousel]);

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

            {/* Карусель категорий */}
            <section className="catalog-categories">
                <div className="container">
                    <CategoriesCarousel />
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
                        {(showFilters || !isMobile) && <FiltersPanel />}

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