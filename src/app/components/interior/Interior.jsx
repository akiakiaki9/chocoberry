'use client';

import { useState } from 'react';
import './interior.css';
import {
    FiChevronLeft,
    FiChevronRight,
    FiStar,
    FiHeart,
    FiCamera,
    FiShoppingCart
} from 'react-icons/fi';
import { GiCrowNest } from "react-icons/gi";
import { GiChocolateBar } from "react-icons/gi";
import { GiHeartWings } from "react-icons/gi";
import { GiFamilyHouse } from "react-icons/gi";
import { IoMdHeart, IoMdPricetag } from 'react-icons/io';
import products from '@/app/utils/data1';

const InteriorShowcase = () => {
    const [activeImage, setActiveImage] = useState(0);
    const [likedBoxes, setLikedBoxes] = useState({});
    const [isZoomed, setIsZoomed] = useState(false);
    const [addedToCart, setAddedToCart] = useState({});

    const interiors = [
        {
            id: 1,
            image: "/images/carousel/carousel/3.png",
            title: "Уютная атмосфера",
            description: "Наш бутик создан для вашего комфорта",
            icon: <FiHeart />
        },
        {
            id: 2,
            image: "/images/carousel/carousel/4.png",
            title: "Золотая витрина",
            description: "Каждый бокс - произведение искусства",
            icon: <GiCrowNest />
        },
        {
            id: 3,
            image: "/images/carousel/carousel/5.png",
            title: "Зона дегустации",
            description: "Попробуйте перед покупкой",
            icon: <GiChocolateBar />
        }
    ];

    // Берем первые 4 товара и используем только нужные поля
    const featuredBoxes = products.slice(0, 4).map((product, index) => ({
        id: product.id,
        image: product.image,
        name: product.name,
        price: product.price,
        icon: [<GiCrowNest />, <GiHeartWings />, <GiFamilyHouse />, <GiChocolateBar />][index % 4],
        badge: index === 0 ? "Хит" : index === 1 ? "Love" : index === 2 ? "Family" : "VIP"
    }));

    // Функция для парсинга цены (поддержка диапазонов)
    const parsePrice = (priceStr) => {
        if (typeof priceStr === 'number') return priceStr;
        if (priceStr.includes('-')) {
            return parseInt(priceStr.split('-')[0]);
        }
        return parseInt(priceStr);
    };

    // Форматирование цены
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
            }, 1000);

        } catch (error) {
            console.error('Ошибка добавления в корзину:', error);
        }
    };

    const nextImage = () => {
        setActiveImage((prev) => (prev + 1) % interiors.length);
    };

    const prevImage = () => {
        setActiveImage((prev) => (prev - 1 + interiors.length) % interiors.length);
    };

    return (
        <section className="interior-showcase">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">
                        Наш <span className="gold-text">бутик</span>
                    </h2>
                    <p className="section-subtitle">
                        Красивый интерьер и изысканные боксы ждут вас
                    </p>
                </div>

                <div className="showcase-grid">
                    {/* Левая колонка - интерьер */}
                    <div className="interior-column">
                        <div className="interior-main">
                            <img
                                src={interiors[activeImage].image}
                                alt={interiors[activeImage].title}
                                className={`interior-main-image ${isZoomed ? 'zoomed' : ''}`}
                                onClick={() => setIsZoomed(!isZoomed)}
                                loading="lazy"
                            />

                            <button className="interior-zoom-btn" onClick={() => setIsZoomed(!isZoomed)}>
                                <FiCamera />
                            </button>

                            <button className="interior-nav prev" onClick={prevImage}>
                                <FiChevronLeft />
                            </button>
                            <button className="interior-nav next" onClick={nextImage}>
                                <FiChevronRight />
                            </button>

                            <div className="interior-caption">
                                <span className="interior-caption-icon">
                                    {interiors[activeImage].icon}
                                </span>
                                <div className="interior-caption-text">
                                    <h3>{interiors[activeImage].title}</h3>
                                    <p>{interiors[activeImage].description}</p>
                                </div>
                            </div>
                        </div>

                        <div className="interior-thumbnails">
                            {interiors.map((item, index) => (
                                <button
                                    key={item.id}
                                    className={`thumbnail ${index === activeImage ? 'active' : ''}`}
                                    onClick={() => setActiveImage(index)}
                                    aria-label={`Перейти к изображению ${index + 1}`}
                                >
                                    <img src={item.image} alt={item.title} loading="lazy" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Правая колонка - боксы */}
                    <div className="boxes-column">
                        <div className="boxes-header">
                            <h3 className="boxes-title">Наши хиты</h3>
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
                            {featuredBoxes.map(box => (
                                <div key={box.id} className="box-card">
                                    {box.badge && (
                                        <div className="box-card-badge">{box.badge}</div>
                                    )}

                                    <div className="box-card-image">
                                        <img
                                            src={box.image}
                                            alt={box.name}
                                            loading="lazy"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/300x300?text=Chocoberry';
                                            }}
                                        />

                                        <button
                                            className="box-card-like"
                                            onClick={() => toggleLike(box.id)}
                                            aria-label="Добавить в избранное"
                                        >
                                            <FiHeart className={likedBoxes[box.id] ? 'liked' : ''} />
                                        </button>

                                        <div className="box-card-icons">
                                            <span className="box-icon">{box.icon}</span>
                                        </div>
                                    </div>

                                    <div className="box-card-info">
                                        <h4 className="box-card-name">{box.name}</h4>

                                        <div className="box-card-footer">
                                            <div className="box-card-price-section">
                                                <IoMdPricetag className="price-icon" />
                                                <span className="box-card-price">{formatPrice(box.price)}</span>
                                            </div>
                                            <button
                                                className={`box-card-cart ${addedToCart[box.id] ? 'added' : ''}`}
                                                onClick={(e) => addToCart(box, e)}
                                                aria-label="Добавить в корзину"
                                            >
                                                <FiShoppingCart className="cart-icon" />
                                                {addedToCart[box.id] && <span className="cart-check">✓</span>}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InteriorShowcase;