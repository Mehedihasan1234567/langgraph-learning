import { format, formatDistanceToNow } from "date-fns";
import { bn } from "date-fns/locale";

/**
 * Format a date in Bengali locale
 * @param date - Date object or timestamp
 * @param formatStr - Format string (default: "PPpp" for full date and time)
 * @returns Formatted date string in Bengali
 */
export function formatDateBengali(
  date: Date | number,
  formatStr: string = "PPpp"
): string {
  return format(date, formatStr, { locale: bn });
}

/**
 * Format a date as relative time in Bengali (e.g., "২ মিনিট আগে")
 * @param date - Date object or timestamp
 * @returns Relative time string in Bengali
 */
export function formatRelativeTimeBengali(date: Date | number): string {
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: bn,
  });
}

/**
 * Format time in Bengali (e.g., "১০:৩০ AM")
 * @param date - Date object or timestamp
 * @returns Time string in Bengali
 */
export function formatTimeBengali(date: Date | number): string {
  return format(date, "h:mm a", { locale: bn });
}

/**
 * Format date and time in Bengali (e.g., "৩ জানুয়ারি, ২০২৪ ১০:৩০ AM")
 * @param date - Date object or timestamp
 * @returns Date and time string in Bengali
 */
export function formatDateTimeBengali(date: Date | number): string {
  return format(date, "d MMMM, yyyy h:mm a", { locale: bn });
}

/**
 * Format short date in Bengali (e.g., "৩ জানুয়ারি, ২০২৪")
 * @param date - Date object or timestamp
 * @returns Short date string in Bengali
 */
export function formatShortDateBengali(date: Date | number): string {
  return format(date, "d MMMM, yyyy", { locale: bn });
}

