import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
export default function MissionVision() {
    const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };
    const itemVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
    };
    return (<section ref={ref} className="mission-vision">
      <div className="container">
        <motion.div variants={containerVariants} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="mission-vision-grid">
          <motion.div variants={itemVariants} className="mission-card card-glassmorphic">
            <div className="card-icon">🎯</div>
            <h2>Our Mission</h2>
            <p>
              Our mission is to make personal finance simple, intelligent, and accessible for everyone by combining modern technology with AI-driven financial insights. FinPilot AI empowers users to understand their spending habits, build healthier financial routines, and confidently achieve their financial goals.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="vision-card card-glassmorphic">
            <div className="card-icon">🚀</div>
            <h2>Our Vision</h2>
            <p>
              To become one of the world's most trusted AI-powered personal finance platforms, enabling millions of people to take control of their financial future through intelligent automation and actionable insights.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>);
}
