import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
export default function Features() {
    const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
    const features = [
        { icon: '🤖', title: 'AI Expense Analysis', desc: 'Intelligent categorization and analysis of spending patterns' },
        { icon: '💼', title: 'Smart Budget Planning', desc: 'AI-powered budget recommendations based on your habits' },
        { icon: '❤️', title: 'Financial Health Score', desc: 'Real-time scoring of your financial well-being' },
        { icon: '🎯', title: 'Goal Tracking', desc: 'Set and monitor progress toward financial goals' },
        { icon: '📈', title: 'Expense Prediction', desc: 'ML-based forecasting of future expenses' },
        { icon: '💰', title: 'Savings Forecast', desc: 'AI projections for potential savings growth' },
        { icon: '📊', title: 'Interactive Dashboard', desc: 'Beautiful, real-time financial visualizations' },
        { icon: '🔐', title: 'Secure Authentication', desc: 'Enterprise-grade JWT security and encryption' },
        { icon: '⚡', title: 'Real-Time Analytics', desc: 'Instant updates and live financial metrics' },
        { icon: '📱', title: 'Responsive Design', desc: 'Seamless experience across all devices' },
        { icon: '📸', title: 'Receipt Scanner', desc: 'OCR receipt scanning (Coming Soon)' },
        { icon: '🎙️', title: 'Voice Entry', desc: 'Voice-based expense logging (Coming Soon)' }
    ];
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };
    return (<section ref={ref} className="features-section">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: -30 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }} transition={{ duration: 0.6 }} className="section-header">
          <h2>Why FinPilot AI</h2>
          <p>Powerful features designed for modern financial management</p>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="features-grid">
          {features.map((feature, idx) => (<motion.div key={idx} variants={itemVariants} className="feature-card card-glassmorphic" whileHover={{ y: -5, transition: { duration: 0.3 } }}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </motion.div>))}
        </motion.div>
      </div>
    </section>);
}
