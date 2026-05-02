import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getContent, updateSection } from '../lib/api';

const EditContext = createContext(null);

export function EditProvider({ children }) {
  const [token, setTokenState] = useState(() => localStorage.getItem('portfolio_token'));
  const [editMode, setEditMode] = useState(false);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let retries = 0;
    const tryFetch = () => {
      getContent()
        .then((data) => { if (!cancelled) { setContent(data); setLoading(false); } })
        .catch(() => {
          if (cancelled) return;
          if (retries < 4) {
            retries++;
            setTimeout(tryFetch, 800 * retries);
          } else {
            setLoading(false);
          }
        });
    };
    tryFetch();
    return () => { cancelled = true; };
  }, []);

  const isLoggedIn = Boolean(token);

  const setLoginToken = (t) => {
    setTokenState(t);
    localStorage.setItem('portfolio_token', t);
    localStorage.setItem('portfolio_owner', 'true'); // persists across logouts
  };

  const logout = () => {
    setTokenState(null);
    setEditMode(false);
    localStorage.removeItem('portfolio_token');
    // portfolio_owner intentionally kept — prevents self-tracking after logout
  };

  // pending > DB — no static fallback
  const getSection = useCallback(
    (section) => pending[section] ?? content?.[section] ?? null,
    [pending, content]
  );

  const updateField = useCallback((section, data) => {
    setPending((prev) => ({ ...prev, [section]: data }));
  }, []);

  const saveAll = async () => {
    setSaving(true);
    try {
      for (const [section, data] of Object.entries(pending)) {
        await updateSection(section, data, token);
      }
      setContent((prev) => ({ ...prev, ...pending }));
      setPending({});
      setEditMode(false);
    } catch (err) {
      const schema = err.details?.expected_structure;
      if (schema) {
        alert(
          `Save failed: ${err.message}\n\nExpected structure:\n${JSON.stringify(schema, null, 2)}`
        );
      } else {
        alert(`Save failed: ${err.message}`);
      }
    } finally {
      setSaving(false);
    }
  };

  const discardChanges = () => { setPending({}); setEditMode(false); };

  const refreshContent = useCallback(async () => {
    const data = await getContent();
    setContent(data);
    setPending({});
  }, []);

  return (
    <EditContext.Provider value={{
      isLoggedIn, editMode, setEditMode, token, setLoginToken, logout,
      getSection, updateField, saveAll, discardChanges, refreshContent,
      saving, loading, hasPendingChanges: Object.keys(pending).length > 0,
    }}>
      {children}
    </EditContext.Provider>
  );
}

export const useEdit = () => useContext(EditContext);
