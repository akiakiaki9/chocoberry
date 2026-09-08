// catalog/[id]/page.jsx - Оптимизированная версия
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { products } from '@/app/utils/data1';
import './catalogdetail.css';
import {
    FiShoppingCart,
    FiChevronRight,
    FiTruck,
    FiGift,
    FiCreditCard,
    FiPackage,
    FiHeart,
    FiShare2,
    FiCheck,
    FiArrowLeft
} from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';
import { HiOutlineLocationMarker, HiOutlineClock } from 'react-icons/hi';

export default function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const [selectedTab, setSelectedTab] = useState('description');
    const [isFavorite, setIsFavorite] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Определение мобильного устройства
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Парсинг цены
    const parsePrice = useCallback((priceStr) => {
        if (typeof priceStr === 'number') return priceStr;
        if (typeof priceStr === 'string' && priceStr.includes('-')) {
            return parseInt(priceStr.split('-')[0]);
        }
        return parseInt(priceStr);
    }, []);

    // Форматирование цены
    const formatPrice = useCallback((price) => {
        if (typeof price === 'string' && price.includes('-')) {
            const [min, max] = price.split('-').map(p => parseInt(p));
            return `${new Intl.NumberFormat('uz-UZ').format(min)} - ${new Intl.NumberFormat('uz-UZ').format(max)} сум`;
        }
        return new Intl.NumberFormat('uz-UZ').format(parseInt(price)) + ' сум';
    }, []);

    // Загрузка товара
    useEffect(() => {
        if (id) {
            const productData = products.find(p => p.id === parseInt(id));
            setProduct(productData);
        }
    }, [id]);

    // Популярные товары
    const popularProductIds = useMemo(() => [1, 2, 3], []);
    const isProductPopular = useCallback((id) => popularProductIds.includes(id), [popularProductIds]);

    // Похожие товары
    const relatedProducts = useMemo(() => {
        if (!product) return [];
        return products
            .filter(p => p.id !== product.id)
            .slice(0, 4);
    }, [product]);

    // Добавление в корзину
    const addToCart = useCallback(() => {
        if (!product) return;

        try {
            const savedCart = localStorage.getItem('chocoberry-cart');
            let cart = savedCart ? JSON.parse(savedCart) : [];

            const existingItem = cart.find(item => item.id === product.id);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: parsePrice(product.price),
                    priceRaw: product.price,
                    image: product.image,
                    quantity: quantity
                });
            }

            localStorage.setItem('chocoberry-cart', JSON.stringify(cart));

            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            window.dispatchEvent(new CustomEvent('cartUpdated', {
                detail: { count: totalItems }
            }));

            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 1500);

        } catch (error) {
            console.error('Ошибка добавления в корзину:', error);
        }
    }, [product, quantity, parsePrice]);

    // Увеличение/уменьшение количества
    const decreaseQuantity = useCallback(() => {
        setQuantity(prev => Math.max(1, prev - 1));
    }, []);

    const increaseQuantity = useCallback(() => {
        setQuantity(prev => prev + 1);
    }, []);

    // Переключение избранного
    const toggleFavorite = useCallback(() => {
        setIsFavorite(prev => !prev);
    }, []);

    // Состояние загрузки
    if (!product) {
        return (
            <div className="product-loading">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    const imageSrc = imageError ? '/images/placeholder.png' : product.image;

    return (
        <div className="product-detail-page">
            {/* Хлебные крошки */}
            <div className="breadcrumbs">
                <div className="container">
                    <Link href="/">Главная</Link>
                    <FiChevronRight className="separator-icon" />
                    <Link href="/catalog">Каталог</Link>
                    <FiChevronRight className="separator-icon" />
                    <span className="current">{product.name}</span>
                </div>
            </div>

            <section className="product-detail">
                <div className="container">
                    <div className="product-detail-grid">
                        {/* Левая колонка - фото */}
                        <div className="product-gallery">
                            <div className="main-image">
                                <img
                                    src={imageSrc}
                                    alt={product.name}
                                    onError={() => setImageError(true)}
                                    loading="lazy"
                                />
                                {isProductPopular(product.id) && (
                                    <span className="gallery-badge">
                                        <FaFire />
                                        Хит
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Правая колонка - информация */}
                        <div className="product-info">
                            <h1 className="product-title">{product.name}</h1>

                            <div className="product-price-section">
                                <span className="current-price">{formatPrice(product.price)}</span>
                            </div>

                            {/* Количество и кнопки */}
                            <div className="product-actions">
                                <div className="quantity-selector">
                                    <button
                                        className="quantity-btn"
                                        onClick={decreaseQuantity}
                                        disabled={quantity <= 1}
                                        aria-label="Уменьшить количество"
                                    >
                                        −
                                    </button>
                                    <span className="quantity">{quantity}</span>
                                    <button
                                        className="quantity-btn"
                                        onClick={increaseQuantity}
                                        aria-label="Увеличить количество"
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    className={`add-to-cart-btn ${addedToCart ? 'added' : ''}`}
                                    onClick={addToCart}
                                >
                                    {addedToCart ? (
                                        <>
                                            <FiCheck />
                                            Добавлено
                                        </>
                                    ) : (
                                        <>
                                            <FiShoppingCart />
                                            В корзину
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Преимущества */}
                            <div className="product-benefits">
                                <div className="benefit">
                                    <FiTruck />
                                    <span>Бесплатная доставка от 500 000 сум</span>
                                </div>
                                <div className="benefit">
                                    <FiGift />
                                    <span>Подарочная упаковка</span>
                                </div>
                                <div className="benefit">
                                    <FiCreditCard />
                                    <span>Оплата картой или наличными</span>
                                </div>
                            </div>

                            {/* Кнопка поделиться */}
                            <button className="share-btn">
                                <FiShare2 />
                                <span>Поделиться</span>
                            </button>
                        </div>
                    </div>

                    {/* Табы с информацией */}
                    <div className="product-tabs">
                        <div className="tabs-header">
                            <button
                                className={`tab-btn ${selectedTab === 'description' ? 'active' : ''}`}
                                onClick={() => setSelectedTab('description')}
                            >
                                Описание
                            </button>
                            <button
                                className={`tab-btn ${selectedTab === 'delivery' ? 'active' : ''}`}
                                onClick={() => setSelectedTab('delivery')}
                            >
                                Доставка
                            </button>
                        </div>

                        <div className="tabs-content">
                            {selectedTab === 'description' && (
                                <div className="tab-pane">
                                    <p className="description-text">
                                        Наши боксы создаются вручную из свежайшей клубники и премиального
                                        бельгийского шоколада. Каждая ягода отбирается вручную, покрывается
                                        шоколадом и декорируется с особой тщательностью.
                                    </p>
                                    <p className="description-text">
                                        {product.name} - это идеальный выбор для сладкого подарка или
                                        создания романтической атмосферы. Бокс упаковывается в фирменную
                                        коробку с золотым тиснением.
                                    </p>
                                </div>
                            )}

                            {selectedTab === 'delivery' && (
                                <div className="tab-pane">
                                    <div className="delivery-info">
                                        <h3>🚚 Доставка</h3>
                                        <ul>
                                            <li>
                                                <FiTruck />
                                                Бесплатно от 500 000 сум
                                            </li>
                                            <li>
                                                <HiOutlineClock />
                                                10:00 - 0:00
                                            </li>
                                            <li>
                                                <HiOutlineLocationMarker />
                                                Самовывоз из бутика
                                            </li>
                                        </ul>

                                        <h3>💳 Оплата</h3>
                                        <ul>
                                            <li>
                                                <FiCreditCard />
                                                Картой на сайте
                                            </li>
                                            <li>
                                                <FiPackage />
                                                Наличными при получении
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Похожие товары */}
            {relatedProducts.length > 0 && (
                <section className="related-products">
                    <div className="container">
                        <h2 className="section-title">
                            Возможно вам <span className="gold-text">понравится</span>
                        </h2>

                        <div className="related-grid">
                            {relatedProducts.map((relatedProduct) => (
                                <Link
                                    key={relatedProduct.id}
                                    href={`/catalog/${relatedProduct.id}`}
                                    className="related-card"
                                >
                                    <div className="related-image">
                                        <img
                                            src={relatedProduct.image}
                                            alt={relatedProduct.name}
                                            loading="lazy"
                                            onError={(e) => {
                                                e.target.src = '/images/placeholder.png';
                                            }}
                                        />
                                        {isProductPopular(relatedProduct.id) && (
                                            <span className="related-badge">
                                                <FaFire />
                                                Хит
                                            </span>
                                        )}
                                    </div>
                                    <div className="related-info">
                                        <h3 className="related-name">{relatedProduct.name}</h3>
                                        <span className="related-price">{formatPrice(relatedProduct.price)}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}