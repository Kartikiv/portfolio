// ==================================================
// File: src/components/Section.jsx
// ==================================================
import React from 'react';
import { motion } from 'framer-motion';

const Section = ({ label, title, children, id }) => {
    return (
        <motion.section
            className="section"
            id={id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.6 }}
        >
            <div className="section-header">
                <motion.div
                    className="section-label"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ duration: 0.5 }}
                >
                    {label}
                </motion.div>
                <motion.h2
                    className="section-title"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    {title}
                </motion.h2>
                <motion.div
                    className="section-divider"
                    initial={{ width: 0 }}
                    whileInView={{ width: 80 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                />
            </div>
            {children}
        </motion.section>
    );
};

export default Section;

