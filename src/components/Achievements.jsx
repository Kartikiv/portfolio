// ==================================================
// File: src/components/Achievements.jsx
// ==================================================
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Section from './Section';

const StatCard = ({ number, label, delay }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            className="stat-card"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, delay }}
        >
            <div className="stat-number">{number}</div>
            <div className="stat-label">{label}</div>
        </motion.div>
    );
};

const Achievements = () => {
    return (
        <Section label="HIGHLIGHTS" title="Key Achievements">
            <div className="stats-grid">
                <StatCard number="Research Publication" label="RANLP 2025 Research" delay={0.1} />
                <StatCard number="3x AWS" label="Certified Professional" delay={0.2} />
                <StatCard number="4.0 GPA" label="Masters Program" delay={0.3} />
            </div>
        </Section>
    );
};

export default Achievements;

