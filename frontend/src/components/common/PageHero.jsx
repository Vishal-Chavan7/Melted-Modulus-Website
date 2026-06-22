import React from 'react';

export const PageHero = ({ label, titlePrefix, titleHighlight, titleSuffix, description }) => {
  return (
    <section className="page-hero">
      <div className="container">
        {label && <span className="section-label">{label}</span>}
        <h1>
          {titlePrefix && `${titlePrefix} `}
          <span className="text-gradient">{titleHighlight}</span>
          {titleSuffix && ` ${titleSuffix}`}
        </h1>
        {description && <p>{description}</p>}
      </div>
    </section>
  );
};
