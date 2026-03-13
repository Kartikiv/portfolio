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
              >
                <BarChart2 size={14} /> Analytics
              </button>

              {!editMode ? (
                <button className="admin-btn admin-btn-edit" onClick={() => setEditMode(true)}>
                  <Edit3 size={14} /> Edit Content
                </button>
              ) : (
                <>
                  <button
                    className="admin-btn admin-btn-save"
                    onClick={saveAll}
                    disabled={saving}
                  >
                    <Save size={14} />
                    {saving ? 'Saving…' : hasPendingChanges ? 'Save Changes *' : 'Save'}
                  </button>
                  <button className="admin-btn admin-btn-discard" onClick={discardChanges}>
                    <X size={14} /> Discard
                  </button>
                </>
              )}
              <button className="admin-btn admin-btn-logout" onClick={logout}>
                <LogOut size={14} /> Logout
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
