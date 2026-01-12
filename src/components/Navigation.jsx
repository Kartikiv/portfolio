import React from 'react';
import { motion } from 'framer-motion';
import './styles.css';

const Navigation = () => {
  return (
    <motion.nav
      className="nav"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="logo">{'<Kartik Ivaturi />'}</div>
      <ul className="nav-links">
        <li><a href="#about" className="nav-link">ABOUT</a></li>
        <li><a href="#experience" className="nav-link">EXPERIENCE</a></li>
        <li><a href="#projects" className="nav-link">PROJECTS</a></li>
        <li><a href="#contact" className="nav-link">CONTACT</a></li>
      </ul>
    </motion.nav>
  );
};

export default Navigation;
