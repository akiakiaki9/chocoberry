'use client';

import './whyus.css';
import { GiStrawberry } from "react-icons/gi";
import { GiChocolateBar } from "react-icons/gi";
import { GiDiamondHard } from "react-icons/gi";
import { FiAward, FiFeather } from 'react-icons/fi';
import { IoMdHeart } from 'react-icons/io';
import { FaHandHoldingHeart } from 'react-icons/fa';
import { BiLeaf } from 'react-icons/bi';
import { useState } from 'react';

const WhyUs = () => {
    const [hoveredCard, setHoveredCard] = useState(null);

    const features = [
        {
            id: 1,
            icon: <GiStrawberry />,
            title: "Свежайшая клубника",
            description: "Ежедневная поставка отборных ягод от местных фермеров",
            color: "#ff4d4d"
        },
        {
            id: 2,
            icon: <GiChocolateBar />,
            title: "Бельгийский шоколад",
            description: "Только премиальный шоколад Callebaut",
            color: "#8B4513"
        },
        {
            id: 3,
            icon: <FaHandHoldingHeart />,
            title: "Ручная работа",
            description: "Каждый бокс создаётся с любовью нашими мастерами",
            color: "#d4a373"
        },
        {
            id: 4,
            icon: <GiDiamondHard />,
            title: "Уникальный дизайн",
            description: "Эксклюзивные боксы для особых моментов",
            color: "#bc8c4c"
        }
    ];

    return (
        <section className="why-us">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">
                        Почему <span className="gold-text">Chocoberry</span>
                    </h2>
                    <p className="section-subtitle">
                        Мы создаём не просто боксы, а настоящие произведения искусства
                    </p>
                </div>

                <div className="why-us-grid">
                    {features.map((feature, index) => (
                        <div
                            key={feature.id}
                            className="why-card"
                            style={{ animationDelay: `${index * 0.1}s` }}
                            onMouseEnter={() => setHoveredCard(feature.id)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <div className="why-card-content">
                                <div className="why-card-icon-wrapper">
                                    <div
                                        className="why-card-icon"
                                        style={{
                                            backgroundColor: hoveredCard === feature.id ? feature.color : 'var(--gold)',
                                            color: hoveredCard === feature.id ? '#fff' : '#2d2a24'
                                        }}
                                    >
                                        {feature.icon}
                                    </div>
                                </div>
                                <h3 className="why-card-title">{feature.title}</h3>
                                <p className="why-card-description">{feature.description}</p>
                                <div className="why-card-features">
                                    <span className="why-feature">
                                        <FiAward className="feature-icon" />
                                        <span>Гарантия качества</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Дополнительные преимущества для мобильных */}
                <div className="why-us-mobile-features">
                    <div className="mobile-feature">
                        <BiLeaf className="mobile-feature-icon" />
                        <span>Натуральные ингредиенты</span>
                    </div>
                    <div className="mobile-feature">
                        <IoMdHeart className="mobile-feature-icon" />
                        <span>С любовью к деталям</span>
                    </div>
                    <div className="mobile-feature">
                        <FiFeather className="mobile-feature-icon" />
                        <span>Нежный вкус</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyUs;