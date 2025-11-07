import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formatiert ein UTC-Datum zur deutschen Zeitzone (Europe/Berlin)
 * @param {string|Date} dateString - ISO-Datum-String oder Date-Objekt
 * @param {Object} options - Formatierungsoptionen für toLocaleString
 * @returns {string} Formatiertes Datum in deutscher Zeitzone
 */
export function formatDateToGermanTime(dateString, options = {}) {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  
  // Standard-Optionen für deutsches Format
  const defaultOptions = {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  }
  
  return date.toLocaleString('de-DE', defaultOptions)
}

/**
 * Formatiert ein Datum kurz (nur Datum, keine Zeit)
 * @param {string|Date} dateString - ISO-Datum-String oder Date-Objekt
 * @returns {string} Formatiertes Datum
 */
export function formatDateShort(dateString) {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  
  return date.toLocaleDateString('de-DE', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
