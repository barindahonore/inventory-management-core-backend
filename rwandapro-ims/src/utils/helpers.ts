import { DateTime } from "luxon";
import { env } from "../config/env";

// RWF currency formatting (1,000 FRW)
export const formatRWF = (amount: number) => {
  return new Intl.NumberFormat("rw-RW", {
    style: "currency",
    currency: "RWF",
    minimumFractionDigits: 0
  }).format(amount);
};

// Generate unique transaction ID (e.g., RWPRO-20231001-ABC123)
export const generateTransactionId = (prefix = "RWPRO") => {
  const date = DateTime.now().toFormat("yyyyMMdd");
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${date}-${random}`;
};

// Kigali timezone formatting
export const kigaliTime = (date?: Date) => {
  return DateTime.fromJSDate(date || new Date())
    .setZone("Africa/Kigali")
    .toFormat("yyyy-MM-dd HH:mm:ss");
};

// Redact sensitive fields from objects
export const redactSensitiveFields = <T extends Record<string, any>>(
  obj: T,
  fields: string[] = ["password", "token", "jwt"]
): T => {
  const redacted = { ...obj };
  fields.forEach((field) => {
    if (redacted[field]) redacted[field] = "**REDACTED**";
  });
  return redacted;
};

// Generate pagination metadata
export const paginationMeta = (
  totalItems: number,
  page: number,
  pageSize: number
) => {
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
