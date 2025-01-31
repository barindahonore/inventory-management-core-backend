"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationMeta = exports.redactSensitiveFields = exports.kigaliTime = exports.generateTransactionId = exports.formatRWF = void 0;
const luxon_1 = require("luxon");
// RWF currency formatting (1,000 FRW)
const formatRWF = (amount) => {
    return new Intl.NumberFormat("rw-RW", {
        style: "currency",
        currency: "RWF",
        minimumFractionDigits: 0
    }).format(amount);
};
exports.formatRWF = formatRWF;
// Generate unique transaction ID (e.g., RWPRO-20231001-ABC123)
const generateTransactionId = (prefix = "RWPRO") => {
    const date = luxon_1.DateTime.now().toFormat("yyyyMMdd");
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${date}-${random}`;
};
exports.generateTransactionId = generateTransactionId;
// Kigali timezone formatting
const kigaliTime = (date) => {
    return luxon_1.DateTime.fromJSDate(date || new Date())
        .setZone("Africa/Kigali")
        .toFormat("yyyy-MM-dd HH:mm:ss");
};
exports.kigaliTime = kigaliTime;
// Redact sensitive fields from objects
const redactSensitiveFields = (obj, fields = ["password", "token", "jwt"]) => {
    const redacted = { ...obj };
    fields.forEach((field) => {
        if (redacted[field])
            redacted[field] = "**REDACTED**";
    });
    return redacted;
};
exports.redactSensitiveFields = redactSensitiveFields;
// Generate pagination metadata
const paginationMeta = (totalItems, page, pageSize) => {
    const totalPages = Math.ceil(totalItems / pageSize);
    return {
        page,
        pageSize,
        totalItems,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
    };
};
exports.paginationMeta = paginationMeta;
