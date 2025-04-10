import { ref } from 'vue'

interface FetchOptions extends RequestInit {
    baseUrl?: string
    params?: Record<string, string>
    body?: any
}

interface ApiResponse<T = any> {
    data: T | null
    error: string | null
    status: number
}

export function useFetchApi() {
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    // Safely check if we're in browser environment
    const isBrowser = () => typeof window !== 'undefined'

    // Get API token from localStorage
    const getToken = (): string | null => {
        if (!isBrowser()) return null
        return localStorage.getItem('auth_token')
    }

    // Main fetch function
    const fetchApi = async <T = any>(
        endpoint: string,
        options: FetchOptions = {}
    ): Promise<T> => {
        const {
            baseUrl = 'https://api.example.com/v1', // Replace with your actual API base URL
            params = {},
            body,
            headers = {},
            method = 'GET',
            ...restOptions
        } = options

        isLoading.value = true
        error.value = null

        try {
            // Build URL with query parameters
            const url = new URL(endpoint, baseUrl)
            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.append(key, value)
            })

            // Prepare headers
            const token = getToken()
            const defaultHeaders: HeadersInit = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                ...headers
            }

            // Prepare request options
            const fetchOptions: RequestInit = {
                method,
                headers: defaultHeaders,
                ...restOptions
            }

            // Add body if present
            if (body) {
                fetchOptions.body = JSON.stringify(body)
            }

            // For demo purposes, simulate API response
            // In a real app, this would be a real fetch call
            await new Promise(resolve => setTimeout(resolve, 800)) // Simulate network delay

            // Simulate API response based on endpoint
            let mockResponse: ApiResponse<T>

            if (endpoint.includes('/auth/request-otp') || endpoint.includes('/auth/register')) {
                mockResponse = {
                    data: {
                        sessionId: 'session_' + Math.random().toString(36).substring(2, 15),
                        phoneNumber: body?.phoneNumber || '+628123456789',
                        expiresAt: Date.now() + 180000,
                        attempts: 0
                    } as unknown as T,
                    error: null,
                    status: 200
                }
            } else if (endpoint.includes('/auth/verify-otp')) {
                if (body?.otp === '123456') {
                    mockResponse = {
                        data: {
                            user: {
                                id: 'user_' + Math.random().toString(36).substring(2, 15),
                                fullName: 'Demo User',
                                phoneNumber: '+628123456789',
                                email: 'demo@example.com'
                            },
                            token: 'token_' + Math.random().toString(36).substring(2, 15)
                        } as unknown as T,
                        error: null,
                        status: 200
                    }
                } else {
                    throw new Error('Invalid OTP code')
                }
            } else if (endpoint.includes('/auth/resend-otp')) {
                mockResponse = {
                    data: {
                        sessionId: body?.sessionId || 'session_' + Math.random().toString(36).substring(2, 15),
                        phoneNumber: '+628123456789',
                        expiresAt: Date.now() + 180000,
                        attempts: 0
                    } as unknown as T,
                    error: null,
                    status: 200
                }
            } else if (endpoint.includes('/auth/logout')) {
                mockResponse = {
                    data: { success: true } as unknown as T,
                    error: null,
                    status: 200
                }
            } else {
                // Default mock response
                mockResponse = {
                    data: null,
                    error: 'Endpoint not implemented in mock',
                    status: 404
                }
            }

            // Check for errors in mock response
            if (mockResponse.error) {
                throw new Error(mockResponse.error)
            }

            return mockResponse.data as T

            /* In a real implementation, you would use actual fetch:
            
            const response = await fetch(url.toString(), fetchOptions)
            
            // Handle HTTP errors
            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}))
              throw new Error(errorData.message || `API error: ${response.status}`)
            }
            
            // Parse JSON response
            const data = await response.json()
            return data
            */

        } catch (err: any) {
            error.value = err.message || 'An error occurred while fetching data'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    return {
        fetchApi,
        isLoading,
        error
    }
}

export function useAuth() {
    const user = ref(null)
    const isAuthenticated = ref(false)

    // Function to log the user in
    const login = async (token: string, userData: object) => {
        user.value = userData
        isAuthenticated.value = true
        if (typeof window !== 'undefined') {  // Check if running in the browser
            localStorage.setItem('auth_token', token)
        }
    }

    // Function to log the user out
    const logout = () => {
        user.value = null
        isAuthenticated.value = false
        if (typeof window !== 'undefined') {  // Check if running in the browser
            localStorage.removeItem('auth_token')
        }
    }

    // Check if there's a valid token in localStorage
    const checkAuth = () => {
        if (typeof window !== 'undefined') {  // Check if running in the browser
            const token = localStorage.getItem('auth_token')
            if (token) {
                isAuthenticated.value = true
                // You might want to fetch user data based on the token here
                user.value = { name: 'Demo User' } // Mocked user data for demo purposes
            }
        }
    }

    // Initialize auth on app load
    checkAuth()

    return {
        user,
        isAuthenticated,
        login,
        logout
    }
}
