import React from 'react';
import { Plus, Trash2 } from 'react-feather';
import { generateUUID } from '@/utils.js';
import styles from './Editors.module.css';

function StagesEditor({ state, setState }) {
    const { paymentStages } = state;
    const handleFieldChange = (index, field, value) => {
        const newStages = [...paymentStages];
        const val = field === 'percentage' ? parseFloat(value) || 0 : value;
        newStages[index][field] = val;
        setState({ ...state, paymentStages: newStages });
    };
    const addStage = () => {
        const newStage = { id: generateUUID(), stage: 'New Stage', percentage: 0, description: '' };
        setState({ ...state, paymentStages: [...paymentStages, newStage] });
    };
    const deleteStage = (index) => {
        const newStages = paymentStages.filter((_, i) => i !== index);
        setState({ ...state, paymentStages: newStages });
    };
    return (
        <div className={styles.editorPanel}>
            <h3 className={styles.editorSectionTitle}>Tahap Pembayaran</h3>
            {(paymentStages ?? []).map((stage, index) => (
                <div key={stage.id} className={styles.editorGroup}>
                    <div className={styles.editorGroupHeader}>
                        <div className={styles.editorGroupTitle}>
                            <input type="text" value={stage.stage} onChange={(e) => handleFieldChange(index, 'stage', e.target.value)} />
                        </div>
                        <div className={styles.editorGroupActions}>
                            <button className={`${styles.btnIcon} ${styles.btnIconDanger}`} onClick={() => deleteStage(index)}><Trash2 size={16} /></button>
                        </div>
                    </div>
                    <div className={styles.editorGroupContent}>
                        <div className={styles.formGroup}>
                            <label>Persentase (%)</label>
                            <input type="number" value={stage.percentage} onChange={(e) => handleFieldChange(index, 'percentage', e.target.value)} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Deskripsi</label>
                            <input type="text" value={stage.description} onChange={(e) => handleFieldChange(index, 'description', e.target.value)} />
                        </div>
                    </div>
                </div>
            ))}
            <button className={`${styles.btnPrimary} ${styles.btnFull}`} onClick={addStage}><Plus size={16} /> Tambah Tahap</button>
        </div>
    );
}
export default StagesEditor;