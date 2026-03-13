import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ExternalLink, Mail, ChevronDown } from 'lucide-react';
import { useEdit } from '../context/EditContext';
import EditableText from './EditableText';
import { trackEvent } from '../lib/api';

function useTypewriter(texts, speed = 80) {
  const [displayed, setDisplayed] = useState('');
  const [textIdx, setTextIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const pauseRef = useRef(false);

  useEffect(() => {
    if (!texts?.length || pauseRef.current) return;
    const current = texts[textIdx];
    const t = setTimeout(() => {
      if (!deleting) {
        setDisplayed(current.slice(0, charIdx + 1));
        if (charIdx + 1 === current.length) {
          pauseRef.current = true;
          setTimeout(() => { pauseRef.current = false; setDeleting(true); }, 2200);
        } else setCharIdx(c => c + 1);
      } else {
        setDisplayed(current.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) {
          setDeleting(false);
          setTextIdx(i => (i + 1) % texts.length);
          setCharIdx(0);
        } else setCharIdx(c => c - 1);
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(t);
  }, [charIdx, deleting, textIdx, texts, speed]);

  return displayed;
}

function MagneticButton({ children, className, href, onClick }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });
  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.25);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.25);
  };
  return (
    <motion.a href={href} className={className} style={{ x: springX, y: springY }}
      onMouseMove={handleMove} onMouseLeave={() => { x.set(0); y.set(0); }} onClick={onClick}>
      {children}
    </motion.a>
  );
}

const TYPEWRITER_PHRASES = [
  'Building Scalable Systems & Intelligent Solutions',
  'Distributed Systems Engineer',
  'ML Infrastructure Architect',
  'Open to New Opportunities',
];

const MARQUEE_TECHS = [
  { slug: 'openjdk', name: 'Java' },
  { slug: 'python', name: 'Python' },
  { slug: 'springboot', name: 'Spring Boot' },
  { slug: 'typescript', name: 'TypeScript' },
  { slug: 'postgresql', name: 'PostgreSQL' },
  { slug: 'docker', name: 'Docker' },
  { slug: 'kubernetes', name: 'Kubernetes' },
  { slug: 'terraform', name: 'Terraform' },
  { slug: 'mongodb', name: 'MongoDB' },
  { slug: 'react', name: 'React' },
  { slug: 'go', name: 'Go' },
  { slug: 'rust', name: 'Rust' },
  { slug: 'pytorch', name: 'PyTorch' },
  { slug: 'githubactions', name: 'CI/CD' },
  { slug: 'apachekafka', name: 'Kafka' },
  { slug: 'grafana', name: 'Grafana' },
  { slug: 'elasticsearch', name: 'Elasticsearch' },
  { slug: 'terraform', name: 'Terraform' },
  { slug: 'nginx', name: 'Nginx' },
  { slug: 'postman', name: 'Postman' },
];

function TechMarquee() {
  const doubled = [...MARQUEE_TECHS, ...MARQUEE_TECHS];
  return (
    <div className="tech-marquee-section">
      <div className="tech-marquee-track">
        {doubled.map((tech, i) => (
          <TechMarqueeItem key={i} tech={tech} />
        ))}
      </div>
    </div>
  );
}

function TechMarqueeItem({ tech }) {
  const [err, setErr] = React.useState(false);
  return (
    <span className="tech-marquee-item">
      {!err && (
        <img
          src={`https://cdn.simpleicons.org/${tech.slug}`}
          alt=""
          className="tech-marquee-logo"
          onError={() => setErr(true)}
        />
      )}
      {tech.name}
    </span>
  );
}

const Hero = () => {
  const { editMode, getSection, updateField, loading, isLoggedIn } = useEdit();
  const data = getSection('hero');
  const typewritten = useTypewriter(TYPEWRITER_PHRASES);

  if (loading || !data) return <section className="hero" id="hero" />;

  const onChange = (field) => (val) => updateField('hero', { ...data, [field]: val });

  return (
    <section className="hero" id="hero">
      <div className="hero-content">
        <motion.div className="hero-label" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
          <EditableText value={data.label} onChange={onChange('label')} />
        </motion.div>
        <motion.h1 className="hero-title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
          <EditableText value={data.title} onChange={onChange('title')} />
        </motion.h1>
        <motion.h2 className="hero-subtitle" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}>
          {editMode
            ? <EditableText value={data.subtitle} onChange={onChange('subtitle')} />
            : <>{typewritten}<span className="typewriter-cursor">|</span></>}
        </motion.h2>
        <motion.p className="hero-description" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}>
          <EditableText tag="span" value={data.description} onChange={onChange('description')} multiline />
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.75 }}>
          <TechMarquee />
        </motion.div>
        <motion.div className="hero-cta" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.9 }}>
          <MagneticButton href="#projects" className="btn btn-primary" onClick={() => !isLoggedIn && trackEvent('cta_click', 'view_projects')}>View My Projects <ExternalLink size={18} /></MagneticButton>
          <MagneticButton href="#experience" className="btn btn-primary" onClick={() => !isLoggedIn && trackEvent('cta_click', 'view_experience')}>View My Experience <ExternalLink size={18} /></MagneticButton>
          <MagneticButton href="#contact" className="btn btn-secondary" onClick={() => !isLoggedIn && trackEvent('cta_click', 'get_in_touch')}>Get In Touch <Mail size={18} /></MagneticButton>
        </motion.div>
        <motion.div className="hero-stats" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.1 }}>
          {[
            { num: '3+', label: 'Years Experience' },
            { num: '10+', label: 'Projects Shipped' },
            { num: '5+', label: 'Tech Stacks' },
            { num: '2', label: 'Countries' },
          ].map((s) => (
            <div key={s.label} className="hero-stat">
              <span className="hero-stat-num">{s.num}</span>
              <span className="hero-stat-label">{s.label}</span>
            </div>
          ))}
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
