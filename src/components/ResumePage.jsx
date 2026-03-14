import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { useEdit } from '../context/EditContext';

const ResumePage = () => {
  const navigate = useNavigate();
  const { getSection, loading } = useEdit();

  const hero     = getSection('hero')     || {};
  const exp      = getSection('experience')?.items || [];
  const edu      = getSection('education')?.items  || [];
  const skills   = getSection('skills')?.categories || [];
  const certs    = getSection('certifications')?.items || [];
  const contact  = getSection('contact') || {};
  const resumeRef = useRef(null);

  useEffect(() => {
    document.title = `${hero.title || 'Resume'} — Resume`;
    return () => { document.title = 'Sai Kartik Ivaturi - Software Engineer'; };
  }, [hero.title]);

  // Auto-scale to always fill exactly one letter page
  useEffect(() => {
    const el = resumeRef.current;
    if (!el) return;
    el.style.transform = '';
    el.style.transformOrigin = '';
    const maxH = 864;
    const h = el.scrollHeight;
    const scale = maxH / h;
    el.style.transform = `scale(${scale})`;
    el.style.transformOrigin = 'top center';
    el.parentElement.style.height = maxH + 'px';
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
        Loading resume…
      </div>
    );
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #f0f0f0; }

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

        .resume-wrap {
          margin: 60px auto 40px;
          max-width: 816px;
          background: #fff;
          box-shadow: 0 4px 24px rgba(0,0,0,0.15);
        }

        .resume {
          padding: 0.3in;
          font-family: 'Times New Roman', Times, serif;
          font-size: 9.5pt;
          color: #111;
          line-height: 1.38;
        }

        /* ── Header ── */
        .r-name { font-size: 21pt; font-weight: 700; letter-spacing: 0.3px; margin-bottom: 2px; text-align: center; }
        .r-label { font-size: 10.5pt; color: #444; margin-bottom: 5px; text-align: center; }
        .r-contact { display: flex; flex-wrap: wrap; gap: 4px 18px; font-size: 8.5pt; color: #555; justify-content: center; }
        .r-contact a { color: #1a56db; text-decoration: underline; }
        a { color: #1a56db; text-decoration: underline; }

        /* ── Divider ── */
        .r-divider { border: none; border-top: 1.2px solid #222; margin: 7px 0; }

        /* ── Section ── */
        .r-section { margin-top: 7px; }
        .r-section-title {
          font-size: 8.5pt; font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase; border-bottom: 0.8px solid #555;
          padding-bottom: 1px; margin-bottom: 4px; color: #222;
        }

        /* ── Summary ── */
        .r-summary { font-size: 8.5pt; line-height: 1.4; color: #333; margin-top: 5px; }

        /* ── Experience ── */
        .r-job { margin-bottom: 6px; }
        .r-job-header { display: flex; justify-content: space-between; align-items: baseline; }
        .r-job-title { font-size: 9pt; font-weight: 700; }
        .r-job-period { font-size: 8pt; color: #555; white-space: nowrap; }
        .r-job-sub { font-size: 8pt; color: #444; margin-bottom: 2px; }
        .r-bullets { list-style: none; padding: 0; margin: 0; }
        .r-bullets li {
          display: flex; gap: 5px;
          font-size: 8pt; line-height: 1.35; margin-bottom: 1.5px; color: #222;
        }
        .r-bullets li::before { content: "•"; flex-shrink: 0; }

        /* ── Skills ── */
        .r-skills-list { list-style: disc; padding-left: 14px; margin: 0; }
        .r-skill-row { font-size: 8pt; line-height: 1.35; margin-bottom: 1.5px; color: #222; }
        .r-skill-cat { font-weight: 700; color: #222; }
        .r-skill-list { color: #333; }

        /* ── Education ── */
        .r-edu-list { list-style: disc; padding-left: 14px; margin: 0; }
        .r-edu { margin-bottom: 4px; }
        .r-edu-header { display: flex; justify-content: space-between; align-items: baseline; }
        .r-edu-degree { font-size: 9pt; font-weight: 700; }
        .r-edu-inst { font-size: 8pt; color: #444; }

        /* ── Certifications ── */
        .r-certs { list-style: disc; padding-left: 14px; margin: 0; }
        .r-cert { font-size: 8pt; color: #333; line-height: 1.35; }

        /* ────────── PRINT ────────── */
        @media print {
          body { background: #fff; }
          .resume-toolbar { display: none; }
          .resume-wrap { margin: 0; max-width: none; box-shadow: none; overflow: visible; }
          .resume { padding: 0; transform-origin: top center !important; }
          @page { size: letter; margin: 0.5in 0.55in; }
        }
      `}</style>

      {/* Toolbar — hidden on print */}
      <div className="resume-toolbar">
        <button className="btn-back" onClick={() => navigate('/')}>
          <ArrowLeft size={14} /> Back
        </button>
        <button className="btn-print" onClick={() => window.print()}>
          <Download size={14} /> Save as PDF
        </button>
        <span className="toolbar-hint">In the print dialog → Destination: "Save as PDF" → disable headers/footers</span>
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

          {/* Summary — no title */}
          {hero.description && (
            <p className="r-summary">{hero.description}</p>
          )}

          {/* Experience */}
          {exp.length > 0 && (
            <div className="r-section">
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
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="r-section">
              <div className="r-section-title">Skills</div>
              <ul className="r-skills-list">
                {skills.map((cat, i) => (
                  <li key={i} className="r-skill-row">
                    <strong className="r-skill-cat">{cat.title}:</strong>{' '}{(cat.skills || []).join(', ')}.
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Education */}
          {edu.length > 0 && (
            <div className="r-section">
              <div className="r-section-title">Education</div>
              <ul className="r-edu-list">
                {edu.map((e, i) => (
                  <li key={i} className="r-edu">
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
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Certifications */}
          {certs.length > 0 && (
            <div className="r-section">
              <div className="r-section-title">Certifications</div>
              <ul className="r-certs">
                {certs.map((c, i) => (
                  <li key={i} className="r-cert">{c.text}</li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default ResumePage;
