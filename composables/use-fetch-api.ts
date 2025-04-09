import { ref } from 'vue'
import type { ApiResponse } from '~/types/common'

export function useApiClient() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  const request = async <T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> => {
    isLoading.value = true
    error.value = null
    
    try {
      // In a real app, this would be a fetch call
      // const response = await fetch(url, {
      //   headers: {
      //     'Content-Type': 'application/json',
      //     ...options.headers
      //   },
      //   ...options
      // })
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock response
      const mockResponse: ApiResponse<T> = {
        data: {} as T,
        success: true
      }
      
      return mockResponse
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'An unknown error occurred'
      return {
        data: {} as T,
        success: false,
        message: error.value
      }
    } finally {
      isLoading.value = false
    }
  }
  
  return {
    isLoading,
    error,
    get: <T>(url: string) => request<T>(url, { method: 'GET' }),
    post: <T>(url: string, data: any) => request<T>(url, { 
      method: 'POST',
      body: JSON.stringify(data)
    }),
    put: <T>(url: string, data: any) => request<T>(url, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: <T>(url: string) => request<T>(url, { method: 'DELETE' })
  }
}