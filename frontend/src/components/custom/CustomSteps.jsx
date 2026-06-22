import React from 'react';
import { HiOutlineLightBulb, HiOutlineDocumentText, HiOutlineRocketLaunch } from 'react-icons/hi2';
import { SectionHeader } from '../common/SectionHeader';
import { ScrollReveal } from '../common/ScrollReveal';

export const CustomSteps = () => {
  return (
    <section>
      <div className="container">
        <SectionHeader 
          label="Process"
          title="How It "
          titleHighlight="Works"
          description="Getting your custom 3D print is simple — just three steps."
        />

        <div className="custom-steps">
          <ScrollReveal className="custom-step-card" delay={1}>
            <div className="custom-step-card__num">1</div>
            <div className="custom-step-card__icon"><HiOutlineLightBulb size={28} aria-hidden="true" /></div>
            <h4>Describe Your Idea</h4>
            <p style={{ color: 'var(--clr-text-secondary)', fontSize: 'var(--fs-small)' }}>
              Tell us what you need — share descriptions, reference images, sketches, or 3D model files. The more detail, the better.
            </p>
          </ScrollReveal>
          
          <ScrollReveal className="custom-step-card" delay={2}>
            <div className="custom-step-card__num">2</div>
            <div className="custom-step-card__icon"><HiOutlineDocumentText size={28} aria-hidden="true" /></div>
            <h4>We Design & Quote</h4>
            <p style={{ color: 'var(--clr-text-secondary)', fontSize: 'var(--fs-small)' }}>
              Our team reviews your request, prepares the design, and sends you a detailed quote with material options and timeline.
            </p>
          </ScrollReveal>
          
          <ScrollReveal className="custom-step-card" delay={3}>
            <div className="custom-step-card__num">3</div>
            <div className="custom-step-card__icon"><HiOutlineRocketLaunch size={28} aria-hidden="true" /></div>
            <h4>We Print & Ship</h4>
            <p style={{ color: 'var(--clr-text-secondary)', fontSize: 'var(--fs-small)' }}>
              Once approved, we print your item with precision, post-process it for quality, and ship it right to your doorstep.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
