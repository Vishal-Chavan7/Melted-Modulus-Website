import React from 'react';
import { PageHero } from '../components/common/PageHero';
import { CustomSteps } from '../components/custom/CustomSteps';
import { CustomForm } from '../components/custom/CustomForm';
import { CustomInfo } from '../components/custom/CustomInfo';
import { FaqAccordion } from '../components/common/FaqAccordion';
import { CtaBanner } from '../components/common/CtaBanner';
import { SectionHeader } from '../components/common/SectionHeader';

export const CustomPage = () => {
  const customFaqs = [
    {
      question: "What file formats or images do you accept?",
      answer: "You can share JPG, PNG, or other image files as reference for your custom print. If you have a 3D model file, we also accept STL, OBJ, and 3MF. Don't have a file? Just describe your idea and our team will take care of the design for you."
    },
    {
      question: "How long does it take?",
      answer: "Standard orders are completed in 3-7 business days. Rush orders (1-2 days) are available at an additional cost. Design work (if needed) adds 2-3 days. We'll provide an exact timeline with your quote."
    },
    {
      question: "Can I get a prototype before a bulk order?",
      answer: "Absolutely! We encourage prototyping. Order a single unit first, review the quality, request adjustments if needed, and then proceed with your bulk order. We offer 10% off bulk orders (10+ units)."
    }
  ];

  return (
    <>
      <PageHero 
        label="Made for You"
        titlePrefix="Custom"
        titleHighlight="3D Printing"
        description="Bring your ideas to life. Describe your concept, choose your specs — we'll make it real, layer by layer."
      />

      <CustomSteps />

      <section id="custom-form" style={{ paddingTop: 'var(--space-4)' }}>
        <div className="container">
          <SectionHeader 
            label="Get Started"
            title="Request a "
            titleHighlight="Custom Quote"
            titleFirst={true}
          />

          <div className="custom-form-section">
            <CustomForm />
            <CustomInfo />
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <SectionHeader 
            label="FAQ"
            title="Common "
            titleHighlight="Questions"
            titleFirst={true}
          />
          <FaqAccordion faqs={customFaqs} />
        </div>
      </section>

      <CtaBanner 
        titlePrefix="Ready to Start Your"
        titleHighlight="Project"
        titleSuffix="?"
        description="Have questions before submitting? Reach out to our team directly."
        primaryAction={{ label: "Contact Us →", to: "/contact" }}
      />
    </>
  );
};
