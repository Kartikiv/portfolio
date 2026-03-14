import React, { useState, useEffect } from 'react';
import { useEdit } from '../context/EditContext';

export default function FormatToolbar() {
  const { editMode } = useEdit();
  const [pos, setPos] = useState(null);
  const [active, setActive] = useState({ bold: false, italic: false, underline: false });

  useEffect(() => {
    if (!editMode) { setPos(null); return; }

    const update = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) { setPos(null); return; }

      const range = sel.getRangeAt(0);
      let node = range.commonAncestorContainer;
      if (node.nodeType === 3) node = node.parentNode;
      if (!node.closest?.('[data-richtext]')) { setPos(null); return; }

      const rect = range.getBoundingClientRect();
      setPos({ x: rect.left + rect.width / 2, y: rect.top - 44 });
      setActive({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
      });
    };

    document.addEventListener('selectionchange', update);
    return () => document.removeEventListener('selectionchange', update);
  }, [editMode]);

  const apply = (e, cmd) => {
    e.preventDefault(); // keep focus in contentEditable
    document.execCommand(cmd);
    setActive({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
    });
  };

  if (!pos) return null;

  return (
    <div style={{
      position: 'fixed',
      top: pos.y,
      left: pos.x,
      transform: 'translateX(-50%)',
      zIndex: 99999,
      background: '#1e1e2e',
      border: '1px solid rgba(139,92,246,0.4)',
      borderRadius: 8,
      padding: '3px 5px',
      display: 'flex',
      gap: 2,
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      pointerEvents: 'all',
    }}>
      {[
        { cmd: 'bold',      label: 'B', fw: 700, fi: 'normal', td: 'none' },
        { cmd: 'italic',    label: 'I', fw: 400, fi: 'italic', td: 'none' },
        { cmd: 'underline', label: 'U', fw: 400, fi: 'normal', td: 'underline' },
      ].map(({ cmd, label, fw, fi, td }) => (
        <button
          key={cmd}
          onMouseDown={(e) => apply(e, cmd)}
          style={{
            background: active[cmd] ? 'rgba(139,92,246,0.25)' : 'transparent',
            border: 'none',
            borderRadius: 4,
            color: active[cmd] ? '#a78bfa' : '#94a3b8',
            cursor: 'pointer',
            padding: '2px 8px',
            fontWeight: fw,
            fontStyle: fi,
            textDecoration: td,
            fontSize: '13px',
            minWidth: 28,
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
