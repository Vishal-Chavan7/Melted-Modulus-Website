import React from 'react';
import { ScrollReveal } from '../common/ScrollReveal';

export const OurStory = () => {
  return (
    <section id="story">
      <div className="container">
        <div className="about-story about-story--centered">
          <ScrollReveal className="about-story__content">
            <span className="section-label">Since 2023</span>
            <h3>From a Hobby to a <span className="text-gradient">Mission</span></h3>
            <p style={{ color: 'var(--clr-text-secondary)' }}>
              MeltedModulus was born from a simple love of making things. What started as a single Ender-3 printer in a small room quickly grew into a passion — printing custom gifts, fixing broken parts, creating miniatures for friends, and discovering a whole new way to solve problems.
            </p>
            <p style={{ color: 'var(--clr-text-secondary)' }}>
              We realized that most people know about 3D printing but have no easy, reliable way to get custom, high-quality prints made. So we built MeltedModulus — a platform where anyone can order ready-made 3D-printed products or bring their own ideas to life, with professional quality and zero technical knowledge required.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
