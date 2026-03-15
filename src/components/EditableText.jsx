import React, { useRef, useEffect } from 'react';
import { useEdit } from '../context/EditContext';

/**
 * Renders text normally when not in edit mode.
 * In edit mode: contentEditable, highlighted, saves on blur.
 *
 * Props:
 *   richText — if true, saves/renders innerHTML so bold/italic/underline persist.
 */
/**
 * Recursively strip all inline styles and font attributes from an HTML element,
 * keeping only semantic tags (b, strong, i, em, u) and their content.
 */
function cleanNode(node) {
  if (node.nodeType === Node.TEXT_NODE) return node.cloneNode();
  const tag = node.nodeName.toLowerCase();
  const allowed = ['b', 'strong', 'i', 'em', 'u'];
  const wrapper = allowed.includes(tag)
    ? document.createElement(tag)
    : document.createDocumentFragment();
  node.childNodes.forEach(child => {
    const cleaned = cleanNode(child);
    wrapper.appendChild(cleaned);
  });
  return wrapper;
}

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
      // Strip inline styles/fonts from stored HTML before rendering
      const parser = new DOMParser();
      const doc = parser.parseFromString(value, 'text/html');
      const frag = document.createDocumentFragment();
      doc.body.childNodes.forEach(child => frag.appendChild(cleanNode(child)));
      const div = document.createElement('div');
      div.appendChild(frag);
      return <Tag className={className} style={style} dangerouslySetInnerHTML={{ __html: div.innerHTML }} />;
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
      onPaste={(e) => {
        e.preventDefault();
        if (richText) {
          // Parse pasted HTML, strip fonts/styles, keep only b/i/u
          const html = e.clipboardData.getData('text/html');
          if (html) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const frag = document.createDocumentFragment();
            doc.body.childNodes.forEach(child => frag.appendChild(cleanNode(child)));
            const div = document.createElement('div');
            div.appendChild(frag);
            document.execCommand('insertHTML', false, div.innerHTML);
          } else {
            const text = e.clipboardData.getData('text/plain');
            document.execCommand('insertText', false, text);
          }
        } else {
          const text = e.clipboardData.getData('text/plain');
          document.execCommand('insertText', false, text);
        }
      }}
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
