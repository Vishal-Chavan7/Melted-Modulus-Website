import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaXTwitter, FaYoutube, FaDiscord } from 'react-icons/fa6';
import { HiOutlineArrowRight } from 'react-icons/hi2';

export const Footer = () => {
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer__main">
          <div className="footer__brand">
            <Link to="/" className="footer__brand-logo">
              <img src="/assets/images/logo.png" alt="MeltedModulus" />
              <span className="footer__brand-name"><span>Melted</span>Modulus</span>
            </Link>
            <p className="footer__brand-desc">Where ideas take shape — one layer at a time. Premium 3D-printed products and custom prints crafted with precision and passion.</p>
            <div className="footer__social">
              <a href="#" className="footer__social-link" aria-label="Instagram"><FaInstagram aria-hidden="true" /></a>
              <a href="#" className="footer__social-link" aria-label="Twitter / X"><FaXTwitter aria-hidden="true" /></a>
              <a href="#" className="footer__social-link" aria-label="YouTube"><FaYoutube aria-hidden="true" /></a>
              <a href="#" className="footer__social-link" aria-label="Discord"><FaDiscord aria-hidden="true" /></a>
            </div>
          </div>

          <div className="footer__column">
            <h4>Shop</h4>
            <div className="footer__links">
              <Link to="/products" className="footer__link"><HiOutlineArrowRight className="footer__link-icon" aria-hidden="true" />All Products</Link>
              <Link to="/custom" className="footer__link"><HiOutlineArrowRight className="footer__link-icon" aria-hidden="true" />Custom Prints</Link>
            </div>
          </div>

          <div className="footer__column">
            <h4>Company</h4>
            <div className="footer__links">
              <Link to="/about" className="footer__link"><HiOutlineArrowRight className="footer__link-icon" aria-hidden="true" />About Us</Link>
              <a href="#" className="footer__link"><HiOutlineArrowRight className="footer__link-icon" aria-hidden="true" />Legals</a>
            </div>
          </div>

          <div className="footer__column">
            <h4>Support</h4>
            <div className="footer__links">
              <a href="#" className="footer__link"><HiOutlineArrowRight className="footer__link-icon" aria-hidden="true" />Help Center</a>
              <a href="#" className="footer__link"><HiOutlineArrowRight className="footer__link-icon" aria-hidden="true" />Shipping Info</a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">© 2026 MeltedModulus. All rights reserved.</p>

          <div className="footer__legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Shipping Policy</a>
          </div>

          <div className="footer__payment">
            <span className="footer__payment-label">We accept:</span>
            <div className="footer__payment-icon">VISA</div>
            <div className="footer__payment-icon">MC</div>
            <div className="footer__payment-icon">UPI</div>
            <div className="footer__payment-icon">GPay</div>
          </div>
        </div>
      </div>
    </footer>
  );
};
