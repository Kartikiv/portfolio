import React from 'react';
import { motion } from 'framer-motion';
import { Award, Cloud, Terminal, FileCode, Plus, X } from 'lucide-react';
import Section from './Section';
import EditableText from './EditableText';
import { useEdit } from '../context/EditContext';

const ICON_MAP = { Award, Cloud, Terminal, FileCode };

const CertBadge = ({ item, itemIdx, delay, onRemove }) => {
  const { getSection, updateField, editMode } = useEdit();
  const IconComp = ICON_MAP[item.icon] || Award;

  const onChangeText = (val) => {
    const data = getSection('certifications');
    updateField('certifications', {
      ...data,
      items: data.items.map((it, i) => i === itemIdx ? { ...it, text: val } : it),
    });
  };

  return (
    <motion.div className="cert-badge"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, amount: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      {editMode && (
        <button className="edit-remove-inline-btn edit-remove-cert" onClick={onRemove} title="Remove">
          <X size={12} />
        </button>
      )}
      <div className="cert-icon"><IconComp /></div>
      <div className="cert-text">
        <EditableText value={item.text} onChange={onChangeText} multiline />
      </div>
    </motion.div>
  );
};

const Certifications = () => {
  const { getSection, updateField, editMode, loading } = useEdit();
  const data = getSection('certifications');

  if (loading || !data) return <Section label="CREDENTIALS" title="Certifications & Publications" />;

  const addCert = () => {
    updateField('certifications', {
      ...data,
      items: [...data.items, { icon: 'Award', text: 'New Certification or Publication' }],
    });
  };

  const removeCert = (idx) => {
    updateField('certifications', { ...data, items: data.items.filter((_, i) => i !== idx) });
  };

  return (
    <Section label="CREDENTIALS" title="Certifications & Publications">
      <div className="certifications-grid">
        {data.items.map((item, i) => (
          <CertBadge key={i} item={item} itemIdx={i} delay={i * 0.1} onRemove={() => removeCert(i)} />
        ))}
      </div>
      {editMode && (
        <div className="edit-add-section-row">
          <button className="edit-add-btn edit-add-section-btn" onClick={addCert}>
            <Plus size={14} /> Add Certification
          </button>
        </div>
      )}
    </Section>
  );
};

export default Certifications;
