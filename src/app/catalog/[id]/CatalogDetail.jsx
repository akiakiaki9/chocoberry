'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { products, getProductById } from '@/app/utils/data';
import './catalogdetail.css';

export default function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [addedToCart, setAddedToCart] = useState(false);
    const [selectedTab, setSelectedTab] = useState('description');

    // Загрузка товара
    useEffect(() => {
        const productData = getProductById(parseInt(id));
        setProduct(productData);
    }, [id]);

    // Похожие товары (исключаем текущий)
    const relatedProducts = products
        .filter(p => p.category === product?.category && p.id !== product?.id)
        .slice(0, 4);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('uz-UZ').format(price) + ' сум';
    };

    const addToCart = () => {
        try {
            const savedCart = localStorage.getItem('chocoberry-cart');
            let cart = savedCart ? JSON.parse(savedCart) : [];

            const existingItem = cart.find(item => item.id === product.id);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image || '/images/placeholder.jpg',
                    quantity: quantity
                });
            }

            localStorage.setItem('chocoberry-cart', JSON.stringify(cart));

            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            window.dispatchEvent(new CustomEvent('cartUpdated', {
                detail: { count: totalItems }
            }));

            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2000);

        } catch (error) {
            console.error('Ошибка добавления в корзину:', error);
        }
    };

    if (!product) {
        return (
            <div className="product-loading">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="product-detail-page">
            {/* Хлебные крошки */}
            <div className="breadcrumbs">
                <div className="container">
                    <Link href="/">Главная</Link>
                    <span className="separator">/</span>
                    <Link href="/catalog">Каталог</Link>
                    <span className="separator">/</span>
                    <span className="current">{product.name}</span>
                </div>
            </div>

            <section className="product-detail">
                <div className="container">
                    <div className="product-detail-grid">
                        {/* Левая колонка - фото */}
                        <div className="product-gallery">
                            <div className="main-image">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/600x600?text=Chocoberry';
                                    }}
                                />
                                {product.popular && (
                                    <span className="gallery-badge">Хит продаж</span>
                                )}
                                {!product.inStock && (
                                    <span className="gallery-badge out">Нет в наличии</span>
                                )}
                            </div>

                            <div className="gallery-thumbnails">
                                {[1, 2, 3, 4].map((_, index) => (
                                    <button
                                        key={index}
                                        className={`thumbnail ${activeImage === index ? 'active' : ''}`}
                                        onClick={() => setActiveImage(index)}
                                    >
                                        <img
                                            src={product.image}
                                            alt={`${product.name} ${index + 1}`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Правая колонка - информация */}
                        <div className="product-info">
                            <h1 className="product-title">{product.name}</h1>

                            <div className="product-rating">
                                <span className="stars">★★★★★</span>
                                <span className="reviews-count">12 отзывов</span>
                            </div>

                            <div className="product-price-section">
                                <span className="current-price">{formatPrice(product.price)}</span>
                                {product.oldPrice && (
                                    <span className="old-price">{formatPrice(product.oldPrice)}</span>
                                )}
                            </div>

                            <div className="product-attributes">
                                <div className="attribute">
                                    <span className="attribute-label">Вес:</span>
                                    <span className="attribute-value">{product.weight}</span>
                                </div>
                                <div className="attribute">
                                    <span className="attribute-label">Количество ягод:</span>
                                    <span className="attribute-value">🍓 {product.strawberries}</span>
                                </div>
                                <div className="attribute">
                                    <span className="attribute-label">Категория:</span>
                                    <span className="attribute-value">{product.category}</span>
                                </div>
                                <div className="attribute">
                                    <span className="attribute-label">Наличие:</span>
                                    <span className={`attribute-value ${product.inStock ? 'in-stock' : 'out-stock'}`}>
                                        {product.inStock ? 'В наличии' : 'Нет в наличии'}
                                    </span>
                                </div>
                            </div>

                            {/* Количество и кнопки */}
                            <div className="product-actions">
                                <div className="quantity-selector">
                                    <button
                                        className="quantity-btn"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={!product.inStock}
                                    >
                                        −
                                    </button>
                                    <span className="quantity">{quantity}</span>
                                    <button
                                        className="quantity-btn"
                                        onClick={() => setQuantity(quantity + 1)}
                                        disabled={!product.inStock}
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    className={`add-to-cart-btn ${addedToCart ? 'added' : ''}`}
                                    onClick={addToCart}
                                    disabled={!product.inStock}
                                >
                                    {addedToCart ? '✓ Добавлено' : 'В корзину'}
                                </button>

                                <button className="favorite-btn">
                                    ♡
                                </button>
                            </div>

                            {/* Преимущества */}
                            <div className="product-benefits">
                                <div className="benefit">
                                    <span className="benefit-icon">🚚</span>
                                    <span>Бесплатная доставка от 500 000 сум</span>
                                </div>
                                <div className="benefit">
                                    <span className="benefit-icon">🎁</span>
                                    <span>Подарочная упаковка</span>
                                </div>
                                <div className="benefit">
                                    <span className="benefit-icon">💳</span>
                                    <span>Оплата картой или наличными</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Табы с информацией */}
                    <div className="product-tabs">
                        <div className="tabs-header">
                            <button
                                className={`tab-btn ${selectedTab === 'description' ? 'active' : ''}`}
                                onClick={() => setSelectedTab('description')}
                            >
                                Описание
                            </button>
                            <button
                                className={`tab-btn ${selectedTab === 'characteristics' ? 'active' : ''}`}
                                onClick={() => setSelectedTab('characteristics')}
                            >
                                Характеристики
                            </button>
                            <button
                                className={`tab-btn ${selectedTab === 'reviews' ? 'active' : ''}`}
                                onClick={() => setSelectedTab('reviews')}
                            >
                                Отзывы (12)
                            </button>
                            <button
                                className={`tab-btn ${selectedTab === 'delivery' ? 'active' : ''}`}
                                onClick={() => setSelectedTab('delivery')}
                            >
                                Доставка и оплата
                            </button>
                        </div>

                        <div className="tabs-content">
                            {selectedTab === 'description' && (
                                <div className="tab-pane">
                                    <p className="description-text">{product.description}</p>
                                    <p className="description-text">
                                        Наши боксы создаются вручную из свежайшей клубники и премиального
                                        бельгийского шоколада. Каждая ягода отбирается вручную, покрывается
                                        шоколадом и декорируется с особой тщательностью.
                                    </p>
                                    <p className="description-text">
                                        Идеально подходит для подарка или создания романтической атмосферы.
                                        Бокс упаковывается в фирменную коробку с золотым тиснением.
                                    </p>
                                </div>
                            )}

                            {selectedTab === 'characteristics' && (
                                <div className="tab-pane">
                                    <ul className="characteristics-list">
                                        <li><span>Состав:</span> Клубника свежая, шоколад бельгийский (какао-масло, какао тертое, сахар), декор (золото пищевое, фисташка, кокосовая стружка)</li>
                                        <li><span>Срок годности:</span> 3 дня при хранении в холодильнике</li>
                                        <li><span>Условия хранения:</span> от +2°C до +6°C</li>
                                        <li><span>Вес бокса:</span> {product.weight}</li>
                                        <li><span>Количество ягод:</span> {product.strawberries} шт</li>
                                        <li><span>Размер коробки:</span> 25x15x8 см</li>
                                    </ul>
                                </div>
                            )}

                            {selectedTab === 'reviews' && (
                                <div className="tab-pane">
                                    <div className="reviews-section">
                                        <div className="reviews-summary">
                                            <div className="average-rating">
                                                <span className="big-rating">4.9</span>
                                                <span className="rating-stars">★★★★★</span>
                                                <span className="total-reviews">12 отзывов</span>
                                            </div>
                                            <button className="write-review-btn">Написать отзыв</button>
                                        </div>

                                        <div className="reviews-list">
                                            {[1, 2, 3].map((_, index) => (
                                                <div key={index} className="review-item">
                                                    <div className="review-header">
                                                        <strong>Мария</strong>
                                                        <span className="review-date">2 дня назад</span>
                                                    </div>
                                                    <div className="review-rating">★★★★★</div>
                                                    <p className="review-text">
                                                        Очень вкусно! Клубника свежая, шоколад тает во рту.
                                                        Упаковка шикарная, подарила подруге - она в восторге!
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedTab === 'delivery' && (
                                <div className="tab-pane">
                                    <div className="delivery-info">
                                        <h3>Доставка</h3>
                                        <ul>
                                            <li>🚚 Бесплатная доставка по Бухаре при заказе от 500 000 сум</li>
                                            <li>💰 Доставка до 500 000 сум - 20 000 сум</li>
                                            <li>⏰ Доставка осуществляется с 10:00 до 22:00</li>
                                            <li>📦 Возможен самовывоз из нашего бутика</li>
                                        </ul>

                                        <h3>Оплата</h3>
                                        <ul>
                                            <li>💳 Оплата картой на сайте</li>
                                            <li>💵 Наличными при получении</li>
                                            <li>📱 Переводом на карту</li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Возможно вам понравится */}
            <section className="related-products">
                <div className="container">
                    <h2 className="section-title">
                        Возможно вам <span className="gold-text">понравится</span>
                    </h2>

                    <div className="related-grid">
                        {relatedProducts.map((product, index) => (
                            <Link
                                href={`/catalog/${product.id}`}
                                key={product.id}
                                className="related-card"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="related-image">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/300x300?text=Chocoberry';
                                        }}
                                    />
                                    {product.popular && (
                                        <span className="related-badge">Хит</span>
                                    )}
                                </div>
                                <div className="related-info">
                                    <h3 className="related-name">{product.name}</h3>
                                    <span className="related-price">{formatPrice(product.price)}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}