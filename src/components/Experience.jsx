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
                    period="Jun 2021 – Jul 2024"
                    location="Hyderabad, India"
                    achievements={[
                        'Built a 0→1 large-scale distributed ingestion pipeline processing 1M+ daily events from healthcare' +
                        ' telemetry sensors across multiple hospitals across the globe.',
                        'Designed a plug-and-play architecture using Kafka, Flink, Spark, Cassandra and data lakes like Iceberg to support complex event ' +
                        'processing for use cases ranging from real-time diagnostics to early risk prediction',
                        'Improved processing throughput by 30% by implementing cross–data center replication strategies, optimizing concurrency controls, and reducing shared ' +
                        'resource contention, resulting in more resilient and scalable data pipelines.',
                        'Built and instrumented real-time telemetry dashboards exposing ingestion lag and pipeline health, reducing MTTD and accelerating on-call incident resolution.',
                        'Deployed and scaled cloud-native services on AWS with 99.9% availability, enabling elastic load handling, fault recovery, and zero-downtime rollouts'
                    ]}
                    delay={0.1}
                />
                <TimelineItem
                    title="Software Development Engineer Intern"
                    company="Amazon "
                    period="Feb 2020 - Feb 2021"
                    location="Hyderabad, India"
                    achievements={[
                        'Reduced downstream model failures by 35% by designing and deploying custom validation pipelines that enforced schema constraints, anomaly detection, and automated data quality checks across 500K+ weekly records, ' +
                        'preventing corrupt inputs from reaching training and inference systems.',
                        'Cut annotation turnaround time by 25% and reduced rework by standardizing data schemas, introducing validation tooling,' +
                        ' and eliminating ambiguous formats, enabling 10+ engineers to produce consistent, machine-ready datasets on the first pass.',
                        'Reduced false positives by 18% by conducting root-cause analysis on model failures, surfacing recurring edge cases,' +
                        ' and hardening labeling guidelines and preprocessing pipelines to eliminate systematic misclassifications.',
                        'Increased annotation throughput by 40% while maintaining 99% consistency by automating quality checks, enforcing rule-based validations, and ' +
                        'streamlining workflow steps to eliminate manual review bottlenecks in high-volume data pipelines.'
                    ]}
                    delay={0.3}
                />
            </div>
        </Section>
    );
};

export default Experience;
