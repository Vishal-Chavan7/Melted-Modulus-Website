import React from 'react';
import { SectionHeader } from '../components/common/SectionHeader';

export const LegalPage = () => {
  return (
    <div className="page-transition">
      <div className="page-hero">
        <div className="container">
          <SectionHeader 
            label="Legal"
            title="Terms & "
            titleHighlight="Conditions"
            description="Important information about using our services and products."
          />
        </div>
      </div>
      <section className="container" style={{ padding: 'var(--space-12) var(--space-4)', minHeight: '40vh' }}>
        <p style={{ color: 'var(--clr-text-secondary)', textAlign: 'center' }}>
          This page is under construction. Full legal terms will be available shortly.
        </p>
      </section>
    </div>
  );
};
