/**
 * Seed script — run once to create the table and populate initial content.
 * Usage: cd server && node seed.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const db = require('./db');

const sections = {
    hero: {
        label: 'SOFTWARE ENGINEER',
        title: 'Sai Kartik Ivaturi',
        subtitle: 'Building Scalable Systems & Intelligent Solutions',
        description:
            'Software Engineer with 3+ years of industry experience and a clear focus on delivering systems that scale in real-world environments. Drawn to hard problems at the intersection of systems and machine learning, with a focus on building adaptive, resilient platforms. Past experience includes building and maintaining large scale distributed systems that support entire Australian healthcare and enabling data processing for machine learning.',
    },

    skills: {
        categories: [
            {
                icon: 'Code2',
                title: 'Languages',
                skills: ['Java', 'Python', 'C++', 'JavaScript', 'TypeScript', 'Rust', 'Scala', 'Go'],
            },
            {
                icon: 'Network',
                title: 'Backend & Systems',
                skills: ['Distributed Systems', 'Microservices', 'Event-Driven', 'RESTful APIs', 'Spring Boot', 'Hibernate'],
            },
            {
                icon: 'Database',
                title: 'Data & Storage',
                skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'MariaDB', 'Query Optimization', 'Indexing'],
            },
            {
                icon: 'Cloud',
                title: 'Cloud & DevOps',
                skills: ['AWS (EC2, S3, Lambda)', 'Cloud-Native', 'CI/CD', 'Auto-Scaling', 'Load Balancing'],
            },
            {
                icon: 'Brain',
                title: 'AI & Automation',
                skills: ['Reinforcement Learning', 'NLP', 'PPO', 'Human-in-Loop', 'Decision Automation'],
            },
            {
                icon: 'Cpu',
                title: 'Frontend & Tools',
                skills: ['React', 'Angular', 'API Integration', 'Observability', 'Performance Optimization'],
            },
        ],
    },

    experience: {
        items: [
            {
                title: 'Software Engineer',
                company: 'Drucare',
                period: 'Jun 2021 – Jul 2024',
                location: 'Hyderabad, India',
                achievements: [
                    'Built a 0→1 large-scale distributed ingestion pipeline processing 1M+ daily events from healthcare telemetry sensors across multiple hospitals across the globe.',
                    'Designed a plug-and-play architecture using Kafka, Flink, Spark, Cassandra and data lakes like Iceberg to support complex event processing for use cases ranging from real-time diagnostics to early risk prediction',
                    'Improved processing throughput by 30% by implementing cross–data center replication strategies, optimizing concurrency controls, and reducing shared resource contention, resulting in more resilient and scalable data pipelines.',
                    'Built and instrumented real-time telemetry dashboards exposing ingestion lag and pipeline health, reducing MTTD and accelerating on-call incident resolution.',
                    'Deployed and scaled cloud-native services on AWS with 99.9% availability, enabling elastic load handling, fault recovery, and zero-downtime rollouts',
                ],
            },
            {
                title: 'Software Development Engineer',
                company: 'AtRite Pvt Ltd',
                period: 'Feb 2020 - Feb 2021',
                location: 'Hyderabad, India',
                achievements: [
                    'Reduced downstream model failures by 35% by designing and deploying custom validation pipelines that enforced schema constraints, anomaly detection, and automated data quality checks across 500K+ weekly records, preventing corrupt inputs from reaching training and inference systems.',
                    'Cut annotation turnaround time by 25% and reduced rework by standardizing data schemas, introducing validation tooling, and eliminating ambiguous formats, enabling 10+ engineers to produce consistent, machine-ready datasets on the first pass.',
                    'Reduced false positives by 18% by conducting root-cause analysis on model failures, surfacing recurring edge cases, and hardening labeling guidelines and preprocessing pipelines to eliminate systematic misclassifications.',
                    'Increased annotation throughput by 40% while maintaining 99% consistency by automating quality checks, enforcing rule-based validations, and streamlining workflow steps to eliminate manual review bottlenecks in high-volume data pipelines.',
                ],
            },
        ],
    },

    projects: {
        items: [
            {
                icon: 'Brain',
                title: 'Multi-Agent Reinforcement Learning for Interactive Code Debugging with Human Feedback and Memory',
                tech: 'Python, Reinforcement Learning, NLP, PPO',
                description: 'RANLP 2025 Publication',
                highlights: [
                    'Designed and deployed a production-grade multi-agent reinforcement learning system that autonomously detects, prioritizes, and remediates code defects using transformer-based code embeddings and a vector-indexed long-term memory store.',
                    'Implemented Proximal Policy Optimization (PPO)–based agents that achieved 92% precision in syntax error detection and 78% precision in logical error detection, outperforming baseline static analysis tools and rule-based approaches',
                    'Engineered a human-in-the-loop feedback pipeline that continuously retrains agents from user corrections, improving fix accuracy by 18% over time',
                    'Built a vector-backed persistent memory module that captured failure patterns, fixes, and contextual embeddings, preventing repeated errors and reducing recurrence by 33%.',
                    'Designed the platform as a modular, plug-and-play architecture, enabling new agents, heuristics, and debugging strategies to be integrated without retraining the entire system.',
                    'Eliminated ~$10K in third-party annual licensing costs, by becoming the default code assistant within the CS Departments Fab Lab, supporting coursework and projects across multiple programming and fabrication languages.',
                ],
            },
            {
                icon: 'Database',
                title: 'WebRTC Peer-to-Peer Real-Time Messaging and File Transfer System',
                tech: 'Distributed Systems',
                description: 'Messaging platform',
                highlights: [
                    'Built a real-time P2P communication app for college students supporting chat, video/audio calls, and collaboration, designed to scale to billions of concurrent users',
                    'Engineered a decentralized file sharing system where each peer acts as a storage node, enabling real-time sharing of notes, assignments, and large study materials without central storage',
                    'Integrated an AI assistant that translates messages, finds citations, and summarizes lecture notes and PDFs in real time to accelerate learning and cross-language collaboration',
                ],
            },
        ],
    },

    certifications: {
        items: [
            { icon: 'Award', text: 'RANLP 2025 Publication - Reinforcement Learning Systems' },
            { icon: 'Cloud', text: 'AWS Certified Solutions Architect – Associate' },
            { icon: 'Cloud', text: 'AWS Certified Developer – Associate' },
            { icon: 'Cloud', text: 'Architecting with Google Compute Engine' },
            { icon: 'Terminal', text: 'ServiceNow Certified System Administrator (CSA)' },
            { icon: 'FileCode', text: 'ServiceNow Certified Application Developer (CAD)' },
        ],
    },

    education: {
        items: [
            {
                title: 'Master of Science in Computer Science',
                institution: 'University of Illinois Chicago',
                period: 'Aug 2024 – May 2026',
                location: 'Chicago, IL',
                achievements: [
                    'Specialization in Systems and Machine Learning',
                    'Graduate Teaching Assistant — Data Structures & Algorithms',
                    'Research focus on multi-agent reinforcement learning systems',
                ],
            },
            {
                title: 'Bachelor of Technology in Computer Science',
                institution: 'Jawaharlal Nehru Technological University',
                period: 'Aug 2017 – May 2021',
                location: 'Hyderabad, India',
                achievements: [
                    'First Class with Distinction',
                    'Coursework: Operating Systems, Distributed Systems, Database Management, Computer Networks',
                ],
            },
        ],
    },

    contact: {
        email: 'saikartik.iv@gmail.com',
        linkedin: 'https://linkedin.com/in/sai-kartik-ivaturi-958809183/',
        github: 'https://github.com/kartikiv',
        text: "I'm currently seeking software engineering opportunities where I can contribute to building scalable, high-performance systems. Whether you have a project in mind, want to discuss technology, or just want to connect, I'd love to hear from you.",
    },
};

async function seed() {
    try {
        // Create table
        await db.query(`
            CREATE TABLE IF NOT EXISTS portfolio_content (
                                                             section     VARCHAR(100) PRIMARY KEY,
                data        JSONB        NOT NULL,
                updated_at  TIMESTAMPTZ  DEFAULT NOW()
                )
        `);
        console.log('✓ Table ready');

        // Insert sections (skip if already present)
        for (const [section, data] of Object.entries(sections)) {
            await db.query(
                `INSERT INTO portfolio_content (section, data)
                 VALUES ($1, $2)
                     ON CONFLICT (section) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
                [section, JSON.stringify(data)]
            );
            console.log(`✓ Seeded: ${section}`);
        }

        console.log('\nDone! Run the server with: node index.js');
        process.exit(0);
    } catch (err) {
        console.error('Seed failed:', err.message);
        process.exit(1);
    }
}

seed();
