import React from 'react';
import { Hero } from '../components/home/Hero';
import { Features } from '../components/home/Features';
import { FeaturedCarousel } from '../components/home/FeaturedCarousel';
import { Education } from '../components/home/Education';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { Newsletter } from '../components/home/Newsletter';

export const HomePage = () => {
  return (
    <>
      <Hero />
      <Features />
      <FeaturedCarousel />
      <Education />
      <WhyChooseUs />
      <Newsletter />
    </>
  );
};
