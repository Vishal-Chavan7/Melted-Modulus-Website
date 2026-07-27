import React from 'react';
import { SectionHeader } from '../components/common/SectionHeader';

export const ShippingInfoPage = () => {
  return (
    <div className="page-transition">
      <div className="page-hero">
        <div className="container">
          <SectionHeader 
            label="Logistics"
            title="Shipping "
            titleHighlight="Information"
            description="Details about our delivery process, rates, and estimated shipping times."
          />
        </div>
      </div>
      <section className="container" style={{ padding: 'var(--space-12) var(--space-4)', minHeight: '40vh' }}>
        <p style={{ color: 'var(--clr-text-secondary)', textAlign: 'center' }}>
          This page is under construction. Shipping information will be available shortly.
        </p>
      </section>
    </div>
  );
};
