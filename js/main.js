// === Hafizh Signature Code ===
// Author: Hafizh Rizqullah — Invoice Generator
// File: js/main.js
// Created: 2025-08-14 10:12:03

import { state } from './state.js';
import { loadStateFromStorage } from './storage.js';
import { renderApp, initEventListeners } from './editor.js';

// Import all available templates
import * as invoiceRinci from './templates/invoiceRinci.js';

// Map templates for dynamic selection
const templates = {
  invoiceRinci,
};

// --- App Initialization ---
function initialize() {
  // 1. Load data from storage or set defaults
  loadStateFromStorage();
  
  // 2. Find the active template module
  const activeTemplateModule = templates[state.activeTemplate];
  
  if (activeTemplateModule) {
    // 3. Perform the initial render
    renderApp(activeTemplateModule);

    // 4. Bind all event listeners
    initEventListeners();
  } else {
    console.error(`Template "${state.activeTemplate}" not found.`);
  }
}

// Start the app once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initialize);