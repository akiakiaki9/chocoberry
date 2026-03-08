'use client';

import './contacts.css';

const Contacts = () => {
    return (
        <section className="contacts" id="contacts">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">
                        Где <span className="gold-text">нас найти</span>
                    </h2>
                    <p className="section-subtitle">
                        Приходите в гости или заказывайте с доставкой
                    </p>
                </div>

                <div className="contacts-grid">
                    {/* Информация */}
                    <div className="contacts-info">
                        <div className="contacts-card">
                            <h3>Бутик в Бухаре</h3>

                            <div className="contact-item">
                                <span className="contact-icon">📍</span>
                                <div>
                                    <strong>Адрес:</strong>
                                    <p>ул. Шохрух, 42<br />Центральный район</p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <span className="contact-icon">📞</span>
                                <div>
                                    <strong>Телефон:</strong>
                                    <p>
                                        <a href="tel:+998901234567">+998 90 123 45 67</a><br />
                                        <a href="tel:+998901234568">+998 90 123 45 68</a>
                                    </p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <span className="contact-icon">⏰</span>
                                <div>
                                    <strong>Часы работы:</strong>
                                    <p>Ежедневно: 10:00 - 22:00<br />Без выходных</p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <span className="contact-icon">📧</span>
                                <div>
                                    <strong>Email:</strong>
                                    <p>
                                        <a href="mailto:info@chocoberry.uz">info@chocoberry.uz</a>
                                    </p>
                                </div>
                            </div>

                            <div className="contacts-social">
                                <h4>Мы в соцсетях</h4>
                                <div className="social-links">
                                    <a href="#" className="social-link" aria-label="Instagram">📷</a>
                                    <a href="#" className="social-link" aria-label="Telegram">📱</a>
                                    <a href="#" className="social-link" aria-label="WhatsApp">💬</a>
                                    <a href="#" className="social-link" aria-label="Pinterest">📌</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Карта */}
                    <div className="contacts-map">
                        <div className="map-container">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124456.78901234567!2d64.416666!3d39.766666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDQ2JzAwLjAiTiA2NMKwMjUnMDAuMCJF!5e0!3m2!1sru!2s!4v1234567890"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                title="Карта бутика"
                            ></iframe>
                        </div>

                        {/* Фото бутика */}
                        <div className="map-gallery">
                            <img src="https://images.unsplash.com/photo-1528696892704-5e1122855e49?q=80&w=800&auto=format&fit=crop" alt="Фасад бутика" />
                            <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop" alt="Внутри бутика" />
                            <img src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=800&auto=format&fit=crop" alt="Витрина" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contacts;