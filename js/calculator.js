// === Hafizh Signature Code ===
// Author: Hafizh Rizqullah — Invoice Generator
// File: js/calculator.js
// Created: 2025-08-14 12:30:00

import { parseNum } from './utils.js';

/**
 * Calculates all financial totals for a given invoice state.
 * This is a pure function that takes invoice data and returns calculated values.
 * @param {object} data - The invoiceRinci state object.
 * @returns {object} An object containing all calculated values.
 */
export function calculate(data) {
    let subtotal = 0;
    const itemGroups = {}; // Stores header info and their calculated totals

    let currentHeaderKey = null;

    // First pass: Group items under headers and calculate their auto-totals
    data.items.forEach((item, index) => {
        if (item.type === 'header') {
            currentHeaderKey = `header-${index}`;
            itemGroups[currentHeaderKey] = {
                header: item,
                autoTotal: 0,
                displayTotal: 0,
            };
        } else if (item.type === 'item') {
            const itemTotal = parseNum(item.volume) * parseNum(item.price);
            if (currentHeaderKey && itemGroups[currentHeaderKey]) {
                itemGroups[currentHeaderKey].autoTotal += itemTotal;
            } else {
                // This handles items that are not under any header
                subtotal += itemTotal;
            }
        }
    });

    // Second pass: Determine the final total for each group and add to subtotal
    Object.values(itemGroups).forEach(group => {
        const manualTotal = parseNum(group.header.total);
        // Use manual total if provided, otherwise use the auto-calculated total
        group.displayTotal = manualTotal > 0 ? manualTotal : group.autoTotal;
        subtotal += group.displayTotal;
    });

    // Final calculations
    const discountValue = subtotal * (parseNum(data.summary.discountPct) / 100);
    const totalAfterDiscount = subtotal - discountValue;
    const rounding = parseNum(data.summary.rounding); // Parse the rounding value
    const finalTotal = totalAfterDiscount + rounding; // Use the parsed value

    return {
        subtotal,
        discountValue,
        totalAfterDiscount,
        rounding, // Return the parsed rounding value for the template
        finalTotal,
        itemGroups, // Pass this back for the renderer to use
    };
}