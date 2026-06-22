import React from 'react';
import { HiOutlinePrinter } from 'react-icons/hi2';
import { SectionHeader } from '../common/SectionHeader';
import { ScrollReveal } from '../common/ScrollReveal';

export const Equipment = () => {
  return (
    <section>
      <div className="container">
        <SectionHeader 
          label="Our Workshop"
          title="The "
          titleHighlight="Equipment"
          description="We use industry-leading 3D printers trusted by professionals worldwide."
        />

        <div className="equipment-grid" style={{ gridTemplateColumns: '1fr', maxWidth: '480px', margin: '0 auto' }}>
          <ScrollReveal className="equipment-card" delay={1}>
            <div className="equipment-card__icon"><HiOutlinePrinter size={32} aria-hidden="true" /></div>
            <h4>Bambu Lab A1</h4>
            <span className="equipment-card__brand">Bambu Lab</span>
            <p style={{ color: 'var(--clr-text-secondary)' }}>
              Our workhorse for everyday prints. Auto bed-leveling, fast speeds up to 500mm/s, and exceptional print quality. Perfect for PLA, PETG, and TPU projects.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
