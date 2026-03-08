'use client';

import { useState } from 'react';
import './gallery.css';

const GalleryGrid = () => {
    const [activeFilter, setActiveFilter] = useState('all');

    const filters = [
        { id: 'all', name: 'Все' },
        { id: 'interior', name: 'Интерьер' },
        { id: 'boxes', name: 'Боксы' },
        { id: 'process', name: 'Процесс' }
    ];

    const galleryItems = [
        { id: 1, image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop", category: 'interior', title: 'Витрина с боксами' },
        { id: 2, image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800&auto=format&fit=crop", category: 'boxes', title: 'Клубничное сердце' },
        { id: 3, image: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=800&auto=format&fit=crop", category: 'process', title: 'Ручная работа' },
        { id: 4, image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=800&auto=format&fit=crop", category: 'interior', title: 'Зона ожидания' },
        { id: 5, image: "https://images.unsplash.com/photo-1606312619075-23f201a38042?q=80&w=800&auto=format&fit=crop", category: 'boxes', title: 'Золотая коллекция' },
        { id: 6, image: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?q=80&w=800&auto=format&fit=crop", category: 'process', title: 'Декорирование' },
        { id: 7, image: "https://images.unsplash.com/photo-1556020685-ae41abfc9365?q=80&w=800&auto=format&fit=crop", category: 'interior', title: 'Освещение' },
        { id: 8, image: "https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=800&auto=format&fit=crop", category: 'boxes', title: 'Свадебные боксы' },
        { id: 9, image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?q=80&w=800&auto=format&fit=crop", category: 'interior', title: 'Детали интерьера' },
    ];

    const filteredItems = activeFilter === 'all'
        ? galleryItems
        : galleryItems.filter(item => item.category === activeFilter);

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
                            {filter.name}
                        </button>
                    ))}
                </div>

                {/* Сетка */}
                <div className="gallery-masonry">
                    {filteredItems.map((item, index) => (
                        <div
                            key={item.id}
                            className="gallery-item"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <img src={item.image} alt={item.title} />
                            <div className="gallery-item-overlay">
                                <h3>{item.title}</h3>
                                <button className="gallery-item-zoom">🔍</button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Кнопка "Смотреть ещё" */}
                <div className="gallery-action">
                    <button className="btn btn-secondary">
                        Загрузить ещё
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default GalleryGrid;