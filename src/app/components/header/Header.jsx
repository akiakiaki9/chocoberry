'use client';

import { useState, useEffect, useRef } from 'react';
import './header.css';
import { IoMdHeart, IoMdInformationCircle } from 'react-icons/io';
import Link from 'next/link';

const HeroCarousel = () => {
    const [isMobile, setIsMobile] = useState(false);
    const videoRef = useRef(null);

    // Определяем тип устройства сразу без задержки
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();

        // Запускаем видео сразу после монтирования
        if (videoRef.current) {
            videoRef.current.play().catch(e => console.log('Auto-play failed:', e));
        }

        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const videoSrc = isMobile ? "/images/videos/mobile.mp4" : "/images/videos/pc.mp4";

    return (
        <section className="hero">
            {/* Видеофон */}
            <div className="hero-video-background">
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="hero-video"
                    poster="/images/video-poster.jpg"
                    preload="auto"
                >
                    <source
                        src={videoSrc}
                        type="video/mp4"
                    />
                </video>
                <div className="video-overlay"></div>
            </div>

            {/* Контент */}
            <div className="hero-content">
                <div className="container">
                    <div className="hero-text">
                        <span className="hero-subtitle">Добро пожаловать</span>
                        <h1 className="hero-title">
                            ChocoBerry <br />
                            Бутик
                        </h1>
                        <p className="hero-description">
                            Ваш уютный уголок в самом сердце Бухары. <br />
                            Здесь вас ждут вкусные сюрпризы и теплая атмосфера.
                        </p>
                        <div className="hero-buttons">
                            <Link href='/catalog' className="btn btn-primary">
                                <IoMdHeart className="btn-icon" />
                                <span>Посмотреть боксы</span>
                            </Link>
                            <Link href='/contacts' className="btn btn-secondary">
                                <IoMdInformationCircle className="btn-icon" />
                                <span>Как нас найти</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroCarousel;