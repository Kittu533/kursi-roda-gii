export function useMobile() {
    // Format phone number to E.164 format
    const formatPhoneNumber = (phoneNumber: string, countryCode: string = '+62'): string => {
      // Remove any non-digit characters
      let cleaned = phoneNumber.replace(/\D/g, '')
      
      // Remove leading zeros
      cleaned = cleaned.replace(/^0+/, '')
      
      // Remove country code if it's already included
      if (cleaned.startsWith(countryCode.replace('+', ''))) {
        cleaned = cleaned.substring(countryCode.length - 1)
      }
      
      // Add country code
      return `${countryCode}${cleaned}`
    }
    
    // Validate phone number
    const validatePhoneNumber = (phoneNumber: string): boolean => {
      // Basic validation - at least 10 digits after country code
      const cleaned = phoneNumber.replace(/\D/g, '')
      return cleaned.length >= 10
    }
    
    // Format phone number for display
    const formatPhoneForDisplay = (phoneNumber: string): string => {
      if (!phoneNumber) return ''
      
      // Assuming E.164 format (e.g., +628123456789)
      const match = phoneNumber.match(/^\+(\d{2})(\d{3})(\d{4})(\d{4})$/)
      
      if (match) {
        return `+${match[1]} ${match[2]}-${match[3]}-${match[4]}`
      }
      
      return phoneNumber
    }
    
    return {
      formatPhoneNumber,
      validatePhoneNumber,
      formatPhoneForDisplay
    }
  }