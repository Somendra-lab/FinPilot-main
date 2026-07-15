import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import './Feedback.css';

export default function Feedback() {
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

  const onFeedbackSubmit = async data => {
    setFeedbackError('');
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }
      setFeedbackSubmitted(true);
      feedbackForm.reset();
      setTimeout(() => setFeedbackSubmitted(false), 4000);
    } catch (error) {
      setFeedbackError('Failed to submit feedback. Please try again.');
    }
  };

  const onNewsletterSubmit = async data => {
    setNewsletterError('');
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to subscribe');
      }
      setNewsletterSubmitted(true);
      newsletterForm.reset();
      setTimeout(() => setNewsletterSubmitted(false), 4000);
    } catch (error) {
      setNewsletterError(error.message || 'Failed to subscribe. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="feedback-page-container">
        <div className="feedback-header-section">
          <h1>We Value Your Feedback</h1>
          <p>Help us improve FinPilot AI by sharing your experience, reporting bugs, or subscribing to our newsletter for updates.</p>
        </div>

        <div className="feedback-content-grid">
          {/* Feedback Form Card */}
          <div className="feedback-card-premium">
            <div className="card-header-icon">💬</div>
            <h2>Share Your Experience</h2>
            <p className="card-description">Let us know what you think, what features you'd like to see, or any issues you encountered.</p>

            <form onSubmit={feedbackForm.handleSubmit(onFeedbackSubmit)} className="premium-form">
              {feedbackError && <div className="feedback-alert error">{feedbackError}</div>}
              {feedbackSubmitted && <div className="feedback-alert success">🎉 Thank you for your feedback!</div>}

              <div className="form-group-premium">
                <label htmlFor="feedback-name">Your Name</label>
                <input
                  id="feedback-name"
                  type="text"
                  placeholder="e.g., John Doe"
                  {...feedbackForm.register('name', { required: 'Name is required' })}
                  className="premium-input"
                />
                {feedbackForm.formState.errors.name && (
                  <span className="error-hint">{feedbackForm.formState.errors.name.message}</span>
                )}
              </div>

              <div className="form-group-premium">
                <label htmlFor="feedback-email">Your Email Address</label>
                <input
                  id="feedback-email"
                  type="email"
                  placeholder="e.g., john@example.com"
                  {...feedbackForm.register('email', { required: 'Email is required' })}
                  className="premium-input"
                />
                {feedbackForm.formState.errors.email && (
                  <span className="error-hint">{feedbackForm.formState.errors.email.message}</span>
                )}
              </div>

              <div className="form-group-premium">
                <label htmlFor="feedback-rating">How would you rate us?</label>
                <select id="feedback-rating" {...feedbackForm.register('rating')} className="premium-select">
                  <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                  <option value="4">⭐⭐⭐⭐ Good</option>
                  <option value="3">⭐⭐⭐ Average</option>
                  <option value="2">⭐⭐ Poor</option>
                  <option value="1">⭐ Very Poor</option>
                </select>
              </div>

              <div className="form-group-premium">
                <div className="label-with-counter">
                  <label htmlFor="feedback-message">Your Message</label>
                  <span className="char-count">
                    {feedbackForm.watch('message')?.length || 0} / 2000
                  </span>
                </div>
                <textarea
                  id="feedback-message"
                  placeholder="Tell us what you think..."
                  {...feedbackForm.register('message', { required: 'Message is required' })}
                  className="premium-textarea"
                  maxLength={2000}
                />
                {feedbackForm.formState.errors.message && (
                  <span className="error-hint">{feedbackForm.formState.errors.message.message}</span>
                )}
              </div>

              <button type="submit" className="premium-btn submit" disabled={feedbackForm.formState.isSubmitting}>
                {feedbackForm.formState.isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          </div>

          {/* Newsletter Card */}
          <div className="feedback-card-premium newsletter-card">
            <div className="card-header-icon">✉️</div>
            <h2>Subscribe to Newsletter</h2>
            <p className="card-description">Stay updated with the latest AI insights, finance management tips, and new feature releases.</p>

            <form onSubmit={newsletterForm.handleSubmit(onNewsletterSubmit)} className="premium-form">
              {newsletterError && <div className="feedback-alert error">{newsletterError}</div>}
              {newsletterSubmitted && <div className="feedback-alert success">✨ Successfully subscribed to our newsletter!</div>}

              <div className="form-group-premium">
                <label htmlFor="newsletter-email">Email Address</label>
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="e.g., mail@example.com"
                  {...newsletterForm.register('email', { required: 'Email is required' })}
                  className="premium-input"
                />
                {newsletterForm.formState.errors.email && (
                  <span className="error-hint">{newsletterForm.formState.errors.email.message}</span>
                )}
              </div>

              <button type="submit" className="premium-btn newsletter-btn" disabled={newsletterForm.formState.isSubmitting}>
                {newsletterForm.formState.isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
              </button>
            </form>

            <div className="newsletter-benefits">
              <h3>What you'll receive:</h3>
              <ul>
                <li>🚀 New feature notifications and update logs.</li>
                <li>💡 Intelligent tips on boosting your savings rate.</li>
                <li>📊 Interactive reports on spending habits.</li>
                <li>🔒 Security updates and data safety best practices.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
