import React from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import Section from './Section';
import EditableText from './EditableText';
import { useEdit } from '../context/EditContext';

const EduItem = ({ item, itemIdx, onRemove }) => {
  const { getSection, updateField, editMode } = useEdit();

  const onChangeField = (field, val) => {
    const data = getSection('education');
    updateField('education', { ...data, items: data.items.map((it, i) => i === itemIdx ? { ...it, [field]: val } : it) });
  };

  const onChangeAchievement = (achIdx, val) => {
    const data = getSection('education');
    updateField('education', {
      ...data,
      items: data.items.map((it, i) => i === itemIdx
        ? { ...it, achievements: it.achievements.map((a, ai) => ai === achIdx ? val : a) }
        : it),
    });
  };

  const addAchievement = () => {
    const data = getSection('education');
    updateField('education', {
      ...data,
      items: data.items.map((it, i) => i === itemIdx
        ? { ...it, achievements: [...it.achievements, 'Add detail here.'] }
        : it),
    });
  };

  const removeAchievement = (achIdx) => {
    const data = getSection('education');
    updateField('education', {
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
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.6, delay: itemIdx * 0.1 }}
    >
      {editMode && (
        <button className="edit-remove-item-btn" onClick={onRemove} title="Remove entry">
          <X size={14} /> Remove Entry
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
              <EditableText value={item.institution} onChange={(v) => onChangeField('institution', v)} />
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
            <motion.li key={achIdx} className="timeline-achievement-row"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.4, delay: achIdx * 0.05 }}
            >
              <EditableText value={ach} onChange={(v) => onChangeAchievement(achIdx, v)} multiline />
              {editMode && (
                <button className="edit-remove-inline-btn" onClick={() => removeAchievement(achIdx)} title="Remove">
                  <X size={12} />
                </button>
              )}
            </motion.li>
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

const Education = () => {
  const { getSection, updateField, editMode, loading } = useEdit();
  const data = getSection('education');

  if (loading || !data) return <Section label="EDUCATION" title="Academic Background" />;

  const addEntry = () => {
    updateField('education', {
      ...data,
      items: [...data.items, {
        title: 'Degree Title',
        institution: 'University Name',
        period: 'Start – End',
        location: 'Location',
        achievements: ['Add detail here.'],
      }],
    });
  };

  const removeEntry = (idx) => {
    updateField('education', { ...data, items: data.items.filter((_, i) => i !== idx) });
  };

  return (
    <Section label="EDUCATION" title="Academic Background">
      <div className="timeline">
        {data.items.map((item, i) => (
          <EduItem key={i} item={item} itemIdx={i} onRemove={() => removeEntry(i)} />
        ))}
        {editMode && (
          <div className="edit-add-section-row">
            <button className="edit-add-btn edit-add-section-btn" onClick={addEntry}>
              <Plus size={14} /> Add Education Entry
            </button>
          </div>
        )}
      </div>
    </Section>
  );
};

export default Education;
