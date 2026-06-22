import React, { useState } from 'react';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { ScrollReveal } from '../common/ScrollReveal';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="newsletter" id="newsletter">
      <div className="newsletter__bg"></div>
      <div className="container">
        <ScrollReveal className="newsletter__content">
          {!submitted ? (
            <>
              <span className="section-label">Stay Connected</span>
              <h2>Join the Maker <span className="text-gradient">Community</span></h2>
              <p>Get early access to new products, exclusive discounts, and 3D printing tips delivered weekly.</p>

              <form className="newsletter__form" id="newsletter-form" onSubmit={handleSubmit}>
                <div className="input-group">
                  <input 
                    type="email" 
                    className="form-input" 
                    id="newsletter-email" 
                    placeholder="Enter your email address" 
                    required 
                    aria-label="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary">Subscribe</button>
                </div>
              </form>

              <p className="newsletter__trust">10,000+ makers subscribed • No spam, unsubscribe anytime</p>
            </>
          ) : (
            <div className="newsletter__success show" id="newsletter-success">
              <div className="newsletter__success-icon">
                <HiOutlineSparkles size={40} aria-hidden="true" />
              </div>
              <h3>Welcome to the community!</h3>
              <p>Check your inbox for a confirmation email and your 10% off welcome code.</p>
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
};
