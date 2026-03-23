'use client';

import { useState } from 'react';
import './gallery.css';
import {
    FiZoomIn,
    FiDownload,
    FiGrid,
    FiHeart,
    FiCamera,
    FiPackage,
    FiCpu
} from 'react-icons/fi';
import {
    GiChocolateBar,
    GiStrawberry,
    GiHeartWings,
    GiCrown,
    GiFlowerPot
} from 'react-icons/gi';
import { IoMdPhotos } from 'react-icons/io';
import Link from 'next/link';

const GalleryGrid = () => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [likedItems, setLikedItems] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);

    const filters = [
        { id: 'all', name: 'Все', icon: <FiGrid /> },
        { id: 'interior', name: 'Интерьер', icon: <FiCamera /> },
        { id: 'boxes', name: 'Боксы', icon: <FiPackage /> },
        { id: 'process', name: 'Процесс', icon: <FiCpu /> }
    ];

    const galleryItems = [
        {
            id: 1,
            image: "/images/carousel/carousel/1.png",
            category: 'interior',
            title: 'Витрина с боксами',
            description: 'Золотая витрина с премиум боксами',
            icon: <GiCrown />
        },
        {
            id: 2,
            image: "/images/carousel/carousel/2.png",
            category: 'boxes',
            title: 'Клубничное сердце',
            description: 'Бокс в форме сердца с клубникой',
            icon: <GiHeartWings />
        },
        {
            id: 3,
            image: "/images/carousel/carousel/3.png",
            category: 'process',
            title: 'Ручная работа',
            description: 'Мастер за созданием бокса',
            icon: <GiChocolateBar />
        },
        {
            id: 4,
            image: "/images/carousel/carousel/4.png",
            category: 'interior',
            title: 'Зона ожидания',
            description: 'Уютная зона для посетителей',
            icon: <GiFlowerPot />
        },
        {
            id: 5,
            image: "/images/carousel/carousel/5.png",
            category: 'boxes',
            title: 'Золотая коллекция',
            description: 'Премиум боксы с золотом',
            icon: <GiCrown />
        },
        {
            id: 6,
            image: "/images/carousel/carousel/1.png",
            category: 'process',
            title: 'Декорирование',
            description: 'Процесс украшения боксов',
            icon: <GiStrawberry />
        },
    ];

    const filteredItems = activeFilter === 'all'
        ? galleryItems
        : galleryItems.filter(item => item.category === activeFilter);

    const toggleLike = (itemId) => {
        setLikedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
    };

    const openZoom = (item) => {
        setSelectedImage(item);
    };

    const closeZoom = () => {
        setSelectedImage(null);
    };

    return (
        <section className="gallery-grid">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">
                        Фотогалерея <span className="gold-text">Chocoberry</span>
                    </h2>
                    <p className="section-subtitle">
                        Посмотрите на наши работы и атмосферу бутика
                    </p>
                </div>

                {/* Фильтры */}
                <div className="gallery-filters">
                    {filters.map(filter => (
                        <button
                            key={filter.id}
                            className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
                            onClick={() => setActiveFilter(filter.id)}
                        >
                            <span className="filter-icon">{filter.icon}</span>
                            <span className="filter-name">{filter.name}</span>
                        </button>
                    ))}
                </div>

                {/* Статистика */}
                <div className="gallery-stats">
                    <div className="stat-item">
                        <IoMdPhotos className="stat-icon" />
                        <span className="stat-value">{galleryItems.length}</span>
                        <span className="stat-label">всего фото</span>
                    </div>
                    <div className="stat-item">
                        <FiCamera className="stat-icon" />
                        <span className="stat-value">{galleryItems.filter(i => i.category === 'interior').length}</span>
                        <span className="stat-label">интерьер</span>
                    </div>
                    <div className="stat-item">
                        <FiPackage className="stat-icon" />
                        <span className="stat-value">{galleryItems.filter(i => i.category === 'boxes').length}</span>
                        <span className="stat-label">боксы</span>
                    </div>
                </div>

                {/* Сетка */}
                <div className="gallery-masonry">
                    {filteredItems.map((item, index) => (
                        <div
                            key={item.id}
                            className="gallery-item"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                loading="lazy"
                            />

                            <div className="gallery-item-category">
                                <span className="category-icon">{item.icon}</span>
                            </div>

                            <button
                                className={`gallery-item-like ${likedItems[item.id] ? 'liked' : ''}`}
                                onClick={() => toggleLike(item.id)}
                                aria-label="Нравится"
                            >
                                <FiHeart />
                            </button>

                            <div className="gallery-item-overlay">
                                <h3 className="gallery-item-title">{item.title}</h3>
                                <p className="gallery-item-description">{item.description}</p>
                                <button
                                    className="gallery-item-zoom"
                                    onClick={() => openZoom(item)}
                                    aria-label="Увеличить"
                                >
                                    <FiZoomIn />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Кнопка "Смотреть ещё" */}
                <div className="gallery-action">
                    <Link href='/gallery' className="btn btn-primary">
                        <span>Загрузить ещё</span>
                        <FiDownload className="btn-icon" />
                    </Link>
                </div>
            </div>

            {/* Модальное окно для увеличения */}
            {selectedImage && (
                <div className="gallery-modal" onClick={closeZoom}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeZoom}>×</button>
                        <img src={selectedImage.image} alt={selectedImage.title} />
                        <div className="modal-info">
                            <h3>{selectedImage.title}</h3>
                            <p>{selectedImage.description}</p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default GalleryGrid;