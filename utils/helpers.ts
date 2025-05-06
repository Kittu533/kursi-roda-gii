import type { TableItem, TableItemValue } from "../types/data-table"
import { statusClass } from "../types/data-table"

/**
 * Get the value of an item by key, supporting nested properties
 */
export function getItemValue(item: TableItem, key: string): TableItemValue {
  if (key.includes(".")) {
    return key.split(".").reduce((obj: unknown, k: string) => {
      if (typeof obj === "object" && obj !== null && k in obj) {
        return (obj as Record<string, unknown>)[k]
      }
      return undefined
    }, item) as TableItemValue
  }

  return item[key]
}

/**
 * Format a value based on the specified format
 */
export function formatValue(value: TableItemValue, format?: string): string {
  if (value === undefined || value === null) return ""

  if (format === "date" && value) {
    try {
      return new Date(String(value)).toLocaleDateString("id-ID")
    } catch (e) {
      return String(value)
    }
  }

  if (format === "currency" && value) {
    try {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(Number(value))
    } catch (e) {
      return String(value)
    }
  }

  if (format === "phone" && value) {
    // Format phone number: +628xxx to +62 8xxx
    return String(value).replace(/(\+\d{2})(\d+)/, "$1 $2")
  }

  return String(value)
}

/**
 * Get the CSS class for a status value
 */
export function getStatusClass(status: TableItemValue): string {
  if (!status) {
    return "px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800"
  }

  const statusStr = String(status).toLowerCase()

  const classInfo = statusClass[statusStr]
  if (classInfo) {
    return `px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${classInfo.bg} ${classInfo.text}`
  }

  // fallback default
  return "px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800"
}
export function getPaginationRange(current: number, total: number): (number | string)[] {
  const delta = 2
  const range = []
  const rangeWithDots = []
  let l: number

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i)
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(i)
    l = i
  }

  return rangeWithDots
}

/**
 * Calculate the row number based on pagination
 */
export function calculateRowNumber(
  index: number,
  currentPage: number,
  itemsPerPage: number,
  hasPagination: boolean,
): number {
  if (!hasPagination) {
    return index + 1
  }

  return (currentPage - 1) * itemsPerPage + index + 1
}
