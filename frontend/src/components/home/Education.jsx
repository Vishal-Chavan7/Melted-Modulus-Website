import React from 'react';
import { HiOutlineGlobeAlt, HiOutlineShieldCheck, HiOutlineArrowsPointingOut } from 'react-icons/hi2';
import { ScrollReveal } from '../common/ScrollReveal';
import { SectionHeader } from '../common/SectionHeader';

export const Education = () => {
  return (
    <section className="education" id="education">
      <div className="container">
        <SectionHeader 
          label="Learn"
          title="The Science Behind "
          titleHighlight="the Layer"
          titleFirst={true}
        />

        <ScrollReveal className="education__intro">
          <p>3D printing, also known as <strong style={{ color: 'var(--clr-text-primary)' }}>additive manufacturing</strong>, is a revolutionary process of creating three-dimensional objects from a digital file. Unlike traditional manufacturing that cuts material away, 3D printing builds objects <strong style={{ color: 'var(--clr-brand)' }}>layer by layer</strong> — adding material only where it's needed. This technology has transformed industries from aerospace and healthcare to fashion, gaming, and everyday consumer goods.</p>
        </ScrollReveal>

        <ScrollReveal className="education__sub-header">
          <h3>How It's <span className="text-gradient">Made</span></h3>
          <p className="text-muted">From concept to creation in three precise steps</p>
        </ScrollReveal>

        <ScrollReveal className="education__steps">
          <div className="step reveal-delay-1">
            <div className="step__number">01</div>
            <div className="step-line"></div>
            <h4 className="step__title">Design</h4>
            <p className="step__desc">Every 3D print starts as a digital 3D model, created using CAD software like Fusion 360 or Blender. The model is then "sliced" into hundreds of thin horizontal layers using slicer software.</p>
          </div>

          <div className="step reveal-delay-2">
            <div className="step__number">02</div>
            <div className="step-line"></div>
            <h4 className="step__title">Print</h4>
            <p className="step__desc">The printer reads the sliced file and builds the object layer by layer. An FDM printer melts thermoplastic filament through a heated nozzle at 190–270°C, depositing precise layers as thin as 0.1mm.</p>
          </div>

          <div className="step reveal-delay-3">
            <div className="step__number">03</div>
            <h4 className="step__title">Finish</h4>
            <p className="step__desc">The raw print is removed and post-processed — sanding for smoothness, painting for aesthetics, or applying protective coatings — transforming it from a raw print into a polished product.</p>
          </div>
        </ScrollReveal>

        <ScrollReveal className="education__sub-header">
          <h3>Materials <span className="text-gradient">We Use</span></h3>
          <p className="text-muted">Choosing the right material for every project</p>
        </ScrollReveal>

        <div className="education__materials-grid">
          <ScrollReveal className="card-material" delay={1}>
            <div className="card-material__dot" style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
              <HiOutlineGlobeAlt size={24} aria-hidden="true" />
            </div>
            <h4 className="card-material__name">PLA</h4>
            <p className="card-material__props">Biodegradable • Easy to print • Vibrant colors</p>
            <span className="card-material__use">Best for: Decorative items, prototypes</span>
          </ScrollReveal>

          <ScrollReveal className="card-material" delay={2}>
            <div className="card-material__dot" style={{ background: 'rgba(59, 130, 246, 0.2)' }}>
              <HiOutlineShieldCheck size={24} aria-hidden="true" />
            </div>
            <h4 className="card-material__name">PETG</h4>
            <p className="card-material__props">Strong • Chemical resistant • All-rounder</p>
            <span className="card-material__use">Best for: Mechanical parts, outdoor use</span>
          </ScrollReveal>

          <ScrollReveal className="card-material" delay={3}>
            <div className="card-material__dot" style={{ background: 'rgba(0, 191, 166, 0.2)' }}>
              <HiOutlineArrowsPointingOut size={24} aria-hidden="true" />
            </div>
            <h4 className="card-material__name">TPU</h4>
            <p className="card-material__props">Flexible • Elastic • Abrasion-resistant</p>
            <span className="card-material__use">Best for: Phone cases, gaskets, wearables</span>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
