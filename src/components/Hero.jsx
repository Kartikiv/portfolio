import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Mail, ChevronDown } from 'lucide-react';

const Hero = () => {
  return (
    <section className="hero" id="hero">

      <div className="hero-content">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="hero-label">
          SOFTWARE ENGINEER
        </motion.div>
        <motion.h1 className="hero-title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
          Sai Kartik Ivaturi
        </motion.h1>
        <motion.h2 className="hero-subtitle" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}>
          Building Scalable Systems & Intelligent Solutions
        </motion.h2>
        <motion.p className="hero-description" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}>
            Software Engineer with 3+ years of industry experience and a clear focus on delivering systems that scale in real-world environments. Drawn to
            hard problems at the intersection of systems and machine learning, with a focus on building adaptive, resilient platforms. Past experience includes
            building and maintaining large scale distributed systems that support entire Australian healthcare and enabling data processing for machine
            learning.
        </motion.p>
        <motion.div className="hero-cta" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }}>
          <a href="#projects" className="btn btn-primary">View My Projects <ExternalLink size={18} /></a>
            <a href="#experience" className="btn btn-primary">View My Experience <ExternalLink size={18} /></a>
          <a href="#contact" className="btn btn-secondary">Get In Touch <Mail size={18} /></a>
        </motion.div>
      </div>
      <motion.div className="scroll-indicator" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.5 }}>
        <span>SCROLL</span>
        <ChevronDown size={20} />
      </motion.div>
    </section>
  );
};

export default Hero;
