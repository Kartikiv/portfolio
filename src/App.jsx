import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EditProvider } from './context/EditContext';
import AdminBar from './components/AdminBar';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Achievements from './components/Achievements';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import Education from './components/Education';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Background from './components/Background';
import LoginPage from './components/LoginPage';
import ResumePage from './components/ResumePage';
import { trackEvent } from './lib/api';
import { useEdit } from './context/EditContext';
import './App.css';

const TRACKED_SECTIONS = ['hero', 'skills', 'experience', 'projects', 'certifications', 'education', 'contact'];

function useAnalytics() {
  const { isLoggedIn } = useEdit();
  useEffect(() => {
    if (isLoggedIn) return;
    trackEvent('page_view', 'portfolio');

    const seen = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (entry.isIntersecting && id && !seen.has(id)) {
            seen.add(id);
            if (!isLoggedIn) trackEvent('section_view', id);
          }
        });
      },
      { threshold: 0.3 }
    );

    const timer = setTimeout(() => {
      TRACKED_SECTIONS.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }, 500);

    return () => { clearTimeout(timer); observer.disconnect(); };
  }, [isLoggedIn]);
}

function Portfolio() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useAnalytics();

  useEffect(() => {
    const handleMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="app">
      <Background />
      <AdminBar />
      <motion.div
        className="cursor-follower"
        animate={{ x: mousePosition.x - 200, y: mousePosition.y - 200 }}
        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
      />
      <Navigation />
      <Hero />
      <Skills />
      <Experience />
      <Projects />
      <Certifications />
      <Education />
      <Contact />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <EditProvider>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/resume" element={<ResumePage />} />
        </Routes>
      </EditProvider>
    </BrowserRouter>
  );
}

export default App;
