import React, { useState, useEffect, useRef } from 'react';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2';
import { SectionHeader } from '../common/SectionHeader';
import { ProductCard } from '../common/ProductCard';
import { useProducts } from '../../hooks/useProducts';

export const FeaturedCarousel = () => {
  const { products } = useProducts();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const carouselRef = useRef(null);
  
  const gap = 24; // 1.5rem
  const cardWidthRef = useRef(0);

  useEffect(() => {
    const calculateDimensions = () => {
      if (!carouselRef.current) return;
      const firstCard = carouselRef.current.querySelector('.card-product');
      if (!firstCard) return;

      cardWidthRef.current = firstCard.offsetWidth + gap;
      const wrapperWidth = carouselRef.current.parentElement.offsetWidth;
      const newVisibleCards = Math.floor(wrapperWidth / cardWidthRef.current) || 1;
      setVisibleCards(newVisibleCards);
    };

    calculateDimensions();
    window.addEventListener('resize', calculateDimensions);
    return () => window.removeEventListener('resize', calculateDimensions);
  }, [products]);

  const maxIndex = Math.max(0, products.length - visibleCards);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= maxIndex) return 0;
        return prev + 1;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [maxIndex]);

  const goNext = () => {
    if (currentIndex < maxIndex) setCurrentIndex(currentIndex + 1);
  };

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handlePointerDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX);
    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grabbing';
      carouselRef.current.style.transition = 'none';
    }
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const diff = e.pageX - startX;
    const offset = -currentIndex * cardWidthRef.current + diff;
    carouselRef.current.style.transform = `translateX(${offset}px)`;
  };

  const handlePointerUp = (e) => {
    if (!isDragging || !carouselRef.current) return;
    setIsDragging(false);
    carouselRef.current.style.cursor = '';
    carouselRef.current.style.transition = '';

    const diff = e.pageX - startX;
    const threshold = cardWidthRef.current * 0.25;

    if (diff < -threshold) {
      goNext();
    } else if (diff > threshold) {
      goPrev();
    } else {
      // Snap back
      const offset = -currentIndex * cardWidthRef.current;
      carouselRef.current.style.transform = `translateX(${offset}px)`;
    }
  };

  const handlePointerLeave = () => {
    if (isDragging && carouselRef.current) {
      setIsDragging(false);
      carouselRef.current.style.cursor = '';
      carouselRef.current.style.transition = '';
      const offset = -currentIndex * cardWidthRef.current;
      carouselRef.current.style.transform = `translateX(${offset}px)`;
    }
  };

  return (
    <section>
      <div className="container">
        <div className="carousel-header">
          <SectionHeader 
            label="Shop"
            titleHighlight="Trending"
            title="Now"
          />
          <div className="carousel-controls">
            <button 
              className="carousel-btn" 
              id="carousel-prev" 
              aria-label="Previous products" 
              disabled={currentIndex === 0}
              onClick={goPrev}
            >
              <HiOutlineChevronLeft aria-hidden="true" />
            </button>
            <button 
              className="carousel-btn" 
              id="carousel-next" 
              aria-label="Next products" 
              disabled={currentIndex >= maxIndex}
              onClick={goNext}
            >
              <HiOutlineChevronRight aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="carousel-wrapper">
          <div 
            className="carousel" 
            id="product-carousel"
            ref={carouselRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
            style={{ transform: `translateX(${-currentIndex * cardWidthRef.current}px)` }}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        <div className="carousel-dots" id="carousel-dots">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button 
              key={idx} 
              className={`carousel-dot ${currentIndex === idx ? 'active' : ''}`}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setCurrentIndex(idx)}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};
