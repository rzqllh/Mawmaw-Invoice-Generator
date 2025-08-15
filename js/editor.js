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
const panelTitles = {
  info: 'Info Dokumen',
  items: 'Item Pekerjaan',
  payment: 'Catatan & Pembayaran'
};
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
  const panelTitle = document.getElementById('panel-title');

  if (state.ui.isPanelOpen) {
    panel.classList.add('is-open');
    overlay.classList.add('is-active');
    panelTitle.textContent = panelTitles[state.ui.activePanel] || 'Edit';
    renderEditorPanelContent();
  } else {
    panel.classList.remove('is-open');
    overlay.classList.remove('is-active');
  }
}

// --- Preview Renderer ---
function renderPreview() {
  const canvas = document.getElementById('invoice-canvas');
  if (activeTemplateModule) {
    canvas.innerHTML = activeTemplateModule.render(state.invoiceRinci);
  }
}

// --- Panel Content Renderer ---
function renderEditorPanelContent() {
  const data = state.invoiceRinci;
  const contentDiv = document.getElementById('panel-content');
  
  switch (state.ui.activePanel) {
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
        <div class="field"><label class="label">Pembulatan</label><div class="control"><input type="number" data-path="summary.rounding" class="input" value="${data.summary.rounding}"></div></div>
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
    tinymce.remove('#terms-editor'); // Ensure no old instances are lingering
    tinymce.init({
      selector: '#terms-editor',
      menubar: false,
      toolbar: 'bold italic | bullist numlist',
      plugins: 'lists autolink',
      height: 150,
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
  presetNameInput.value = '';
  saveModal.classList.add('is-active');
  presetNameInput.focus();
}

function closeSaveModal() {
  saveModal.classList.remove('is-active');
}

// --- Event Listeners Initializer ---
export function initEventListeners() {
  const panel = document.getElementById('floating-panel');

  // Delegated listener for all actions
  document.body.addEventListener('click', (e) => {
    const actionTarget = e.target.closest('[data-action]');
    if (actionTarget) {
      const { action, index } = actionTarget.dataset;
      let needsRender = false;

      switch (action) {
        case 'new': needsRender = actions.createNewDocument(); break;
        case 'save': openSaveModal(); break; // Open modal instead of prompt
        case 'load': needsRender = actions.loadPreset(); break;
        case 'print': actions.printDocument(); break;
        case 'add-header': actions.addHeader(); needsRender = true; break;
        case 'add-item': actions.addItem(); needsRender = true; break;
        case 'delete-item': actions.deleteItem(Number(index)); needsRender = true; break;
        case 'add-milestone': actions.addMilestone(); needsRender = true; break;
        case 'delete-milestone': actions.deleteMilestone(Number(index)); needsRender = true; break;
        case 'confirm-save-preset': 
          actions.confirmSavePreset(presetNameInput.value);
          closeSaveModal();
          break;
        case 'cancel-save-preset': closeSaveModal(); break;
      }
      
      if (needsRender) renderApp(activeTemplateModule);
    }
  });

  // Listener for panel toggles
  document.querySelector('.action-toolbar').addEventListener('click', (e) => {
    const panelTarget = e.target.closest('[data-panel]');
    if (panelTarget) {
      mutators.setPanelState(true, panelTarget.dataset.panel);
      renderApp(activeTemplateModule);
    }
  });

  // Listeners for closing the panel
  const closePanel = () => {
    mutators.setPanelState(false);
    renderApp(activeTemplateModule);
  };
  document.getElementById('panel-close-btn').addEventListener('click', closePanel);
  document.getElementById('app-overlay').addEventListener('click', closePanel);

  // Delegated listener for all form inputs
  panel.addEventListener('input', (e) => {
    const inputTarget = e.target.closest('[data-path]');
    if (!inputTarget) return;

    const { path } = inputTarget.dataset;
    const value = inputTarget.value;
    
    const needsPanelRender = actions.handleFieldUpdate(path, value);
    if (needsPanelRender) {
      renderEditorPanelContent();
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