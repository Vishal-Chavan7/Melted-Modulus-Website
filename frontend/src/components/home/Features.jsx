import React from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader } from '../common/SectionHeader';
import { ScrollReveal } from '../common/ScrollReveal';

export const Features = () => {
  return (
    <section className="features" id="features">
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
              <span className="badge badge-brand">Ready to Ship</span>
              <h3>Shop Products</h3>
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
              <span className="badge badge-accent">Made for You</span>
              <h3>Custom Prints</h3>
              <p>Bring your ideas to life. Describe your concept or share your reference images — we'll design and print it in your choice of material, color, and finish. From prototypes to personalized gifts, we make it real.</p>
              <Link to="/custom" className="btn btn-accent">Start Your Custom Order →</Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
