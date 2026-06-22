import React from 'react';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa6';
import '../../styles/social.css';

export const SocialFloat = () => {
  return (
    <div className="social-float">
      <a 
        href="https://wa.me/917821930044" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="social-float__link whatsapp"
        aria-label="Contact us on WhatsApp"
      >
        <FaWhatsapp size={24} aria-hidden="true" />
      </a>
      <a 
        href="https://www.instagram.com/melted_modulus?igsh=cHJxNHMxc2k5MTls" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="social-float__link instagram"
        aria-label="Follow us on Instagram"
      >
        <FaInstagram size={24} aria-hidden="true" />
      </a>
    </div>
  );
};
