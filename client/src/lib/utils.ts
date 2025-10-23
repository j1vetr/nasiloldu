import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Capitalizes the first letter of each word using Turkish locale
 * @param text - The text to capitalize
 * @returns Capitalized text or "Bilinmiyor" if text is null/empty
 */
export function capitalize(text: string | null): string {
  if (!text || text.trim().length === 0) return "Bilinmiyor";
  const trimmed = text.trim();
  
  // Her kelimenin ilk harfini büyük yap
  return trimmed
    .split(' ')
    .map(word => {
      if (word.length === 0) return word;
      return word.charAt(0).toLocaleUpperCase('tr-TR') + word.slice(1).toLocaleLowerCase('tr-TR');
    })
    .join(' ');
}
