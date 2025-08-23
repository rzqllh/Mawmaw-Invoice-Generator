import { generateUUID } from "../utils.js";

// ... (CURRENCIES, BANK_LIST remain the same)
export const CURRENCIES = [
    { code: 'IDR', symbol: 'Rp', name: 'Rupiah Indonesia' },
    { code: 'USD', symbol: '$', name: 'Dolar Amerika Serikat' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
];
export const BANK_LIST = [
    "Bank Mandiri", "Bank BCA", "Bank BNI", "Bank BRI", "Bank CIMB Niaga",
    "Bank Danamon", "Bank Permata", "Bank Panin", "Bank OCBC NISP",
    "Bank UOB Indonesia", "Bank BTN", "Bank Syariah Indonesia (BSI)"
];

export function getGeneralDefaultState() {
    return {
        ui: { 
            activeTab: 'info', 
            themeColor: '#2563EB', 
            isMobileSidebarOpen: false,
            sidebarCollapsed: false, // NEW
        },
        // ... (rest of the state remains the same)
        company: { name: 'MAWMAW\nINTERIOR', address: 'Jagakarsa, \nJakarta Selatan', logo: '', },
        client: { name: 'Nama Perusahaan/Perorangan', address: 'Alamat, Kota', phone: '+62 812 3456 7890', },
        invoice: { title: 'Invoice', number: '#12345678910', date: '2025-08-01', dueDate: '2025-08-15', },
        items: [
            { id: generateUUID(), groupName: 'Floor', details: [
                    { id: generateUUID(), description: 'Floor Plan', qty: 21, unit: 'm²', price: 450000 },
                    { id: generateUUID(), description: 'Floor Profiling & Detailing', qty: 21, unit: 'm²', price: 100000 },
                ]
            },
            { id: generateUUID(), groupName: 'Furniture', details: [
                    { id: generateUUID(), description: 'Meja I (1500 x 900 x 800)', qty: 1, unit: 'pcs', price: 8000000 },
                    { id: generateUUID(), description: 'Meja II (1500 x 900 x 800)', qty: 1, unit: 'pcs', price: 8000000 },
                ]
            }
        ],
        paymentStages: [
            { id: generateUUID(), stage: 'Tahap 1', percentage: 50, description: 'Down Payment (DP)' },
            { id: generateUUID(), stage: 'Tahap 2', percentage: 40, description: '80% Tahap Pengerjaan' },
            { id: generateUUID(), stage: 'Tahap 3', percentage: 10, description: 'Pelunasan Setelah Pengerjaan' },
        ],
        summary: {
            currencyCode: 'IDR',
            discount: { label: 'Diskon (10%)', percentage: 10, },
            rounding: { label: 'Pembulatan', value: 0, },
            notes: `<ul><li>Kami mohon kepada pelanggan untuk melakukan pengecekan terlebih dahulu saat barang diterima atau setelah pengerjaan selesai.</li><li>Apabila terdapat ketidaksesuaian atau kondisi barang tidak sesuai standar, revisi dapat langsung dilakukan pada saat itu juga, dan barang yang kurang rapi akan kami bawa kembali untuk diperbaiki.</li><li>Di luar waktu penerimaan, kami memberikan kesempatan revisi maksimal satu kali, demi menjaga kenyamanan serta menghargai waktu yang telah diluangkan oleh pelanggan maupun tim kami.</li></ul><p>Terima kasih atas kepercayaan Anda.<br>FREE 1x REVISI SETELAH PENERIMAAN</p>`,
            terms: `1. Payment is due within 15 days.\n2. Please make payments to the specified bank account.\n3. Goods remain the property of MAWMAW INTERIOR until paid for in full.`
        },
        calculated: { subtotal: 0, discountAmount: 0, total: 0, },
        notification: null,
    };
}