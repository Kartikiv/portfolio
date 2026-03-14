import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, Reorder, useDragControls } from 'framer-motion';
import { Code2, Network, Database, Cloud, Brain, Cpu, GripVertical, Plus, X, Check } from 'lucide-react';
import Section from './Section';
import { useEdit } from '../context/EditContext';

const ICON_SLUG = {
  Java: 'openjdk', Python: 'python', 'C++': 'cplusplus', JavaScript: 'javascript',
  TypeScript: 'typescript', Rust: 'rust', Scala: 'scala', Go: 'go',
  'Spring Boot': 'springboot', Hibernate: 'hibernate',
  'RESTful APIs': 'swagger', 'Event-Driven': 'apachekafka',
  'Distributed Systems': 'apachekafka', Microservices: 'consul',
  PostgreSQL: 'postgresql', MySQL: 'mysql', MongoDB: 'mongodb', MariaDB: 'mariadb',
  Indexing: 'elasticsearch', 'Query Optimization': 'postgresql',
  Docker: 'docker', Kubernetes: 'kubernetes',
  'CI/CD': 'githubactions', 'Cloud-Native': 'cncf',
  'Load Balancing': 'nginx', 'Auto-Scaling': 'terraform',
  NLP: 'pytorch', 'Reinforcement Learning': 'pytorch',
  React: 'react', Angular: 'angular',
  'API Integration': 'postman', Observability: 'grafana',
};

const ICON_MAP = { Code2, Network, Database, Cloud, Brain, Cpu };

const SkillTag = ({ skill }) => {
  const slug = ICON_SLUG[skill] || skill.toLowerCase().replace(/[^a-z0-9]/g, '');
  const [imgError, setImgError] = useState(false);
  return (
    <span className="skill-tag">
      {slug && !imgError && (
        <img src={`https://cdn.simpleicons.org/${slug}`} alt="" className="skill-tag-icon" onError={() => setImgError(true)} />
      )}
      {skill}
    </span>
  );
};

const DraggableSkillItem = ({ skill, onRemove }) => {
  const controls = useDragControls();
  const slug = ICON_SLUG[skill] || skill.toLowerCase().replace(/[^a-z0-9]/g, '');
  const [imgError, setImgError] = useState(false);
  return (
    <Reorder.Item
      value={skill}
      dragListener={false}
      dragControls={controls}
      className="skill-drag-row"
    >
      <GripVertical
        size={15}
        className="drag-handle"
        onPointerDown={(e) => { e.preventDefault(); controls.start(e); }}
        style={{ touchAction: 'none' }}
      />
      {slug && !imgError && (
        <img src={`https://cdn.simpleicons.org/${slug}`} alt="" className="skill-tag-icon" onError={() => setImgError(true)} />
      )}
      <span className="skill-drag-name">{skill}</span>
      <button className="edit-remove-inline-btn" style={{ opacity: 1 }} onClick={onRemove} title="Remove skill">
        <X size={12} />
      </button>
    </Reorder.Item>
  );
};

const SkillCard = ({ cat, catIdx }) => {
  const cardRef = useRef(null);
  const { getSection, updateField, editMode } = useEdit();
  const rotateX = useMotionValue(0); const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20 });
  const glowOpacity = useMotionValue(0);
  const glowOpacitySpring = useSpring(glowOpacity, { stiffness: 200, damping: 20 });
  const [newSkill, setNewSkill] = useState('');
  const [adding, setAdding] = useState(false);
  const IconComponent = ICON_MAP[cat.icon] || Code2;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    rotateX.set(((e.clientY - rect.top - rect.height / 2) / rect.height) * -12);
    rotateY.set(((e.clientX - rect.left - rect.width / 2) / rect.width) * 12);
    glowOpacity.set(1);
  };

  const reorderSkills = (newSkills) => {
    const data = getSection('skills');
    updateField('skills', {
      ...data,
      categories: data.categories.map((c, i) => i === catIdx ? { ...c, skills: newSkills } : c),
    });
  };

  const removeSkill = (skill) => {
    const data = getSection('skills');
    updateField('skills', {
      ...data,
      categories: data.categories.map((c, i) => i === catIdx
        ? { ...c, skills: c.skills.filter(s => s !== skill) }
        : c),
    });
  };

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed) { setAdding(false); return; }
    const data = getSection('skills');
    updateField('skills', {
      ...data,
      categories: data.categories.map((c, i) => i === catIdx
        ? { ...c, skills: [...c.skills, trimmed] }
        : c),
    });
    setNewSkill('');
    setAdding(false);
  };

  return (
    <motion.div ref={cardRef} className={`skill-card${editMode ? ' skill-card-editing' : ''}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0 }}
      transition={{ duration: 0.4, delay: catIdx * 0.06, ease: 'easeOut' }}
      style={editMode ? {} : { rotateX: springX, rotateY: springY, transformPerspective: 800, transformStyle: 'preserve-3d' }}
      onMouseMove={!editMode ? handleMouseMove : undefined}
      onMouseLeave={!editMode ? () => { rotateX.set(0); rotateY.set(0); glowOpacity.set(0); } : undefined}
    >
      <motion.div className="skill-card-glow" style={{ opacity: glowOpacitySpring }} />
      <motion.div className="skill-card-accent-bar"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: false, amount: 0 }}
        transition={{ duration: 0.5, delay: catIdx * 0.06 + 0.15 }}
      />
      <div className="skill-icon-wrap"><IconComponent size={28} /></div>
      <h3 className="skill-title">{cat.title}</h3>

      {editMode ? (
        <div className="skill-edit-list">
          <Reorder.Group
            axis="y"
            values={cat.skills}
            onReorder={reorderSkills}
            style={{ listStyle: 'none', padding: 0, margin: 0 }}
          >
            {cat.skills.map((skill) => (
              <DraggableSkillItem
                key={skill}
                skill={skill}
                onRemove={() => removeSkill(skill)}
              />
            ))}
          </Reorder.Group>

          {!adding && (
            <button className="skill-tag-add-btn" onClick={() => setAdding(true)}>
              <Plus size={11} /> Add skill
            </button>
          )}
          {adding && (
            <span className="skill-tag-input-wrap">
              <input
                className="skill-tag-input"
                autoFocus
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addSkill();
                  if (e.key === 'Escape') { setAdding(false); setNewSkill(''); }
                }}
                placeholder="e.g. Redis"
              />
              <button className="skill-confirm-btn" onClick={addSkill} title="Confirm"><Check size={12} /></button>
              <button className="skill-cancel-btn" onClick={() => { setAdding(false); setNewSkill(''); }} title="Cancel"><X size={12} /></button>
            </span>
          )}
        </div>
      ) : (
        <div className="skill-items">
          {cat.skills.map((skill, idx) => (
            <SkillTag key={skill + idx} skill={skill} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

const Skills = () => {
  const { getSection, loading } = useEdit();
  const data = getSection('skills');

  if (loading || !data) return <Section label="EXPERTISE" title="Technical Proficiency" />;

  return (
    <Section label="EXPERTISE" title="Technical Proficiency">
      <div className="skills-grid">
        {data.categories.map((cat, i) => (
          <SkillCard key={cat.title} cat={cat} catIdx={i} />
        ))}
      </div>
    </Section>
  );
};

export default Skills;
