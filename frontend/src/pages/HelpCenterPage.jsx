import React from 'react';
import { SectionHeader } from '../components/common/SectionHeader';

export const HelpCenterPage = () => {
  return (
    <div className="page-transition">
      <div className="page-hero">
        <div className="container">
          <SectionHeader 
            label="Support"
            title="Help "
            titleHighlight="Center"
            description="Find answers to common questions and get support for your orders."
          />
        </div>
      </div>
      <section className="container" style={{ padding: 'var(--space-12) var(--space-4)', minHeight: '40vh' }}>
        <p style={{ color: 'var(--clr-text-secondary)', textAlign: 'center' }}>
          This page is under construction. Support resources will be available shortly.
        </p>
      </section>
    </div>
  );
};
