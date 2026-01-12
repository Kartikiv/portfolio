
// ==================================================
// File: src/components/Projects.jsx
// ==================================================
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Brain, Database } from 'lucide-react';
import Section from './Section';

const ProjectCard = ({ icon, title, tech, description, highlights, delay }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            className="project-card"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay }}
        >
            <div className="project-header">
                <div className="project-icon">{icon}</div>
                <h3 className="project-title">{title}</h3>
                <div className="project-tech">{tech}</div>
            </div>
            <div className="project-body">
                <p className="project-description">{description}</p>
                <ul className="project-highlights">
                    {highlights.map((highlight, idx) => (
                        <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                            transition={{ duration: 0.4, delay: delay + (idx * 0.1) }}
                        >
                            {highlight}
                        </motion.li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
};

const Projects = () => {
    return (
        <Section label="INNOVATIONS" title="Featured Projects" id="projects">
            <div className="projects-grid">
                <ProjectCard
                    icon={<Brain />}
                    title="Multi-Agent RL Code Debugger"
                    tech="Python, Reinforcement Learning, NLP, PPO"
                    description="RANLP 2025 Publication"
                    highlights={[
                        'Designed AI-powered debugging platform combining multi-agent RL, NLP, and long-term memory',
                        'Achieved ~92% precision for syntax errors and ~78% for logic errors using PPO-based agents',
                        'Reduced manual debugging steps by ~41% through ranked candidate code fixes',
                        'Implemented feedback-driven learning loops improving accuracy by ~18%'
                    ]}
                    delay={0.1}
                />
                <ProjectCard
                    icon={<Database />}
                    title="Crop Yield Prediction System"
                    tech="Data Analytics, Machine Learning"
                    description="Agriculture optimization platform"
                    highlights={[
                        'Integrated advanced data analytics for accurate crop yield prediction',
                        'Enabled data-driven decision making for farmers',
                        'Optimized prediction models for maximum accuracy'
                    ]}
                    delay={0.2}
                />
            </div>
        </Section>
    );
};

export default Projects;

