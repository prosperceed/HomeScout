import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency = "₦"): string {
  if (amount >= 1_000_000) {
    return `${currency}${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `${currency}${(amount / 1_000).toFixed(0)}k`;
  }
  return `${currency}${amount.toLocaleString()}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .trim();
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}

export function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

/**
 * Format a date string in a SSR-safe way.
 * Uses timeZone: "UTC" so server and client always produce identical output,
 * avoiding React hydration mismatches caused by locale/timezone differences.
 *
 * Example: formatDate("2026-11-12T00:00:00Z") → "12 Nov 2026"
 */
export function formatDate(
  isoDate: string | null | undefined,
  opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }
): string {
  if (!isoDate) return "—";
  return new Date(isoDate).toLocaleDateString("en-GB", {
    timeZone: "UTC",
    ...opts,
  });
}

/**
 * Short date — no year. e.g. "12 Nov"
 */
export function formatDateShort(isoDate: string | null | undefined): string {
  return formatDate(isoDate, { day: "numeric", month: "short", timeZone: "UTC" } as Intl.DateTimeFormatOptions);
}
