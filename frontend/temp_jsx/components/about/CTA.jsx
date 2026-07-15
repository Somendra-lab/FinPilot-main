import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
export default function CTA() {
    const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });
    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8 }
        }
    };
    const buttonVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: (i) => ({
            opacity: 1,
            scale: 1,
            transition: { delay: i * 0.1, duration: 0.5 }
        })
    };
    return (<section ref={ref} className="cta-section">
      <div className="cta-background">
        <div className="cta-gradient"></div>
      </div>

      <div className="container cta-content">
        <motion.div variants={containerVariants} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="cta-inner">
          <h2>Start Your Financial Journey Today</h2>
          <p>Take control of your finances with intelligent AI-powered insights and smart financial planning.</p>

          <div className="cta-buttons">
            <motion.a href="/signup" className="btn btn-primary" custom={0} variants={buttonVariants} initial="hidden" animate={inView ? 'visible' : 'hidden'} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Register Now
            </motion.a>
            <motion.a href="/login" className="btn btn-secondary" custom={1} variants={buttonVariants} initial="hidden" animate={inView ? 'visible' : 'hidden'} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Login
            </motion.a>
            <motion.a href="/" className="btn btn-outline" custom={2} variants={buttonVariants} initial="hidden" animate={inView ? 'visible' : 'hidden'} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Explore Dashboard
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>);
}
