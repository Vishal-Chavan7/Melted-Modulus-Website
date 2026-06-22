import React from 'react';
import { ScrollReveal } from '../common/ScrollReveal';

export const OurStory = () => {
  return (
    <section id="story">
      <div className="container">
        <div className="about-story">
          <ScrollReveal className="about-story__content">
            <span className="section-label">Since 2023</span>
            <h3>From a Hobby to a <span className="text-gradient">Mission</span></h3>
            <p style={{ color: 'var(--clr-text-secondary)' }}>
              MeltedModulus was born from a simple love of making things. What started as a single Ender-3 printer in a small room quickly grew into a passion — printing custom gifts, fixing broken parts, creating miniatures for friends, and discovering a whole new way to solve problems.
            </p>
            <p style={{ color: 'var(--clr-text-secondary)' }}>
              We realized that most people know about 3D printing but have no easy way to get custom, high-quality prints. So we built MeltedModulus — a platform where anyone can shop ready-made products or get their own ideas printed with professional quality. No technical knowledge required.
            </p>
            <p style={{ color: 'var(--clr-text-secondary)' }}>
              Today, we've shipped over 10,000 products across India, working with Bambu Lab and Prusa printers to deliver the precision and quality that our community expects.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={2}>
            <div className="timeline">
              <div className="timeline-item">
                <span className="timeline-item__year">2023</span>
                <h4 className="timeline-item__title">The Beginning</h4>
                <p className="timeline-item__desc">Started with a single FDM printer, learning the craft and experimenting with materials.</p>
              </div>
              <div className="timeline-item">
                <span className="timeline-item__year">2024</span>
                <h4 className="timeline-item__title">First 100 Customers</h4>
                <p className="timeline-item__desc">Launched our online store and shipped our first 100 orders. Upgraded to Bambu Lab printers for speed and quality.</p>
              </div>
              <div className="timeline-item">
                <span className="timeline-item__year">2025</span>
                <h4 className="timeline-item__title">Expanded Product Line</h4>
                <p className="timeline-item__desc">Grew to 500+ products, added custom printing service, and introduced resin printing capabilities.</p>
              </div>
              <div className="timeline-item">
                <span className="timeline-item__year">2026</span>
                <h4 className="timeline-item__title">10,000+ Products Shipped</h4>
                <p className="timeline-item__desc">Crossed the 10K milestone. Expanded our print farm with multiple machines and a dedicated design team.</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
