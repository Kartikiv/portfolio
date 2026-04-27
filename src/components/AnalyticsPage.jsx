import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BarChart2, RefreshCw, Trash2, ArrowLeft,
  Eye, MousePointer, TrendingUp, Clock,
} from 'lucide-react';
import { getMetrics, resetMetrics } from '../lib/api';
import { useEdit } from '../context/EditContext';

// ── Constants ────────────────────────────────────────────────────────────────
const RANGES = [
  { id: '24h', label: '24 h' },
  { id: '7d',  label: '7 d'  },
  { id: '30d', label: '30 d' },
  { id: 'all', label: 'All'  },
];

const BUCKET_LABELS = ['12am–4am', '4am–8am', '8am–12pm', '12pm–4pm', '4pm–8pm', '8pm–12am'];

const TYPE_META = {
  page_view:    { label: 'Page Views',    Icon: Eye          },
  section_view: { label: 'Section Views', Icon: TrendingUp   },
  cta_click:    { label: 'CTA Clicks',    Icon: MousePointer },
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function totalFor(totals, type) {
  return Number(totals.find((r) => r.event_type === type)?.count || 0);
}

function fmtDate(str) {
  // str = 'YYYY-MM-DD'
  const [, m, d] = str.split('-');
  return `${parseInt(m)}/${parseInt(d)}`;
}

// ── Mini bar (reusable) ──────────────────────────────────────────────────────
function Bar({ value, max, label, sublabel, color = 'var(--color-accent)', animated = true }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="an2-bar-col">
      <div className="an2-bar-track">
        <motion.div
          className="an2-bar-fill"
          style={{ background: color }}
          initial={animated ? { height: 0 } : { height: `${pct}%` }}
          animate={{ height: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      <span className="an2-bar-val">{value || 0}</span>
      <span className="an2-bar-label">{label}</span>
      {sublabel && <span className="an2-bar-sublabel">{sublabel}</span>}
    </div>
  );
}

// ── Daily chart ──────────────────────────────────────────────────────────────
function DailyChart({ daily, range }) {
  if (!daily?.length) return (
    <div className="an2-card">
      <div className="an2-card-title"><BarChart2 size={14} /> Daily Activity</div>
      <div className="an2-empty">No data for this range.</div>
    </div>
  );

  // Aggregate all event types into total per date
  const byDate = {};
  daily.forEach(({ date, count }) => {
    byDate[date] = (byDate[date] || 0) + Number(count);
  });

  const dates = Object.keys(byDate).sort();
  const max   = Math.max(...Object.values(byDate), 1);

  // For 24h range show last 24 hours as hourly — reuse the same chart with a note
  return (
    <div className="an2-card">
      <div className="an2-card-title"><BarChart2 size={14} /> Daily Activity</div>
      <div className="an2-bar-chart">
        {dates.map((date) => (
          <Bar
            key={date}
            value={byDate[date]}
            max={max}
            label={fmtDate(date)}
          />
        ))}
      </div>
    </div>
  );
}

// ── 4-hour traffic chart ─────────────────────────────────────────────────────
function BucketChart({ buckets }) {
  const byBucket = {};
  (buckets || []).forEach(({ bucket, count }) => {
    byBucket[Number(bucket)] = Number(count);
  });
  const values = BUCKET_LABELS.map((_, i) => byBucket[i] || 0);
  const max    = Math.max(...values, 1);

  return (
    <div className="an2-card">
      <div className="an2-card-title"><Clock size={14} /> Traffic by Time of Day (4 h buckets)</div>
      <div className="an2-bar-chart">
        {BUCKET_LABELS.map((label, i) => (
          <Bar key={i} value={values[i]} max={max} label={label} />
        ))}
      </div>
    </div>
  );
}

// ── Hourly chart (24h view) ──────────────────────────────────────────────────
function HourlyChart({ hourly }) {
  const byHour = {};
  (hourly || []).forEach(({ hour, count }) => {
    byHour[Number(hour)] = (byHour[Number(hour)] || 0) + Number(count);
  });
  const hours  = Array.from({ length: 24 }, (_, i) => i);
  const values = hours.map((h) => byHour[h] || 0);
  const max    = Math.max(...values, 1);

  const fmt = (h) => {
    const ampm = h < 12 ? 'am' : 'pm';
    const h12  = h % 12 || 12;
    return `${h12}${ampm}`;
  };

  return (
    <div className="an2-card">
      <div className="an2-card-title"><Clock size={14} /> Hourly Activity (last 24 h)</div>
      <div className="an2-bar-chart an2-bar-chart-24">
        {hours.map((h) => (
          <Bar key={h} value={values[h]} max={max} label={fmt(h)} />
        ))}
      </div>
    </div>
  );
}

// ── Top-keys breakdown ───────────────────────────────────────────────────────
function KeyBreakdown({ byKey }) {
  const grouped = {};
  (byKey || []).forEach((r) => {
    if (!grouped[r.event_type]) grouped[r.event_type] = [];
    grouped[r.event_type].push(r);
  });

  if (!Object.keys(grouped).length) return null;

  return (
    <>
      {Object.entries(grouped).map(([type, items]) => {
        const meta = TYPE_META[type] || { label: type, Icon: BarChart2 };
        const max  = Math.max(...items.map((r) => Number(r.count)), 1);
        return (
          <div key={type} className="an2-card">
            <div className="an2-card-title">
              <meta.Icon size={14} /> {meta.label} — by key
            </div>
            {items.slice(0, 15).map((r) => (
              <div key={r.event_key} className="an2-row">
                <span className="an2-row-key">{r.event_key.replace(/_/g, ' ')}</span>
                <div className="an2-row-track">
                  <motion.div
                    className="an2-row-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${(Number(r.count) / max) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="an2-row-count">{r.count}</span>
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const { token, isLoggedIn } = useEdit();
  const navigate = useNavigate();

  const [range, setRange]       = useState('7d');
  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(false);
  const [resetting, setResetting] = useState(false);
  const [error, setError]       = useState(null);

  useEffect(() => {
    if (!isLoggedIn) navigate('/login', { replace: true, state: { from: '/analytics' } });
  }, [isLoggedIn, navigate]);

  const load = useCallback(async (r = range) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      setData(await getMetrics(token, r));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [token, range]);

  useEffect(() => { load(range); }, [range]); // eslint-disable-line

  const handleRangeChange = (r) => {
    setRange(r);
    // load called via useEffect
  };

  const handleReset = async () => {
    if (!window.confirm('Delete all analytics data? This cannot be undone.')) return;
    setResetting(true);
    try {
      await resetMetrics(token);
      setData(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setResetting(false);
    }
  };

  const totals = data?.totals || [];
  const pageViews    = totalFor(totals, 'page_view');
  const sectionViews = totalFor(totals, 'section_view');
  const ctaClicks    = totalFor(totals, 'cta_click');
  const totalAll     = pageViews + sectionViews + ctaClicks;

  if (!isLoggedIn) return null;

  return (
    <div className="analytics-page">

      {/* ── Toolbar ──────────────────────────────────────────────────── */}
      <div className="analytics-toolbar">
        <button className="analytics-btn-back" onClick={() => navigate('/')}>
          <ArrowLeft size={14} /> Back
        </button>
        <span className="analytics-toolbar-title">
          <BarChart2 size={16} /> Analytics
        </span>
        <div className="analytics-toolbar-actions">
          <button className="analytics-icon-btn" onClick={() => load(range)} disabled={loading} title="Refresh">
            <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
          </button>
          <button className="analytics-icon-btn analytics-icon-btn-danger" onClick={handleReset} disabled={resetting}>
            <Trash2 size={14} /> Reset
          </button>
        </div>
      </div>

      <div className="analytics-body">

        {/* ── Range selector ───────────────────────────────────────────── */}
        <div className="an2-range-tabs">
          {RANGES.map((r) => (
            <button
              key={r.id}
              className={`an2-range-tab${range === r.id ? ' active' : ''}`}
              onClick={() => handleRangeChange(r.id)}
            >
              {r.label}
            </button>
          ))}
          {loading && <span className="an2-loading-pill">Loading…</span>}
        </div>

        {error && <div className="analytics-error">{error}</div>}

        {/* ── Summary cards ────────────────────────────────────────────── */}
        <div className="analytics-summary">
          {[
            { icon: Eye,          label: 'Page Views',    value: pageViews    },
            { icon: TrendingUp,   label: 'Section Views', value: sectionViews },
            { icon: MousePointer, label: 'CTA Clicks',    value: ctaClicks    },
            { icon: BarChart2,    label: 'Total Events',  value: totalAll     },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="analytics-summary-card">
              <Icon size={20} className="analytics-summary-icon" />
              <span className="analytics-summary-num">{value}</span>
              <span className="analytics-summary-label">{label}</span>
            </div>
          ))}
        </div>

        {(!data || totalAll === 0) && !loading && (
          <div className="analytics-empty">No events tracked in this range yet.</div>
        )}

        {data && totalAll > 0 && (
          <div className="an2-charts">
            {/* Daily or hourly activity */}
            {range === '24h'
              ? <HourlyChart hourly={data.hourly} />
              : <DailyChart  daily={data.daily} range={range} />
            }

            {/* 4-hour traffic pattern */}
            <BucketChart buckets={data.buckets} />

            {/* Top keys */}
            <KeyBreakdown byKey={data.byKey} />
          </div>
        )}

      </div>
    </div>
  );
}
