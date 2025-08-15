// === Hafizh Signature Code ===
// Author: Hafizh Rizqullah — Invoice Generator
// File: js/utils.js
// Created: 2025-08-14 11:05:00

export const fmtIDR = (n) => 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(n||0));

export function parseNum(v) {
  if (v === undefined || v === null || v === '') return 0;
  if (typeof v === 'number') return v;
  const cleanedString = String(v).replace(/[^0-9.-]/g, '');
  return Number(cleanedString) || 0;
}

export function escapeHtml(unsafe) {
  if (typeof unsafe !== 'string') return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Renders raw HTML content. Use this only for content that is known to be safe,
 * such as the output from the TinyMCE editor.
 * @param {string} content The HTML string to render.
 * @returns {string} The raw HTML string.
 */
export function renderHtml(content) {
    return content || '';
}

export function formatDateFull(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return d.toLocaleDateString('id-ID', options);
}