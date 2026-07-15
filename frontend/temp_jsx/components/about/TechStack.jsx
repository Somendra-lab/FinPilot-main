import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
export default function TechStack() {
    const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
    const techCategories = [
        {
            category: 'Frontend',
            technologies: ['React 19', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Chart.js']
        },
        {
            category: 'Backend',
            technologies: ['Node.js', 'Express.js', 'MongoDB Atlas', 'JWT', 'Mongoose']
        },
        {
            category: 'AI & Analytics',
            technologies: ['JavaScript Analytics', 'Statistical Analysis', 'Predictive Analytics', 'Data Visualization']
        }
    ];
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };
    const itemVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
    };
    return (<section ref={ref} className="tech-stack">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: -30 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }} transition={{ duration: 0.6 }} className="section-header">
          <h2>Technology Stack</h2>
          <p>Built with modern, scalable technologies</p>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="tech-grid">
          {techCategories.map((cat, idx) => (<motion.div key={idx} variants={itemVariants} className="tech-category card-glassmorphic" whileHover={{ y: -8, transition: { duration: 0.3 } }}>
              <h3>{cat.category}</h3>
              <ul className="tech-list">
                {cat.technologies.map((tech, i) => (<li key={i}>
                    <span className="tech-badge">{tech}</span>
                  </li>))}
              </ul>
            </motion.div>))}
        </motion.div>
      </div>
    </section>);
}
