import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';
export default function Highlights() {
  const {
    ref,
    inView
  } = useInView({
    threshold: 0.2,
    triggerOnce: true
  });
  const [counters, setCounters] = useState({
    features: 0,
    apis: 0,
    responsive: 0,
    secure: 0
  });
  useEffect(() => {
    if (!inView) return;
    const intervals = [setInterval(() => setCounters(c => ({
      ...c,
      features: Math.min(c.features + 1, 10)
    })), 50), setInterval(() => setCounters(c => ({
      ...c,
      apis: Math.min(c.apis + 1, 20)
    })), 25), setInterval(() => setCounters(c => ({
      ...c,
      responsive: Math.min(c.responsive + 1, 100)
    })), 15), setInterval(() => setCounters(c => ({
      ...c,
      secure: Math.min(c.secure + 1, 99)
    })), 15)];
    return () => intervals.forEach(clearInterval);
  }, [inView]);
  const highlights = [{
    number: counters.features,
    suffix: '+',
    label: 'Core Features'
  }, {
    number: counters.apis,
    suffix: '+',
    label: 'REST APIs'
  }, {
    number: counters.responsive,
    suffix: '%',
    label: 'Responsive'
  }, {
    number: counters.secure,
    suffix: '%',
    label: 'Secure Auth'
  }];
  return <section ref={ref} className="highlights">
      <div className="container">
        <motion.div initial={{
        opacity: 0,
        y: -30
      }} animate={inView ? {
        opacity: 1,
        y: 0
      } : {
        opacity: 0,
        y: -30
      }} transition={{
        duration: 0.6
      }} className="section-header">
          <h2>Project Highlights</h2>
        </motion.div>

        <div className="highlights-grid">
          {highlights.map((item, idx) => <motion.div key={idx} initial={{
          opacity: 0,
          scale: 0.8
        }} animate={inView ? {
          opacity: 1,
          scale: 1
        } : {
          opacity: 0,
          scale: 0.8
        }} transition={{
          duration: 0.6,
          delay: idx * 0.1
        }} className="highlight-card card-glassmorphic">
              <div className="highlight-number">
                {item.number}{item.suffix}
              </div>
              <div className="highlight-label">{item.label}</div>
            </motion.div>)}
        </div>
      </div>
    </section>;
}