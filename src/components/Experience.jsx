// ==================================================
// File: src/components/Experience.jsx
// ==================================================
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Section from './Section';

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

const Experience = () => {
    return (
        <Section label="CAREER" title="Professional Experience" id="experience">
            <div className="timeline">
                <TimelineItem
                    title="Software Engineer"
                    company="Drucare"
                    period="Jul 2021 – Jul 2024"
                    location="Hyderabad, India"
                    achievements={[
                        'Architected and scaled distributed, event-driven backend systems for health-data telemetry ingestion, processing ~1M+ events/day',
                        'Improved p95 API latency by ~30% through redesigning critical request paths and optimizing concurrency control',
                        'Designed fault-tolerant architectures using asynchronous messaging, preventing cascading failures during outages',
                        'Built Angular-based frontend applications enabling real-time visualization of telemetry data',
                        'Maintained cloud-native services on AWS with 99.9% availability and horizontal scalability'
                    ]}
                    delay={0.1}
                />
                <TimelineItem
                    title="Software Engineer Intern"
                    company="Safertek"
                    period="Feb 2021 - Jul 2021"
                    location="Hyderabad, India"
                    achievements={[
                        'Worked with databases including MariaDB, Oracle, SQL Server, and MySQL',
                        'Operated in Agile TDD environment using Git, Jira, Jenkins, and Maven',
                        'Implemented software testing processes for components used by 90% of the population'
                    ]}
                    delay={0.2}
                />
                <TimelineItem
                    title="Software Development Engineer"
                    company="AtRite Pvt Ltd"
                    period="Feb 2020 - Feb 2021"
                    location="Hyderabad, India"
                    achievements={[
                        'Designed and trained multi-layer neural networks using gradient descent optimization',
                        'Achieved 98% error detection accuracy in machine learning models',
                        'Led Gmail analysis project using Python and Pandas'
                    ]}
                    delay={0.3}
                />
            </div>
        </Section>
    );
};

export default Experience;
