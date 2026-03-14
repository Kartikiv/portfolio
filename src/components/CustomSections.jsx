import React, { useState, useEffect } from 'react';
import { motion, Reorder, useDragControls } from 'framer-motion';
import { GripVertical, Plus, X, GripHorizontal } from 'lucide-react';
import Section from './Section';
import EditableText from './EditableText';
import { useEdit } from '../context/EditContext';

let _uid = 0;
const uid = () => ++_uid;

/* ── Draggable bullet (same pattern as Experience) ── */
const DraggableBullet = ({ bulletObj, onEdit, onRemove }) => {
  const controls = useDragControls();
  return (
    <Reorder.Item
      as="li"
      value={bulletObj}
      dragListener={false}
      dragControls={controls}
      className="timeline-achievement-row"
    >
      <GripVertical
        size={15}
        className="drag-handle"
        onPointerDown={(e) => { e.preventDefault(); controls.start(e); }}
        style={{ touchAction: 'none' }}
      />
      <EditableText value={bulletObj.text} onChange={onEdit} multiline richText />
      <button className="edit-remove-inline-btn" onClick={onRemove} title="Remove bullet">
        <X size={12} />
      </button>
    </Reorder.Item>
  );
};

/* ── A single item row inside a custom section ── */
const CustomItem = ({ item, itemIdx, sectionId, onRemove }) => {
  const { getSection, updateField, editMode } = useEdit();
  const [bullets, setBullets] = useState(() =>
    (item.bullets || []).map(text => ({ id: uid(), text }))
  );

  useEffect(() => {
    if (editMode) setBullets((item.bullets || []).map(text => ({ id: uid(), text })));
  }, [editMode]);

  const patchItem = (patch) => {
    const data = getSection('customSections') || { sections: [] };
    updateField('customSections', {
      ...data,
      sections: data.sections.map(s =>
        s.id !== sectionId ? s : {
          ...s,
          items: s.items.map((it, i) => i === itemIdx ? { ...it, ...patch } : it),
        }
      ),
    });
  };

  const syncBullets = (newBullets) => {
    setBullets(newBullets);
    patchItem({ bullets: newBullets.map(o => o.text) });
  };

  const addBullet = () => syncBullets([...bullets, { id: uid(), text: 'Describe this achievement.' }]);
  const removeBullet = (id) => syncBullets(bullets.filter(o => o.id !== id));
  const editBullet = (id, val) => syncBullets(bullets.map(o => o.id === id ? { ...o, text: val } : o));

  return (
    <motion.div
      className="timeline-item"
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, amount: 0 }}
      transition={{ duration: 0.4, delay: itemIdx * 0.05 }}
    >
      {editMode && (
        <button className="edit-remove-item-btn" onClick={onRemove} title="Remove item">
          <X size={14} /> Remove Item
        </button>
      )}
      <div className="timeline-marker" />
      <div className="timeline-content">
        <div className="timeline-header">
          <div>
            <h3 className="timeline-title">
              <EditableText value={item.title} onChange={(v) => patchItem({ title: v })} />
            </h3>
            <div className="timeline-company">
              <EditableText value={item.subtitle || ''} onChange={(v) => patchItem({ subtitle: v })} />
            </div>
          </div>
          <div className="timeline-period">
            <EditableText value={item.period || ''} onChange={(v) => patchItem({ period: v })} />
          </div>
        </div>
        {(item.location || editMode) && (
          <div style={{ color: 'var(--color-text-muted)', marginBottom: '1rem', fontSize: '0.95rem' }}>
            <EditableText value={item.location || ''} onChange={(v) => patchItem({ location: v })} />
          </div>
        )}
        {editMode ? (
          <>
            <Reorder.Group
              as="ul"
              axis="y"
              values={bullets}
              onReorder={syncBullets}
              className="timeline-achievements"
              style={{ padding: 0, margin: 0 }}
            >
              {bullets.map((b) => (
                <DraggableBullet
                  key={b.id}
                  bulletObj={b}
                  onEdit={(val) => editBullet(b.id, val)}
                  onRemove={() => removeBullet(b.id)}
                />
              ))}
            </Reorder.Group>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="edit-add-row">
                <button className="edit-add-btn" onClick={addBullet}>
                  <Plus size={13} /> Add bullet
                </button>
              </li>
            </ul>
          </>
        ) : (
          bullets.length > 0 && (
            <ul className="timeline-achievements">
              {item.bullets.map((b, bi) => (
                <li key={bi} className="timeline-achievement-row">
                  <EditableText value={b} onChange={() => {}} multiline richText />
                </li>
              ))}
            </ul>
          )
        )}
      </div>
    </motion.div>
  );
};

/* ── One full custom section (label + title + items) ── */
const CustomSectionBlock = ({ section, onRemoveSection, dragControls }) => {
  const { getSection, updateField, editMode } = useEdit();

  const patchSection = (patch) => {
    const data = getSection('customSections') || { sections: [] };
    updateField('customSections', {
      ...data,
      sections: data.sections.map(s => s.id === section.id ? { ...s, ...patch } : s),
    });
  };

  const addItem = () => {
    patchSection({
      items: [...section.items, {
        title: 'Item Title',
        subtitle: 'Organization / Venue',
        period: 'Period',
        location: '',
        bullets: ['Describe this item.'],
      }],
    });
  };

  const removeItem = (idx) => {
    patchSection({ items: section.items.filter((_, i) => i !== idx) });
  };

  return (
    <Section label={section.label} title={section.title} id={`custom-${section.id}`}>
      {editMode && (
        <div className="custom-section-meta-row">
          <GripHorizontal
            size={16}
            className="drag-handle"
            style={{ opacity: 0.5, cursor: 'grab', flexShrink: 0 }}
            onPointerDown={(e) => { e.preventDefault(); dragControls?.start(e); }}
          />
          <span className="custom-section-meta-label">Label:</span>
          <EditableText
            value={section.label}
            onChange={(v) => patchSection({ label: v })}
            className="custom-section-meta-input"
          />
          <span className="custom-section-meta-label" style={{ marginLeft: 16 }}>Title:</span>
          <EditableText
            value={section.title}
            onChange={(v) => patchSection({ title: v })}
            className="custom-section-meta-input"
          />
          <button
            className="edit-remove-item-btn"
            onClick={onRemoveSection}
            style={{ marginLeft: 'auto' }}
          >
            <X size={14} /> Remove Section
          </button>
        </div>
      )}
      <div className="timeline">
        {section.items.map((item, i) => (
          <CustomItem
            key={i}
            item={item}
            itemIdx={i}
            sectionId={section.id}
            onRemove={() => removeItem(i)}
          />
        ))}
        {editMode && (
          <div className="edit-add-section-row">
            <button className="edit-add-btn edit-add-section-btn" onClick={addItem}>
              <Plus size={14} /> Add Item
            </button>
          </div>
        )}
      </div>
    </Section>
  );
};

/* ── Wrapper that provides drag controls for a section ── */
const DraggableSectionWrapper = ({ section, onRemoveSection, children }) => {
  const controls = useDragControls();
  return (
    <Reorder.Item
      as="div"
      value={section}
      dragListener={false}
      dragControls={controls}
    >
      {React.cloneElement(children, { dragControls: controls })}
    </Reorder.Item>
  );
};

/* ── Root component rendered in Portfolio ── */
const CustomSections = () => {
  const { getSection, updateField, editMode } = useEdit();
  const data = getSection('customSections') || { sections: [] };
  const sections = data.sections || [];

  const addSection = () => {
    updateField('customSections', {
      sections: [...sections, {
        id: `cs_${Date.now()}`,
        label: 'CUSTOM',
        title: 'Custom Section Title',
        items: [{
          title: 'Item Title',
          subtitle: 'Organization / Venue',
          period: 'Period',
          location: '',
          bullets: ['Describe this item.'],
        }],
      }],
    });
  };

  const removeSection = (id) => {
    updateField('customSections', { sections: sections.filter(s => s.id !== id) });
  };

  const reorderSections = (newOrder) => {
    updateField('customSections', { sections: newOrder });
  };

  if (!editMode && sections.length === 0) return null;

  return (
    <>
      {editMode ? (
        <Reorder.Group
          as="div"
          axis="y"
          values={sections}
          onReorder={reorderSections}
          style={{ listStyle: 'none', padding: 0, margin: 0 }}
        >
          {sections.map((section) => (
            <DraggableSectionWrapper
              key={section.id}
              section={section}
              onRemoveSection={() => removeSection(section.id)}
            >
              <CustomSectionBlock
                section={section}
                onRemoveSection={() => removeSection(section.id)}
              />
            </DraggableSectionWrapper>
          ))}
        </Reorder.Group>
      ) : (
        sections.map((section) => (
          <CustomSectionBlock
            key={section.id}
            section={section}
            onRemoveSection={() => removeSection(section.id)}
          />
        ))
      )}
      {editMode && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0 3rem', position: 'relative', zIndex: 1 }}>
          <button
            className="edit-add-btn edit-add-section-btn"
            onClick={addSection}
            style={{ fontSize: '0.95rem', padding: '12px 32px' }}
          >
            <Plus size={16} /> Add Custom Section
          </button>
        </div>
      )}
    </>
  );
};

export default CustomSections;
