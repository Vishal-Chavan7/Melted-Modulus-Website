import React from 'react';
import { Link } from 'react-router-dom';
import { ScrollReveal } from './ScrollReveal';

export const CtaBanner = ({ titlePrefix, titleHighlight, titleSuffix, description, primaryAction, secondaryAction }) => {
  return (
    <ScrollReveal className="cta-banner">
      <div className="container">
        <h2>
          {titlePrefix && `${titlePrefix} `}
          <span className="text-gradient">{titleHighlight}</span>
          {titleSuffix && ` ${titleSuffix}`}
        </h2>
        {description && <p>{description}</p>}
        
        {secondaryAction ? (
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={primaryAction.to} className="btn btn-primary btn-lg">
              {primaryAction.label}
            </Link>
            <Link to={secondaryAction.to} className="btn btn-secondary btn-lg">
              {secondaryAction.label}
            </Link>
          </div>
        ) : (
          <Link to={primaryAction.to} className="btn btn-primary btn-lg">
            {primaryAction.label}
          </Link>
        )}
      </div>
    </ScrollReveal>
  );
};
