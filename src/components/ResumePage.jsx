import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { useEdit } from '../context/EditContext';

// A4 at 96 dpi
const A4_W = 794;
const A4_H = 1123;

const ResumePage = () => {
  const navigate = useNavigate();
  const { getSection, loading } = useEdit();

  const hero    = getSection('hero')              || {};
  const exp     = getSection('experience')?.items || [];
  const edu     = getSection('education')?.items  || [];
  const skills  = getSection('skills')?.categories || [];
  const projects = getSection('projects')?.items       || [];
  const certs    = getSection('certifications')?.items || [];
  const contact  = getSection('contact')              || {};
  const customSections = getSection('customSections')?.sections || [];
  const sectionOrder = getSection('sectionOrder')?.order ||
    ['skills', 'experience', 'projects', 'certifications', 'education', 'customSections'];
  const resumeRef = useRef(null);

  useEffect(() => {
    document.title = `${hero.title || 'Resume'} — Resume`;
    return () => { document.title = 'Sai Kartik Ivaturi - Software Engineer'; };
  }, [hero.title]);

  // Scale content to fill exactly one A4 page.
  // Zoom shrinks width too, so we iterate to find the natural width
  // such that (natural_w / zoom) * zoom = A4_W after scaling.
  useEffect(() => {
    const el = resumeRef.current;
    if (!el) return;

    el.style.zoom = '';
    el.style.width = A4_W + 'px';

    let zoom = 1;
    for (let i = 0; i < 3; i++) {
      const h = el.scrollHeight;
      if (!h) break;
      zoom = A4_H / h;
      el.style.width = (A4_W / zoom) + 'px'; // pre-compensate width
    }
    el.style.zoom = zoom; // visual width = (A4_W/zoom)*zoom = A4_W ✓
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'Times New Roman, serif' }}>
        Loading resume…
      </div>
    );
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #e0e0e0; overflow-x: auto; }

        .resume-toolbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          background: #1e1e2e; padding: 10px 24px;
          display: flex; align-items: center; gap: 12px;
        }
        .resume-toolbar button {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px; border-radius: 6px; cursor: pointer;
          font-size: 13px; font-family: Arial, sans-serif; border: none;
        }
        .btn-back  { background: rgba(255,255,255,0.1); color: #fff; }
        .btn-print { background: #6d28d9; color: #fff; }
        .btn-back:hover  { background: rgba(255,255,255,0.18); }
        .btn-print:hover { background: #5b21b6; }
        .toolbar-hint { color: #888; font-size: 12px; font-family: Arial, sans-serif; }

        /* A4 paper shell */
        .resume-wrap {
          margin: 60px auto 40px;
          width: ${A4_W}px;
          height: ${A4_H}px;
          background: #fff;
          box-shadow: 0 4px 32px rgba(0,0,0,0.22);
          overflow: hidden;
        }

        /* Resume body — measured at natural size, then zoomed */
        .resume {
          width: ${A4_W}px;
          padding: 0.45in 0.5in;
          font-family: 'Times New Roman', Times, serif;
          font-size: 9.5pt;
          color: #111;
          line-height: 1.38;
        }

        /* Header */
        .r-name { font-size: 20pt; font-weight: 700; margin-bottom: 3px; text-align: center; }
        .r-contact {
          display: flex; flex-wrap: wrap; gap: 3px 16px;
          font-size: 8.5pt; color: #555; justify-content: center; margin-bottom: 2px;
        }
        .r-contact a, a { color: #1a56db; text-decoration: underline; }

        /* Divider */
        .r-divider { border: none; border-top: 1px solid #222; margin: 5px 0; }

        /* Section */
        .r-section { margin-top: 6px; }
        .r-section-title {
          font-size: 8.5pt; font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase; border-bottom: 0.8px solid #444;
          padding-bottom: 1px; margin-bottom: 4px; color: #222;
        }

        /* Summary */
        .r-summary { font-size: 8.5pt; line-height: 1.4; color: #333; margin-top: 4px; }

        /* Experience */
        .r-job { margin-bottom: 5px; }
        .r-job-header { display: flex; justify-content: space-between; align-items: baseline; }
        .r-job-title { font-size: 9pt; font-weight: 700; }
        .r-job-period { font-size: 8pt; color: #555; white-space: nowrap; }
        .r-job-sub { font-size: 8pt; color: #444; margin-bottom: 2px; }
        .r-bullets { list-style: none; padding: 0; margin: 0; }
        .r-bullets li {
          display: flex; gap: 5px;
          font-size: 8pt; line-height: 1.35; margin-bottom: 1px; color: #222;
        }
        .r-bullets li::before { content: "•"; flex-shrink: 0; }

        /* Skills */
        .r-skills-list { list-style: disc; padding-left: 14px; margin: 0; }
        .r-skill-row { font-size: 8pt; line-height: 1.35; margin-bottom: 1px; color: #222; }
        .r-skill-cat { font-weight: 700; color: #222; }

        /* Education */
        .r-edu { margin-bottom: 5px; }
        .r-edu-header { display: flex; justify-content: space-between; align-items: baseline; }
        .r-edu-degree { font-size: 9pt; font-weight: 700; }
        .r-edu-inst { font-size: 8pt; color: #444; margin-bottom: 1px; }

        /* Certifications */
        .r-certs { list-style: disc; padding-left: 14px; margin: 0; }
        .r-cert { font-size: 8pt; color: #333; line-height: 1.35; }

        /* PRINT — keep inline zoom so content fits exactly one page */
        @media print {
          body { background: #fff; }
          .resume-toolbar { display: none !important; }
          .resume-wrap { margin: 0; width: ${A4_W}px; height: ${A4_H}px; box-shadow: none; overflow: hidden; }
          @page { size: A4; margin: 0; }
        }
      `}</style>

      <div className="resume-toolbar">
        <button className="btn-back" onClick={() => navigate('/')}>
          <ArrowLeft size={14} /> Back
        </button>
        <button className="btn-print" onClick={() => window.print()}>
          <Download size={14} /> Save as PDF
        </button>
        <span className="toolbar-hint">Print dialog → Destination: "Save as PDF" → disable headers/footers</span>
      </div>

      <div className="resume-wrap">
        <div className="resume" ref={resumeRef}>

          {/* Header */}
          <div className="r-name">{hero.title}</div>
          <div className="r-contact">
            {contact.email    && <span>{contact.email}</span>}
            {contact.linkedin && <a href={contact.linkedin} target="_blank" rel="noreferrer">{contact.linkedin.replace('https://', '')}</a>}
            {contact.github   && <a href={contact.github}   target="_blank" rel="noreferrer">{contact.github.replace('https://', '')}</a>}
          </div>
          <hr className="r-divider" />

          {/* Summary */}
          {hero.description && <p className="r-summary">{hero.description}</p>}

          {sectionOrder.map((key) => {
            if (key === 'experience' && exp.length > 0) return (
              <div key="experience" className="r-section">
                <div className="r-section-title">Experience</div>
                {exp.map((job, i) => (
                  <div key={i} className="r-job">
                    <div className="r-job-header">
                      <span className="r-job-title">{job.title} — {job.company}</span>
                      <span className="r-job-period">{job.period}</span>
                    </div>
                    {job.location && <div className="r-job-sub">{job.location}</div>}
                    <ul className="r-bullets">
                      {(job.achievements || []).map((ach, ai) => (
                        <li key={ai} dangerouslySetInnerHTML={{ __html: ach }} />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            );

            if (key === 'skills' && skills.length > 0) return (
              <div key="skills" className="r-section">
                <div className="r-section-title">Skills</div>
                <ul className="r-skills-list">
                  {skills.map((cat, i) => (
                    <li key={i} className="r-skill-row">
                      <strong className="r-skill-cat">{cat.title}:</strong>{' '}{(cat.skills || []).join(', ')}.
                    </li>
                  ))}
                </ul>
              </div>
            );

            if (key === 'projects' && projects.length > 0) return (
              <div key="projects" className="r-section">
                <div className="r-section-title">Projects</div>
                {projects.map((p, i) => (
                  <div key={i} className="r-job">
                    <div className="r-job-header">
                      <span className="r-job-title">{p.title}</span>
                      {p.tech && <span className="r-job-period">{p.tech}</span>}
                    </div>
                    {p.description && <div className="r-job-sub">{p.description}</div>}
                    {(p.highlights || []).length > 0 && (
                      <ul className="r-bullets">
                        {p.highlights.map((h, hi) => (
                          <li key={hi} dangerouslySetInnerHTML={{ __html: h }} />
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            );

            if (key === 'education' && edu.length > 0) return (
              <div key="education" className="r-section">
                <div className="r-section-title">Education</div>
                {edu.map((e, i) => (
                  <div key={i} className="r-edu">
                    <div className="r-edu-header">
                      <span className="r-edu-degree">{e.title}</span>
                      <span className="r-job-period">{e.period}</span>
                    </div>
                    <div className="r-edu-inst">{e.institution}{e.location ? ` | ${e.location}` : ''}</div>
                    {(e.achievements || []).length > 0 && (
                      <ul className="r-bullets" style={{ marginTop: '2px' }}>
                        {e.achievements.map((ach, ai) => (
                          <li key={ai} dangerouslySetInnerHTML={{ __html: ach }} />
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            );

            if (key === 'certifications' && certs.length > 0) return (
              <div key="certifications" className="r-section">
                <div className="r-section-title">Certifications</div>
                <ul className="r-certs">
                  {certs.map((c, i) => (
                    <li key={i} className="r-cert">{c.text}</li>
                  ))}
                </ul>
              </div>
            );

            if (key === 'customSections') return customSections
              .filter(cs => cs.items && cs.items.length > 0)
              .map((cs) => (
                <div key={cs.id} className="r-section">
                  <div className="r-section-title">{cs.title}</div>
                  {cs.items.map((item, i) => (
                    <div key={i} className="r-job" style={{ marginBottom: '6px' }}>
                      <div className="r-job-header">
                        <span className="r-job-title">{item.title}</span>
                        <span className="r-job-period">{item.period}</span>
                      </div>
                      {item.subtitle && <div className="r-job-sub">{item.subtitle}</div>}
                      {item.location && <div className="r-job-sub">{item.location}</div>}
                      {item.bullets && item.bullets.length > 0 && (
                        <ul className="r-bullets">
                          {item.bullets.map((b, bi) => (
                            <li key={bi} dangerouslySetInnerHTML={{ __html: b }} />
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              ));

            return null;
          })}

        </div>
      </div>
    </>
  );
};

export default ResumePage;
