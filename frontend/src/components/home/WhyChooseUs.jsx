import React from 'react';
import { HiOutlineCursorArrowRays, HiOutlinePaintBrush, HiOutlineRocketLaunch } from 'react-icons/hi2';
import { SectionHeader } from '../common/SectionHeader';
import { ScrollReveal } from '../common/ScrollReveal';

export const WhyChooseUs = () => {
  return (
    <section className="why-us" id="why-us">
      <div className="container">
        <SectionHeader 
          label="Our Promise"
          title="Why Makers "
          titleHighlight="Choose Us"
          titleFirst={true}
          description="Quality, customization, speed, and satisfaction — that's the MeltedModulus guarantee."
        />

        <div className="why-us__grid">
          <ScrollReveal className="card-value" delay={1}>
            <div className="card-value__icon"><HiOutlineCursorArrowRays size={32} aria-hidden="true" /></div>
            <h4 className="card-value__title">Precision Quality</h4>
            <p className="card-value__desc">Every product is printed with layer accuracy as fine as 0.1mm using industry-leading Bambu Lab and Prusa printers.</p>
          </ScrollReveal>

          <ScrollReveal className="card-value" delay={2}>
            <div className="card-value__icon"><HiOutlinePaintBrush size={32} aria-hidden="true" /></div>
            <h4 className="card-value__title">Endless Customization</h4>
            <p className="card-value__desc">Choose your material, color, infill density, and finish. Your product, your specifications — made exactly how you want it.</p>
          </ScrollReveal>

          <ScrollReveal className="card-value" delay={3}>
            <div className="card-value__icon"><HiOutlineRocketLaunch size={32} aria-hidden="true" /></div>
            <h4 className="card-value__title">Fast Turnaround</h4>
            <p className="card-value__desc">Most orders ship within 3-5 business days. Rush orders available for time-sensitive projects and last-minute gifts.</p>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
};
