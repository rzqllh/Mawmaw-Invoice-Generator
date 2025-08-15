// === Hafizh Signature Code ===
// Author: Hafizh Rizqullah — Invoice Generator
// File: js/templates/invoiceRinci.js
// Created: 2025-08-14 11:05:00

import { fmtIDR, parseNum, escapeHtml, formatDateFull, renderHtml } from '../utils.js';
import { calculate } from '../calculator.js';

export function render(data) {
    // All calculation logic is now handled by the imported calculator module.
    const calc = calculate(data);

    const itemsHtml = data.items.map((item, index) => {
        if (item.type === 'header') {
            const headerKey = `header-${index}`;
            const group = calc.itemGroups[headerKey];
            const displayTotal = group ? group.displayTotal : 0;

            return `
        <tr class="item-header-row">
          <td class="no">${escapeHtml(item.no)}</td>
          <td class="desc" colspan="4"><strong>${escapeHtml(item.desc)}</strong></td>
          <td class="total"><strong>${displayTotal > 0 ? fmtIDR(displayTotal) : ''}</strong></td>
        </tr>
      `;
        }
        
        const itemTotal = parseNum(item.volume) * parseNum(item.price);
        return `
      <tr class="item-row">
        <td class="no"></td>
        <td class="desc sub-item">${escapeHtml(item.desc) || '-'}</td>
        <td class="volume">${item.volume || ''}</td>
        <td class="unit">${escapeHtml(item.unit)}</td>
        <td class="price">${item.price > 0 ? fmtIDR(item.price) : ''}</td>
        <td class="total">${itemTotal > 0 ? fmtIDR(itemTotal) : ''}</td>
      </tr>
    `;
    }).join('');

    const milestonesHtml = (data.milestones || []).map(m => `
    <tr>
      <td>${escapeHtml(m.stage)}</td>
      <td>${escapeHtml(m.pct)}</td>
      <td>${escapeHtml(m.desc)}</td>
    </tr>
  `).join('');

    const { paymentInfo } = data;
    const bankInfoHtml = `
    <p><strong>${escapeHtml(paymentInfo.bankName)}</strong></p>
    <p>${escapeHtml(paymentInfo.accountNumber)}</p>
    <p>${escapeHtml(paymentInfo.accountHolder)}</p>
  `;

    return `
    <div class="invoice-rinci">
      <header class="invoice-header">
        <div class="invoice-title-section">
          <h1>${escapeHtml(data.invoice.title)}</h1>
          <img src="${data.logo}" alt="Company Logo" class="logo"/>
        </div>
        <div class="company-details">
          <div class="company-info-main">
            <p class="brand">${escapeHtml(data.company.name)}</p>
            <p>${escapeHtml(data.company.contact)} | <a href="mailto:${escapeHtml(data.company.email)}">${escapeHtml(data.company.email)}</a></p>
            <p class="address">${(data.company.address || '').replace(/\n/g, '<br>')}</p>
          </div>
          <div class="company-info-date">
            <p class="date">Tanggal: ${formatDateFull(data.invoice.date)}</p>
          </div>
        </div>
      </header>
      <main>
        <table class="items-table">
          <thead>
            <tr>
              <th class="no">No</th><th class="desc">Jenis Pekerjaan</th><th class="volume">Volume</th><th class="unit">Satuan</th><th class="price">Harga</th><th class="total">Total</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
          <tfoot>
            <tr><td colspan="5" class="summary-label">TOTAL</td><td class="summary-value">${fmtIDR(calc.subtotal)}</td></tr>
            ${calc.discountValue > 0 ? `<tr><td colspan="5" class="summary-label">POTONGAN (${data.summary.discountPct}%)</td><td class="summary-value">- ${fmtIDR(calc.discountValue)}</td></tr>` : ''}
            ${calc.discountValue > 0 ? `<tr><td colspan="5" class="summary-label">SUBTOTAL</td><td class="summary-value">${fmtIDR(calc.totalAfterDiscount)}</td></tr>` : ''}
            ${data.summary.rounding !== 0 ? `<tr><td colspan="5" class="summary-label">PEMBULATAN</td><td class="summary-value">${fmtIDR(calc.rounding)}</td></tr>` : ''}
            <tr class="grand-total"><td colspan="5" class="summary-label">GRAND TOTAL</td><td class="summary-value">${fmtIDR(calc.finalTotal)}</td></tr>
          </tfoot>
        </table>
      </main>
      <footer>
        <div class="footer-columns">
          <div class="terms-section">
            <h3>Syarat & Ketentuan</h3>
            <div class="terms-content">${renderHtml(data.terms)}</div>
          </div>
          <div class="payment-section">
            <h3>Pembayaran</h3>
            <table class="milestones-table">
              <tbody>${milestonesHtml}</tbody>
            </table>
            <div class="bank-info">${bankInfoHtml}</div>
          </div>
        </div>
      </footer>
    </div>
  `;
}