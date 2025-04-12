import { ref } from 'vue'
import { useRouter } from 'vue-router'

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface SignInCredentials {
  email: string
  password: string
  rememberMe: boolean
}

interface AuthResponse {
  success: boolean
  error?: string
  user?: User
}

export function useAuth() {
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const router = useRouter()

  // Check if user is already logged in from localStorage
  const initAuth = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser)
      } catch (e) {
        localStorage.removeItem('user')
      }
    }
  }

  // Sign in with email and password
  const signIn = async (credentials: SignInCredentials): Promise<AuthResponse> => {
    isLoading.value = true
    error.value = null
    
    try {
      // This would be your actual API call
      // const response = await api.post('/auth/login', credentials)
      
      // Simulating API call for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For demo purposes, accept any non-empty email/password
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required')
      }
      
      // Simulate successful login
      const mockUser = {
        id: '1',
        email: credentials.email,
        name: 'Selamat Datang',
        role: 'Administrator'
      }
      
      // Store user in state and localStorage if rememberMe is checked
      user.value = mockUser
      if (credentials.rememberMe) {
        localStorage.setItem('user', JSON.stringify(mockUser))
      }
      
      // Redirect to dashboard
      router.push('/admin')
      
      return { success: true, user: mockUser }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to sign in'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  // Sign in with Google
  const signInWithGoogle = async (): Promise<AuthResponse> => {
    isLoading.value = true
    error.value = null
    
    try {
      // This would be your actual Google auth implementation
      // For example with Firebase:
      // const provider = new GoogleAuthProvider()
      // const result = await signInWithPopup(auth, provider)
      
      // Simulating API call for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simulate successful Google login
      const mockUser = {
        id: '2',
        email: 'google-user@example.com',
        name: 'Google User',
        role: 'User'
      }
      
      // Store user in state and localStorage
      user.value = mockUser
      localStorage.setItem('user', JSON.stringify(mockUser))
      
      // Redirect to dashboard
      router.push('/admin')
      
      return { success: true, user: mockUser }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to sign in with Google'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  // Sign out
  const signOut = () => {
    user.value = null
    localStorage.removeItem('user')
    router.push('/auth/signin')
  }

  return {
    user,
    isLoading,
    error,
    initAuth,
    signIn,
    signInWithGoogle,
    signOut
  }
}