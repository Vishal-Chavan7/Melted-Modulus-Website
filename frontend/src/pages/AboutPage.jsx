import React from 'react';
import { PageHero } from '../components/common/PageHero';
import { OurStory } from '../components/about/OurStory';
import { Values } from '../components/about/Values';
import { Equipment } from '../components/about/Equipment';
import { Team } from '../components/about/Team';
import { CtaBanner } from '../components/common/CtaBanner';

export const AboutPage = () => {
  return (
    <>
      <PageHero 
        label="Our Story"
        titlePrefix="About"
        titleHighlight="MeltedModulus"
        description="Where ideas take shape — one layer at a time. We're a team of makers, designers, and engineers on a mission to democratize 3D printing."
      />

      <OurStory />
      <Values />
      <Equipment />
      <Team />

      <CtaBanner 
        titlePrefix="Want to Work"
        titleHighlight="With Us"
        titleSuffix="?"
        description="Whether you need custom prints or want to join our team — we'd love to hear from you."
        primaryAction={{ label: "Get a Custom Quote", to: "/custom" }}
        secondaryAction={{ label: "Contact Us", to: "/contact" }}
      />
    </>
  );
};
