import React from 'react';
import { Link } from 'react-router';
import { PenTool, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <PenTool className="footer-icon" />
              <span className="footer-title">BlogSpace</span>
            </div>
            <p className="footer-description">
              Your destination for insightful articles on technology, design, business, and lifestyle.
              Join our community of readers and stay informed with the latest trends.
            </p>
            <div className="footer-socials">
              <Twitter className="social-icon" />
              <Facebook className="social-icon" />
              <Instagram className="social-icon" />
              <Linkedin className="social-icon" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-heading">Quick Links</h3>
            <div className="footer-links">
              <Link to="/" className="footer-link">Home</Link>
              <Link to="/categories" className="footer-link">Categories</Link>
              <Link to="/about" className="footer-link">About</Link>
              <Link to="/contact" className="footer-link">Contact</Link>
            </div>
          </div>

          {/* Categories */}
          <div className="footer-section">
            <h3 className="footer-heading">Categories</h3>
            <div className="footer-links">
              <Link to="/categories/technology" className="footer-link">Technology</Link>
              <Link to="/categories/design" className="footer-link">Design</Link>
              <Link to="/categories/business" className="footer-link">Business</Link>
              <Link to="/categories/lifestyle" className="footer-link">Lifestyle</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} BlogSpace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
