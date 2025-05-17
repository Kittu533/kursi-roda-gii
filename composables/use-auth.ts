import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  const initAuth = () => {
    authStore.restore()
  }

  const signIn = async (credentials: { email: string; password: string; rememberMe?: boolean }) => {
    try {
      await authStore.login(credentials.email, credentials.password)

      if (credentials.rememberMe) {
        // already saved in store login action
      }

      router.push('/admin')
      return { success: true, user: authStore.user }
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Login gagal'
      }
    }
  }

  const signOut = () => {
    authStore.logout()
    router.push('/admin/auth/signin')
  }

  return {
    user: authStore.user,
    initAuth,
    signIn,
    signOut
  }
}
