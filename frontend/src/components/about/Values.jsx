import React from 'react';
import {
  HiOutlineLightBulb,
  HiOutlineSparkles,
  HiOutlineHandRaised,
  HiOutlineGlobeAlt,
} from 'react-icons/hi2';
import { SectionHeader } from '../common/SectionHeader';
import { ScrollReveal } from '../common/ScrollReveal';

export const Values = () => {
  return (
    <section>
      <div className="container">
        <SectionHeader 
          label="What We Stand For"
          title="Our "
          titleHighlight="Values"
        />

        <div className="values-grid">
          <ScrollReveal className="value-card" delay={1}>
            <div className="value-card__icon"><HiOutlineLightBulb size={28} aria-hidden="true" /></div>
            <h4>Innovation</h4>
            <p style={{ color: 'var(--clr-text-secondary)' }}>We stay at the forefront of 3D printing technology, constantly experimenting with new materials, techniques, and designs.</p>
          </ScrollReveal>
          <ScrollReveal className="value-card" delay={2}>
            <div className="value-card__icon"><HiOutlineSparkles size={28} aria-hidden="true" /></div>
            <h4>Quality</h4>
            <p style={{ color: 'var(--clr-text-secondary)' }}>Every product goes through rigorous quality checks. We obsess over layer consistency, surface finish, and structural integrity.</p>
          </ScrollReveal>
          <ScrollReveal className="value-card" delay={3}>
            <div className="value-card__icon"><HiOutlineHandRaised size={28} aria-hidden="true" /></div>
            <h4>Community</h4>
            <p style={{ color: 'var(--clr-text-secondary)' }}>We're makers at heart. We share knowledge, support the maker community, and believe in making 3D printing accessible to everyone.</p>
          </ScrollReveal>
          <ScrollReveal className="value-card" delay={4}>
            <div className="value-card__icon"><HiOutlineGlobeAlt size={28} aria-hidden="true" /></div>
            <h4>Sustainability</h4>
            <p style={{ color: 'var(--clr-text-secondary)' }}>We primarily use PLA — a biodegradable, plant-based material. We minimize waste through optimized print settings and recycle failed prints.</p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
