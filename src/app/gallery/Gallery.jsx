'use client';

import { useState, useEffect } from 'react';
import './gallery.css';
import {
  FiGrid,
  FiHome,
  FiGift,
  FiHeart,
  FiCalendar,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiZoomIn,
  FiCamera,
  FiPackage,
  FiUsers
} from 'react-icons/fi';
import {
  GiStrawberry,
  GiChocolateBar,
  GiCrown,
  GiHeartWings,
  GiFamilyHouse,
  GiPartyPopper
} from 'react-icons/gi';
import { IoMdPhotos, IoMdHeart } from 'react-icons/io';
import { FaFire } from 'react-icons/fa';
import { BiCategory } from 'react-icons/bi';

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    interior: 0,
    boxes: 0,
    process: 0,
    events: 0
  });

  const categories = [
    { id: 'all', name: 'Все', icon: <FiGrid /> },
    { id: 'interior', name: 'Интерьер', icon: <FiHome /> },
    { id: 'boxes', name: 'Наши боксы', icon: <FiPackage /> },
    { id: 'process', name: 'Процесс', icon: <FiHeart /> },
    { id: 'events', name: 'Мероприятия', icon: <FiCalendar /> }
  ];

  const galleryItems = [
    // Интерьер
    {
      id: 1,
      image: '/images/carousel/carousel/1.png',
      title: 'Витрина бутика',
      category: 'interior',
      size: 'large',
      icon: <FiCamera />
    },
    {
      id: 2,
      image: '/images/carousel/carousel/2.png',
      title: 'Зона дегустации',
      category: 'interior',
      size: 'small',
      icon: <GiStrawberry />
    },
    {
      id: 3,
      image: '/images/carousel/carousel/3.png',
      title: 'Основной зал',
      category: 'interior',
      size: 'small',
      icon: <FiHome />
    },
    {
      id: 4,
      image: '/images/carousel/carousel/4.png',
      title: 'Золотая витрина',
      category: 'interior',
      size: 'wide',
      icon: <GiCrown />
    },
  ];

  // Подсчет статистики при загрузке
  useEffect(() => {
    const newStats = {
      total: galleryItems.length,
      interior: galleryItems.filter(item => item.category === 'interior').length,
      boxes: galleryItems.filter(item => item.category === 'boxes').length,
      process: galleryItems.filter(item => item.category === 'process').length,
      events: galleryItems.filter(item => item.category === 'events').length
    };
    setStats(newStats);
  }, []);

  const filteredItems = activeCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  const openLightbox = (item) => {
    setSelectedImage(item);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const nextImage = () => {
    const currentIndex = filteredItems.findIndex(item => item.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setSelectedImage(filteredItems[nextIndex]);
  };

  const prevImage = () => {
    const currentIndex = filteredItems.findIndex(item => item.id === selectedImage.id);
    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setSelectedImage(filteredItems[prevIndex]);
  };

  const handleImageLoad = (id) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  const handleKeyDown = (e) => {
    if (!selectedImage) return;

    if (e.key === 'ArrowRight') {
      nextImage();
    } else if (e.key === 'ArrowLeft') {
      prevImage();
    } else if (e.key === 'Escape') {
      closeLightbox();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  return (
    <div className="gallery-page">
      {/* Шапка */}
      <div className="gallery-header">
        <div className="container">
          <h1 className="gallery-title">
            Наша <span className="gold-text">галерея</span>
          </h1>
          <p className="gallery-subtitle">
            Интерьер бутика, наши работы и процесс создания
          </p>

          {/* Статистика */}
          <div className="gallery-stats">
            <div className="stat-item">
              <IoMdPhotos className="stat-icon" />
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">всего фото</span>
            </div>
            <div className="stat-item">
              <FiHome className="stat-icon" />
              <span className="stat-value">{stats.interior}</span>
              <span className="stat-label">интерьер</span>
            </div>
            <div className="stat-item">
              <FiPackage className="stat-icon" />
              <span className="stat-value">{stats.boxes}</span>
              <span className="stat-label">боксы</span>
            </div>
          </div>
        </div>
      </div>

      {/* Категории */}
      <div className="gallery-categories">
        <div className="container">
          <div className="category-list">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span className="category-icon">{cat.icon}</span>
                <span className="category-name">{cat.name}</span>
                {activeCategory === cat.id && (
                  <span className="category-count">
                    {cat.id === 'all' ? stats.total : stats[cat.id]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Сетка галереи */}
      <div className="gallery-content">
        <div className="container">
          <div className="masonry-grid">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className={`masonry-item ${item.size} ${loadedImages[item.id] ? 'loaded' : ''}`}
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => openLightbox(item)}
              >
                {!loadedImages[item.id] && (
                  <div className="image-placeholder">
                    <GiStrawberry className="placeholder-icon" />
                  </div>
                )}
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  onLoad={() => handleImageLoad(item.id)}
                />

                <div className="masonry-category-icon">
                  {item.icon}
                </div>

                <div className="masonry-overlay">
                  <h3>{item.title}</h3>
                  <FiZoomIn className="overlay-icon" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Лайтбокс */}
      {selectedImage && (
        <div className="gallery-lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>
            <FiX />
          </button>

          <button
            className="lightbox-nav lightbox-prev"
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
          >
            <FiChevronLeft />
          </button>

          <button
            className="lightbox-nav lightbox-next"
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
          >
            <FiChevronRight />
          </button>

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              onError={(e) => {
                e.target.src = 'https://images.pexels.com/photos/5632398/pexels-photo-5632398.jpeg?auto=compress&cs=tinysrgb&w=600';
              }}
            />
            <div className="lightbox-caption">
              <h2>{selectedImage.title}</h2>
              <div className="lightbox-category">
                {selectedImage.icon}
                <span>{categories.find(c => c.id === selectedImage.category)?.name}</span>
              </div>
            </div>
          </div>

          <div className="lightbox-counter">
            {filteredItems.findIndex(item => item.id === selectedImage.id) + 1} / {filteredItems.length}
          </div>
        </div>
      )}
    </div>
  );
}