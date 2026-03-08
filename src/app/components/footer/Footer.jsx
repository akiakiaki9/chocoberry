'use client';

import './footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-main">
                <div className="container">
                    <div className="footer-grid">
                        {/* Колонка 1: Лого и описание */}
                        <div className="footer-col">
                            <div className="footer-logo">
                                <span className="logo-text">Choco</span>
                                <span className="logo-highlight">berry</span>
                            </div>
                            <p className="footer-description">
                                Первый клубничный бутик в Бухаре. Создаём боксы премиум-класса из свежей клубники и бельгийского шоколада.
                            </p>
                            <div className="footer-social">
                                <a href="#" className="social-link" aria-label="Instagram">
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M16 11.37C16.1234 12.2022 15.9812 13.0522 15.5937 13.799C15.2062 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.9079 12.2384 16.0396 11.4077 15.9059C10.5771 15.7721 9.80971 15.3801 9.21479 14.7852C8.61987 14.1902 8.2279 13.4229 8.09412 12.5922C7.96034 11.7615 8.09202 10.9098 8.47028 10.1583C8.84854 9.40686 9.45414 8.79374 10.2009 8.40624C10.9477 8.01874 11.7977 7.87658 12.63 8C13.4789 8.12588 14.2648 8.52146 14.8716 9.1283C15.4785 9.73515 15.8741 10.521 16 11.37Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M17.5 6.5H17.51" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </a>
                                <a href="#" className="social-link" aria-label="Telegram">
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <path d="M21 5L2 12.5L9 15.5L12 22L15.5 14.5L21 5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M9 15.5L20 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </a>
                                <a href="#" className="social-link" aria-label="Facebook">
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </a>
                                <a href="#" className="social-link" aria-label="TikTok">
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <path d="M16 8C17.5913 8.91479 18.6223 9.64347 20 10C20 8 20 6 18 4C16 2 13 2 13 2V15.5C13 16.4283 12.6313 17.3185 11.9749 17.9749C11.3185 18.6313 10.4283 19 9.5 19C8.57174 19 7.6815 18.6313 7.02513 17.9749C6.36875 17.3185 6 16.4283 6 15.5C6 14.5717 6.36875 13.6815 7.02513 13.0251C7.6815 12.3687 8.57174 12 9.5 12C10.0304 12 10.55 12.127 11 12.364V9.10001C9.5 9 5.5 8.5 3 13C1 16 2 21 2 21C2 21 6 23 10 23C14 23 17 20 17 16V9.5C17 9.5 19 10 20 8H16Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Колонка 2: Меню */}
                        <div className="footer-col">
                            <h3 className="footer-title">Меню</h3>
                            <ul className="footer-links">
                                <li><a href="#about">О нас</a></li>
                                <li><a href="#catalog">Каталог</a></li>
                                <li><a href="#gallery">Галерея</a></li>
                                <li><a href="#reviews">Отзывы</a></li>
                                <li><a href="#contacts">Контакты</a></li>
                            </ul>
                        </div>

                        {/* Колонка 3: Категории */}
                        <div className="footer-col">
                            <h3 className="footer-title">Категории</h3>
                            <ul className="footer-links">
                                <li><a href="#">Классические боксы</a></li>
                                <li><a href="#">Премиум боксы</a></li>
                                <li><a href="#">Романтические</a></li>
                                <li><a href="#">Семейные</a></li>
                                <li><a href="#">Luxury коллекция</a></li>
                            </ul>
                        </div>

                        {/* Колонка 4: Контакты */}
                        <div className="footer-col">
                            <h3 className="footer-title">Контакты</h3>
                            <ul className="footer-contact">
                                <li>
                                    <span className="contact-icon">📍</span>
                                    <span>ул. Шохрух, 42, Бухара</span>
                                </li>
                                <li>
                                    <span className="contact-icon">📞</span>
                                    <a href="tel:+998901234567">+998 90 123 45 67</a>
                                </li>
                                <li>
                                    <span className="contact-icon">✉️</span>
                                    <a href="mailto:info@chocoberry.uz">info@chocoberry.uz</a>
                                </li>
                                <li>
                                    <span className="contact-icon">⏰</span>
                                    <span>Ежедневно: 10:00 - 22:00</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Нижняя часть футера */}
            <div className="footer-bottom">
                <div className="container">
                    <div className="footer-bottom-content">
                        <p className="copyright">
                            © {currentYear} Chocoberry. Первый клубничный бутик в Бухаре
                        </p>
                        <div className="footer-bottom-links">
                            <a href="#">Политика конфиденциальности</a>
                            <a href="#">Условия доставки</a>
                            <a href="#">Договор оферты</a>
                        </div>
                        <p className="developer">
                            Разработка сайта: <a href="https://akbarsoft.uz">Akbar Soft</a>
                        </p>
                    </div>
                </div>
            </div>

            {/* Кнопка наверх */}
            <button
                className="back-to-top"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Наверх"
            >
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 19V5M5 12L12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </footer>
    );
};

export default Footer;