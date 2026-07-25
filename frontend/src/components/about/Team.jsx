import React from 'react';
import { HiOutlineUserCircle } from 'react-icons/hi2';
import { SectionHeader } from '../common/SectionHeader';
import { ScrollReveal } from '../common/ScrollReveal';

export const Team = () => {
  return (
    <section>
      <div className="container">
        <SectionHeader 
          label="The Founder"
          title="The Person Behind "
          titleHighlight="MeltedModulus"
          description="One maker. One vision. A mission to bring 3D printing to every doorstep in India."
        />

        <div className="team-grid team-grid--single">
          <ScrollReveal className="team-card" delay={1}>
            <div className="team-card__avatar"><HiOutlineUserCircle size={56} aria-hidden="true" /></div>
            <h4>Shashank Kamble</h4>
            <span className="team-card__role">Founder &amp; CEO</span>
            <p style={{ color: 'var(--clr-text-secondary)' }}>Self-taught maker with a passion for additive manufacturing. Turned a hobby into a business. Dreams of a 3D printer in every Indian home.</p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
