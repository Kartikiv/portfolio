import React from 'react';
import { Mail, Linkedin, Github, ExternalLink } from 'lucide-react';
import Section from './Section';

const Contact = () => {
    return (
        <Section label="LET'S CONNECT" title="Get In Touch" id="contact">
            <div className="contact-content">
                <p className="contact-text">
                    I'm currently seeking software engineering opportunities where I can contribute to building
                    scalable, high-performance systems. Whether you have a project in mind, want to discuss
                    technology, or just want to connect, I'd love to hear from you.
                </p>
                <div className="contact-links">
                    <a href="mailto:saikartik.iv@gmail.com" className="contact-link">
                        <Mail className="contact-icon" />
                        Email Me
                    </a>
                    <a href="https://linkedin.com/in/sai-kartik-ivaturi-958809183/" target="_blank" rel="noopener noreferrer" className="contact-link">
                        <Linkedin className="contact-icon" />
                        LinkedIn
                    </a>
                    <a href="https://github.com/kartikiv" target="_blank" rel="noopener noreferrer" className="contact-link">
                        <Github className="contact-icon" />
                        GitHub
                    </a>
                </div>
                <a href="mailto:saikartik.iv@gmail.com" className="btn btn-primary" style={{ marginTop: '2rem', display: 'inline-flex' }}>
                    Let's Build Something Great <ExternalLink size={18} />
                </a>
            </div>
        </Section>
    );
};

export default Contact;

