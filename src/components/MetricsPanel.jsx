import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart2, RefreshCw, Trash2, X, Eye, MousePointer, TrendingUp } from 'lucide-react';
import { getMetrics, resetMetrics } from '../lib/api';
import { useEdit } from '../context/EditContext';

const TYPE_ICON = {
  page_view: Eye,
  section_view: TrendingUp,
  cta_click: MousePointer,
};

const TYPE_LABEL = {
  page_view: 'Page Views',
  section_view: 'Section Views',
  cta_click: 'Button Clicks',
};

export default function MetricsPanel({ onClose }) {
  const { token } = useEdit();
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMetrics(token);
      setRows(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Load on first open
  React.useEffect(() => { load(); }, [load]);

  const handleReset = async () => {
    if (!window.confirm('Reset all metrics? This cannot be undone.')) return;
    setResetting(true);
    try {
      await resetMetrics(token);
      setRows([]);
    } catch (e) {
      setError(e.message);
    } finally {
      setResetting(false);
    }
  };

  // Group rows by event_type
  const grouped = rows
    ? rows.reduce((acc, r) => {
        if (!acc[r.event_type]) acc[r.event_type] = [];
        acc[r.event_type].push(r);
        return acc;
      }, {})
    : {};

  const totalViews = rows?.filter(r => r.event_type === 'page_view').reduce((s, r) => s + Number(r.count), 0) || 0;
  const totalSections = rows?.filter(r => r.event_type === 'section_view').reduce((s, r) => s + Number(r.count), 0) || 0;
  const totalClicks = rows?.filter(r => r.event_type === 'cta_click').reduce((s, r) => s + Number(r.count), 0) || 0;

  return (
    <motion.div
      className="metrics-panel"
      initial={{ opacity: 0, y: -10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.97 }}
      transition={{ duration: 0.2 }}
    >
      <div className="metrics-panel-header">
        <span className="metrics-panel-title"><BarChart2 size={16} /> Analytics</span>
        <div className="metrics-panel-actions">
          <button className="metrics-icon-btn" onClick={load} title="Refresh" disabled={loading}>
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
          </button>
          <button className="metrics-icon-btn metrics-icon-btn-danger" onClick={handleReset} title="Reset All" disabled={resetting}>
            <Trash2 size={14} />
          </button>
          <button className="metrics-icon-btn" onClick={onClose} title="Close">
            <X size={14} />
          </button>
        </div>
      </div>

      {error && <div className="metrics-error">{error}</div>}

      <div className="metrics-summary">
        <div className="metrics-summary-item">
          <Eye size={14} />
          <span className="metrics-summary-num">{totalViews}</span>
          <span className="metrics-summary-label">Page Views</span>
        </div>
        <div className="metrics-summary-item">
          <TrendingUp size={14} />
          <span className="metrics-summary-num">{totalSections}</span>
          <span className="metrics-summary-label">Section Views</span>
        </div>
        <div className="metrics-summary-item">
          <MousePointer size={14} />
          <span className="metrics-summary-num">{totalClicks}</span>
          <span className="metrics-summary-label">CTA Clicks</span>
        </div>
      </div>

      {loading && !rows && (
        <div className="metrics-loading">Loading…</div>
      )}

      {rows && Object.keys(grouped).length === 0 && (
        <div className="metrics-empty">No events tracked yet.</div>
      )}

      {rows && Object.entries(grouped).map(([type, items]) => {
        const Icon = TYPE_ICON[type] || BarChart2;
        const max = Math.max(...items.map(r => Number(r.count)), 1);
        return (
          <div key={type} className="metrics-group">
            <div className="metrics-group-title"><Icon size={12} /> {TYPE_LABEL[type] || type}</div>
            {items.map((r) => (
              <div key={r.event_key} className="metrics-row">
                <span className="metrics-row-key">{r.event_key.replace(/_/g, ' ')}</span>
                <div className="metrics-bar-wrap">
                  <motion.div
                    className="metrics-bar"
                    initial={{ width: 0 }}
                    animate={{ width: `${(Number(r.count) / max) * 100}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
                <span className="metrics-row-count">{r.count}</span>
              </div>
            ))}
          </div>
        );
      })}
    </motion.div>
  );
}
