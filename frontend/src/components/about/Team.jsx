import React from 'react';
import { HiOutlineUserCircle } from 'react-icons/hi2';
import { SectionHeader } from '../common/SectionHeader';
import { ScrollReveal } from '../common/ScrollReveal';

export const Team = () => {
  return (
    <section>
      <div className="container">
        <SectionHeader 
          label="The People"
          title="Meet Our "
          titleHighlight="Team"
          description="Small team, big ambitions. Every member is a maker at heart."
        />

        <div className="team-grid">
          <ScrollReveal className="team-card" delay={1}>
            <div className="team-card__avatar"><HiOutlineUserCircle size={56} aria-hidden="true" /></div>
            <h4>Aarav Sharma</h4>
            <span className="team-card__role">Founder & CEO</span>
            <p style={{ color: 'var(--clr-text-secondary)' }}>Self-taught maker with a passion for additive manufacturing. Turned a hobby into a business. Dreams of a 3D printer in every Indian home.</p>
          </ScrollReveal>
          <ScrollReveal className="team-card" delay={2}>
            <div className="team-card__avatar"><HiOutlineUserCircle size={56} aria-hidden="true" /></div>
            <h4>Priya Mehta</h4>
            <span className="team-card__role">Lead Designer</span>
            <p style={{ color: 'var(--clr-text-secondary)' }}>Industrial designer with 5+ years in CAD modeling. Creates all our original product designs. Expert in Fusion 360 and Blender.</p>
          </ScrollReveal>
          <ScrollReveal className="team-card" delay={3}>
            <div className="team-card__avatar"><HiOutlineUserCircle size={56} aria-hidden="true" /></div>
            <h4>Rohan Patel</h4>
            <span className="team-card__role">Production Head</span>
            <p style={{ color: 'var(--clr-text-secondary)' }}>Oversees our print farm of 8 machines. Quality control perfectionist. Knows every printer setting by heart. The reason our prints are flawless.</p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
