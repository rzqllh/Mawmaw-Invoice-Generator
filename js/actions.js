// === Hafizh Signature Code ===
// Author: Hafizh Rizqullah — Invoice Generator
// File: js/actions.js
// Created: 2025-08-14 10:12:03

import { state } from './state.js';
import * as mutators from './mutators.js';
import { bankPresets } from './defaults.js';

// --- Document Actions ---

export function createNewDocument() {
  if (confirm('Mulai dokumen baru? Perubahan yang tidak disimpan akan hilang.')) {
    mutators.resetState();
    return true; // Indicates a re-render is needed
  }
  return false;
}

export function confirmSavePreset(name) {
  const presetName = name.trim();
  if (presetName) {
    localStorage.setItem(`invoicer-preset-${presetName}`, JSON.stringify(state.invoiceRinci));
    alert(`Preset '${presetName}' disimpan.`);
  } else {
    alert('Nama preset tidak boleh kosong.');
  }
}

export function loadPreset() {
  // We keep the old prompt for loading as it's a simpler interaction.
  const presetName = prompt('Muat preset:');
  if (presetName) {
    const data = localStorage.getItem(`invoicer-preset-${presetName}`);
    if (data) {
      mutators.setInvoiceState(JSON.parse(data));
      alert(`Preset '${presetName}' dimuat.`);
      return true;
    } else {
      alert(`Preset tidak ditemukan.`);
    }
  }
  return false;
}

export function printDocument() {
  window.print();
}

// --- Item Actions ---

export function addHeader() {
  const items = [...state.invoiceRinci.items];
  const lastHeaderNo = items.filter(i => i.type === 'header').length;
  items.push({ type: 'header', no: String(lastHeaderNo + 1), desc: '' });
  mutators.setItems(items);
}

export function addItem() {
  const items = [...state.invoiceRinci.items];
  items.push({ type: 'item', desc: '', volume: 1, unit: 'pcs', price: 0 });
  mutators.setItems(items);
}

export function deleteItem(index) {
  const items = [...state.invoiceRinci.items];
  items.splice(index, 1);
  mutators.setItems(items);
}

// --- Milestone Actions ---

export function addMilestone() {
    const milestones = state.invoiceRinci.milestones ? [...state.invoiceRinci.milestones] : [];
    milestones.push({ stage: '', pct: '', desc: '' });
    mutators.setMilestones(milestones);
}

export function deleteMilestone(index) {
    const milestones = [...state.invoiceRinci.milestones];
    milestones.splice(index, 1);
    mutators.setMilestones(milestones);
}

// --- Field Update Actions ---

export function handleFieldUpdate(path, value) {
  mutators.updateStateValue(path, value);

  // Special logic for bank selection
  if (path === 'paymentInfo.selectedBankId') {
    const selectedBank = bankPresets.find(b => b.id === value);
    if (selectedBank) {
      mutators.updateStateValue('paymentInfo.bankName', selectedBank.name === 'Lainnya...' ? '' : selectedBank.name);
      mutators.updateStateValue('paymentInfo.accountHolder', selectedBank.defaultHolder);
      mutators.updateStateValue('paymentInfo.accountNumber', selectedBank.defaultNumber);
    }
    return true; // Needs re-render of panel content
  }
  return false; // No full panel re-render needed, only preview
}

export function handleLogoUpload(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        mutators.setLogo(event.target.result);
        // This is async, so we manually trigger render inside editor.js
    };
    reader.readAsDataURL(file);
}

export function handleTermsUpdate(content) {
    mutators.setTermsContent(content);
}