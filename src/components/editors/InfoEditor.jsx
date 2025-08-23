import React, { useState } from 'react';
import styles from './Editors.module.css';

function InfoEditor({ state, updateField }) {
  const { company, client, invoice, ui } = state;
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        updateField('company.logo', event.target.result);
      };
      reader.readAsDataURL(file);
    } else {
        setFileName('');
    }
  };

  return (
    <div className={styles.editorPanel}>
      <div className={styles.editorSection}>
        <h3 className={styles.editorSectionTitle}>Info Utama</h3>
        <div className={styles.formGroup}>
          <label htmlFor="company-name">Nama Perusahaan</label>
          <input type="text" id="company-name" value={company.name} onChange={e => updateField('company.name', e.target.value)} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="company-address">Alamat</label>
          <textarea id="company-address" rows="3" value={company.address} onChange={e => updateField('company.address', e.target.value)} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="logo-uploader">Logo Perusahaan</label>
          <div className={styles.formGroupFile}>
            <input type="file" id="logo-uploader" accept="image/*" className={styles.fileInputHidden} onChange={handleFileChange} />
            <label htmlFor="logo-uploader" className={styles.btnFileChooser}>Choose File</label>
            <span className={styles.fileNameDisplay}>{fileName || 'No file chosen'}</span>
          </div>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="theme-color">Warna Tema</label>
          <input type="color" id="theme-color" value={ui.themeColor} onChange={e => updateField('ui.themeColor', e.target.value)} />
        </div>
      </div>
      <div className={styles.editorSection}>
        <h3 className={styles.editorSectionTitle}>Klien</h3>
        <div className={styles.formGroup}><label htmlFor="client-name">Nama Klien</label><input type="text" id="client-name" value={client.name} onChange={e => updateField('client.name', e.target.value)} /></div>
        <div className={styles.formGroup}><label htmlFor="client-address">Alamat</label><textarea id="client-address" rows="3" value={client.address} onChange={e => updateField('client.address', e.target.value)} /></div>
        <div className={styles.formGroup}><label htmlFor="client-phone">Telepon</label><input type="text" id="client-phone" value={client.phone} onChange={e => updateField('client.phone', e.target.value)} /></div>
      </div>
      <div className={styles.editorSection}>
        <h3 className={styles.editorSectionTitle}>Invoice</h3>
        <div className={styles.formGroup}><label htmlFor="invoice-title">Judul</label><input type="text" id="invoice-title" value={invoice.title} onChange={e => updateField('invoice.title', e.target.value)} /></div>
        <div className={styles.formGroup}><label htmlFor="invoice-number">Nomor Invoice</label><input type="text" id="invoice-number" value={invoice.number} onChange={e => updateField('invoice.number', e.target.value)} /></div>
        <div className={styles.formGroup}><label htmlFor="invoice-date">Tanggal Invoice</label><input type="date" id="invoice-date" value={invoice.date} onChange={e => updateField('invoice.date', e.target.value)} /></div>
        <div className={styles.formGroup}><label htmlFor="invoice-due-date">Tenggat Waktu</label><input type="date" id="invoice-due-date" value={invoice.dueDate} onChange={e => updateField('invoice.dueDate', e.target.value)} /></div>
      </div>
    </div>
  );
}

export default InfoEditor;