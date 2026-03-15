import React from 'react';
import { Mail, Linkedin, Github, ExternalLink } from 'lucide-react';
import Section from './Section';
import EditableText from './EditableText';
import { useEdit } from '../context/EditContext';

const Contact = () => {
  const { getSection, updateField, loading } = useEdit();
  const data = getSection('contact');

  if (loading || !data) return <Section label="LET'S CONNECT" title="Get In Touch" id="contact" />;

  const onChange = (field) => (val) => updateField('contact', { ...data, [field]: val });

  return (
    <Section label="LET'S CONNECT" title="Get In Touch" id="contact">
      <div className="contact-content">
        <p className="contact-text">
          <EditableText tag="span" value={data.text} onChange={onChange('text')} multiline />
        </p>
        <div className="contact-links">
          <a href={`mailto:${data.email}`} className="contact-link">
            <Mail className="contact-icon" />
            <EditableText value={data.email} onChange={onChange('email')} />
          </a>
          {(data.phone || true) && (
            <span className="contact-link">
              <EditableText value={data.phone || ''} onChange={onChange('phone')} style={{ minWidth: 80 }} />
            </span>
          )}
          {(data.location || true) && (
            <span className="contact-link">
              <EditableText value={data.location || ''} onChange={onChange('location')} style={{ minWidth: 80 }} />
            </span>
          )}
          <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="contact-link">
            <Linkedin className="contact-icon" />
            LinkedIn
          </a>
          <a href={data.github} target="_blank" rel="noopener noreferrer" className="contact-link">
            <Github className="contact-icon" />
            GitHub
          </a>
        </div>
        <a href={`mailto:${data.email}`} className="btn btn-primary" style={{ marginTop: '2rem', display: 'inline-flex' }}>
          Let's Build Something Great <ExternalLink size={18} />
        </a>
      </div>
    </Section>
  );
};

export default Contact;
