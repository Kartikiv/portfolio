import React from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import Section from './Section';
import EditableText from './EditableText';
import { useEdit } from '../context/EditContext';

const TimelineItem = ({ item, itemIdx, onRemove }) => {
  const { getSection, updateField, editMode } = useEdit();

  const onChangeField = (field, val) => {
    const data = getSection('experience');
    updateField('experience', { ...data, items: data.items.map((it, i) => i === itemIdx ? { ...it, [field]: val } : it) });
  };

  const onChangeAchievement = (achIdx, val) => {
    const data = getSection('experience');
    updateField('experience', {
      ...data,
      items: data.items.map((it, i) => i === itemIdx
        ? { ...it, achievements: it.achievements.map((a, ai) => ai === achIdx ? val : a) }
        : it),
    });
  };

  const addAchievement = () => {
    const data = getSection('experience');
    updateField('experience', {
      ...data,
      items: data.items.map((it, i) => i === itemIdx
        ? { ...it, achievements: [...it.achievements, 'Describe your achievement here.'] }
        : it),
    });
  };

  const removeAchievement = (achIdx) => {
    const data = getSection('experience');
    updateField('experience', {
      ...data,
      items: data.items.map((it, i) => i === itemIdx
        ? { ...it, achievements: it.achievements.filter((_, ai) => ai !== achIdx) }
        : it),
    });
  };

  return (
    <motion.div className="timeline-item"
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, amount: 0 }}
      transition={{ duration: 0.4, delay: itemIdx * 0.05 }}
    >
      {editMode && (
        <button className="edit-remove-item-btn" onClick={onRemove} title="Remove job">
          <X size={14} /> Remove Job
        </button>
      )}
      <div className="timeline-marker" />
      <div className="timeline-content">
        <div className="timeline-header">
          <div>
            <h3 className="timeline-title">
              <EditableText value={item.title} onChange={(v) => onChangeField('title', v)} />
            </h3>
            <div className="timeline-company">
              <EditableText value={item.company} onChange={(v) => onChangeField('company', v)} />
            </div>
          </div>
          <div className="timeline-period">
            <EditableText value={item.period} onChange={(v) => onChangeField('period', v)} />
          </div>
        </div>
        {(item.location || editMode) && (
          <div style={{ color: 'var(--color-text-muted)', marginBottom: '1rem', fontSize: '0.95rem' }}>
            <EditableText value={item.location || ''} onChange={(v) => onChangeField('location', v)} />
          </div>
        )}
        <ul className="timeline-achievements">
          {item.achievements.map((ach, achIdx) => (
            <li key={achIdx} className="timeline-achievement-row">
              <EditableText value={ach} onChange={(v) => onChangeAchievement(achIdx, v)} multiline />
              {editMode && (
                <button className="edit-remove-inline-btn" onClick={() => removeAchievement(achIdx)} title="Remove bullet">
                  <X size={12} />
                </button>
              )}
            </li>
          ))}
          {editMode && (
            <li className="edit-add-row">
              <button className="edit-add-btn" onClick={addAchievement}>
                <Plus size={13} /> Add bullet
              </button>
            </li>
          )}
        </ul>
      </div>
    </motion.div>
  );
};

const Experience = () => {
  const { getSection, updateField, editMode, loading } = useEdit();
  const data = getSection('experience');

  if (loading || !data) return <Section label="CAREER" title="Professional Experience" id="experience" />;

  const addJob = () => {
    updateField('experience', {
      ...data,
      items: [...data.items, {
        title: 'Job Title',
        company: 'Company Name',
        period: 'Start – End',
        location: 'Location',
        achievements: ['Describe your achievement here.'],
      }],
    });
  };

  const removeJob = (idx) => {
    updateField('experience', { ...data, items: data.items.filter((_, i) => i !== idx) });
  };

  return (
    <Section label="CAREER" title="Professional Experience" id="experience">
      <div className="timeline">
        {data.items.map((item, i) => (
          <TimelineItem key={i} item={item} itemIdx={i} onRemove={() => removeJob(i)} />
        ))}
        {editMode && (
          <div className="edit-add-section-row">
            <button className="edit-add-btn edit-add-section-btn" onClick={addJob}>
              <Plus size={14} /> Add Job
            </button>
          </div>
        )}
      </div>
    </Section>
  );
};

export default Experience;
