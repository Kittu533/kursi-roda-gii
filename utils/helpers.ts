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
  export const getPaginationRange = (
    currentPage: number, 
    totalPages: number, 
    maxVisiblePages: number = 5
  ): (number | string)[] => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    
    const pages: (number | string)[] = [1]
    
    const leftBound = Math.max(2, currentPage - 1)
    const rightBound = Math.min(totalPages - 1, currentPage + 1)
    
    if (leftBound > 2) {
      pages.push('...')
    }
    
    for (let i = leftBound; i <= rightBound; i++) {
      pages.push(i)
    }
    
    if (rightBound < totalPages - 1) {
      pages.push('...')
    }
    
    if (totalPages > 1) {
      pages.push(totalPages)
    }
    
    return pages
  }