'use client';

import { useState } from 'react';
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
    const [sortBy, setSortBy] = useState('popular');
    const [priceRange, setPriceRange] = useState([0, 2000000]);
    const [showFilters, setShowFilters] = useState(false);
    const [addedToCart, setAddedToCart] = useState({});
    const [quickView, setQuickView] = useState(null);

    // Категории - можно создать на основе данных или оставить для фильтрации
    const categories = [
        { id: 'all', name: 'Все боксы', icon: GiStrawberry },
        { id: 'classic', name: 'Классические', icon: GiStrawberry },
        { id: 'premium', name: 'Премиум', icon: GiCrown },
        { id: 'romantic', name: 'Романтические', icon: GiHeartWings }
    ];

    // Функция для парсинга цены (поддержка диапазонов типа "700000-500000")
    const parsePrice = (priceStr) => {
        if (typeof priceStr === 'number') return priceStr;
        if (priceStr.includes('-')) {
            const [min, max] = priceStr.split('-').map(p => parseInt(p));
            return min; // или можно вернуть среднее значение
        }
        return parseInt(priceStr);
    };

    // Получение минимальной цены для фильтрации
    const getMinPrice = (priceStr) => {
        if (typeof priceStr === 'number') return priceStr;
        if (priceStr.includes('-')) {
            return parseInt(priceStr.split('-')[0]);
        }
        return parseInt(priceStr);
    };

    // Получение максимальной цены для фильтрации
    const getMaxPrice = (priceStr) => {
        if (typeof priceStr === 'number') return priceStr;
        if (priceStr.includes('-')) {
            return parseInt(priceStr.split('-')[1]);
        }
        return parseInt(priceStr);
    };

    // Фильтрация товаров
    const filteredProducts = products.filter(product => {
        const productMinPrice = getMinPrice(product.price);
        const productMaxPrice = getMaxPrice(product.price);
        
        // Проверяем, попадает ли товар в диапазон цен
        // Если цена в виде диапазона, проверяем пересечение
        if (product.price.includes('-')) {
            return productMinPrice <= priceRange[1] && productMaxPrice >= priceRange[0];
        } else {
            return productMinPrice >= priceRange[0] && productMinPrice <= priceRange[1];
        }
    });

    // Сортировка
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        const priceA = parsePrice(a.price);
        const priceB = parsePrice(b.price);
        
        switch (sortBy) {
            case 'price-asc': return priceA - priceB;
            case 'price-desc': return priceB - priceA;
            case 'popular': 
                // Если нет поля popular, можно сортировать по id или цене
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
                    priceRaw: product.price, // сохраняем оригинальную цену
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

    // Определяем популярные товары (например, первые 5 или с определенными id)
    const popularProductIds = [1, 2, 3, 4, 5]; // пример популярных товаров
    const isProductPopular = (id) => popularProductIds.includes(id);

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
                                                {isProductPopular(product.id) && (
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