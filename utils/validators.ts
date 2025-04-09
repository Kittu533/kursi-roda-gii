// Email validation
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  // Phone number validation
  export const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^\+?[0-9]{10,15}$/
    return phoneRegex.test(phone)
  }
  
  // Required field validation
  export const isRequired = (value: string | number | boolean | object | null | undefined): boolean => {
    if (typeof value === 'string') {
      return value.trim().length > 0
    }
    return value !== null && value !== undefined
  }