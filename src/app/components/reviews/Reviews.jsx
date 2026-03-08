'use client';

import { useState } from 'react';
import './reviews.css';

const Reviews = () => {
    const [activeReview, setActiveReview] = useState(0);

    const reviews = [
        {
            id: 1,
            name: "Мария",
            date: "2 дня назад",
            text: "Заказывала бокс на годовщину. Это просто восторг! Клубника свежайшая, шоколад тает во рту. Интерьер бутика тоже очень красивый, сделали много фото.",
            rating: 5,
            image: "/images/review-1.jpg",
            box: "Клубничное сердце"
        },
        {
            id: 2,
            name: "Александр",
            date: "Неделю назад",
            text: "Решил удивить девушку, взял Золотую коллекцию. Она была в восторге! Отдельное спасибо за упаковку и открытку. Обязательно вернусь.",
            rating: 5,
            image: "/images/review-2.jpg",
            box: "Золотая коллекция"
        },
        {
            id: 3,
            name: "Динара",
            date: "3 дня назад",
            text: "Лучшая клубника в шоколаде, которую я пробовала. Очень уютный бутик, приятно находиться. Девочки-продавцы доброжелательные, помогли с выбором.",
            rating: 5,
            image: "/images/review-3.jpg",
            box: "Премиум ассорти"
        },
        {
            id: 4,
            name: "Рустам",
            date: "Вчера",
            text: "Заказывал корпоративные подарки. Все коллеги оценили! Красиво, вкусно, презентабельно. Спасибо команде Chocoberry!",
            rating: 5,
            image: "/images/review-4.jpg",
            box: "Императорский бокс"
        }
    ];

    return (
        <section className="reviews">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">
                        Отзывы <span className="gold-text">наших гостей</span>
                    </h2>
                    <p className="section-subtitle">
                        Более 1000 счастливых клиентов
                    </p>
                </div>

                <div className="reviews-grid">
                    {/* Большой отзыв слева */}
                    <div className="review-featured">
                        <div className="review-featured-image">
                            <img src={reviews[activeReview].image} alt={reviews[activeReview].name} />
                            <div className="review-featured-badge">
                                <span className="box-name">{reviews[activeReview].box}</span>
                            </div>
                        </div>
                        <div className="review-featured-content">
                            <div className="review-rating">
                                {'★'.repeat(reviews[activeReview].rating)}
                                {'☆'.repeat(5 - reviews[activeReview].rating)}
                            </div>
                            <p className="review-text">"{reviews[activeReview].text}"</p>
                            <div className="review-author">
                                <strong>{reviews[activeReview].name}</strong>
                                <span>{reviews[activeReview].date}</span>
                            </div>
                        </div>
                    </div>

                    {/* Список отзывов справа */}
                    <div className="reviews-list">
                        {reviews.map((review, index) => (
                            <button
                                key={review.id}
                                className={`review-card ${index === activeReview ? 'active' : ''}`}
                                onClick={() => setActiveReview(index)}
                            >
                                <div className="review-card-image">
                                    <img src={review.image} alt={review.name} />
                                </div>
                                <div className="review-card-content">
                                    <h4>{review.name}</h4>
                                    <div className="review-card-rating">
                                        {'★'.repeat(review.rating)}
                                    </div>
                                    <p>{review.text.substring(0, 60)}...</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Кнопка с отзывами */}
                <div className="reviews-action">
                    <button className="btn btn-primary">
                        Оставить отзыв
                    </button>
                    <span className="reviews-stats">
                        ★ 4.9 · 128 отзывов
                    </span>
                </div>
            </div>
        </section>
    );
};

export default Reviews;