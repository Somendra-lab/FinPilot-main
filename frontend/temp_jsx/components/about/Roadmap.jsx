import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
export default function Roadmap() {
    const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
    const roadmapItems = [
        'AI Chat Financial Coach',
        'Bank Statement Import',
        'UPI Integration',
        'Investment Portfolio',
        'Mobile App',
        'OCR Receipt Scanner',
        'Voice Assistant',
        'Tax Planning',
        'Multi Currency',
        'Dark & Light Themes',
        'Export Reports',
        'Cloud Backup'
    ];
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
        }
    };
    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
    };
    return (<section ref={ref} className="roadmap-section">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: -30 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }} transition={{ duration: 0.6 }} className="section-header">
          <h2>Future Roadmap</h2>
          <p>Exciting features coming soon</p>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="roadmap-grid">
          {roadmapItems.map((item, idx) => (<motion.div key={idx} variants={itemVariants} className="roadmap-card card-glassmorphic" whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}>
              <div className="roadmap-icon">🚀</div>
              <span>{item}</span>
            </motion.div>))}
        </motion.div>
      </div>
    </section>);
}
