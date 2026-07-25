import React from 'react';
import { PageHero } from '../components/common/PageHero';
import { ContactForm } from '../components/contact/ContactForm';
import { ContactInfo } from '../components/contact/ContactInfo';
import { FaqAccordion } from '../components/common/FaqAccordion';
import { SectionHeader } from '../components/common/SectionHeader';

export const ContactPage = () => {
  const contactFaqs = [
    {
      question: "What are your shipping options?",
      answer: "We ship pan-India via BlueDart and DTDC. Standard shipping (5-7 days) is free on orders above ₹2,000. Express shipping (2-3 days) is available at ₹199. We'll send you a tracking link once your order ships."
    },
    {
      question: "Do you offer bulk/wholesale pricing?",
      answer: "Yes! Orders of 10+ units qualify for 10% off. For 50+ units, we offer custom wholesale pricing. Contact us with your requirements and we'll prepare a quote tailored to your volume."
    },
    {
      question: "Can I track my order?",
      answer: "Absolutely. Once your order ships, you'll receive an email with a tracking number and link. You can also check order status by contacting us with your order ID via email or phone."
    }
  ];

  return (
    <>
      <PageHero 
        label="Reach Out"
        titlePrefix="Get in"
        titleHighlight="Touch"
        description="Have a question, feedback, or need a custom quote? We'd love to hear from you. Our team typically responds within 24 hours."
      />

      <section>
        <div className="container">
          <div className="contact-layout">
            <ContactForm />
            <ContactInfo />
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <SectionHeader 
            label="FAQ"
            title="Frequently Asked "
            titleHighlight="Questions"
          />
          <FaqAccordion faqs={contactFaqs} />
        </div>
      </section>
    </>
  );
};
