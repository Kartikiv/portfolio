import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Database, Plus, X } from 'lucide-react';
import Section from './Section';
import EditableText from './EditableText';
import { useEdit } from '../context/EditContext';

const ICON_MAP = { Brain, Database };

const ProjectCard = ({ item, itemIdx, onRemove }) => {
  const { getSection, updateField, editMode } = useEdit();
  const IconComp = ICON_MAP[item.icon] || Brain;

  const onChangeField = (field, val) => {
    const data = getSection('projects');
    updateField('projects', { ...data, items: data.items.map((it, i) => i === itemIdx ? { ...it, [field]: val } : it) });
  };

  const onChangeHighlight = (hIdx, val) => {
    const data = getSection('projects');
    updateField('projects', {
      ...data,
      items: data.items.map((it, i) => i === itemIdx
        ? { ...it, highlights: it.highlights.map((h, hi) => hi === hIdx ? val : h) }
        : it),
    });
  };

  const addHighlight = () => {
    const data = getSection('projects');
    updateField('projects', {
      ...data,
      items: data.items.map((it, i) => i === itemIdx
        ? { ...it, highlights: [...it.highlights, 'Describe this highlight.'] }
        : it),
    });
  };

  const removeHighlight = (hIdx) => {
    const data = getSection('projects');
    updateField('projects', {
      ...data,
      items: data.items.map((it, i) => i === itemIdx
        ? { ...it, highlights: it.highlights.filter((_, hi) => hi !== hIdx) }
        : it),
    });
  };

  return (
    <motion.div className="project-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.5, delay: itemIdx * 0.1 }}
      whileHover={{ y: -8 }}
    >
      {editMode && (
        <button className="edit-remove-item-btn" onClick={onRemove} title="Remove project">
          <X size={14} /> Remove Project
        </button>
      )}
      <div className="project-header">
        <div className="project-icon"><IconComp /></div>
        <h3 className="project-title">
          <EditableText value={item.title} onChange={(v) => onChangeField('title', v)} multiline />
        </h3>
        <div className="project-tech">
          <EditableText value={item.tech} onChange={(v) => onChangeField('tech', v)} />
        </div>
      </div>
      <div className="project-body">
        <p className="project-description">
          <EditableText tag="span" value={item.description} onChange={(v) => onChangeField('description', v)} />
        </p>
        <ul className="project-highlights">
          {item.highlights.map((h, hi) => (
            <motion.li key={hi} className="timeline-achievement-row"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.4, delay: hi * 0.05 }}
            >
              <EditableText value={h} onChange={(v) => onChangeHighlight(hi, v)} multiline />
              {editMode && (
                <button className="edit-remove-inline-btn" onClick={() => removeHighlight(hi)} title="Remove bullet">
                  <X size={12} />
                </button>
              )}
            </motion.li>
          ))}
          {editMode && (
            <li className="edit-add-row">
              <button className="edit-add-btn" onClick={addHighlight}>
                <Plus size={13} /> Add bullet
              </button>
            </li>
          )}
        </ul>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const { getSection, updateField, editMode, loading } = useEdit();
  const data = getSection('projects');

  if (loading || !data) return <Section label="INNOVATIONS" title="Featured Projects" id="projects" />;

  const addProject = () => {
    updateField('projects', {
      ...data,
      items: [...data.items, {
        icon: 'Brain',
        title: 'Project Title',
        tech: 'Tech Stack',
        description: 'Brief project description.',
        highlights: ['Describe a key highlight here.'],
      }],
    });
  };

  const removeProject = (idx) => {
    updateField('projects', { ...data, items: data.items.filter((_, i) => i !== idx) });
  };

  return (
    <Section label="INNOVATIONS" title="Featured Projects" id="projects">
      <div className="projects-grid">
        {data.items.map((item, i) => (
          <ProjectCard key={i} item={item} itemIdx={i} onRemove={() => removeProject(i)} />
        ))}
      </div>
      {editMode && (
        <div className="edit-add-section-row">
          <button className="edit-add-btn edit-add-section-btn" onClick={addProject}>
            <Plus size={14} /> Add Project
          </button>
        </div>
      )}
    </Section>
  );
};

export default Projects;
