'use client';

import { useState, useRef, useEffect } from 'react';
import './interior.css';
import {
    FiChevronLeft,
    FiChevronRight,
    FiStar,
    FiHeart,
    FiShoppingCart,
    FiMaximize2,
    FiMinimize2
} from 'react-icons/fi';
import { GiCrowNest, GiChocolateBar, GiHeartWings, GiFamilyHouse } from "react-icons/gi";
import { IoMdHeart, IoMdPricetag } from 'react-icons/io';
import { FaFire, FaLeaf } from 'react-icons/fa';
import { products } from '@/app/utils/data1';
import { motion, AnimatePresence } from 'framer-motion';

const InteriorShowcase = () => {
    const [activeImage, setActiveImage] = useState(0);
    const [likedBoxes, setLikedBoxes] = useState({});
    const [isZoomed, setIsZoomed] = useState(false);
    const [addedToCart, setAddedToCart] = useState({});
    const [imageErrors, setImageErrors] = useState({});
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    const [touchStart, setTouchStart] = useState(null);
    const autoPlayRef = useRef(null);

    const interiors = [
        {
            id: 1,
            image: "/images/carousel/carousel/3.png",
            title: "Уютная атмосфера",
            description: "Наш бутик создан для вашего комфорта и радости",
            icon: <FiHeart />,
            color: "#ff6b6b"
        },
        {
            id: 2,
            image: "/images/carousel/carousel/4.png",
            title: "Золотая витрина",
            description: "Каждый бокс - произведение искусства",
            icon: <GiCrowNest />,
            color: "#bc8c4c"
        },
        {
            id: 3,
            image: "/images/carousel/carousel/5.png",
            title: "Зона дегустации",
            description: "Попробуйте перед покупкой",
            icon: <GiChocolateBar />,
            color: "#8B4513"
        }
    ];

    // Берем первые 4 товара
    const featuredBoxes = products.slice(0, 4).map((product, index) => ({
        id: product.id,
        image: product.image,
        name: product.name,
        price: product.price,
        icon: [<GiCrowNest />, <GiHeartWings />, <GiFamilyHouse />, <GiChocolateBar />][index % 4],
        badge: index === 0 ? "Хит" : index === 1 ? "Love" : index === 2 ? "Family" : "VIP",
        badgeColor: index === 0 ? "#ff6b6b" : index === 1 ? "#ff4757" : index === 2 ? "#2ed573" : "#bc8c4c",
        isNew: index === 3
    }));

    const getImagePath = (imagePath) => {
        if (!imagePath) return '/images/placeholder.png';
        if (imagePath.startsWith('/')) return imagePath;
        if (imagePath.startsWith('images/')) return '/' + imagePath;
        if (imagePath.startsWith('data/images/')) return '/' + imagePath;
        return '/' + imagePath;
    };

    const handleImageError = (id) => {
        setImageErrors(prev => ({ ...prev, [id]: true }));
    };

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

    const toggleLike = (boxId) => {
        setLikedBoxes(prev => ({ ...prev, [boxId]: !prev[boxId] }));
    };

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
                    image: product.image,
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
            }, 1200);

        } catch (error) {
            console.error('Ошибка добавления в корзину:', error);
        }
    };

    const nextImage = () => {
        setActiveImage((prev) => (prev + 1) % interiors.length);
        resetAutoPlay();
    };

    const prevImage = () => {
        setActiveImage((prev) => (prev - 1 + interiors.length) % interiors.length);
        resetAutoPlay();
    };

    const resetAutoPlay = () => {
        if (autoPlayRef.current) {
            clearInterval(autoPlayRef.current);
            if (isAutoPlay) {
                autoPlayRef.current = setInterval(nextImage, 4000);
            }
        }
    };

    // Автоплей
    useEffect(() => {
        if (isAutoPlay) {
            autoPlayRef.current = setInterval(nextImage, 4000);
        }
        return () => {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current);
            }
        };
    }, [isAutoPlay]);

    // Touch события для свайпа
    const handleTouchStart = (e) => {
        setTouchStart(e.touches[0].clientX);
    };

    const handleTouchEnd = (e) => {
        if (!touchStart) return;
        const touchEnd = e.changedTouches[0].clientX;
        const diff = touchStart - touchEnd;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextImage();
            } else {
                prevImage();
            }
        }
        setTouchStart(null);
    };

    const toggleZoom = () => {
        setIsZoomed(!isZoomed);
    };

    const toggleAutoPlay = () => {
        setIsAutoPlay(!isAutoPlay);
    };

    const imageVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: { duration: 0.5, ease: "easeOut" }
        },
        exit: { 
            opacity: 0, 
            scale: 1.05,
            transition: { duration: 0.3 }
        }
    };

    const boxVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (index) => ({
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 25,
                delay: index * 0.08
            }
        }),
        hover: {
            y: -8,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 20
            }
        }
    };

    return (
        <section className="interior-showcase">
            <div className="container">
                {/* Заголовок секции */}
                <motion.div 
                    className="section-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="section-badge">✨ Интерьер</span>
                    <h2 className="section-title">
                        Наш <span className="gold-text">бутик</span>
                    </h2>
                    <p className="section-subtitle">
                        Красивый интерьер и изысканные боксы ждут вас
                    </p>
                    <div className="section-divider">
                        <span className="divider-line"></span>
                        <span className="divider-icon">🍫</span>
                        <span className="divider-line"></span>
                    </div>
                </motion.div>

                <div className="showcase-grid">
                    {/* Левая колонка - интерьер */}
                    <motion.div 
                        className="interior-column"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        <div 
                            className="interior-main"
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                        >
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeImage}
                                    src={interiors[activeImage].image}
                                    alt={interiors[activeImage].title}
                                    className={`interior-main-image ${isZoomed ? 'zoomed' : ''}`}
                                    onClick={toggleZoom}
                                    variants={imageVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.src = '/images/placeholder.png';
                                    }}
                                />
                            </AnimatePresence>

                            {/* Индикатор прогресса */}
                            <div className="interior-progress">
                                {interiors.map((_, index) => (
                                    <span 
                                        key={index}
                                        className={`progress-dot ${index === activeImage ? 'active' : ''}`}
                                        onClick={() => setActiveImage(index)}
                                    />
                                ))}
                            </div>

                            {/* Кнопки управления */}
                            <div className="interior-controls">
                                <button 
                                    className="interior-zoom-btn" 
                                    onClick={toggleZoom}
                                    aria-label={isZoomed ? 'Уменьшить' : 'Увеличить'}
                                >
                                    {isZoomed ? <FiMinimize2 /> : <FiMaximize2 />}
                                </button>

                                <button 
                                    className="interior-autoplay-btn" 
                                    onClick={toggleAutoPlay}
                                    aria-label={isAutoPlay ? 'Остановить автоплей' : 'Запустить автоплей'}
                                >
                                    {isAutoPlay ? '⏸' : '▶'}
                                </button>
                            </div>

                            <button className="interior-nav prev" onClick={prevImage}>
                                <FiChevronLeft />
                            </button>
                            <button className="interior-nav next" onClick={nextImage}>
                                <FiChevronRight />
                            </button>

                            {/* Подпись */}
                            <motion.div 
                                className="interior-caption"
                                key={activeImage}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div 
                                    className="interior-caption-icon"
                                    style={{ backgroundColor: interiors[activeImage].color }}
                                >
                                    {interiors[activeImage].icon}
                                </div>
                                <div className="interior-caption-text">
                                    <h3>{interiors[activeImage].title}</h3>
                                    <p>{interiors[activeImage].description}</p>
                                </div>
                            </motion.div>
                        </div>

                        <div className="interior-thumbnails">
                            {interiors.map((item, index) => (
                                <motion.button
                                    key={item.id}
                                    className={`thumbnail ${index === activeImage ? 'active' : ''}`}
                                    onClick={() => setActiveImage(index)}
                                    aria-label={`Перейти к изображению ${index + 1}`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <img src={item.image} alt={item.title} loading="lazy" />
                                    {index === activeImage && (
                                        <motion.span 
                                            className="thumbnail-active-indicator"
                                            layoutId="thumbnailActive"
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Правая колонка - боксы */}
                    <motion.div 
                        className="boxes-column"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        <div className="boxes-header">
                            <div>
                                <h3 className="boxes-title">Наши хиты</h3>
                                <p className="boxes-subtitle">Самые популярные боксы</p>
                            </div>
                            <div className="boxes-stats">
                                <span className="boxes-stats-item">
                                    <FiStar className="stats-icon" />
                                    4.9
                                </span>
                                <span className="boxes-stats-item">
                                    <IoMdHeart className="stats-icon" />
                                    128
                                </span>
                            </div>
                        </div>

                        <div className="boxes-grid">
                            {featuredBoxes.map((box, index) => {
                                const imageSrc = imageErrors[box.id] 
                                    ? '/images/placeholder.png' 
                                    : getImagePath(box.image);

                                return (
                                    <motion.div
                                        key={box.id}
                                        className="box-card"
                                        custom={index}
                                        variants={boxVariants}
                                        initial="hidden"
                                        whileInView="visible"
                                        whileHover="hover"
                                        viewport={{ once: true }}
                                        style={{
                                            '--badge-color': box.badgeColor
                                        }}
                                    >
                                        {/* Бейджи */}
                                        <div className="box-card-badges">
                                            <span 
                                                className="box-card-badge"
                                                style={{ backgroundColor: box.badgeColor }}
                                            >
                                                {box.badge}
                                            </span>
                                            {box.isNew && (
                                                <span className="box-card-badge new">
                                                    <FaLeaf className="badge-icon" />
                                                    Новинка
                                                </span>
                                            )}
                                        </div>

                                        <div className="box-card-image">
                                            <img
                                                src={imageSrc}
                                                alt={box.name}
                                                loading="lazy"
                                                onError={() => handleImageError(box.id)}
                                            />

                                            <motion.button
                                                className="box-card-like"
                                                onClick={() => toggleLike(box.id)}
                                                aria-label="Добавить в избранное"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <FiHeart className={likedBoxes[box.id] ? 'liked' : ''} />
                                            </motion.button>

                                            <div className="box-card-icons">
                                                <span className="box-icon">{box.icon}</span>
                                            </div>

                                            {/* Overlay при наведении */}
                                            <motion.div 
                                                className="box-card-overlay"
                                                initial={{ opacity: 0 }}
                                                whileHover={{ opacity: 1 }}
                                            >
                                                <span className="overlay-text">Быстрый просмотр</span>
                                            </motion.div>
                                        </div>

                                        <div className="box-card-info">
                                            <h4 className="box-card-name">{box.name}</h4>

                                            <div className="box-card-footer">
                                                <div className="box-card-price-section">
                                                    <IoMdPricetag className="price-icon" />
                                                    <span className="box-card-price">{formatPrice(box.price)}</span>
                                                </div>
                                                <motion.button
                                                    className={`box-card-cart ${addedToCart[box.id] ? 'added' : ''}`}
                                                    onClick={(e) => addToCart(box, e)}
                                                    aria-label="Добавить в корзину"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <AnimatePresence mode="wait">
                                                        {addedToCart[box.id] ? (
                                                            <motion.span
                                                                key="check"
                                                                initial={{ scale: 0, rotate: -180 }}
                                                                animate={{ scale: 1, rotate: 0 }}
                                                                exit={{ scale: 0, rotate: 180 }}
                                                                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                                                            >
                                                                ✓
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
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default InteriorShowcase;