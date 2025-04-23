// Generate a unique ID with prefix
export const generateId = (prefix: string, length: number = 4): string => {
  const randomNum = Math.floor(Math.random() * 10000)
  return `${prefix}${String(randomNum).padStart(length, '0')}`
}

// Deep clone an object
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
}

// Get pagination range
// export const getPaginationRange = (
//   currentPage: number,
//   totalPages: number,
//   maxVisiblePages: number = 5
// ): (number | string)[] => {
//   if (totalPages <= maxVisiblePages) {
//     return Array.from({ length: totalPages }, (_, i) => i + 1)
//   }

//   const pages: (number | string)[] = [1]

//   const leftBound = Math.max(2, currentPage - 1)
//   const rightBound = Math.min(totalPages - 1, currentPage + 1)

//   if (leftBound > 2) {
//     pages.push('...')
//   }

//   for (let i = leftBound; i <= rightBound; i++) {
//     pages.push(i)
//   }

//   if (rightBound < totalPages - 1) {
//     pages.push('...')
//   }

//   if (totalPages > 1) {
//     pages.push(totalPages)
//   }

//   return pages
// }

/**
 * Generate a pagination range with ellipsis for large page counts
 * @param currentPage Current active page
 * @param totalPages Total number of pages
 * @returns Array of page numbers and ellipsis strings
 */
export function getPaginationRange(currentPage: number, totalPages: number): (number | string)[] {
  const delta = 2; // Number of pages to show on each side of current page
  const range: (number | string)[] = [];

  // Always include first page
  range.push(1);

  // Calculate start and end of range
  const rangeStart = Math.max(2, currentPage - delta);
  const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

  // Add ellipsis if there's a gap after page 1
  if (rangeStart > 2) {
    range.push('...');
  }

  // Add pages in the middle range
  for (let i = rangeStart; i <= rangeEnd; i++) {
    range.push(i);
  }

  // Add ellipsis if there's a gap before the last page
  if (rangeEnd < totalPages - 1) {
    range.push('...');
  }

  // Always include last page if it's not the first page
  if (totalPages > 1) {
    range.push(totalPages);
  }

  return range;
}

/**
 * Format a date string to a localized format
 * @param dateString Date string to format
 * @param locale Locale to use for formatting (default: 'id-ID')
 * @returns Formatted date string
 */
export function formatDate(dateString: string, locale = 'id-ID'): string {
  try {
    return new Date(dateString).toLocaleDateString(locale);
  } catch (e) {
    return dateString;
  }
}

/**
 * Format a number as currency
 * @param value Number to format
 * @param locale Locale to use for formatting (default: 'id-ID')
 * @param currency Currency code (default: 'IDR')
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, locale = 'id-ID', currency = 'IDR'): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(value);
  } catch (e) {
    return String(value);
  }
}