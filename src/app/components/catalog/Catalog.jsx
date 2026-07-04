'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { products } from '@/app/utils/data1';
import './catalog.css';
import {
    FiShoppingCart,
    FiChevronRight,
    FiHeart,
    FiEye,
    FiCheck,
    FiStar,
    FiChevronLeft
} from 'react-icons/fi';
import { GiStrawberry, GiCrowNest, GiHeartWings, GiGiftOfKnowledge } from "react-icons/gi";
import { FaFire } from 'react-icons/fa';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const CatalogPreview = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [addedToCart, setAddedToCart] = useState({});
    const [wishlist, setWishlist] = useState({});
    const [imageErrors, setImageErrors] = useState({});
    const [hoveredProduct, setHoveredProduct] = useState(null);
    const [visibleProducts, setVisibleProducts] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const carouselRef = useRef(null);
    const observerRef = useRef(null);

    const categories = [
        { id: 'all', name: 'Все', icon: <GiGiftOfKnowledge />, count: products.length },
        { id: 'classic', name: 'Классика', icon: <GiStrawberry />, count: products.filter(p => p.category === 'classic').length },
        { id: 'premium', name: 'Премиум', icon: <GiCrowNest />, count: products.filter(p => p.category === 'premium').length },
        { id: 'romantic', name: 'Романтика', icon: <GiHeartWings />, count: products.filter(p => p.category === 'romantic').length }
    ];

    const previewProducts = products.slice(0, 4);

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

    const getImagePath = (imagePath) => {
        if (!imagePath) return '/images/placeholder.png';
        if (imagePath.startsWith('/')) return imagePath;
        if (imagePath.startsWith('images/')) return '/' + imagePath;
        if (imagePath.startsWith('data/images/')) return '/' + imagePath;
        return '/' + imagePath;
    };

    const handleImageError = (productId) => {
        setImageErrors(prev => ({ ...prev, [productId]: true }));
    };

    const isProductPopular = (id) => [1, 2, 3].includes(id);
    const isProductNew = (id) => [4, 5].includes(id);

    // Добавление в корзину
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
                    image: product.image || '/images/placeholder.png',
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
            }, 1500);

        } catch (error) {
            console.error('Ошибка добавления в корзину:', error);
        }
    };

    const toggleWishlist = (productId, e) => {
        e.preventDefault();
        e.stopPropagation();
        setWishlist(prev => ({ ...prev, [productId]: !prev[productId] }));
    };

    const quickView = (product, e) => {
        e.preventDefault();
        e.stopPropagation();
        alert(`${product.name}\n\nЦена: ${formatPrice(product.price)}`);
    };

    // Обработчики для карусели
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - carouselRef.current.offsetLeft);
        setScrollLeft(carouselRef.current.scrollLeft);
        carouselRef.current.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - carouselRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        carouselRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        if (carouselRef.current) {
            carouselRef.current.style.cursor = 'grab';
        }
    };

    const handleTouchStart = (e) => {
        setIsDragging(true);
        setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft);
        setScrollLeft(carouselRef.current.scrollLeft);
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        carouselRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    // Intersection Observer для анимации появления
    useEffect(() => {
        const options = {
            threshold: 0.1,
            rootMargin: '50px'
        };

        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = parseInt(entry.target.dataset.id);
                    setVisibleProducts(prev => [...new Set([...prev, id])]);
                }
            });
        }, options);

        const cards = document.querySelectorAll('.preview-card-link');
        cards.forEach(card => observerRef.current.observe(card));

        return () => observerRef.current?.disconnect();
    }, []);

    // Скролл к категории
    const scrollToCategory = (categoryId) => {
        setActiveCategory(categoryId);
        // Находим кнопку категории и центрируем её
        const tabs = document.querySelector('.category-tabs');
        if (tabs) {
            const tab = tabs.querySelector(`[data-category="${categoryId}"]`);
            if (tab) {
                const tabRect = tab.getBoundingClientRect();
                const tabsRect = tabs.getBoundingClientRect();
                const scrollPosition = tabRect.left - tabsRect.left - (tabsRect.width / 2) + (tabRect.width / 2);
                tabs.scrollTo({
                    left: tabs.scrollLeft + scrollPosition,
                    behavior: 'smooth'
                });
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 25,
                duration: 0.5
            }
        }
    };

    return (
        <section className="catalog-preview">
            <div className="container">
                {/* Заголовок секции */}
                <motion.div 
                    className="section-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="section-badge">🍫 Сладкое вдохновение</span>
                    <h2 className="section-title">
                        Выберите свой <span className="gold-text">идеальный</span> бокс
                    </h2>
                    <p className="section-subtitle">
                        Каждый бокс создан с любовью, чтобы подарить вам незабываемые моменты радости
                    </p>
                </motion.div>

                {/* Категории - карусель */}
                <div 
                    className="category-tabs"
                    ref={carouselRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {categories.map((cat, index) => (
                        <motion.button
                            key={cat.id}
                            data-category={cat.id}
                            className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                            onClick={() => scrollToCategory(cat.id)}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <span className="category-icon">{cat.icon}</span>
                            <span className="category-name">{cat.name}</span>
                            <span className="category-count">{cat.count}</span>
                            {activeCategory === cat.id && (
                                <motion.span 
                                    className="category-active-dot"
                                    layoutId="activeCategory"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                        </motion.button>
                    ))}
                </div>

                {/* Сетка товаров */}
                <div className="preview-grid">
                    {previewProducts.map((product, index) => {
                        const imageSrc = imageErrors[product.id] 
                            ? '/images/placeholder.png' 
                            : getImagePath(product.image);

                        const isVisible = visibleProducts.includes(product.id);
                        const isPopular = isProductPopular(product.id);
                        const isNew = isProductNew(product.id);

                        return (
                            <motion.div
                                key={product.id}
                                className="preview-card-wrapper"
                                variants={cardVariants}
                                initial="hidden"
                                animate={isVisible ? "visible" : "hidden"}
                                onHoverStart={() => setHoveredProduct(product.id)}
                                onHoverEnd={() => setHoveredProduct(null)}
                                data-id={product.id}
                                ref={(el) => {
                                    if (el && !observerRef.current) {
                                        const observer = new IntersectionObserver((entries) => {
                                            entries.forEach(entry => {
                                                if (entry.isIntersecting) {
                                                    setVisibleProducts(prev => [...new Set([...prev, product.id])]);
                                                }
                                            });
                                        }, { threshold: 0.1 });
                                        observer.observe(el);
                                    }
                                }}
                            >
                                <Link href={`/catalog/${product.id}`} className="preview-card-link">
                                    <div className="preview-card">
                                        {/* Бейджи */}
                                        <div className="card-badges">
                                            {isPopular && (
                                                <motion.div 
                                                    className="card-badge popular"
                                                    initial={{ scale: 0, rotate: -180 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                                                >
                                                    <FaFire className="badge-icon" />
                                                    <span>Хит</span>
                                                </motion.div>
                                            )}
                                            {isNew && (
                                                <motion.div 
                                                    className="card-badge new"
                                                    initial={{ scale: 0, rotate: -180 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.1 }}
                                                >
                                                    <FiStar className="badge-icon" />
                                                    <span>Новинка</span>
                                                </motion.div>
                                            )}
                                        </div>

                                        {/* Кнопка избранного */}
                                        <motion.button
                                            className={`wishlist-btn ${wishlist[product.id] ? 'active' : ''}`}
                                            onClick={(e) => toggleWishlist(product.id, e)}
                                            aria-label="Добавить в избранное"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <FiHeart className={`wishlist-icon ${wishlist[product.id] ? 'filled' : ''}`} />
                                        </motion.button>

                                        {/* Изображение */}
                                        <div className="card-image">
                                            <img
                                                src={imageSrc}
                                                alt={product.name}
                                                onError={() => handleImageError(product.id)}
                                                loading="lazy"
                                            />
                                            <motion.div 
                                                className="card-overlay"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: hoveredProduct === product.id ? 1 : 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <motion.button
                                                    className="quick-view"
                                                    onClick={(e) => quickView(product, e)}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <FiEye className="quick-view-icon" />
                                                    <span>Быстрый просмотр</span>
                                                </motion.button>
                                            </motion.div>
                                        </div>

                                        {/* Контент */}
                                        <div className="card-content">
                                            <h3 className="card-title">{product.name}</h3>

                                            <div className="card-meta">
                                                <span className="card-category">
                                                    {categories.find(c => c.id === product.category)?.name || 'Классика'}
                                                </span>
                                            </div>

                                            <div className="card-footer">
                                                <div className="price-section">
                                                    <span className="card-price">{formatPrice(product.price)}</span>
                                                </div>
                                                <motion.button
                                                    className={`card-add ${addedToCart[product.id] ? 'added' : ''}`}
                                                    onClick={(e) => addToCart(product, e)}
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <AnimatePresence mode="wait">
                                                        {addedToCart[product.id] ? (
                                                            <motion.span
                                                                key="check"
                                                                initial={{ scale: 0, rotate: -180 }}
                                                                animate={{ scale: 1, rotate: 0 }}
                                                                exit={{ scale: 0, rotate: 180 }}
                                                                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                                                            >
                                                                <FiCheck className="check-icon" />
                                                            </motion.span>
                                                        ) : (
                                                            <motion.span
                                                                key="cart"
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                exit={{ scale: 0 }}
                                                            >
                                                                <FiShoppingCart className="cart-icon" />
                                                            </motion.span>
                                                        )}
                                                    </AnimatePresence>
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Кнопка "Все боксы" */}
                <motion.div 
                    className="catalog-action"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <Link href='/catalog' className="btn btn-primary">
                        <span>Смотреть все боксы</span>
                        <FiChevronRight className="btn-icon" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default CatalogPreview;