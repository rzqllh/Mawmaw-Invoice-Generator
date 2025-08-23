import React from 'react';
import { CURRENCIES } from '@/config/default.js';
import RichTextEditor from './RichTextEditor'; // Import the new editor
import styles from './Editors.module.css';

function SummaryEditor({ state, updateField }) {
    const { summary } = state;
    return (
        <div className={styles.editorPanel}>
            <h3 className={styles.editorSectionTitle}>Ringkasan & Catatan</h3>
            <div className={styles.formGroup}>
                <label>Mata Uang</label>
                <select value={summary.currencyCode} onChange={e => updateField('summary.currencyCode', e.target.value)}>
                    {CURRENCIES.map(c => <option key={c.code} value={c.code}>{`${c.name} (${c.symbol})`}</option>)}
                </select>
            </div>
            <div className={styles.formGroup}>
                <label>Label Diskon</label>
                <input type="text" value={summary.discount.label} onChange={e => updateField('summary.discount.label', e.target.value)} />
            </div>
            <div className={styles.formGroup}>
                <label>Persentase Diskon (%)</label>
                <input type="number" value={summary.discount.percentage} onChange={e => updateField('summary.discount.percentage', parseFloat(e.target.value) || 0)} />
            </div>
            <div className={styles.formGroup}>
                <label>Nilai Pembulatan</label>
                <input type="number" value={summary.rounding.value} onChange={e => updateField('summary.rounding.value', parseFloat(e.target.value) || 0)} />
            </div>
            <div className={styles.formGroup}>
                <label>Catatan</label>
                {/* Replace textarea with RichTextEditor */}
                <RichTextEditor 
                    value={summary.notes}
                    onChange={(content) => updateField('summary.notes', content)}
                />
            </div>
            <div className={styles.formGroup}>
                <label>Syarat & Ketentuan</label>
                <textarea rows="4" value={summary.terms} onChange={e => updateField('summary.terms', e.target.value)} />
            </div>
        </div>
    );
}
export default SummaryEditor;