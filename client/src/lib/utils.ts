import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Capitalizes the first letter of a string using Turkish locale
 * @param text - The text to capitalize
 * @returns Capitalized text or "Bilinmiyor" if text is null/empty
 */
export function capitalize(text: string | null): string {
  if (!text || text.trim().length === 0) return "Bilinmiyor";
  const trimmed = text.trim();
  return trimmed.charAt(0).toLocaleUpperCase('tr-TR') + trimmed.slice(1);
}
