import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
export default function HowItWorks() {
    const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
    const steps = [
        { number: '1', title: 'Create Account', desc: 'Sign up securely with email and password' },
        { number: '2', title: 'Track Income', desc: 'Add your income sources and amounts' },
        { number: '3', title: 'Record Expenses', desc: 'Log daily expenses by category' },
        { number: '4', title: 'Analyze Health', desc: 'View AI-powered financial insights' },
        { number: '5', title: 'Get Recommendations', desc: 'Receive personalized financial advice' },
        { number: '6', title: 'Achieve Goals', desc: 'Monitor progress toward your targets' }
    ];
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };
    return (<section ref={ref} className="how-it-works">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: -30 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }} transition={{ duration: 0.6 }} className="section-header">
          <h2>How It Works</h2>
          <p>Simple steps to financial mastery</p>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="timeline">
          {steps.map((step, idx) => (<motion.div key={idx} variants={itemVariants} className="timeline-item">
              <div className="timeline-marker">
                <div className="marker-circle">{step.number}</div>
                {idx < steps.length - 1 && <div className="marker-line"></div>}
              </div>
              <div className="timeline-content card-glassmorphic">
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </motion.div>))}
        </motion.div>
      </div>
    </section>);
}
