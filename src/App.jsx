import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion, Reorder, useDragControls } from 'framer-motion';
import { GripHorizontal } from 'lucide-react';
import { EditProvider } from './context/EditContext';
import AdminBar from './components/AdminBar';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import Education from './components/Education';
import Contact from './components/Contact';
import Background from './components/Background';
import LoginPage from './components/LoginPage';
import ResumePage from './components/ResumePage';
import AnalyticsPage from './components/AnalyticsPage';
import FormatToolbar from './components/FormatToolbar';
import CustomSections from './components/CustomSections';
import { trackEvent } from './lib/api';
import { useEdit } from './context/EditContext';
import './App.css';

const TRACKED_SECTIONS = ['hero', 'skills', 'experience', 'projects', 'certifications', 'education', 'contact'];

const DEFAULT_ORDER = ['skills', 'experience', 'projects', 'certifications', 'education', 'customSections'];

const SECTION_COMPONENTS = {
  skills: <Skills />,
  experience: <Experience />,
  projects: <Projects />,
  certifications: <Certifications />,
  education: <Education />,
  customSections: <CustomSections />,
};

const SECTION_LABELS = {
  skills: 'Skills',
  experience: 'Experience',
  projects: 'Projects',
  certifications: 'Certifications',
  education: 'Education',
  customSections: 'Custom Sections',
};

function useAnalytics() {
  const { isLoggedIn } = useEdit();
  useEffect(() => {
    if (isLoggedIn || localStorage.getItem('portfolio_owner') === 'true') return;
    trackEvent('page_view', 'portfolio');

    const seen = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (entry.isIntersecting && id && !seen.has(id)) {
            seen.add(id);
            trackEvent('section_view', id);
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

/* Wraps one section slot with a drag handle in edit mode */
const SectionSlot = ({ sectionKey }) => {
  const { editMode } = useEdit();
  const controls = useDragControls();

  return (
    <Reorder.Item
      as="div"
      value={sectionKey}
      dragListener={false}
      dragControls={controls}
      style={{ position: 'relative' }}
    >
      {editMode && (
        <div
          className="section-reorder-handle"
          onPointerDown={(e) => { e.preventDefault(); controls.start(e); }}
          title={`Drag to reorder ${SECTION_LABELS[sectionKey]}`}
        >
          <GripHorizontal size={14} />
          <span>{SECTION_LABELS[sectionKey]}</span>
        </div>
      )}
      {SECTION_COMPONENTS[sectionKey]}
    </Reorder.Item>
  );
};

function Portfolio() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { getSection, updateField, editMode } = useEdit();
  useAnalytics();

  const sectionOrder = getSection('sectionOrder')?.order || DEFAULT_ORDER;

  const handleReorder = (newOrder) => {
    updateField('sectionOrder', { order: newOrder });
  };

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

      {editMode ? (
        <Reorder.Group
          as="div"
          axis="y"
          values={sectionOrder}
          onReorder={handleReorder}
          style={{ listStyle: 'none', padding: 0, margin: 0 }}
        >
          {sectionOrder.map((key) => (
            <SectionSlot key={key} sectionKey={key} />
          ))}
        </Reorder.Group>
      ) : (
        sectionOrder.map((key) => (
          <div key={key}>{SECTION_COMPONENTS[key]}</div>
        ))
      )}

      <Contact />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <EditProvider>
        <FormatToolbar />
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </EditProvider>
    </BrowserRouter>
  );
}

export default App;
