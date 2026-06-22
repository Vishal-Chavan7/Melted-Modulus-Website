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
      question: "What file formats do you accept?",
      answer: "We accept STL, OBJ, 3MF, and STEP files. If you don't have a 3D model file, no worries — just describe your idea with reference images and our design team can create the model for you (design fee may apply)."
    },
    {
      question: "How much does custom printing cost?",
      answer: "Pricing depends on the size, material, complexity, and quantity. Simple items start at ₹300-500, while larger or complex pieces can range from ₹2,000-10,000+. We always provide a detailed quote before proceeding."
    },
    {
      question: "How long does it take?",
      answer: "Standard orders are completed in 3-7 business days. Rush orders (1-2 days) are available at an additional cost. Design work (if needed) adds 2-3 days. We'll provide an exact timeline with your quote."
    },
    {
      question: "What materials can I choose from?",
      answer: "We offer PLA (biodegradable, vibrant colors), PETG (strong, chemical resistant), and TPU (flexible, elastic). Our team can recommend the best material for your specific use case."
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

      <section>
        <div className="container">
          <SectionHeader 
            label="Get Started"
            title="Request a "
            titleHighlight="Custom Quote"
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
