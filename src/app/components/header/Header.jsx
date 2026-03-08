'use client';

import { useState, useEffect } from 'react';
import './header.css';

const slides = [
    {
        id: 1,
        title: "Клубника в шоколаде",
        subtitle: "Ручная работа",
        description: "Свежие ягоды в бельгийском шоколаде",
        price: "от 190 000 сум",
        image: "/images/carousel/1.jpg",
        color: "var(--red)"
    },
    {
        id: 2,
        title: "Премиум боксы",
        subtitle: "Золотая коллекция",
        description: "Съедобное золото и фисташки",
        price: "650 000 сум",
        image: "/images/carousel/2.png",
        color: "var(--gold)"
    },
    {
        id: 3,
        title: "Sweet Romance",
        subtitle: "Для особых моментов",
        description: "Сердечки из клубники в розовом шоколаде",
        price: "380 000 сум",
        image: "/images/carousel/3.png",
        color: "var(--red)"
    }
];

const HeroCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(timer);
    }, [currentSlide]);

    const nextSlide = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setTimeout(() => setIsAnimating(false), 500);
    };

    const prevSlide = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        setTimeout(() => setIsAnimating(false), 500);
    };

    const goToSlide = (index) => {
        if (isAnimating || index === currentSlide) return;
        setIsAnimating(true);
        setCurrentSlide(index);
        setTimeout(() => setIsAnimating(false), 500);
    };

    return (
        <section className="hero">
            <div className="hero-carousel">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                        style={{
                            '--slide-color': slide.color,
                            transform: `translateX(${(index - currentSlide) * 100}%)`
                        }}
                    >
                        <div className="slide-content">
                            <span className="slide-subtitle">{slide.subtitle}</span>
                            <h1 className="slide-title">{slide.title}</h1>
                            <p className="slide-description">{slide.description}</p>
                            <div className="slide-price">{slide.price}</div>
                            <div className="slide-buttons">
                                <button className="btn btn-primary">Заказать</button>
                                <button className="btn btn-secondary">Подробнее</button>
                            </div>
                        </div>
                        <div className="slide-image">
                            <div className="image-overlay"></div>
                            <img src={slide.image} alt={slide.title} />
                        </div>
                    </div>
                ))}

                {/* Навигация */}
                <button className="carousel-arrow prev" onClick={prevSlide}>
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <button className="carousel-arrow next" onClick={nextSlide}>
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                {/* Точки */}
                <div className="carousel-dots">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`dot ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                        >
                            <span></span>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HeroCarousel;