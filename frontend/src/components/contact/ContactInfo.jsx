import React from 'react';
import {
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineMapPin,
  HiOutlineClock,
} from 'react-icons/hi2';
import { FaInstagram, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import { ScrollReveal } from '../common/ScrollReveal';

export const ContactInfo = () => {
  return (
    <ScrollReveal className="contact-info" delay={2}>
      <div className="contact-info-card">
        <div className="contact-info-card__icon"><HiOutlineEnvelope size={24} aria-hidden="true" /></div>
        <div>
          <h4>Email</h4>
          <p><a href="mailto:hello@meltedmodulus.com">hello@meltedmodulus.com</a></p>
        </div>
      </div>
      <div className="contact-info-card">
        <div className="contact-info-card__icon"><HiOutlinePhone size={24} aria-hidden="true" /></div>
        <div>
          <h4>Phone</h4>
          <p><a href="tel:+919876543210">+91 98765 43210</a></p>
        </div>
      </div>
      <div className="contact-info-card">
        <div className="contact-info-card__icon"><HiOutlineMapPin size={24} aria-hidden="true" /></div>
        <div>
          <h4>Location</h4>
          <p style={{ color: 'var(--clr-text-secondary)' }}>Mumbai, Maharashtra, India</p>
        </div>
      </div>
      <div className="contact-info-card">
        <div className="contact-info-card__icon"><HiOutlineClock size={24} aria-hidden="true" /></div>
        <div>
          <h4>Business Hours</h4>
          <p style={{ color: 'var(--clr-text-secondary)' }}>Mon – Sat: 10:00 AM – 7:00 PM IST<br />Sunday: Closed</p>
        </div>
      </div>

      <div style={{ marginTop: 'var(--space-4)' }}>
        <h4 style={{ fontSize: 'var(--fs-small)', marginBottom: 'var(--space-4)', textTransform: 'uppercase', letterSpacing: 'var(--ls-wider)', fontFamily: 'var(--font-mono)' }}>Follow Us</h4>
        <div className="footer__social">
          <a href="#" className="footer__social-link" aria-label="Instagram">
            <FaInstagram aria-hidden="true" />
          </a>
          <a href="#" className="footer__social-link" aria-label="Twitter / X">
            <FaXTwitter aria-hidden="true" />
          </a>
          <a href="#" className="footer__social-link" aria-label="YouTube">
            <FaYoutube aria-hidden="true" />
          </a>
        </div>
      </div>
    </ScrollReveal>
  );
};
