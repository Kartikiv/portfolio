import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BarChart2, RefreshCw, Trash2, ArrowLeft, Eye, MousePointer, TrendingUp } from 'lucide-react';
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

export default function AnalyticsPage() {
  const { token, isLoggedIn } = useEdit();
  const navigate = useNavigate();
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoggedIn) navigate('/login', { replace: true, state: { from: '/analytics' } });
  }, [isLoggedIn, navigate]);

  const load = useCallback(async () => {
    if (!token) return;
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

  useEffect(() => { load(); }, [load]);

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

  const grouped = rows
    ? rows.reduce((acc, r) => {
        if (!acc[r.event_type]) acc[r.event_type] = [];
        acc[r.event_type].push(r);
        return acc;
      }, {})
    : {};

  const totalViews   = rows?.filter(r => r.event_type === 'page_view').reduce((s, r) => s + Number(r.count), 0) || 0;
  const totalSections = rows?.filter(r => r.event_type === 'section_view').reduce((s, r) => s + Number(r.count), 0) || 0;
  const totalClicks  = rows?.filter(r => r.event_type === 'cta_click').reduce((s, r) => s + Number(r.count), 0) || 0;

  if (!isLoggedIn) return null;

  return (
    <div className="analytics-page">
      <div className="analytics-toolbar">
        <button className="analytics-btn-back" onClick={() => navigate('/')}>
          <ArrowLeft size={14} /> Back
        </button>
        <span className="analytics-toolbar-title"><BarChart2 size={16} /> Analytics</span>
        <div className="analytics-toolbar-actions">
          <button className="analytics-icon-btn" onClick={load} disabled={loading} title="Refresh">
            <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
          </button>
          <button className="analytics-icon-btn analytics-icon-btn-danger" onClick={handleReset} disabled={resetting} title="Reset All">
            <Trash2 size={14} /> Reset All
          </button>
        </div>
      </div>

      <div className="analytics-body">
        {/* Summary cards */}
        <div className="analytics-summary">
          {[
            { icon: Eye, label: 'Page Views', value: totalViews },
            { icon: TrendingUp, label: 'Section Views', value: totalSections },
            { icon: MousePointer, label: 'CTA Clicks', value: totalClicks },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="analytics-summary-card">
              <Icon size={20} className="analytics-summary-icon" />
              <span className="analytics-summary-num">{value}</span>
              <span className="analytics-summary-label">{label}</span>
            </div>
          ))}
        </div>

        {error && <div className="analytics-error">{error}</div>}
        {loading && !rows && <div className="analytics-loading">Loading…</div>}
        {rows && Object.keys(grouped).length === 0 && (
          <div className="analytics-empty">No events tracked yet.</div>
        )}

        {/* Event groups */}
        <div className="analytics-groups">
          {rows && Object.entries(grouped).map(([type, items]) => {
            const Icon = TYPE_ICON[type] || BarChart2;
            const max = Math.max(...items.map(r => Number(r.count)), 1);
            return (
              <div key={type} className="analytics-group">
                <div className="analytics-group-title">
                  <Icon size={14} /> {TYPE_LABEL[type] || type}
                </div>
                {items.map((r) => (
                  <div key={r.event_key} className="analytics-row">
                    <span className="analytics-row-key">{r.event_key.replace(/_/g, ' ')}</span>
                    <div className="analytics-bar-wrap">
                      <motion.div
                        className="analytics-bar"
                        initial={{ width: 0 }}
                        animate={{ width: `${(Number(r.count) / max) * 100}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                    <span className="analytics-row-count">{r.count}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
