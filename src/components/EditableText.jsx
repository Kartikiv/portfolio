import React, { useRef, useEffect } from 'react';
import { useEdit } from '../context/EditContext';

/**
 * Renders text normally when not in edit mode.
 * In edit mode: contentEditable, highlighted, saves on blur.
 *
 * Usage:
 *   <EditableText tag="h1" className="hero-title" value={data.title}
 *     onChange={(v) => updateField('hero', { ...data, title: v })} />
 */
export default function EditableText({ tag: Tag = 'span', value, onChange, className, style, multiline = false }) {
  const { editMode } = useEdit();
  const ref = useRef(null);

  // Sync DOM to value when switching into edit mode
  useEffect(() => {
    if (editMode && ref.current && ref.current.textContent !== value) {
      ref.current.textContent = value;
    }
  }, [editMode, value]);

  if (!editMode) {
    return <Tag className={className} style={style}>{value}</Tag>;
  }

  return (
    <Tag
      ref={ref}
      className={`${className || ''} editable-field`}
      style={style}
      contentEditable
      suppressContentEditableWarning
      onKeyDown={(e) => {
        if (!multiline && e.key === 'Enter') e.preventDefault();
      }}
      onBlur={(e) => onChange?.(e.currentTarget.textContent.trim())}
    />
  );
}
