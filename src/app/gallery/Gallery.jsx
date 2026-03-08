'use client';

import { useState } from 'react';
import './gallery.css';

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});

  const categories = [
    { id: 'all', name: 'Все', icon: '🖼️' },
    { id: 'interior', name: 'Интерьер', icon: '🏠' },
    { id: 'boxes', name: 'Наши боксы', icon: '🎁' },
    { id: 'process', name: 'Процесс', icon: '👩‍🍳' },
    { id: 'events', name: 'Мероприятия', icon: '🎉' }
  ];

  const galleryItems = [
    // Интерьер - 100% рабочие фото
    {
      id: 1,
      image: 'https://images.pexels.com/photos/5632398/pexels-photo-5632398.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Витрина бутика',
      category: 'interior',
      size: 'large'
    },
    {
      id: 2,
      image: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Зона дегустации',
      category: 'interior',
      size: 'small'
    },
    {
      id: 3,
      image: 'https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Основной зал',
      category: 'interior',
      size: 'small'
    },
    {
      id: 4,
      image: 'https://images.pexels.com/photos/5632403/pexels-photo-5632403.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Золотая витрина',
      category: 'interior',
      size: 'wide'
    },
    
    // Боксы - НОВЫЕ РАБОЧИЕ ФОТО
    {
      id: 5,
      image: 'https://images.pexels.com/photos/1126353/pexels-photo-1126353.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Клубничное сердце',
      category: 'boxes',
      size: 'small'
    },
    {
      id: 6,
      image: 'https://images.pexels.com/photos/1126354/pexels-photo-1126354.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Золотая коллекция',
      category: 'boxes',
      size: 'large'
    },
    {
      id: 7,
      image: 'https://images.pexels.com/photos/1126355/pexels-photo-1126355.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Романтический',
      category: 'boxes',
      size: 'small'
    },
    {
      id: 8,
      image: 'https://images.pexels.com/photos/1126356/pexels-photo-1126356.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Семейный бокс',
      category: 'boxes',
      size: 'small'
    },
    {
      id: 9,
      image: 'https://images.pexels.com/photos/1126357/pexels-photo-1126357.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Мини бокс',
      category: 'boxes',
      size: 'wide'
    },
    
    // Процесс - рабочие фото
    {
      id: 10,
      image: 'https://images.pexels.com/photos/4016527/pexels-photo-4016527.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Покрытие шоколадом',
      category: 'process',
      size: 'small'
    },
    {
      id: 11,
      image: 'https://images.pexels.com/photos/4016528/pexels-photo-4016528.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Декорирование',
      category: 'process',
      size: 'large'
    },
    {
      id: 12,
      image: 'https://images.pexels.com/photos/4016529/pexels-photo-4016529.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Упаковка',
      category: 'process',
      size: 'small'
    },
    
    // Мероприятия - НОВЫЕ РАБОЧИЕ ФОТО
    {
      id: 13,
      image: 'https://images.pexels.com/photos/2253643/pexels-photo-2253643.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Мастер-класс',
      category: 'events',
      size: 'small'
    },
    {
      id: 14,
      image: 'https://images.pexels.com/photos/2253644/pexels-photo-2253644.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Дегустация',
      category: 'events',
      size: 'wide'
    },
    {
      id: 15,
      image: 'https://images.pexels.com/photos/2253645/pexels-photo-2253645.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Свадьба',
      category: 'events',
      size: 'small'
    },
    {
      id: 16,
      image: 'https://images.pexels.com/photos/2253646/pexels-photo-2253646.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Корпоратив',
      category: 'events',
      size: 'large'
    }
  ];

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
                    <span>🍓</span>
                  </div>
                )}
                <img 
                  src={item.image} 
                  alt={item.title}
                  loading="lazy"
                  onLoad={() => handleImageLoad(item.id)}
                />
                <div className="masonry-overlay">
                  <h3>{item.title}</h3>
                  <span className="overlay-icon">🔍</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Лайтбокс */}
      {selectedImage && (
        <div className="gallery-lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>×</button>
          <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); prevImage(); }}>‹</button>
          <button className="lightbox-nav lightbox-next" onClick={(e) => { e.stopPropagation(); nextImage(); }}>›</button>
          
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}