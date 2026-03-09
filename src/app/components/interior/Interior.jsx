'use client';

import { useState } from 'react';
import './interior.css';
import {
    FiEye,
    FiChevronLeft,
    FiChevronRight,
    FiStar,
    FiHeart,
    FiCamera
} from 'react-icons/fi';
import { GiCrowNest } from "react-icons/gi";
import { GiChocolateBar } from "react-icons/gi";
import { GiHeartWings } from "react-icons/gi";
import { GiFamilyHouse } from "react-icons/gi";
import { IoMdHeart, IoMdPricetag } from 'react-icons/io';

const InteriorShowcase = () => {
    const [activeImage, setActiveImage] = useState(0);
    const [likedBoxes, setLikedBoxes] = useState({});
    const [isZoomed, setIsZoomed] = useState(false);

    const interiors = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop",
            title: "Уютная атмосфера",
            description: "Наш бутик создан для вашего комфорта",
            icon: <FiHeart />
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1556020685-ae41abfc9365?q=80&w=800&auto=format&fit=crop",
            title: "Золотая витрина",
            description: "Каждый бокс - произведение искусства",
            icon: <GiCrowNest />
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=800&auto=format&fit=crop",
            title: "Зона дегустации",
            description: "Попробуйте перед покупкой",
            icon: <GiChocolateBar />
        }
    ];

    const boxes = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800&auto=format&fit=crop",
            name: "Премиум бокс",
            price: "650 000 сум",
            icon: <GiCrowNest />,
            badge: "Хит",
            weight: "500г",
            pieces: "16 шт"
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop",
            name: "Романтический",
            price: "380 000 сум",
            icon: <GiHeartWings />,
            badge: "Love",
            weight: "350г",
            pieces: "9 шт"
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=800&auto=format&fit=crop",
            name: "Семейный",
            price: "890 000 сум",
            icon: <GiFamilyHouse />,
            badge: "Family",
            weight: "800г",
            pieces: "24 шт"
        },
        {
            id: 4,
            image: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?q=80&w=800&auto=format&fit=crop",
            name: "Императорский",
            price: "1 500 000 сум",
            icon: <GiHeartWings />,
            badge: "VIP",
            weight: "1000г",
            pieces: "36 шт"
        }
    ];

    const toggleLike = (boxId) => {
        setLikedBoxes(prev => ({ ...prev, [boxId]: !prev[boxId] }));
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
                            {boxes.map(box => (
                                <div key={box.id} className="box-card">
                                    {box.badge && (
                                        <div className="box-card-badge">{box.badge}</div>
                                    )}

                                    <div className="box-card-image">
                                        <img src={box.image} alt={box.name} loading="lazy" />

                                        <button
                                            className="box-card-like"
                                            onClick={() => toggleLike(box.id)}
                                            aria-label="Добавить в избранное"
                                        >
                                            <FiHeart className={likedBoxes[box.id] ? 'liked' : ''} />
                                        </button>

                                        <button className="box-card-quick" aria-label="Быстрый просмотр">
                                            <FiEye />
                                        </button>

                                        <div className="box-card-icons">
                                            <span className="box-icon">{box.icon}</span>
                                        </div>
                                    </div>

                                    <div className="box-card-info">
                                        <h4 className="box-card-name">{box.name}</h4>

                                        <div className="box-card-details">
                                            <span className="box-card-detail">⚖️ {box.weight}</span>
                                            <span className="box-card-detail">🍓 {box.pieces}</span>
                                        </div>

                                        <div className="box-card-footer">
                                            <div className="box-card-price-section">
                                                <IoMdPricetag className="price-icon" />
                                                <span className="box-card-price">{box.price}</span>
                                            </div>
                                            <button className="box-card-cart" aria-label="Добавить в корзину">
                                                <FiEye className="cart-icon" />
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