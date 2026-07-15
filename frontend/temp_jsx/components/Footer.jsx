import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import './Footer.css';
const Footer = () => {
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
    const [feedbackError, setFeedbackError] = useState('');
    const [newsletterError, setNewsletterError] = useState('');
    const feedbackForm = useForm({
        defaultValues: {
            name: '',
            email: '',
            rating: 5,
            message: ''
        }
    });
    const newsletterForm = useForm({
        defaultValues: {
            email: ''
        }
    });
    const onFeedbackSubmit = async (data) => {
        setFeedbackError('');
        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error('Failed to submit feedback');
            }
            setFeedbackSubmitted(true);
            feedbackForm.reset();
            setTimeout(() => setFeedbackSubmitted(false), 4000);
        }
        catch (error) {
            setFeedbackError('Failed to submit feedback. Please try again.');
        }
    };
    const onNewsletterSubmit = async (data) => {
        setNewsletterError('');
        try {
            const response = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to subscribe');
            }
            setNewsletterSubmitted(true);
            newsletterForm.reset();
            setTimeout(() => setNewsletterSubmitted(false), 4000);
        }
        catch (error) {
            setNewsletterError(error.message || 'Failed to subscribe. Please try again.');
        }
    };
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4 }
        }
    };
    return (<motion.footer className="footer-container" initial="hidden" whileInView="visible" variants={containerVariants} viewport={{ once: true, margin: '-100px' }}>
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

        {/* Section 6: Feedback */}
        <motion.div className="footer-section feedback-section" variants={itemVariants}>
          <h3>Feedback</h3>
          <form onSubmit={feedbackForm.handleSubmit(onFeedbackSubmit)} className="feedback-form">
            {feedbackError && <div className="feedback-error">{feedbackError}</div>}
            {feedbackSubmitted && (<div className="feedback-success">Thank you for your feedback!</div>)}

            <input type="text" placeholder="Your name" {...feedbackForm.register('name', { required: 'Name is required' })} className="feedback-input"/>
            {feedbackForm.formState.errors.name && (<span className="error-text">{feedbackForm.formState.errors.name.message}</span>)}

            <input type="email" placeholder="Your email" {...feedbackForm.register('email', { required: 'Email is required' })} className="feedback-input"/>
            {feedbackForm.formState.errors.email && (<span className="error-text">{feedbackForm.formState.errors.email.message}</span>)}

            <select {...feedbackForm.register('rating')} className="feedback-input">
              <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
              <option value="4">⭐⭐⭐⭐ Good</option>
              <option value="3">⭐⭐⭐ Average</option>
              <option value="2">⭐⭐ Poor</option>
              <option value="1">⭐ Very Poor</option>
            </select>

            <textarea placeholder="Your message (10-2000 characters)" {...feedbackForm.register('message', { required: 'Message is required' })} className="feedback-textarea" maxLength={2000}/>
            {feedbackForm.formState.errors.message && (<span className="error-text">{feedbackForm.formState.errors.message.message}</span>)}

            <div className="char-counter">
              {feedbackForm.watch('message')?.length || 0} / 2000
            </div>

            <button type="submit" className="feedback-submit" disabled={feedbackForm.formState.isSubmitting}>
              {feedbackForm.formState.isSubmitting ? 'Submitting...' : 'Send Feedback'}
            </button>
          </form>
        </motion.div>

        {/* Newsletter */}
        <motion.div className="footer-section newsletter-section" variants={itemVariants}>
          <h3>Newsletter</h3>
          <p>Subscribe to get the latest updates and insights</p>
          <form onSubmit={newsletterForm.handleSubmit(onNewsletterSubmit)} className="newsletter-form">
            {newsletterError && <div className="newsletter-error">{newsletterError}</div>}
            {newsletterSubmitted && (<div className="newsletter-success">Successfully subscribed!</div>)}

            <input type="email" placeholder="Enter your email" {...newsletterForm.register('email', { required: 'Email is required' })} className="newsletter-input"/>
            {newsletterForm.formState.errors.email && (<span className="error-text">{newsletterForm.formState.errors.email.message}</span>)}

            <button type="submit" className="newsletter-submit" disabled={newsletterForm.formState.isSubmitting}>
              {newsletterForm.formState.isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
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
    </motion.footer>);
};
export default Footer;
