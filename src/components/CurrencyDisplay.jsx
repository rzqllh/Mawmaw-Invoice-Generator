import React from 'react';
import { formatCurrencyParts } from '@/utils.js';
import styles from './CurrencyDisplay.module.css';

function CurrencyDisplay({ amount, currencyCode }) {
    const parts = formatCurrencyParts(amount, currencyCode);
    return (
      <div className={styles.currencyCell}>
        <span className={styles.currencySymbol}>{parts.symbol}</span>
        <span className={styles.currencyValue}>{parts.value}</span>
      </div>
    );
}

export default CurrencyDisplay;