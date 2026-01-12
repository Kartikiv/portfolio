// ==================================================
// File: src/components/Education.jsx
// ==================================================
import React from 'react';
import Section from './Section';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const TimelineItem = ({ title, company, period, location, achievements, delay }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            className="timeline-item"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6, delay }}
        >
            <div className="timeline-marker" />
            <div className="timeline-content">
                <div className="timeline-header">
                    <div>
                        <h3 className="timeline-title">{title}</h3>
                        <div className="timeline-company">{company}</div>
                    </div>
                    <div className="timeline-period">{period}</div>
                </div>
                {location && <div style={{ color: 'var(--color-text-muted)', marginBottom: '1rem', fontSize: '0.95rem' }}>{location}</div>}
                <ul className="timeline-achievements">
                    {achievements.map((achievement, idx) => (
                        <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                            transition={{ duration: 0.4, delay: delay + (idx * 0.1) }}
                        >
                            {achievement}
                        </motion.li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
};

const Education = () => {
    return (
        <Section label="EDUCATION" title="Academic Background">
            <div className="timeline">
                <TimelineItem
                    title="Master of Science in Computer Science"
                    company="California State University, Dominguez Hills"
                    period="Aug 2024 – May 2026"
                    location="USA"
                    achievements={['CGPA: 4.0/4.0', 'Focus: Operating Systems, Object-Oriented Design, UML Modeling']}
                    delay={0.1}
                />
                <TimelineItem
                    title="Bachelor of Technology in Computer Science"
                    company="Jawaharlal Nehru Technological University"
                    period="Jul 2017 – May 2021"
                    location="Hyderabad, India"
                    achievements={['CGPA: 8.0/10']}
                    delay={0.2}
                />
            </div>
        </Section>
    );
};

export default Education;
