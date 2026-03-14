import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Save, X, LogOut, Shield, BarChart2 } from 'lucide-react';
import { useEdit } from '../context/EditContext';
import MetricsPanel from './MetricsPanel';

export default function AdminBar() {
  const { isLoggedIn, editMode, setEditMode, saveAll, discardChanges, logout, saving, hasPendingChanges } = useEdit();
  const [showMetrics, setShowMetrics] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isLoggedIn && (
          <motion.div
            className="admin-bar"
            initial={{ y: -56 }}
            animate={{ y: 0 }}
            exit={{ y: -56 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="admin-bar-left">
              <Shield size={16} />
              <span className="admin-bar-label">ADMIN MODE</span>
            </div>

            <div className="admin-bar-actions">
              <button
                className={`admin-btn admin-btn-metrics${showMetrics ? ' active' : ''}`}
                onClick={() => setShowMetrics((v) => !v)}
                title="Analytics"
              >
                <BarChart2 size={14} /> <span className="admin-btn-text">Analytics</span>
              </button>

              {!editMode ? (
                <button className="admin-btn admin-btn-edit" onClick={() => setEditMode(true)} title="Edit Content">
                  <Edit3 size={14} /> <span className="admin-btn-text">Edit Content</span>
                </button>
              ) : (
                <>
                  <button
                    className="admin-btn admin-btn-save"
                    onClick={saveAll}
                    disabled={saving}
                    title={saving ? 'Saving…' : 'Save'}
                  >
                    <Save size={14} />
                    <span className="admin-btn-text">{saving ? 'Saving…' : hasPendingChanges ? 'Save *' : 'Save'}</span>
                  </button>
                  <button className="admin-btn admin-btn-discard" onClick={discardChanges} title="Discard">
                    <X size={14} /> <span className="admin-btn-text">Discard</span>
                  </button>
                </>
              )}
              <button className="admin-btn admin-btn-logout" onClick={logout} title="Logout">
                <LogOut size={14} /> <span className="admin-btn-text">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLoggedIn && showMetrics && (
          <MetricsPanel onClose={() => setShowMetrics(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
