
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
                    title="Multi-Agent Reinforcement Learning for Interactive Code Debugging with Human Feedback and Memory"
                    tech="Python, Reinforcement Learning, NLP, PPO"
                    description="RANLP 2025 Publication"
                    highlights={[
                        'Designed and deployed a production-grade multi-agent reinforcement learning system that ' +
                        'autonomously detects, prioritizes, and remediates code defects using transformer-based code embeddings and a vector-indexed long-term memory store.',
                        'Implemented Proximal Policy Optimization (PPO)–based agents that achieved 92% precision in syntax error detection ' +
                        'and 78% precision in logical error detection, outperforming baseline static analysis tools and rule-based approaches',
                        'Engineered a human-in-the-loop feedback pipeline that continuously retrains agents from user corrections, improving fix accuracy by 18% over time',
                        'Built a vector-backed persistent memory module that captured failure patterns, fixes,' +
                        ' and contextual embeddings, preventing repeated errors and reducing recurrence by 33%.',
                        'Designed the platform as a modular, plug-and-play architecture, enabling new agents, heuristics, and debugging strategies to be integrated without' +
                        'retraining the entire system.',
                        'Eliminated ~$10K in third-party annual licensing costs, by becoming the default code assistant within the CS Departments Fab Lab, supporting' +
                        ' coursework and projects across multiple programming and fabrication languages.'
                    ]}
                    delay={0.1}
                />
                <ProjectCard
                    icon={<Database />}
                    title="WebRTC Peer-to-Peer Real-Time Messaging and File Transfer System"
                    tech="Distributed Systems"
                    description="Messaging platform"
                    highlights={[
                        ' Built a real-time P2P communication app for college students supporting chat, video/audio calls, and collaboration,' +
                        ' designed to scale to billions of concurrent users',
                        ' Engineered a decentralized file sharing system where each peer acts as a storage node, ' +
                        'enabling real-time sharing of notes, assignments, and large study materials without central storage',
                        'Integrated an AI assistant that translates messages, finds citations,' +
                        ' and summarizes lecture notes and PDFs in real time to accelerate learning and cross-language collaboration'
                    ]}
                    delay={0.2}
                />
            </div>
        </Section>
    );
};

export default Projects;

