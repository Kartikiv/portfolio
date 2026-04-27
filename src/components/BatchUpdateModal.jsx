import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Upload, CheckCircle2, XCircle, Loader2, FileJson,
  Download, Copy, Check, RefreshCw, GitMerge,
} from 'lucide-react';
import { useEdit } from '../context/EditContext';
import { updateSection, getContent } from '../lib/api';

// Sections that can be PUT directly
const STANDARD_SECTIONS = ['hero', 'skills', 'experience', 'projects', 'certifications', 'education', 'contact'];
const VALID_SECTIONS = [...STANDARD_SECTIONS, 'customSections'];

const STATUS_ICON = {
  pending:  null,
  applying: <Loader2 size={13} className="bu-spin" />,
  done:     <CheckCircle2 size={13} style={{ color: '#22c55e' }} />,
  error:    <XCircle     size={13} style={{ color: '#ef4444' }} />,
};

export default function BatchUpdateModal({ onClose }) {
  const { token, refreshContent, getSection } = useEdit();

  const [raw, setRaw]               = useState('');
  const [parsed, setParsed]         = useState(null);
  const [parseError, setParseError] = useState(null);
  const [sectionStatus, setSectionStatus] = useState(null);
  const [applying, setApplying]     = useState(false);
  const [done, setDone]             = useState(false);
  const [loadingCurrent, setLoadingCurrent] = useState(false);
  const [copied, setCopied]         = useState(false);

  const textareaRef = useRef(null);

  // ── Parse textarea value ─────────────────────────────────────────────────
  const parseValue = useCallback((val) => {
    setRaw(val);
    setSectionStatus(null);
    setDone(false);
    if (!val.trim()) { setParsed(null); setParseError(null); return; }
    try {
      const obj = JSON.parse(val);
      if (typeof obj !== 'object' || Array.isArray(obj)) {
        setParsed(null);
        setParseError('Root value must be a JSON object { }');
        return;
      }
      setParsed(obj);
      setParseError(null);
    } catch (err) {
      setParsed(null);
      setParseError(err.message);
    }
  }, []);

  const handleChange = useCallback((e) => parseValue(e.target.value), [parseValue]);

  // ── Load current resume from the API ────────────────────────────────────
  const loadCurrentResume = useCallback(async () => {
    setLoadingCurrent(true);
    try {
      const data = await getContent();
      const json = JSON.stringify(data, null, 2);
      parseValue(json);
      setTimeout(() => textareaRef.current?.focus(), 50);
    } catch (err) {
      setParseError(`Failed to load: ${err.message}`);
    } finally {
      setLoadingCurrent(false);
    }
  }, [parseValue]);

  // ── Copy textarea to clipboard ───────────────────────────────────────────
  const copyToClipboard = useCallback(() => {
    if (!raw) return;
    navigator.clipboard.writeText(raw).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [raw]);

  // ── Derive valid / unknown keys ──────────────────────────────────────────
  const validKeys   = parsed ? Object.keys(parsed).filter((k) =>  VALID_SECTIONS.includes(k)) : [];
  const unknownKeys = parsed ? Object.keys(parsed).filter((k) => !VALID_SECTIONS.includes(k)) : [];

  // ── Apply updates ────────────────────────────────────────────────────────
  const handleApply = useCallback(async () => {
    if (!validKeys.length) return;
    setApplying(true);

    const initial = {};
    validKeys.forEach((k) => { initial[k] = 'pending'; });
    setSectionStatus(initial);

    let allOk = true;

    for (const section of validKeys) {
      setSectionStatus((prev) => ({ ...prev, [section]: 'applying' }));
      try {
        let payload = parsed[section];

        // ── customSections: merge by id, don't replace ───────────────────
        if (section === 'customSections') {
          const existing      = getSection('customSections') || { sections: [] };
          const existingList  = existing.sections || [];
          const patchList     = payload?.sections || [];

          // Start from the existing list so unlisted sections survive
          const merged = [...existingList];
          for (const ps of patchList) {
            const idx = merged.findIndex((s) => s.id === ps.id);
            if (idx >= 0) {
              merged[idx] = ps;          // update existing section
            } else {
              merged.push(ps);           // add new section
            }
          }
          payload = { sections: merged };
        }

        await updateSection(section, payload, token);
        setSectionStatus((prev) => ({ ...prev, [section]: 'done' }));
      } catch {
        setSectionStatus((prev) => ({ ...prev, [section]: 'error' }));
        allOk = false;
      }
    }

    await refreshContent();
    setApplying(false);
    setDone(true);
    if (allOk) setTimeout(() => onClose(), 1500);
  }, [validKeys, parsed, token, refreshContent, getSection, onClose]);

  const canApply = validKeys.length > 0 && !applying && !done;

  return (
    <AnimatePresence>
      <motion.div
        className="bu-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => { if (e.target === e.currentTarget && !applying) onClose(); }}
      >
        <motion.div
          className="bu-modal"
          initial={{ scale: 0.94, opacity: 0, y: 16 }}
          animate={{ scale: 1,    opacity: 1, y: 0  }}
          exit={{ scale: 0.94,    opacity: 0, y: 16 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        >

          {/* ── Header ────────────────────────────────────────────────── */}
          <div className="bu-header">
            <div className="bu-header-left">
              <FileJson size={18} />
              <span className="bu-title">Batch Update Resume</span>
            </div>
            <div className="bu-header-actions">
              <button
                className="bu-header-btn"
                onClick={loadCurrentResume}
                disabled={loadingCurrent || applying}
                title="Load current resume JSON into editor"
              >
                {loadingCurrent
                  ? <Loader2 size={13} className="bu-spin" />
                  : <Download size={13} />
                }
                <span>{loadingCurrent ? 'Loading…' : 'Load current resume'}</span>
              </button>
              <button className="bu-close" onClick={onClose} disabled={applying} title="Close">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* ── Instructions ──────────────────────────────────────────── */}
          <div className="bu-instructions">
            <strong>Load current resume</strong> to see exact JSON, edit what you need, delete the rest, then hit <strong>Apply</strong>.
            Only included sections are touched — everything else stays as-is.
            <div className="bu-rules">
              <span className="bu-rule"><span className="bu-rule-key">Standard sections</span> — fully replaced with what you paste</span>
              <span className="bu-rule bu-rule-merge">
                <GitMerge size={11} />
                <span className="bu-rule-key">customSections</span> — merged by <code>id</code>: existing sections updated, new ones added, unlisted ones untouched
              </span>
            </div>
          </div>

          {/* ── Editor toolbar ────────────────────────────────────────── */}
          <div className="bu-editor-toolbar">
            <span className="bu-editor-hint">
              {raw ? `${raw.split('\n').length} lines` : 'Paste or load JSON below'}
            </span>
            {raw && (
              <button className="bu-toolbar-btn" onClick={copyToClipboard} title="Copy to clipboard">
                {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
              </button>
            )}
          </div>

          {/* ── Textarea ──────────────────────────────────────────────── */}
          <div className="bu-editor-wrap">
            <textarea
              ref={textareaRef}
              className={`bu-editor${parseError ? ' bu-editor-error' : parsed ? ' bu-editor-ok' : ''}`}
              value={raw}
              onChange={handleChange}
              placeholder={'{\n  "experience": { ... },\n  "customSections": { "sections": [ ... ] }\n}\n\nClick "Load current resume" above to start from the full live JSON.'}
              spellCheck={false}
              disabled={applying}
            />
          </div>

          {/* ── Parse error ───────────────────────────────────────────── */}
          {parseError && (
            <div className="bu-feedback bu-feedback-error">
              <XCircle size={14} /> <span>{parseError}</span>
            </div>
          )}

          {/* ── Valid sections preview ────────────────────────────────── */}
          {parsed && !parseError && (
            <div className="bu-feedback bu-feedback-ok">
              {validKeys.length > 0 && (
                <div className="bu-will-update">
                  <span className="bu-feedback-label">Will update:</span>
                  {validKeys.map((k) => (
                    <span key={k} className={`bu-pill bu-pill-update${k === 'customSections' ? ' bu-pill-merge' : ''}`}>
                      {STATUS_ICON[sectionStatus?.[k] ?? 'pending']}
                      {k === 'customSections' ? <GitMerge size={10} /> : null}
                      {k}
                    </span>
                  ))}
                </div>
              )}
              {unknownKeys.length > 0 && (
                <div className="bu-ignored">
                  <span className="bu-feedback-label">Ignored:</span>
                  {unknownKeys.map((k) => (
                    <span key={k} className="bu-pill bu-pill-ignored">{k}</span>
                  ))}
                </div>
              )}
              {validKeys.length === 0 && (
                <span className="bu-no-sections">No valid section keys found — check spelling.</span>
              )}
            </div>
          )}

          {/* ── Done banner ───────────────────────────────────────────── */}
          {done && (
            <div className={`bu-done-banner ${Object.values(sectionStatus || {}).some((s) => s === 'error') ? 'bu-done-banner-partial' : 'bu-done-banner-ok'}`}>
              {Object.values(sectionStatus || {}).some((s) => s === 'error')
                ? <><XCircle size={15} /> Some sections failed — check above.</>
                : <><CheckCircle2 size={15} /> All sections updated successfully!</>
              }
            </div>
          )}

          {/* ── Footer ────────────────────────────────────────────────── */}
          <div className="bu-footer">
            <button className="bu-btn bu-btn-cancel" onClick={onClose} disabled={applying}>
              Cancel
            </button>
            <button className="bu-btn bu-btn-apply" onClick={handleApply} disabled={!canApply}>
              {applying
                ? <><Loader2 size={14} className="bu-spin" /> Applying…</>
                : done
                ? <><RefreshCw size={14} /> Done</>
                : <><Upload size={14} /> Apply Updates</>
              }
            </button>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
