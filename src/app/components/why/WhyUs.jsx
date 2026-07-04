'use client';

import './whyus.css';
import { GiStrawberry, GiChocolateBar, GiDiamondHard } from "react-icons/gi";
import { FiAward, FiFeather, FiShield, FiClock } from 'react-icons/fi';
import { IoMdHeart } from 'react-icons/io';
import { FaHandHoldingHeart, FaLeaf } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WhyUs = () => {
    const [hoveredCard, setHoveredCard] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    const features = [
        {
            id: 1,
            icon: <GiStrawberry />,
            title: "Свежайшая клубника",
            description: "Ежедневная поставка отборных ягод от местных фермеров",
            color: "#ff6b6b",
            gradient: "linear-gradient(135deg, #ff6b6b, #ee5a24)",
            badge: "Сезонное",
            stats: "100% натуральная"
        },
        {
            id: 2,
            icon: <GiChocolateBar />,
            title: "Бельгийский шоколад",
            description: "Только премиальный шоколад Callebaut высшего качества",
            color: "#8B4513",
            gradient: "linear-gradient(135deg, #8B4513, #654321)",
            badge: "Премиум",
            stats: "72% какао"
        },
        {
            id: 3,
            icon: <FaHandHoldingHeart />,
            title: "Ручная работа",
            description: "Каждый бокс создаётся с любовью нашими мастерами",
            color: "#d4a373",
            gradient: "linear-gradient(135deg, #d4a373, #bc8c4c)",
            badge: "Эксклюзив",
            stats: "Ручная сборка"
        },
        {
            id: 4,
            icon: <GiDiamondHard />,
            title: "Уникальный дизайн",
            description: "Эксклюзивные боксы для особых моментов жизни",
            color: "#bc8c4c",
            gradient: "linear-gradient(135deg, #bc8c4c, #daa520)",
            badge: "Дизайн",
            stats: "Индивидуально"
        }
    ];

    // Intersection Observer для анимации появления
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: (index) => ({
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 25,
                delay: index * 0.1,
                duration: 0.6
            }
        }),
        hover: {
            y: -15,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 20
            }
        }
    };

    const iconVariants = {
        idle: { rotate: 0, scale: 1 },
        hover: { 
            rotate: 360, 
            scale: 1.15,
            transition: { 
                type: "spring",
                stiffness: 300,
                damping: 15,
                duration: 0.6
            }
        }
    };

    const badgeVariants = {
        hidden: { scale: 0, rotate: -90 },
        visible: { 
            scale: 1, 
            rotate: 0,
            transition: {
                type: "spring",
                stiffness: 500,
                damping: 15
            }
        }
    };

    return (
        <section className="why-us" ref={sectionRef}>
            <div className="container">
                {/* Заголовок секции */}
                <motion.div 
                    className="section-header"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="section-badge">✨ Почему мы</span>
                    <h2 className="section-title">
                        Choco<span className="gold-text">berry</span>
                    </h2>
                    <p className="section-subtitle">
                        Мы создаём не просто боксы, а настоящие произведения искусства, 
                        наполненные любовью и заботой
                    </p>
                    <div className="section-divider">
                        <span className="divider-line"></span>
                        <span className="divider-icon">🍓</span>
                        <span className="divider-line"></span>
                    </div>
                </motion.div>

                {/* Сетка преимуществ */}
                <div className="why-us-grid">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.id}
                            className={`why-card ${hoveredCard === feature.id ? 'hovered' : ''}`}
                            custom={index}
                            variants={cardVariants}
                            initial="hidden"
                            animate={isVisible ? "visible" : "hidden"}
                            whileHover="hover"
                            onHoverStart={() => setHoveredCard(feature.id)}
                            onHoverEnd={() => setHoveredCard(null)}
                            style={{
                                '--card-gradient': feature.gradient,
                                '--card-color': feature.color
                            }}
                        >
                            <div className="why-card-content">
                                {/* Бейдж */}
                                <motion.div 
                                    className="why-card-badge"
                                    variants={badgeVariants}
                                    initial="hidden"
                                    animate={isVisible ? "visible" : "hidden"}
                                    transition={{ delay: index * 0.1 + 0.2 }}
                                >
                                    {feature.badge}
                                </motion.div>

                                {/* Иконка */}
                                <div className="why-card-icon-wrapper">
                                    <motion.div
                                        className="why-card-icon"
                                        variants={iconVariants}
                                        initial="idle"
                                        animate={hoveredCard === feature.id ? "hover" : "idle"}
                                        style={{
                                            background: feature.gradient
                                        }}
                                    >
                                        {feature.icon}
                                        <div className="icon-glow"></div>
                                    </motion.div>
                                </div>

                                {/* Контент */}
                                <h3 className="why-card-title">{feature.title}</h3>
                                <p className="why-card-description">{feature.description}</p>

                                {/* Характеристики */}
                                <div className="why-card-stats">
                                    <div className="why-stat">
                                        <FiAward className="stat-icon" />
                                        <span>{feature.stats}</span>
                                    </div>
                                </div>

                                {/* Украшения */}
                                <div className="why-card-decoration">
                                    <div className="decoration-dot"></div>
                                    <div className="decoration-dot"></div>
                                    <div className="decoration-dot"></div>
                                </div>
                            </div>

                            {/* Hover эффект - световая волна */}
                            <AnimatePresence>
                                {hoveredCard === feature.id && (
                                    <motion.div 
                                        className="card-ripple"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 2, opacity: 0 }}
                                        transition={{ duration: 0.6 }}
                                    />
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                {/* Дополнительные преимущества */}
                <motion.div 
                    className="why-us-mobile-features"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <div className="mobile-feature">
                        <FaLeaf className="mobile-feature-icon" />
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
                    <div className="mobile-feature">
                        <FiShield className="mobile-feature-icon" />
                        <span>Гарантия качества</span>
                    </div>
                    <div className="mobile-feature">
                        <FiClock className="mobile-feature-icon" />
                        <span>Свежесть каждый день</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default WhyUs;