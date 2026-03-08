'use client';
import './whyus.css';

const WhyUs = () => {
    const features = [
        {
            id: 1,
            icon: "🍓",
            title: "Свежайшая клубника",
            description: "Ежедневная поставка отборных ягод от местных фермеров",
            image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?q=80&w=800&auto=format&fit=crop"
        },
        {
            id: 2,
            icon: "🍫",
            title: "Бельгийский шоколад",
            description: "Только премиальный шоколад Callebaut",
            image: "https://lefood.menu/wp-content/uploads/w_images/2023/09/recept-85815-1240x827.jpg"
        },
        {
            id: 3,
            icon: "👩‍🍳",
            title: "Ручная работа",
            description: "Каждый бокс создаётся с любовью нашими мастерами",
            image: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=800&auto=format&fit=crop"
        },
        {
            id: 4,
            icon: "✨",
            title: "Уникальный дизайн",
            description: "Эксклюзивные боксы для особых моментов",
            image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop"
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
                        <div key={feature.id} className="why-card" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="why-card-image">
                                <img src={feature.image} alt={feature.title} />
                                <div className="why-card-overlay">
                                    <span className="why-card-icon">{feature.icon}</span>
                                </div>
                            </div>
                            <div className="why-card-content">
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyUs;