import React from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader } from '../common/SectionHeader';
import { ScrollReveal } from '../common/ScrollReveal';

export const Features = () => {
  return (
    <section className="features" id="features" style={{ paddingTop: 'var(--space-4)' }}>
      <div className="container">
        <SectionHeader 
          label="What We Offer"
          title="Explore Our "
          titleHighlight="World"
          description="From ready-made products to fully custom creations — we've got everything a maker needs."
          titleFirst={true}
        />

        <div className="features__grid">
          {/* Products Card */}
          <ScrollReveal className="card-feature card-feature--violet" delay={1}>
            <div className="card-feature__image">
              <img src="/assets/images/hero/hero-prints.png" alt="Curated collection of 3D printed products" />
            </div>
            <div className="card-feature__content">
              <span className="badge badge-brand" style={{ fontSize: '0.7rem', padding: '0.2rem 0.65rem' }}>Ready to Ship</span>
              <h3 style={{ marginTop: 'var(--space-3)' }}>Shop Products</h3>
              <p>Discover our curated collection of ready-made 3D-printed products — from gaming miniatures and cosplay props to functional home accessories and tech gadgets. All printed with premium materials and meticulous attention to detail.</p>
              <Link to="/products" className="btn btn-primary">Browse Collection →</Link>
            </div>
          </ScrollReveal>

          {/* Custom Card */}
          <ScrollReveal className="card-feature card-feature--cyan" delay={2}>
            <div className="card-feature__image">
              <img src="/assets/images/hero/hero-printer.png" alt="Custom 3D printing service" />
            </div>
            <div className="card-feature__content">
              <span className="badge badge-accent" style={{ fontSize: '0.7rem', padding: '0.2rem 0.65rem' }}>Made for You</span>
              <h3 style={{ marginTop: 'var(--space-3)' }}>Custom Prints</h3>
              <p>Bring your ideas to life. Describe your concept or share your reference images — we'll design and print it in your choice of material, color, and finish. From prototypes to personalized gifts, we make it real.</p>
              <Link to="/custom#custom-form" className="btn btn-secondary">Get a Custom Quote →</Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
