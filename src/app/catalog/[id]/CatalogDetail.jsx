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
    FiHeart,
    FiShare2,
    FiCheck
} from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';
import { HiOutlineLocationMarker, HiOutlineClock } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const [selectedTab, setSelectedTab] = useState('description');
    const [isFavorite, setIsFavorite] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const parsePrice = (priceStr) => {
        if (typeof priceStr === 'number') return priceStr;
        if (priceStr.includes('-')) {
            return parseInt(priceStr.split('-')[0]);
        }
        return parseInt(priceStr);
    };

    const formatPrice = (price) => {
        if (price.includes('-')) {
            const [min, max] = price.split('-').map(p => parseInt(p));
            return `${new Intl.NumberFormat('uz-UZ').format(min)} - ${new Intl.NumberFormat('uz-UZ').format(max)} сум`;
        }
        return new Intl.NumberFormat('uz-UZ').format(parseInt(price)) + ' сум';
    };

    useEffect(() => {
        if (id) {
            const productData = products.find(p => p.id === parseInt(id));
            setProduct(productData);
        }
    }, [id]);

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

    const popularProductIds = [1, 2, 3];
    const isProductPopular = (id) => popularProductIds.includes(id);

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
                        <motion.div
                            className="product-gallery"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="main-image">
                                <img
                                    src={imageSrc}
                                    alt={product.name}
                                    onError={() => setImageError(true)}
                                />
                                {isProductPopular(product.id) && (
                                    <span className="gallery-badge">
                                        <FaFire className="badge-icon" />
                                        Хит
                                    </span>
                                )}
                            </div>
                        </motion.div>

                        {/* Правая колонка - информация */}
                        <motion.div
                            className="product-info"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
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
                                        disabled={quantity <= 1}
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

                                <motion.button
                                    className={`add-to-cart-btn ${addedToCart ? 'added' : ''}`}
                                    onClick={addToCart}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <AnimatePresence mode="wait">
                                        {addedToCart ? (
                                            <motion.span
                                                key="check"
                                                initial={{ scale: 0, rotate: -180 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                exit={{ scale: 0, rotate: 180 }}
                                                className="add-content"
                                            >
                                                <FiCheck className="btn-icon" />
                                                Добавлено
                                            </motion.span>
                                        ) : (
                                            <motion.span
                                                key="cart"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                                className="add-content"
                                            >
                                                <FiShoppingCart className="btn-icon" />
                                                В корзину
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </motion.button>

                                <button
                                    className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                                    onClick={() => setIsFavorite(!isFavorite)}
                                >
                                    <FiHeart />
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

                            {/* Кнопка поделиться */}
                            <button className="share-btn">
                                <FiShare2 />
                                <span>Поделиться</span>
                            </button>
                        </motion.div>
                    </div>

                    {/* Табы с информацией */}
                    <motion.div
                        className="product-tabs"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
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
                                        <h3>Доставка</h3>
                                        <ul>
                                            <li>
                                                <FiTruck className="delivery-icon" />
                                                Бесплатно от 500 000 сум
                                            </li>
                                            <li>
                                                <HiOutlineClock className="delivery-icon" />
                                                10:00 - 22:00
                                            </li>
                                            <li>
                                                <HiOutlineLocationMarker className="delivery-icon" />
                                                Самовывоз из бутика
                                            </li>
                                        </ul>

                                        <h3>Оплата</h3>
                                        <ul>
                                            <li>
                                                <FiCreditCard className="delivery-icon" />
                                                Картой на сайте
                                            </li>
                                            <li>
                                                <FiPackage className="delivery-icon" />
                                                Наличными при получении
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Похожие товары */}
            <section className="related-products">
                <div className="container">
                    <h2 className="section-title">
                        Возможно вам <span className="gold-text">понравится</span>
                    </h2>

                    <div className="related-grid">
                        {relatedProducts.map((relatedProduct, index) => (
                            <motion.div
                                key={relatedProduct.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.08 }}
                            >
                                <Link
                                    href={`/catalog/${relatedProduct.id}`}
                                    className="related-card"
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
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}