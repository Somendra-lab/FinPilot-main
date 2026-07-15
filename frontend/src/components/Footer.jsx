import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Footer.css';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 10
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  return <motion.footer className="footer-container" initial="hidden" whileInView="visible" variants={containerVariants} viewport={{
    once: true,
    margin: '-100px'
  }}>
      <div className="footer-content">
        {/* Section 1: Brand */}
        <motion.div className="footer-section brand-section" variants={itemVariants}>
          <div className="brand-header">
            <h2 className="brand-title">FinPilot AI</h2>
            <p className="brand-subtitle">AI Powered Personal Finance Analyzer & Smart Financial Manager</p>
          </div>
          <p className="brand-description">
            Helping individuals understand, manage, and improve their financial future using intelligent analytics
            and modern AI-powered insights.
          </p>
        </motion.div>

        {/* Section 2: Quick Links */}
        <motion.div className="footer-section links-section" variants={itemVariants}>
          <h3>Quick Links</h3>
          <nav className="footer-nav">
            <Link to="/" className="footer-link">Dashboard</Link>
            <Link to="/transactions" className="footer-link">Transactions</Link>
            <Link to="/budgets" className="footer-link">Budgets</Link>
            <Link to="/goals" className="footer-link">Goals</Link>
            <Link to="/analytics" className="footer-link">Analytics</Link>
            <Link to="/feedback" className="footer-link">Feedback</Link>
            <button onClick={scrollToTop} className="footer-link back-to-top">
              Back to Top
            </button>
          </nav>
        </motion.div>

        {/* Section 3: Developer */}
        <motion.div className="footer-section developer-section" variants={itemVariants}>
          <h3>Developer</h3>
          <div className="developer-card">
            <div className="developer-info">
              <p className="dev-role">AI & Full Stack Developer</p>
              <p className="dev-name">Somendra Pratap Singh</p>
              <p className="dev-location">📍 Lucknow, Uttar Pradesh, India</p>
            </div>
          </div>
        </motion.div>

        {/* Section 4: Contact Information */}
        <motion.div className="footer-section contact-section" variants={itemVariants}>
          <h3>Contact</h3>
          <div className="contact-info">
            <a href="tel:+918400029870" className="contact-link">
              <span className="contact-icon">📞</span>
              <span>+91 8400029870</span>
            </a>
            <a href="mailto:somendraprataps966@gmail.com" className="contact-link">
              <span className="contact-icon">✉️</span>
              <span>somendraprataps966@gmail.com</span>
            </a>
            <a href="https://www.linkedin.com/in/somendra-pratap-singh-923842344" target="_blank" rel="noopener noreferrer" className="contact-link">
              <span className="contact-icon">💼</span>
              <span>LinkedIn Profile</span>
            </a>
          </div>
        </motion.div>

        {/* Section 5: Social Media */}
        <motion.div className="footer-section social-section" variants={itemVariants}>
          <h3>Connect</h3>
          <div className="social-links">
            <a href="https://www.linkedin.com/in/somendra-pratap-singh-923842344" target="_blank" rel="noopener noreferrer" className="social-icon linkedin" title="LinkedIn">
              in
            </a>
            <a href="#" className="social-icon github" title="GitHub (Coming Soon)">
              gh
            </a>
            <a href="#" className="social-icon portfolio" title="Portfolio (Coming Soon)">
              web
            </a>
            <a href="#" className="social-icon instagram" title="Instagram (Coming Soon)">
              📷
            </a>
            <a href="mailto:somendraprataps966@gmail.com" className="social-icon email" title="Email">
              ✉️
            </a>
            <a href="tel:+918400029870" className="social-icon phone" title="Phone">
              📱
            </a>
          </div>
        </motion.div>
      </div>

      {/* Copyright & Legal */}
      <motion.div className="footer-bottom" variants={itemVariants}>
        <div className="footer-copyright">
          <p>&copy; {new Date().getFullYear()} FinPilot AI. All Rights Reserved.</p>
          <p>
            Designed & Developed by <strong>Somendra Pratap Singh</strong>
          </p>
        </div>

        <div className="footer-legal">
          <Link to="/about" className="legal-link">About</Link>
          <Link to="/privacy" className="legal-link">Privacy Policy</Link>
          <Link to="/terms" className="legal-link">Terms of Service</Link>
          <Link to="/cookies" className="legal-link">Cookie Policy</Link>
        </div>

        <div className="footer-meta">
          <span className="meta-item">Version 1.0.0</span>
          <span className="meta-item">Environment: {import.meta.env.MODE || 'development'}</span>
        </div>
      </motion.div>
    </motion.footer>;
};

export default Footer;