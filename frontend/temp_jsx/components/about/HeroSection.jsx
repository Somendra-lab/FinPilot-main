import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
export default function HeroSection() {
    const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.1 }
        }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
    };
    const stats = [
        { number: '50K+', label: 'Users Managed' },
        { number: '5M+', label: 'Transactions Processed' },
        { number: '₹100Cr+', label: 'Savings Tracked' },
        { number: '1M+', label: 'AI Insights Generated' }
    ];
    return (<section ref={ref} className="hero-section">
      <div className="hero-background">
        <div className="gradient-mesh"></div>
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <div className="container hero-content">
        <motion.div variants={containerVariants} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="hero-text">
          <motion.h1 variants={itemVariants} className="hero-title">
            Manage Money Smarter with AI
          </motion.h1>

          <motion.p variants={itemVariants} className="hero-subtitle">
            FinPilot AI is an intelligent personal finance platform that helps users track spending, analyze financial habits, predict future expenses, and make smarter financial decisions through AI-powered insights.
          </motion.p>

          <motion.div variants={itemVariants} className="hero-buttons">
            <a href="/signup" className="btn btn-primary">Get Started</a>
            <a href="/login" className="btn btn-secondary">Explore Dashboard</a>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="hero-stats">
          {stats.map((stat, idx) => (<motion.div key={idx} className="stat-item" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>))}
        </motion.div>
      </div>
    </section>);
}
