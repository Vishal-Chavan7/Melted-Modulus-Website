import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineTruck,
  HiOutlinePaintBrush,
  HiOutlineStar,
} from 'react-icons/hi2';

const HERO_SLIDES = [
  '/assets/images/hero/hero-bambulab.png',
  '/assets/images/hero/hero-prints.png',
  '/assets/images/hero/hero-models.png',
  '/assets/images/hero/hero-printer.png',
  '/assets/images/hero/hero-workspace.png',
];

export const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero" id="hero">
      {HERO_SLIDES.map((slide, index) => (
        <div 
          key={index}
          className={`hero__bg-slide ${currentSlide === index ? 'active' : ''}`}
        >
          <img src={slide} alt="" loading={index === 0 ? 'eager' : 'lazy'} />
        </div>
      ))}
      <div className="hero__overlay"></div>

      <div className="hero__shapes">
        <div className="hero__shape hero__shape--1"></div>
        <div className="hero__shape hero__shape--2"></div>
        <div className="hero__shape hero__shape--3"></div>
        <div className="hero__shape hero__shape--4"></div>
      </div>

      <div className="hero__content">
        <h1 className="hero__title">
          Where Ideas<br /><span className="highlight">Take Shape</span>
        </h1>

        <p className="hero__subtitle">
          Premium 3D-printed products, custom designs, and maker supplies — crafted layer by layer with precision and passion.
        </p>

        <div className="hero__cta">
          <Link to="/products" className="btn btn-primary btn-lg">Explore Products</Link>
          <Link to="/custom#custom-form" className="btn btn-secondary btn-lg">Get a Custom Quote</Link>
        </div>

        <div className="hero__trust">
          <div className="hero__trust-list">
            <div className="hero__trust-item">
              <span className="hero__trust-icon"><HiOutlineTruck aria-hidden="true" /></span>
              Free Shipping on ₹2,000+
            </div>
            <div className="hero__trust-item">
              <span className="hero__trust-icon"><HiOutlinePaintBrush aria-hidden="true" /></span>
              Made-to-Order Custom Prints
            </div>
            <div className="hero__trust-item">
              <span className="hero__trust-icon"><HiOutlineStar aria-hidden="true" /></span>
              Premium Quality Materials
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
