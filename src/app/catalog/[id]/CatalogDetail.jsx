'use client';

import { useState, useEffect } from 'react';
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
} from 'react-icons/fi';
import {
    IoMdHeart,
    IoMdHeartEmpty,
} from 'react-icons/io';
import { FaFire } from 'react-icons/fa';
import { HiOutlineLocationMarker, HiOutlineClock } from 'react-icons/hi';

export default function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const [selectedTab, setSelectedTab] = useState('description');
    const [isFavorite, setIsFavorite] = useState(false);

    // Функция для парсинга цены
    const parsePrice = (priceStr) => {
        if (typeof priceStr === 'number') return priceStr;
        if (priceStr.includes('-')) {
            return parseInt(priceStr.split('-')[0]);
        }
        return parseInt(priceStr);
    };

    // Функция для форматирования цены
    const formatPrice = (price) => {
        if (price.includes('-')) {
            const [min, max] = price.split('-').map(p => parseInt(p));
            return `${new Intl.NumberFormat('uz-UZ').format(min)} - ${new Intl.NumberFormat('uz-UZ').format(max)} сум`;
        }
        return new Intl.NumberFormat('uz-UZ').format(parseInt(price)) + ' сум';
    };

    // Загрузка товара
    useEffect(() => {
        if (id) {
            const productData = products.find(p => p.id === parseInt(id));
            setProduct(productData);
        }
    }, [id]);

    // Похожие товары (первые 4, исключая текущий)
    const relatedProducts = products
        .filter(p => p.id !== product?.id)
        .slice(0, 4);

    const addToCart = () => {
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
            setTimeout(() => setAddedToCart(false), 2000);

        } catch (error) {
            console.error('Ошибка добавления в корзину:', error);
        }
    };

    // Определяем популярные товары (первые 3)
    const popularProductIds = [1, 2, 3];
    const isProductPopular = (id) => popularProductIds.includes(id);

    if (!product) {
        return (
            <div className="product-loading">
                <div className="loading-spinner"></div>
            </div>
        );
    }

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
                                    src={product.image}
                                    alt={product.name}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/600x600?text=Chocoberry';
                                    }}
                                />
                                {isProductPopular(product.id) && (
                                    <span className="gallery-badge">
                                        <FaFire className="badge-icon" />
                                        Хит продаж
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
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    >
                                        −
                                    </button>
                                    <span className="quantity">{quantity}</span>
                                    <button
                                        className="quantity-btn"
                                        onClick={() => setQuantity(quantity + 1)}
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    className={`add-to-cart-btn ${addedToCart ? 'added' : ''}`}
                                    onClick={addToCart}
                                >
                                    <FiShoppingCart className="btn-icon" />
                                    <span>{addedToCart ? 'Добавлено' : 'В корзину'}</span>
                                </button>

                                <button
                                    className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                                    onClick={() => setIsFavorite(!isFavorite)}
                                >
                                    {isFavorite ? <IoMdHeart /> : <IoMdHeartEmpty />}
                                </button>
                            </div>

                            {/* Преимущества */}
                            <div className="product-benefits">
                                <div className="benefit">
                                    <FiTruck className="benefit-icon" />
                                    <span>Бесплатная доставка от 500 000 сум</span>
                                </div>
                                <div className="benefit">
                                    <FiGift className="benefit-icon" />
                                    <span>Подарочная упаковка</span>
                                </div>
                                <div className="benefit">
                                    <FiCreditCard className="benefit-icon" />
                                    <span>Оплата картой или наличными</span>
                                </div>
                            </div>
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
                                Доставка и оплата
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
                                    <p className="description-text">
                                        Свежая клубника в бельгийском шоколаде - это сочетание натуральных
                                        ингредиентов и мастерства наших кондитеров. Каждый бокс - это
                                        уникальное произведение искусства.
                                    </p>
                                </div>
                            )}

                            {selectedTab === 'delivery' && (
                                <div className="tab-pane">
                                    <div className="delivery-info">
                                        <h3>Доставка</h3>
                                        <ul>
                                            <li>
                                                <FiTruck className="delivery-icon" />
                                                Бесплатная доставка по Бухаре при заказе от 500 000 сум
                                            </li>
                                            <li>
                                                <FiCreditCard className="delivery-icon" />
                                                Доставка до 500 000 сум - 20 000 сум
                                            </li>
                                            <li>
                                                <HiOutlineClock className="delivery-icon" />
                                                Доставка осуществляется с 10:00 до 22:00
                                            </li>
                                            <li>
                                                <HiOutlineLocationMarker className="delivery-icon" />
                                                Возможен самовывоз из нашего бутика
                                            </li>
                                        </ul>

                                        <h3>Оплата</h3>
                                        <ul>
                                            <li>
                                                <FiCreditCard className="delivery-icon" />
                                                Оплата картой на сайте
                                            </li>
                                            <li>
                                                <FiPackage className="delivery-icon" />
                                                Наличными при получении
                                            </li>
                                            <li>
                                                <FiGift className="delivery-icon" />
                                                Переводом на карту
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Возможно вам понравится */}
            <section className="related-products">
                <div className="container">
                    <h2 className="section-title">
                        Возможно вам <span className="gold-text">понравится</span>
                    </h2>

                    <div className="related-grid">
                        {relatedProducts.map((relatedProduct, index) => (
                            <Link
                                href={`/catalog/${relatedProduct.id}`}
                                key={relatedProduct.id}
                                className="related-card"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="related-image">
                                    <img
                                        src={relatedProduct.image}
                                        alt={relatedProduct.name}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/300x300?text=Chocoberry';
                                        }}
                                    />
                                    {isProductPopular(relatedProduct.id) && (
                                        <span className="related-badge">
                                            <FaFire className="badge-icon" />
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
        </div>
    );
}