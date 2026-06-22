import React, { useState } from 'react';
import { HiOutlinePlus, HiOutlineMinus } from 'react-icons/hi2';
import { ScrollReveal } from './ScrollReveal';

export const FaqAccordion = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <ScrollReveal className="faq-list">
      {faqs.map((faq, index) => (
        <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
          <button className="faq-question" onClick={() => toggleAccordion(index)}>
            {faq.question}
            <span className="faq-question__icon" aria-hidden="true">
              {openIndex === index ? <HiOutlineMinus /> : <HiOutlinePlus />}
            </span>
          </button>
          <div className="faq-answer">
            <p>{faq.answer}</p>
          </div>
        </div>
      ))}
    </ScrollReveal>
  );
};
