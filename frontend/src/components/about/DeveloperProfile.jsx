import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
export default function DeveloperProfile() {
  const {
    ref,
    inView
  } = useInView({
    threshold: 0.3,
    triggerOnce: true
  });
  const contacts = [{
    icon: '📱',
    label: 'Phone',
    value: '+91 8400029870',
    href: 'tel:+918400029870'
  }, {
    icon: '✉️',
    label: 'Email',
    value: 'somendraprataps966@gmail.com',
    href: 'mailto:somendraprataps966@gmail.com'
  }, {
    icon: '💼',
    label: 'LinkedIn',
    value: 'linkedin.com/in/somendra-pratap-singh',
    href: 'https://www.linkedin.com/in/somendra-pratap-singh-923842344'
  }];
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };
  return <section ref={ref} className="developer-section">
      <div className="container">
        <motion.div variants={containerVariants} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="developer-profile">
          <motion.div variants={itemVariants} className="profile-avatar">
            <div className="avatar-placeholder">
              <span className="avatar-initials">SP</span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="profile-info">
            <h2>Somendra Pratap Singh</h2>
            <p className="profile-role">AI & Full Stack Developer</p>
            <p className="profile-location">📍 Lucknow, Uttar Pradesh, India</p>
            <p className="profile-bio">
              Passionate Computer Science student specializing in Artificial Intelligence & Data Science with a strong interest in building practical AI-powered applications that solve real-world problems through modern web technologies.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="profile-contacts">
            {contacts.map((contact, idx) => <motion.a key={idx} href={contact.href} target="_blank" rel="noopener noreferrer" className="contact-item card-glassmorphic" whileHover={{
            y: -3,
            transition: {
              duration: 0.2
            }
          }}>
                <span className="contact-icon">{contact.icon}</span>
                <div className="contact-details">
                  <span className="contact-label">{contact.label}</span>
                  <span className="contact-value">{contact.value}</span>
                </div>
              </motion.a>)}
          </motion.div>
        </motion.div>
      </div>
    </section>;
}