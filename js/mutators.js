// === Hafizh Signature Code ===
// Author: Hafizh Rizqullah — Invoice Generator
// File: js/mutators.js
// Created: 2025-08-14 10:12:03

import { state } from './state.js';
import { getDefaultInvoiceRinciState } from './defaults.js';

/**
 * Updates a value in the state using a dot-notation path.
 * @param {string} path - The path to the value (e.g., "company.name").
 * @param {*} value - The new value to set.
 */
export function updateStateValue(path, value) {
    const keys = path.split('.');
    let obj = state.invoiceRinci;
    keys.slice(0, -1).forEach(key => {
        if (!obj[key]) obj[key] = {};
        obj = obj[key];
    });
    obj[keys[keys.length - 1]] = value;
}

/**
 * Updates the entire items array.
 * @param {Array} newItems - The new array of items.
 */
export function setItems(newItems) {
    state.invoiceRinci.items = newItems;
}

/**
 * Updates the entire milestones array.
 * @param {Array} newMilestones - The new array of milestones.
 */
export function setMilestones(newMilestones) {
    state.invoiceRinci.milestones = newMilestones;
}

/**
 * Sets the logo data URL in the state.
 * @param {string} dataUrl - The base64 data URL of the logo.
 */
export function setLogo(dataUrl) {
    state.invoiceRinci.logo = dataUrl;
}

/**
 * Sets the content for the terms editor.
 * @param {string} htmlContent - The HTML content from TinyMCE.
 */
export function setTermsContent(htmlContent) {
    state.invoiceRinci.terms = htmlContent;
}

/**
 * Updates the entire invoiceRinci state, typically from a preset.
 * @param {object} newInvoiceState - The new invoice state object.
 */
export function setInvoiceState(newInvoiceState) {
    state.invoiceRinci = newInvoiceState;
}

/**
 * Resets the application state to its default values.
 */
export function resetState() {
    state.invoiceRinci = getDefaultInvoiceRinciState();
    state.ui.isPanelOpen = false;
    state.ui.activeEditorTab = 'info'; // Reset to the default tab
}

/**
 * Manages the UI panel visibility.
 * @param {boolean} isOpen - Whether the panel should be open.
 */
export function setPanelVisibility(isOpen) {
    state.ui.isPanelOpen = isOpen;
}

/**
 * Sets the active tab in the editor panel.
 * @param {string} tabName - The context of the panel ('info', 'items', 'payment').
 */
export function setActiveEditorTab(tabName) {
    state.ui.activeEditorTab = tabName;
}