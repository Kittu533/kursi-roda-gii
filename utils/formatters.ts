// Format status with capitalized first letter
export const formatStatus = (status: string): string => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }
  
  // Get CSS class for status badge
  export const getStatusClass = (status: string): string => {
    const statusClasses: Record<string, string> = {
      menunggu: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
      aktif: 'bg-green-100 text-green-800 hover:bg-green-100',
      dibatalkan: 'bg-red-100 text-red-800 hover:bg-red-100',
      nonaktif: 'bg-gray-100 text-gray-800 hover:bg-gray-100'
    }
    
    return statusClasses[status] || ''
  }
  
  // Format gender
  export const formatGender = (gender: string): string => {
    return gender === 'laki-laki' ? 'Laki-laki' : 'Perempuan'
  }
  
  // Format date to locale string
  export const formatDate = (dateString: string): string => {
    // Assuming dateString is in format DD/MM/YYYY
    if (!dateString) return ''
    
    const [day, month, year] = dateString.split('/')
    const date = new Date(`${year}-${month}-${day}`)
    
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }