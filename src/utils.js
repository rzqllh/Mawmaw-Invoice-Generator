export function generateUUID() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );
}

export function formatCurrencyParts(amount, currencyCode = 'IDR') {
    if (typeof amount !== 'number' || isNaN(amount)) {
        amount = 0;
    }
    
    const locale = currencyCode === 'IDR' ? 'id-ID' : 'en-US';

    try {
        const formatter = new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currencyCode,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });

        const parts = formatter.formatToParts(amount);
        const symbol = parts.find(part => part.type === 'currency')?.value || 'Rp';
        const value = parts.filter(part => part.type === 'integer' || part.type === 'group' || part.type === 'decimal' || part.type === 'fraction').map(part => part.value).join('');
        
        return { symbol: symbol, value: value };
    } catch (e) {
        console.error("Currency formatting failed:", e);
        const symbol = currencyCode === 'IDR' ? 'Rp' : (currencyCode === 'USD' ? '$' : '€');
        return { symbol: symbol, value: amount.toLocaleString(locale) };
    }
}

function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

export function deepMerge(target, source) {
    const output = { ...target };
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key]) && key in target) {
                output[key] = deepMerge(target[key], source[key]);
            } else {
                output[key] = source[key];
            }
        });
    }
    return output;
}