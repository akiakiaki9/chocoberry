'use client';

import { useState } from 'react';
import './interior.css';

const InteriorShowcase = () => {
    const [activeImage, setActiveImage] = useState(0);

    const interiors = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop",
            title: "Уютная атмосфера",
            description: "Наш бутик создан для вашего комфорта"
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1556020685-ae41abfc9365?q=80&w=800&auto=format&fit=crop",
            title: "Золотая витрина",
            description: "Каждый бокс - произведение искусства"
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=800&auto=format&fit=crop",
            title: "Зона дегустации",
            description: "Попробуйте перед покупкой"
        }
    ];

    const boxes = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800&auto=format&fit=crop",
            name: "Премиум бокс",
            price: "650 000 сум"
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop",
            name: "Романтический",
            price: "380 000 сум"
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=800&auto=format&fit=crop",
            name: "Семейный",
            price: "890 000 сум"
        },
        {
            id: 4,
            image: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?q=80&w=800&auto=format&fit=crop",
            name: "Императорский",
            price: "1 500 000 сум"
        }
    ];

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
                                className="interior-main-image"
                            />
                            <div className="interior-caption">
                                <h3>{interiors[activeImage].title}</h3>
                                <p>{interiors[activeImage].description}</p>
                            </div>
                        </div>

                        <div className="interior-thumbnails">
                            {interiors.map((item, index) => (
                                <button
                                    key={item.id}
                                    className={`thumbnail ${index === activeImage ? 'active' : ''}`}
                                    onClick={() => setActiveImage(index)}
                                >
                                    <img src={item.image} alt={item.title} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Правая колонка - боксы */}
                    <div className="boxes-column">
                        <h3 className="boxes-title">Наши хиты</h3>
                        <div className="boxes-grid">
                            {boxes.map(box => (
                                <div key={box.id} className="box-card">
                                    <div className="box-card-image">
                                        <img src={box.image} alt={box.name} />
                                        <button className="box-card-quick">👁️</button>
                                    </div>
                                    <div className="box-card-info">
                                        <h4>{box.name}</h4>
                                        <span className="box-card-price">{box.price}</span>
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