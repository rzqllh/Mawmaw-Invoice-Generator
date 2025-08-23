import React from 'react';
import { RefreshCw, Download, Upload, Printer } from 'react-feather';
import styles from './MainHeader.module.css';
import editorStyles from './editors/Editors.module.css';

function MainHeader({ actions }) {
  const handleLoadClick = () => {
    document.getElementById('file-loader').click();
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerActions}>
        <button className={editorStyles.btnSecondary} onClick={actions.resetState} title="Reset to default" aria-label="Reset to default template">
          <RefreshCw size={16} /><span>Reset</span>
        </button>
        <button className={editorStyles.btnSecondary} onClick={actions.saveFile} title="Save draft as JSON file" aria-label="Save draft as JSON file">
          <Download size={16} /><span>Simpan</span>
        </button>
        <button className={editorStyles.btnSecondary} onClick={handleLoadClick} title="Load draft from JSON file" aria-label="Load draft from JSON file">
          <Upload size={16} /><span>Muat</span>
        </button>
        <button className={editorStyles.btnPrimary} onClick={() => window.print()} title="Print or Save as PDF" aria-label="Print or Save as PDF">
          <Printer size={16} /><span>Cetak/PDF</span>
        </button>
      </div>
    </header>
  );
}

export default MainHeader;