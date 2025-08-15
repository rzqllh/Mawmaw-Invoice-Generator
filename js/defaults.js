// === Hafizh Signature Code ===
// Author: Hafizh Rizqullah — Invoice Generator
// File: js/defaults.js
// Created: 2025-08-14 10:12:03

export const bankPresets = [
  { id: 'bca', name: 'BCA', defaultHolder: 'Your Company Name', defaultNumber: '123-456-7890' },
  { id: 'mandiri', name: 'Mandiri', defaultHolder: 'Your Company Name', defaultNumber: '098-765-4321' },
  { id: 'bni', name: 'BNI', defaultHolder: 'Your Company Name', defaultNumber: '112-233-4455' },
  { id: 'bri', name: 'BRI', defaultHolder: 'Your Company Name', defaultNumber: '554-433-2211' },
  { id: 'cimb', name: 'CIMB Niaga', defaultHolder: 'Your Company Name', defaultNumber: '667-788-9900' },
  { id: 'custom', name: 'Lainnya...', defaultHolder: '', defaultNumber: '' }
];

export const getDefaultInvoiceRinciState = () => ({
  logo: './assets/logo-placeholder.png', // Placeholder logo
  company: {
    name: 'Your Company Name',
    contact: 'Your Name',
    email: 'contact@yourcompany.com',
    address: '123 Main Street\nCity, State, ZIP',
  },
  invoice: {
    title: 'INVOICE',
    date: new Date().toISOString().split('T')[0],
  },
  items: [
    { type: 'header', no: '1', desc: 'Description of Services', total: 0 },
    { type: 'item', desc: 'Example: Web Design Service', volume: 1, unit: 'project', price: 1500000 },
    { type: 'item', desc: 'Example: Monthly Hosting', volume: 1, unit: 'month', price: 250000 },
  ],
  summary: {
    discountPct: 0,
    rounding: 0,
  },
  terms: '<ul><li>Payment is due within 14 days.</li><li>Late payments are subject to a 5% fee.</li></ul>',
  milestones: [
    { stage: 'TAHAP 1', pct: '50%', desc: 'Down Payment (DP)' },
    { stage: 'TAHAP 2', pct: '50%', desc: 'Final Payment Upon Completion' },
  ],
  paymentInfo: {
    bankPresets: bankPresets,
    selectedBankId: 'bca',
    bankName: 'BCA',
    accountHolder: 'Your Company Name',
    accountNumber: '123-456-7890',
  }
});