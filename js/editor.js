// === Hafizh Signature Code ===
// Author: Hafizh Rizqullah — Invoice Generator
// File: js/editor.js
// Created: 2025-08-14 10:12:03

import { state } from './state.js';
import * as mutators from './mutators.js';
import * as actions from './actions.js';
import { saveStateToStorage } from './storage.js';
import { escapeHtml } from './utils.js';

let activeTemplateModule = null;
const TABS = [
  { id: 'info', label: 'Info' },
  { id: 'items', label: 'Items' },
  { id: 'payment', label: 'Catatan' },
];
let tinymceEditor = null;

// --- Main Render Function (The Conductor) ---
export function renderApp(templateModule) {
  activeTemplateModule = templateModule;
  
  renderPanel();
  renderPreview();
  saveStateToStorage();
}

function renderPanel() {
  const panel = document.getElementById('floating-panel');
  const overlay = document.getElementById('app-overlay');

  if (state.ui.isPanelOpen) {
    panel.classList.add('is-open');
    overlay.classList.add('is-active');
    renderPanelTabs();
    renderPanelContent();
  } else {
    panel.classList.remove('is-open');
    overlay.classList.remove('is-active');
  }
}

function renderPanelTabs() {
  const tabsContainer = document.getElementById('panel-tabs');
  tabsContainer.innerHTML = TABS.map(tab => `
    <button 
      class="tab-button ${state.ui.activeEditorTab === tab.id ? 'is-active' : ''}" 
      data-tab="${tab.id}">
      ${tab.label}
    </button>
  `).join('');
}

// --- Preview Renderer ---
function renderPreview() {
  const canvas = document.getElementById('invoice-canvas');
  if (activeTemplateModule) {
    canvas.innerHTML = activeTemplateModule.render(state.invoiceRinci);
  }
}

// --- Panel Content Renderer ---
function renderPanelContent() {
  const data = state.invoiceRinci;
  const contentDiv = document.getElementById('panel-content');
  
  switch (state.ui.activeEditorTab) {
    case 'info':
      contentDiv.innerHTML = `
        <div class="field"><label class="label">Logo Brand</label><div class="control"><input type="file" id="logo-upload" accept="image/*" class="input"></div></div>
        <div class="field"><label class="label">Nama Brand</label><div class="control"><input type="text" data-path="company.name" class="input" value="${escapeHtml(data.company.name)}"></div></div>
        <div class="field"><label class="label">Tanggal Invoice</label><div class="control"><input type="date" data-path="invoice.date" class="input" value="${data.invoice.date}"></div></div>
        <div class="field"><label class="label">Alamat Brand</label><div class="control"><textarea data-path="company.address" class="textarea" rows="2">${escapeHtml(data.company.address)}</textarea></div></div>
        <div class="field"><label class="label">Nama Kontak</label><div class="control"><input type="text" data-path="company.contact" class="input" value="${escapeHtml(data.company.contact)}"></div></div>
        <div class="field"><label class="label">Email</label><div class="control"><input type="email" data-path="company.email" class="input" value="${escapeHtml(data.company.email)}"></div></div>
      `;
      break;
    case 'items':
      contentDiv.innerHTML = `
        <div id="items-editor">
          ${data.items.map((item, index) => `
            <div class="box mb-4">
              ${item.type === 'header' ? `
                <div class="field"><label class="label">Kategori No. ${escapeHtml(item.no)}</label><input type="text" class="input" placeholder="Nama Kategori" value="${escapeHtml(item.desc)}" data-path="items.${index}.desc"></div>
                <div class="field"><label class="label is-small">Total Manual (opsional)</label><input type="number" class="input is-small" placeholder="Biarkan 0 untuk auto-sum" value="${item.total || ''}" data-path="items.${index}.total"></div>
              ` : `
                <div class="field"><label class="label">Deskripsi Item</label><input type="text" class="input" placeholder="Deskripsi Item" value="${escapeHtml(item.desc)}" data-path="items.${index}.desc"></div>
                <div class="columns is-mobile">
                  <div class="column field"><label class="label">Vol</label><input type="number" class="input" value="${item.volume}" data-path="items.${index}.volume"></div>
                  <div class="column field"><label class="label">Unit</label><input type="text" class="input" value="${escapeHtml(item.unit)}" data-path="items.${index}.unit"></div>
                  <div class="column field"><label class="label">Harga</label><input type="number" class="input" value="${item.price}" data-path="items.${index}.price"></div>
                </div>
              `}
              <button class="button is-danger is-small is-fullwidth mt-2" data-action="delete-item" data-index="${index}">Hapus</button>
            </div>
          `).join('')}
        </div>
        <button data-action="add-header" class="button is-link is-fullwidth">+ Tambah Kategori</button>
        <button data-action="add-item" class="button is-link is-light is-fullwidth mt-2">+ Tambah Item Lepas</button>
      `;
      break;
    case 'payment':
      const { paymentInfo } = data;
      contentDiv.innerHTML = `
        <div class="field"><label class="label">Potongan (%)</label><div class="control"><input type="number" data-path="summary.discountPct" class="input" value="${data.summary.discountPct}"></div></div>
        <div class="field"><label class="label">Pembulatan (+/-)</label><div class="control"><input type="number" data-path="summary.rounding" class="input" value="${data.summary.rounding}" placeholder="e.g. 500 or -500"></div></div>
        <hr>
        <div class="field"><label class="label">Syarat & Ketentuan</label>
            <textarea id="terms-editor"></textarea>
        </div>
        <div class="field mt-5"><label class="label">Tahap Pembayaran</label><div id="milestones-editor">
          ${(data.milestones || []).map((m, i) => `
            <div class="box mb-2 p-3">
              <div class="columns is-mobile">
                <div class="column field"><label class="label is-small">Tahap</label><input type="text" class="input is-small" value="${escapeHtml(m.stage)}" data-path="milestones.${i}.stage"></div>
                <div class="column field"><label class="label is-small">%</label><input type="text" class="input is-small" value="${escapeHtml(m.pct)}" data-path="milestones.${i}.pct"></div>
              </div>
              <div class="field"><label class="label is-small">Deskripsi</label><input type="text" class="input is-small" value="${escapeHtml(m.desc)}" data-path="milestones.${i}.desc"></div>
              <button class="button is-danger is-small is-fullwidth mt-2" data-action="delete-milestone" data-index="${i}">Hapus Tahap</button>
            </div>
          `).join('')}
        </div><button data-action="add-milestone" class="button is-small is-fullwidth">+ Tambah Tahap</button></div>
        <hr>
        <div class="field mt-5">
          <label class="label">Pilih Bank</label>
          <div class="control"><div class="select is-fullwidth"><select data-path="paymentInfo.selectedBankId">
            ${paymentInfo.bankPresets.map(bank => `<option value="${bank.id}" ${paymentInfo.selectedBankId === bank.id ? 'selected' : ''}>${escapeHtml(bank.name)}</option>`).join('')}
          </select></div></div>
        </div>
        <div class="field ${paymentInfo.selectedBankId !== 'custom' ? 'is-hidden' : ''}">
          <label class="label">Nama Bank (Custom)</label>
          <div class="control"><input type="text" data-path="paymentInfo.bankName" class="input" value="${escapeHtml(paymentInfo.bankName)}" placeholder="Masukkan nama bank"></div>
        </div>
        <div class="field">
          <label class="label">Atas Nama</label>
          <div class="control"><input type="text" data-path="paymentInfo.accountHolder" class="input" value="${escapeHtml(paymentInfo.accountHolder)}" placeholder="Nama Pemilik Rek."></div>
        </div>
        <div class="field">
          <label class="label">Nomor Rekening</label>
          <div class="control"><input type="text" data-path="paymentInfo.accountNumber" class="input" value="${escapeHtml(paymentInfo.accountNumber)}" placeholder="xxxxxxxxxx"></div>
        </div>
      `;
      initTinyMCE();
      break;
  }
}

// --- TinyMCE Initializer ---
function initTinyMCE() {
    tinymce.remove('#terms-editor');
    tinymce.init({
      selector: '#terms-editor',
      menubar: false,
      plugins: 'lists autolink link',
      toolbar: 'undo redo | bold italic underline | bullist numlist | alignleft aligncenter alignright | link',
      height: 200,
      content_style: "body { font-family: 'Inter', sans-serif; font-size: 14px; }",
      setup: (editor) => {
        tinymceEditor = editor;
        editor.on('init', () => editor.setContent(state.invoiceRinci.terms || ''));
        editor.on('input ExecCommand Change', () => {
          const content = editor.getContent();
          if (state.invoiceRinci.terms !== content) {
            actions.handleTermsUpdate(content);
            renderPreview();
            saveStateToStorage();
          }
        });
      }
    });
}

// --- Modal Management ---
const saveModal = document.getElementById('save-preset-modal');
const presetNameInput = document.getElementById('preset-name-input');

function openSaveModal() {
  saveModal.classList.add('is-active');
  presetNameInput.focus();
}

function closeSaveModal() {
  saveModal.classList.remove('is-active');
}

// --- Event Listeners Initializer ---
export function initEventListeners() {
  const panel = document.getElementById('floating-panel');
  const docDropdown = document.getElementById('document-dropdown');

  // Delegated listener for all body-level actions
  document.body.addEventListener('click', (e) => {
    const actionTarget = e.target.closest('[data-action]');
    if (actionTarget) {
      const { action } = actionTarget.dataset;
      let needsFullRender = false;

      switch (action) {
        case 'new': needsFullRender = actions.createNewDocument(); break;
        case 'save': openSaveModal(); break;
        case 'load': needsFullRender = actions.loadPreset(); break;
        case 'print': actions.printDocument(); break;
        case 'toggle-panel':
          mutators.setPanelVisibility(!state.ui.isPanelOpen);
          needsFullRender = true;
          break;
        case 'toggle-dropdown':
          docDropdown.classList.toggle('is-active');
          return; // Prevent dropdown from closing immediately
        case 'confirm-save-preset': 
          actions.confirmSavePreset(presetNameInput.value);
          closeSaveModal();
          break;
        case 'cancel-save-preset': closeSaveModal(); break;
      }
      
      if (needsFullRender) renderApp(activeTemplateModule);
    }
    
    // Close dropdown if clicking outside
    if (!docDropdown.contains(e.target)) {
      docDropdown.classList.remove('is-active');
    }
  });

  // Listener for panel-specific actions (tabs and content)
  panel.addEventListener('click', (e) => {
    // Tab switching
    const tabTarget = e.target.closest('[data-tab]');
    if (tabTarget) {
      mutators.setActiveEditorTab(tabTarget.dataset.tab);
      renderPanelTabs(); // Re-render tabs to show active state
      renderPanelContent(); // Re-render content for the new tab
      return;
    }

    // Item/Milestone actions
    const itemActionTarget = e.target.closest('[data-action]');
    if (itemActionTarget) {
      const { action, index } = itemActionTarget.dataset;
      let needsContentRender = false;
      switch (action) {
        case 'add-header': actions.addHeader(); needsContentRender = true; break;
        case 'add-item': actions.addItem(); needsContentRender = true; break;
        case 'delete-item': actions.deleteItem(Number(index)); needsContentRender = true; break;
        case 'add-milestone': actions.addMilestone(); needsContentRender = true; break;
        case 'delete-milestone': actions.deleteMilestone(Number(index)); needsContentRender = true; break;
      }
      if (needsContentRender) {
        renderPanelContent();
        renderPreview();
        saveStateToStorage();
      }
    }
  });

  // Listeners for closing the panel
  const closePanel = () => {
    mutators.setPanelVisibility(false);
    renderApp(activeTemplateModule);
  };
  document.getElementById('panel-close-btn').addEventListener('click', closePanel);
  document.getElementById('app-overlay').addEventListener('click', closePanel);

  // Delegated listener for all form inputs within the panel
  panel.addEventListener('input', (e) => {
    const inputTarget = e.target.closest('[data-path]');
    if (!inputTarget) return;

    const { path } = inputTarget.dataset;
    const value = inputTarget.value;
    
    const needsPanelReRender = actions.handleFieldUpdate(path, value);
    if (needsPanelReRender) {
      renderPanelContent(); // e.g., for bank selection logic
    }
    renderPreview();
    saveStateToStorage();
  });
  
  // Listener for file uploads
  panel.addEventListener('change', (e) => {
    if (e.target.id === 'logo-upload') {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
          mutators.setLogo(event.target.result);
          renderApp(activeTemplateModule);
      };
      reader.readAsDataURL(file);
    }
  });
}