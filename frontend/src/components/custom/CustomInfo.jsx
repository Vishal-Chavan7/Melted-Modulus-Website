import React from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineCube,
  HiOutlineBolt,
  HiOutlineChatBubbleLeftRight,
} from 'react-icons/hi2';
import { ScrollReveal } from '../common/ScrollReveal';

const InfoHeading = ({ icon: Icon, children }) => (
  <h4 className="custom-info-card__heading">
    <Icon className="ri-icon" aria-hidden="true" />
    {children}
  </h4>
);

export const CustomInfo = () => {
  return (
    <ScrollReveal className="custom-info" delay={2}>
      <div className="custom-info-card">
        <InfoHeading icon={HiOutlineCube}>What We Can Print</InfoHeading>
        <ul>
          <li>Prototypes & functional parts</li>
          <li>Cosplay props & armor</li>
          <li>Personalized gifts & decor</li>
          <li>Replacement parts & brackets</li>
          <li>Miniatures & figurines</li>
          <li>Custom phone cases & accessories</li>
          <li>Architectural models</li>
        </ul>
      </div>
      <div className="custom-info-card">
        <InfoHeading icon={HiOutlineBolt}>Quick Facts</InfoHeading>
        <ul>
          <li>Free consultation & quote</li>
          <li>Turnaround: 3-7 business days</li>
          <li>Max print size: 256×256×256 mm</li>
          <li>Layer accuracy: 0.1mm – 0.3mm</li>
          <li>3 materials available</li>
          <li>Post-processing included</li>
        </ul>
      </div>
      <div className="custom-info-card">
        <InfoHeading icon={HiOutlineChatBubbleLeftRight}>Need Help?</InfoHeading>
        <p style={{ fontSize: 'var(--fs-small)', color: 'var(--clr-text-secondary)', marginBottom: 'var(--space-3)' }}>
          Not sure what you need? Our team is happy to help you figure it out.
        </p>
        <Link to="/contact" className="btn btn-ghost btn-sm">
          Contact Support →
        </Link>
      </div>
    </ScrollReveal>
  );
};
