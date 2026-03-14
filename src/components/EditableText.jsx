import React, { useRef, useEffect } from 'react';
import { useEdit } from '../context/EditContext';

/**
 * Renders text normally when not in edit mode.
 * In edit mode: contentEditable, highlighted, saves on blur.
 *
 * Props:
 *   richText — if true, saves/renders innerHTML so bold/italic/underline persist.
 */
export default function EditableText({ tag: Tag = 'span', value, onChange, className, style, multiline = false, richText = false }) {
  const { editMode } = useEdit();
  const ref = useRef(null);

  // Sync DOM content when entering edit mode or value changes externally
  useEffect(() => {
    if (editMode && ref.current) {
      if (richText) {
        ref.current.innerHTML = value || '';
      } else if (ref.current.textContent !== (value || '')) {
        ref.current.textContent = value || '';
      }
    }
  }, [editMode, value]);

  if (!editMode) {
    if (richText && value) {
      return <Tag className={className} style={style} dangerouslySetInnerHTML={{ __html: value }} />;
    }
    return <Tag className={className} style={style}>{value}</Tag>;
  }

  return (
    <Tag
      ref={ref}
      className={`${className || ''} editable-field`}
      style={style}
      contentEditable
      suppressContentEditableWarning
      data-richtext={richText ? 'true' : undefined}
      onKeyDown={(e) => {
        if (!multiline && e.key === 'Enter') e.preventDefault();
      }}
      onBlur={(e) => {
        const val = richText ? e.currentTarget.innerHTML : e.currentTarget.textContent.trim();
        onChange?.(val);
      }}
    />
  );
}
