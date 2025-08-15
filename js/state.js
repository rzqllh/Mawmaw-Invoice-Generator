// === Hafizh Signature Code ===
// Author: Hafizh Rizqullah — Invoice Generator
// File: js/state.js
// Created: 2025-08-14 10:12:03

import { getDefaultInvoiceRinciState } from './defaults.js';

/**
 * The single source of truth for the application's state.
 * It is initialized with default values and mutated only through
 * functions in mutators.js.
 */
export const state = {
  activeTemplate: 'invoiceRinci',
  invoiceRinci: getDefaultInvoiceRinciState(),
  ui: {
    isPanelOpen: false,
    // REFACTORED: 'activePanel' is now 'activeEditorTab' to support the new tabbed interface.
    activeEditorTab: 'info', // 'info', 'items', 'payment'
  }
};