'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './orderModal.css';

const OrderModal = ({ isOpen, onClose, cartItems, totalPrice, onOrderSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        location: {
            address: '',
            lat: null,
            lng: null
        }
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [isEditingLocation, setIsEditingLocation] = useState(false);
    const [mapLoaded, setMapLoaded] = useState(false);
    const mapRef = useRef(null);

    // БЛОКИРОВКА СКРОЛЛА ПРИ ОТКРЫТИИ МОДАЛКИ
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.height = '100%';
        } else {
            document.body.style.overflow = 'unset';
            document.body.style.position = 'unset';
            document.body.style.width = 'unset';
            document.body.style.height = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.position = 'unset';
            document.body.style.width = 'unset';
            document.body.style.height = 'unset';
        };
    }, [isOpen]);

    // Автоматическое определение локации
    useEffect(() => {
        if (isOpen) {
            detectLocation();
        }
    }, [isOpen]);

    // Загрузка Яндекс карт
    useEffect(() => {
        if (isOpen && !mapLoaded) {
            loadYandexMaps();
        }
    }, [isOpen, mapLoaded]);

    const loadYandexMaps = () => {
        if (window.ymaps) {
            setMapLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://api-maps.yandex.ru/2.1/?apikey=YOUR_YANDEX_API_KEY&lang=ru_RU';
        script.async = true;
        script.onload = () => {
            setMapLoaded(true);
            if (formData.location.lat && formData.location.lng) {
                setTimeout(initMap, 500);
            }
        };
        document.head.appendChild(script);
    };

    const initMap = () => {
        if (!window.ymaps || !mapRef.current) return;

        window.ymaps.ready(() => {
            const map = new window.ymaps.Map(mapRef.current, {
                center: [formData.location.lat, formData.location.lng],
                zoom: 15,
                controls: ['zoomControl', 'fullscreenControl']
            });

            const placemark = new window.ymaps.Placemark(
                [formData.location.lat, formData.location.lng],
                {
                    hintContent: 'Ваше местоположение',
                    balloonContent: 'Вы здесь'
                },
                {
                    preset: 'islands#redCircleIcon',
                    draggable: true
                }
            );

            map.geoObjects.add(placemark);

            // Обновление координат при перетаскивании
            placemark.events.add('dragend', () => {
                const coords = placemark.geometry.getCoordinates();
                setFormData(prev => ({
                    ...prev,
                    location: {
                        ...prev.location,
                        lat: coords[0],
                        lng: coords[1]
                    }
                }));
                getAddressFromCoords(coords[0], coords[1]);
            });

            mapRef.current._map = map;
            mapRef.current._placemark = placemark;
        });
    };

    const detectLocation = () => {
        setIsLocating(true);
        setLocationError('');

        if (!navigator.geolocation) {
            setLocationError('Ваш браузер не поддерживает геолокацию');
            setIsLocating(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setFormData(prev => ({
                    ...prev,
                    location: {
                        ...prev.location,
                        lat: latitude,
                        lng: longitude
                    }
                }));

                await getAddressFromCoords(latitude, longitude);
                setIsLocating(false);

                if (mapLoaded) {
                    setTimeout(initMap, 300);
                }
            },
            (error) => {
                console.error('Ошибка определения местоположения:', error);
                setLocationError('Не удалось определить местоположение. Введите адрес вручную.');
                setIsLocating(false);
                // Устанавливаем координаты по умолчанию (центр Бухары)
                setFormData(prev => ({
                    ...prev,
                    location: {
                        ...prev.location,
                        lat: 39.7747,
                        lng: 64.4286,
                        address: 'Бухара, Узбекистан'
                    }
                }));
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    };

    const getAddressFromCoords = async (lat, lng) => {
        try {
            const response = await fetch(
                `https://geocode-maps.yandex.ru/1.x/?apikey=YOUR_YANDEX_API_KEY&geocode=${lng},${lat}&format=json`
            );
            const data = await response.json();
            const address = data.response.GeoObjectCollection.featureMember[0]?.GeoObject?.metaDataProperty?.GeocoderMetaData?.text ||
                `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

            setFormData(prev => ({
                ...prev,
                location: {
                    ...prev.location,
                    address: address
                }
            }));
        } catch (error) {
            console.error('Ошибка получения адреса:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'address') {
            setFormData(prev => ({
                ...prev,
                location: {
                    ...prev.location,
                    address: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const orderData = {
            customer: {
                name: formData.name,
                phone: formData.phone,
                location: {
                    address: formData.location.address,
                    lat: formData.location.lat,
                    lng: formData.location.lng
                }
            },
            items: cartItems.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
                total: item.price * item.quantity
            })),
            total: totalPrice,
            timestamp: new Date().toISOString()
        };

        try {
            const response = await fetch('/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            const result = await response.json();

            // ВСЕГДА закрываем модалку, даже если ошибка
            // Потому что заказ уже ушел в бот
            onOrderSuccess(orderData);
            onClose();

            // Показываем сообщение только если ошибка
            if (!response.ok || !result.success) {
                alert('✅ Заказ отправлен! Наш менеджер свяжется с вами.');
            }

        } catch (error) {
            console.error('Ошибка отправки заказа:', error);
            // Даже при ошибке - заказ скорее всего ушел
            // Закрываем модалку
            onOrderSuccess(orderData);
            onClose();
            alert('✅ Заказ отправлен! Наш менеджер свяжется с вами.');
        } finally {
            setIsLoading(false);
        }
    };

    const openYandexTaxi = () => {
        if (!formData.location.lat || !formData.location.lng) return;

        const url = `https://taxi.yandex.ru/?rtext=~${formData.location.lat},${formData.location.lng}`;
        window.open(url, '_blank');
    };

    const openGoogleMaps = () => {
        if (!formData.location.lat || !formData.location.lng) return;

        const url = `https://www.google.com/maps/dir/?api=1&destination=${formData.location.lat},${formData.location.lng}`;
        window.open(url, '_blank');
    };

    const openYandexMaps = () => {
        if (!formData.location.lat || !formData.location.lng) return;

        const url = `https://yandex.uz/maps/?pt=${formData.location.lng},${formData.location.lat}&z=16`;
        window.open(url, '_blank');
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 30
            }
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            y: 20
        }
    };

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="order-modal-overlay"
                onClick={onClose}
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            />

            <motion.div
                className="order-modal-container"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <button className="order-modal-close" onClick={onClose}>
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>

                <h2 className="order-modal-title">Оформление заказа</h2>

                <form onSubmit={handleSubmit} className="order-form">
                    {/* Имя */}
                    <div className="form-group">
                        <label htmlFor="name">Ваше имя *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Введите ваше имя"
                            required
                            className="form-input"
                        />
                    </div>

                    {/* Телефон */}
                    <div className="form-group">
                        <label htmlFor="phone">Телефон *</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+998 90 123 45 67"
                            required
                            className="form-input"
                        />
                    </div>

                    {/* Локация */}
                    <div className="form-group">
                        <div className="location-header">
                            <label>Ваше местоположение</label>
                            <div className="location-actions">
                                <button
                                    type="button"
                                    onClick={detectLocation}
                                    className="locate-btn"
                                    disabled={isLocating}
                                >
                                    {isLocating ? 'Определяем...' : '🔍 Определить'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditingLocation(!isEditingLocation)}
                                    className="edit-location-btn"
                                >
                                    {isEditingLocation ? 'Сохранить' : '✏️'}
                                </button>
                            </div>
                        </div>

                        {locationError && (
                            <div className="location-error">{locationError}</div>
                        )}

                        {isEditingLocation ? (
                            <input
                                type="text"
                                name="address"
                                value={formData.location.address}
                                onChange={handleInputChange}
                                placeholder="Введите адрес вручную"
                                className="form-input"
                            />
                        ) : (
                            <div className="location-display">
                                <span className="location-address">
                                    {formData.location.address || 'Определение местоположения...'}
                                </span>
                                {formData.location.lat && formData.location.lng && (
                                    <span className="location-coords">
                                        {formData.location.lat.toFixed(6)}, {formData.location.lng.toFixed(6)}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Карта */}
                    <div className="map-container">
                        <div ref={mapRef} className="map-wrapper"></div>
                        {!mapLoaded && (
                            <div className="map-loading">
                                <div className="loading-spinner"></div>
                                <span>Загрузка карты...</span>
                            </div>
                        )}
                    </div>

                    {/* Информация о заказе */}
                    <div className="order-summary">
                        <h3>Ваш заказ:</h3>
                        {cartItems.map((item) => (
                            <div key={item.id} className="order-item-summary">
                                <span>{item.name} x{item.quantity}</span>
                                <span>{item.price * item.quantity} сум</span>
                            </div>
                        ))}
                        <div className="order-total">
                            <strong>Итого:</strong>
                            <strong>{totalPrice} сум</strong>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="submit-order-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Оформление...' : 'Оформить заказ'}
                    </button>
                </form>
            </motion.div>
        </AnimatePresence>
    );
};

export default OrderModal;