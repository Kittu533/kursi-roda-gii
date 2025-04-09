// composables/useAuthForm.ts
import { ref, computed } from 'vue'

export const useAuthForm = (type: 'signin' | 'signup') => {
  const formData = ref({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: '',
    rememberMe: false,
  })

  const errors = ref<Record<string, string>>({})
  const formError = ref<string | null>(null)
  const loading = ref(false)

  const isSignIn = computed(() => type === 'signin')

  const title = computed(() => (isSignIn.value ? 'Sign In' : 'Create an Account'))
  const description = computed(() =>
    isSignIn.value
      ? 'Enter your credentials to access your account'
      : 'Fill in the form below to create your account'
  )
  const submitText = computed(() => (isSignIn.value ? 'Sign In' : 'Sign Up'))
  const toggleText = computed(() =>
    isSignIn.value ? "Don't have an account?" : 'Already have an account?'
  )
  const toggleAction = computed(() => (isSignIn.value ? 'Sign Up' : 'Sign In'))
  const toggleRoute = computed(() => (isSignIn.value ? '/auth/signup' : '/auth/signin'))

  const validateForm = () => {
    errors.value = {}
    formError.value = null

    if (!formData.value.email) {
      errors.value.email = 'Email is required'
    } else if (!/^\S+@\S+\.\S+$/.test(formData.value.email)) {
      errors.value.email = 'Please enter a valid email'
    }

    if (!formData.value.password) {
      errors.value.password = 'Password is required'
    } else if (formData.value.password.length < 6) {
      errors.value.password = 'Password must be at least 6 characters'
    }

    if (!isSignIn.value) {
      if (!formData.value.fullName) {
        errors.value.fullName = 'Full name is required'
      }
      if (!formData.value.confirmPassword) {
        errors.value.confirmPassword = 'Please confirm your password'
      } else if (formData.value.password !== formData.value.confirmPassword) {
        errors.value.confirmPassword = 'Passwords do not match'
      }
    }

    return Object.keys(errors.value).length === 0
  }

  return {
    formData,
    errors,
    formError,
    loading,
    isSignIn,
    title,
    description,
    submitText,
    toggleText,
    toggleAction,
    toggleRoute,
    validateForm,
  }
}
