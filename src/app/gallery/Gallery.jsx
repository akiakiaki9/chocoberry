'use client';

import { useState, useEffect, useCallback } from 'react';
import './gallery.css';
import {
  FiGrid,
  FiHome,
  FiHeart,
  FiCalendar,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiZoomIn,
  FiCamera,
  FiPackage,
} from 'react-icons/fi';
import {
  GiStrawberry,
  GiCrown,
} from 'react-icons/gi';
import { IoMdPhotos } from 'react-icons/io';
import { motion, AnimatePresence } from 'framer-motion';

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const nextImage = useCallback(() => {
    const currentIndex = filteredItems.findIndex(item => item.id === selectedImage?.id);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setSelectedImage(filteredItems[nextIndex]);
  }, [filteredItems, selectedImage]);

  const prevImage = useCallback(() => {
    const currentIndex = filteredItems.findIndex(item => item.id === selectedImage?.id);
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setSelectedImage(filteredItems[prevIndex]);
  }, [filteredItems, selectedImage]);

  const handleImageLoad = (id) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  // Touch events for swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart || !selectedImage) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
    setTouchStart(null);
  };

  // Keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;
      if (e.key === 'ArrowRight') nextImage();
      else if (e.key === 'ArrowLeft') prevImage();
      else if (e.key === 'Escape') closeLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, nextImage, prevImage]);

  // Variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  const lightboxVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="gallery-page">
      {/* Шапка */}
      <div className="gallery-header">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="gallery-title">
              Наша <span className="gold-text">галерея</span>
            </h1>
            <p className="gallery-subtitle">
              Интерьер бутика, наши работы и процесс создания
            </p>
          </motion.div>

          {/* Статистика */}
          <motion.div
            className="gallery-stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
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
          </motion.div>
        </div>
      </div>

      {/* Категории */}
      <div className="gallery-categories">
        <div className="container">
          <div className="category-list">
            {categories.map((cat, index) => (
              <motion.button
                key={cat.id}
                className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <span className="category-icon">{cat.icon}</span>
                <span className="category-name">{cat.name}</span>
                {activeCategory === cat.id && (
                  <span className="category-count">
                    {cat.id === 'all' ? stats.total : stats[cat.id]}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Сетка галереи */}
      <div className="gallery-content">
        <div className="container">
          <motion.div
            className="masonry-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                className={`masonry-item ${item.size} ${loadedImages[item.id] ? 'loaded' : ''}`}
                variants={itemVariants}
                onClick={() => openLightbox(item)}
                whileHover={!isMobile ? { y: -8 } : {}}
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
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Лайтбокс */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="gallery-lightbox"
            variants={lightboxVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeLightbox}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <motion.button
              className="lightbox-close"
              onClick={closeLightbox}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiX />
            </motion.button>

            <motion.button
              className="lightbox-nav lightbox-prev"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiChevronLeft />
            </motion.button>

            <motion.button
              className="lightbox-nav lightbox-next"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiChevronRight />
            </motion.button>

            <motion.div
              className="lightbox-content"
              onClick={(e) => e.stopPropagation()}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
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
            </motion.div>

            <div className="lightbox-counter">
              {filteredItems.findIndex(item => item.id === selectedImage.id) + 1} / {filteredItems.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}