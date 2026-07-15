import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
export default function FAQ() {
    const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
    const [openIndex, setOpenIndex] = useState(0);
    const faqs = [
        {
            question: 'Is my financial data secure?',
            answer: 'Yes, we use enterprise-grade JWT authentication, bcrypt password hashing, and encrypted data transmission. All data is stored securely on MongoDB Atlas with industry-standard security protocols.'
        },
        {
            question: 'What payment methods do you support?',
            answer: 'Currently, FinPilot AI is free to use with all core features accessible. We are integrating UPI and other payment methods for premium features in the future.'
        },
        {
            question: 'Can I export my financial data?',
            answer: 'Export functionality is coming soon. Currently, you can view all your data in the dashboard and take screenshots of reports.'
        },
        {
            question: 'How accurate are the AI predictions?',
            answer: 'Our AI uses statistical analysis and historical data patterns to generate insights. Accuracy improves as you add more transaction data to the system.'
        },
        {
            question: 'Is there a mobile app?',
            answer: 'A mobile app is on our roadmap and will be released soon. Currently, the platform is fully responsive and works great on mobile browsers.'
        },
        {
            question: 'Can I import bank statements?',
            answer: 'Bank statement import is coming soon. For now, you can manually add transactions or use our CSV import feature once available.'
        },
        {
            question: 'What is the Financial Health Score?',
            answer: 'Your Financial Health Score is calculated based on your income, expenses, savings rate, goal progress, and budget adherence. It gives you a 0-100 rating of your financial wellness.'
        },
        {
            question: 'Do you offer customer support?',
            answer: 'Yes! You can reach us via email at somendraprataps966@gmail.com or through the feedback form in our footer. We respond within 24 hours.'
        }
    ];
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };
    return (<section ref={ref} className="faq-section">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: -30 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }} transition={{ duration: 0.6 }} className="section-header">
          <h2>Frequently Asked Questions</h2>
          <p>Get answers to common questions</p>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="faq-container">
          {faqs.map((faq, idx) => (<motion.div key={idx} variants={itemVariants} className="faq-item card-glassmorphic">
              <button className="faq-question" onClick={() => setOpenIndex(openIndex === idx ? null : idx)} aria-expanded={openIndex === idx}>
                <span>{faq.question}</span>
                <motion.span animate={{ rotate: openIndex === idx ? 180 : 0 }} transition={{ duration: 0.3 }} className="faq-icon">
                  ▼
                </motion.span>
              </button>

              <AnimatePresence>
                {openIndex === idx && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="faq-answer">
                    <p>{faq.answer}</p>
                  </motion.div>)}
              </AnimatePresence>
            </motion.div>))}
        </motion.div>
      </div>
    </section>);
}
