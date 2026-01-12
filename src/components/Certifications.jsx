// ==================================================
// File: src/components/Certifications.jsx
// ==================================================
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, Cloud, Terminal, FileCode } from 'lucide-react';
import Section from './Section';

const CertBadge = ({ icon, text, delay }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            className="cert-badge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, delay }}
        >
            <div className="cert-icon">{icon}</div>
            <div className="cert-text">{text}</div>
        </motion.div>
    );
};

const Certifications = () => {
    return (
        <Section label="CREDENTIALS" title="Certifications & Publications">
            <div className="certifications-grid">
                <CertBadge icon={<Award />} text="RANLP 2025 Publication - Reinforcement Learning Systems" delay={0.1} />
                <CertBadge icon={<Cloud />} text="AWS Certified Solutions Architect – Associate" delay={0.2} />
                <CertBadge icon={<Cloud />} text="AWS Certified Developer – Associate" delay={0.3} />
                <CertBadge icon={<Cloud />} text="Architecting with Google Compute Engine" delay={0.4} />
                <CertBadge icon={<Terminal />} text="ServiceNow Certified System Administrator (CSA)" delay={0.5} />
                <CertBadge icon={<FileCode />} text="ServiceNow Certified Application Developer (CAD)" delay={0.6} />
            </div>
        </Section>
    );
};

export default Certifications;

