import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine Tailwind class names safely with conditional logic.
 * Example:
 * cn("p-2", isActive && "bg-green-500")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convert a percentage (0–1 or 0–100) into a formatted string.
 * Example: formatPercent(0.42) → "42.00%"
 */
export function formatPercent(value: number, decimals: number = 2): string {
  if (value < 0) return "0%";
  if (value > 1 && value <= 100) return `${value.toFixed(decimals)}%`;
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Delay helper for animations or async effects.
 * Example: await sleep(500)
 */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
