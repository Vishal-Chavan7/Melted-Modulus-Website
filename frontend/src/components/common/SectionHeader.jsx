import React from 'react';
import { ScrollReveal } from './ScrollReveal';

export const SectionHeader = ({ label, titleHighlight, title, description, titleFirst = false }) => {
  return (
    <ScrollReveal className="section-header">
      {label && <span className="section-label">{label}</span>}
      <h2>
        {titleFirst ? (
          <>
            {title} <span className="text-gradient">{titleHighlight}</span>
          </>
        ) : (
          <>
            <span className="text-gradient">{titleHighlight}</span> {title}
          </>
        )}
      </h2>
      {description && <p>{description}</p>}
    </ScrollReveal>
  );
};
