// ==================================================
// File: src/components/Skills.jsx
// ==================================================
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Code2, Network, Database, Cloud, Brain, Cpu } from 'lucide-react';
import Section from './Section';

const SkillCard = ({ icon, title, skills, delay }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            className="skill-card"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay }}
        >
            <div className="skill-icon">{icon}</div>
            <h3 className="skill-title">{title}</h3>
            <div className="skill-items">
                {skills.map((skill, idx) => (
                    <motion.span
                        key={idx}
                        className="skill-tag"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3, delay: delay + (idx * 0.05) }}
                    >
                        {skill}
                    </motion.span>
                ))}
            </div>
        </motion.div>
    );
};

const Skills = () => {
    return (
        <Section label="EXPERTISE" title="Technical Proficiency">
            <div className="skills-grid">
                <SkillCard
                    icon={<Code2 />}
                    title="Languages"
                    skills={['Java', 'Python', 'C++', 'JavaScript', 'TypeScript', 'Rust', 'Scala', 'Go']}
                    delay={0.1}
                />
                <SkillCard
                    icon={<Network />}
                    title="Backend & Systems"
                    skills={['Distributed Systems', 'Microservices', 'Event-Driven', 'RESTful APIs', 'Spring Boot', 'Hibernate']}
                    delay={0.2}
                />
                <SkillCard
                    icon={<Database />}
                    title="Data & Storage"
                    skills={['PostgreSQL', 'MySQL', 'MongoDB', 'MariaDB', 'Query Optimization', 'Indexing']}
                    delay={0.3}
                />
                <SkillCard
                    icon={<Cloud />}
                    title="Cloud & DevOps"
                    skills={['AWS (EC2, S3, Lambda)', 'Cloud-Native', 'CI/CD', 'Auto-Scaling', 'Load Balancing']}
                    delay={0.4}
                />
                <SkillCard
                    icon={<Brain />}
                    title="AI & Automation"
                    skills={['Reinforcement Learning', 'NLP', 'PPO', 'Human-in-Loop', 'Decision Automation']}
                    delay={0.5}
                />
                <SkillCard
                    icon={<Cpu />}
                    title="Frontend & Tools"
                    skills={['React', 'Angular', 'API Integration', 'Observability', 'Performance Optimization']}
                    delay={0.6}
                />
            </div>
        </Section>
    );
};

export default Skills;

