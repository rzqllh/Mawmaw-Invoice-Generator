// === Hafizh Signature Code ===
// Author: Hafizh Rizqullah — Invoice Generator
// File: js/storage.js
// Created: 2025-08-14 10:12:03

import { state } from './state.js';
import { bankPresets, getDefaultInvoiceRinciState } from './defaults.js';

const STORAGE_KEY = 'invoicer-state-v11'; // Version bump for new structure

/**
 * Saves the current application state to localStorage.
 * The UI state is explicitly excluded from persistence.
 */
export function saveStateToStorage() {
  const stateToSave = {
    activeTemplate: state.activeTemplate,
    invoiceRinci: state.invoiceRinci,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
}

/**
 * Loads the application state from localStorage.
 * If no saved state is found, it initializes with default values.
 * It intelligently merges loaded data with defaults to prevent missing keys.
 */
export function loadStateFromStorage() {
  const savedStateJSON = localStorage.getItem(STORAGE_KEY);
  
  if (savedStateJSON) {
    const loadedState = JSON.parse(savedStateJSON);
    
    // Merge loaded state with defaults to ensure all keys exist
    state.activeTemplate = loadedState.activeTemplate || 'invoiceRinci';
    state.invoiceRinci = {
        ...getDefaultInvoiceRinciState(),
        ...loadedState.invoiceRinci,
        company: { ...getDefaultInvoiceRinciState().company, ...loadedState.invoiceRinci?.company },
        invoice: { ...getDefaultInvoiceRinciState().invoice, ...loadedState.invoiceRinci?.invoice },
        summary: { ...getDefaultInvoiceRinciState().summary, ...loadedState.invoiceRinci?.summary },
        paymentInfo: { ...getDefaultInvoiceRinciState().paymentInfo, ...loadedState.invoiceRinci?.paymentInfo }
    };
    
    // Always ensure bank presets are up-to-date from the defaults module
    state.invoiceRinci.paymentInfo.bankPresets = bankPresets;

  } else {
    // Initialize with default state if nothing is saved
    state.invoiceRinci = getDefaultInvoiceRinciState();
  }
}