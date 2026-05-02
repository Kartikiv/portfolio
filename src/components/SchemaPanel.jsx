import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ChevronRight } from 'lucide-react';

const SCHEMAS = {
  experience: {
    label: 'Experience',
    description: 'List of jobs. Each job needs these exact keys:',
    structure: {
      items: [
        {
          title: 'Job Title',
          company: 'Company Name',
          period: 'Jun 2021 – Jul 2024',
          location: 'City, Country',
          achievements: [
            'Describe what you built or achieved.',
            'Use as many bullets as needed.',
          ],
        },
      ],
    },
    notes: [
      'Use "title" — not "role" or "position"',
      'Use "achievements" — not "updates" or "bullets"',
      'Top level must be an object with "items", not a plain array',
    ],
  },

  skills: {
    label: 'Skills',
    description: 'Skill categories, each with a list of skill names:',
    structure: {
      categories: [
        {
          icon: 'Code2',
          title: 'Languages',
          skills: ['Java', 'Python', 'TypeScript'],
        },
      ],
    },
    notes: [
      '"icon" must be one of: Code2, Network, Database, Cloud, Brain, Cpu',
      '"skills" is a plain array of strings',
    ],
  },

  projects: {
    label: 'Projects',
    description: 'Portfolio projects:',
    structure: {
      items: [
        {
          icon: 'Brain',
          title: 'Project Title',
          tech: 'Python, React, PostgreSQL',
          description: 'One-line summary shown as a tag',
          highlights: [
            'What you built and why it matters.',
            'Impact or scale — numbers help.',
          ],
        },
      ],
    },
    notes: [
      '"icon" must be one of: Brain, Database, Cloud, Code2, Network, Cpu',
      'Use "highlights" — not "bullets" or "achievements"',
    ],
  },

  certifications: {
    label: 'Certifications',
    description: 'Certifications and awards:',
    structure: {
      items: [
        { icon: 'Award', text: 'AWS Certified Solutions Architect – Associate' },
        { icon: 'Cloud', text: 'Architecting with Google Compute Engine' },
      ],
    },
    notes: [
      '"icon" can be: Award, Cloud, Terminal, FileCode, Shield, Star',
      '"text" is the full display string for the certification',
    ],
  },
};

function SchemaEntry({ sectionKey, schema }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="schema-entry">
      <button className="schema-entry-header" onClick={() => setOpen((v) => !v)}>
        <span className="schema-entry-label">{schema.label}</span>
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="schema-entry-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="schema-desc">{schema.description}</p>

            <pre className="schema-code">
              {JSON.stringify(schema.structure, null, 2)}
            </pre>

            {schema.notes?.length > 0 && (
              <ul className="schema-notes">
                {schema.notes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SchemaPanel({ onClose }) {
  return (
    <motion.div
      className="schema-panel-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="schema-panel"
        initial={{ x: 340 }}
        animate={{ x: 0 }}
        exit={{ x: 340 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="schema-panel-header">
          <span className="schema-panel-title">Section Structure Reference</span>
          <button className="schema-panel-close" onClick={onClose}><X size={16} /></button>
        </div>

        <p className="schema-panel-intro">
          Use these structures when editing sections directly via the API.
          The server will reject saves that don't match.
        </p>

        <div className="schema-entries">
          {Object.entries(SCHEMAS).map(([key, schema]) => (
            <SchemaEntry key={key} sectionKey={key} schema={schema} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
