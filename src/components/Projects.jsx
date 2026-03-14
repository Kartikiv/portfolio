import React, { useState, useEffect } from 'react';
import { motion, Reorder, useDragControls } from 'framer-motion';
import { Brain, Database, GripVertical, Plus, X } from 'lucide-react';
import Section from './Section';
import EditableText from './EditableText';
import { useEdit } from '../context/EditContext';

const ICON_MAP = { Brain, Database };

let _uid = 0;
const uid = () => ++_uid;

const DraggableHighlight = ({ hObj, onEdit, onRemove }) => {
  const controls = useDragControls();
  return (
    <Reorder.Item
      as="li"
      value={hObj}
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
      <EditableText value={hObj.text} onChange={onEdit} multiline />
      <button className="edit-remove-inline-btn" onClick={onRemove} title="Remove bullet">
        <X size={12} />
      </button>
    </Reorder.Item>
  );
};

const ProjectCard = ({ item, itemIdx, onRemove }) => {
  const { getSection, updateField, editMode } = useEdit();
  const IconComp = ICON_MAP[item.icon] || Brain;

  const [reorderItems, setReorderItems] = useState(() =>
    (item.highlights || []).map(text => ({ id: uid(), text }))
  );

  useEffect(() => {
    if (editMode) {
      setReorderItems((item.highlights || []).map(text => ({ id: uid(), text })));
    }
  }, [editMode]);

  const onChangeField = (field, val) => {
    const data = getSection('projects');
    updateField('projects', { ...data, items: data.items.map((it, i) => i === itemIdx ? { ...it, [field]: val } : it) });
  };

  const onChangeHighlight = (id, val) => {
    const newItems = reorderItems.map(o => o.id === id ? { ...o, text: val } : o);
    setReorderItems(newItems);
    const data = getSection('projects');
    updateField('projects', {
      ...data,
      items: data.items.map((it, i) => i === itemIdx ? { ...it, highlights: newItems.map(o => o.text) } : it),
    });
  };

  const reorderHighlights = (newOrder) => {
    setReorderItems(newOrder);
    const data = getSection('projects');
    updateField('projects', {
      ...data,
      items: data.items.map((it, i) => i === itemIdx ? { ...it, highlights: newOrder.map(o => o.text) } : it),
    });
  };

  const addHighlight = () => {
    const newObj = { id: uid(), text: 'Describe this highlight.' };
    const newItems = [...reorderItems, newObj];
    setReorderItems(newItems);
    const data = getSection('projects');
    updateField('projects', {
      ...data,
      items: data.items.map((it, i) => i === itemIdx ? { ...it, highlights: newItems.map(o => o.text) } : it),
    });
  };

  const removeHighlight = (id) => {
    const newItems = reorderItems.filter(o => o.id !== id);
    setReorderItems(newItems);
    const data = getSection('projects');
    updateField('projects', {
      ...data,
      items: data.items.map((it, i) => i === itemIdx ? { ...it, highlights: newItems.map(o => o.text) } : it),
    });
  };

  return (
    <motion.div className="project-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0 }}
      transition={{ duration: 0.4, delay: itemIdx * 0.05 }}
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
          {editMode ? (
            <Reorder.Group
              as="div"
              axis="y"
              values={reorderItems}
              onReorder={reorderHighlights}
              style={{ padding: 0, margin: 0 }}
            >
              {reorderItems.map((hObj) => (
                <DraggableHighlight
                  key={hObj.id}
                  hObj={hObj}
                  onEdit={(val) => onChangeHighlight(hObj.id, val)}
                  onRemove={() => removeHighlight(hObj.id)}
                />
              ))}
            </Reorder.Group>
          ) : (
            (item.highlights || []).map((h, hi) => (
              <li key={hi} className="timeline-achievement-row">
                <EditableText value={h} onChange={() => {}} multiline />
              </li>
            ))
          )}
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
