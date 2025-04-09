<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuth } from '@/composables/use-auth'
import { EyeIcon, EyeOffIcon } from 'lucide-vue-next'
import { definePageMeta } from '#imports'

definePageMeta({
  title: 'Sign In',
  layout: false
})

const { signIn, signInWithGoogle, isLoading, error: authError } = useAuth()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const formError = ref<string | null>(null)
const formSubmitted = ref(false)
const formSuccess = ref(false)

// Form validation
const emailError = computed(() => {
  if (!formSubmitted.value) return null
  if (!email.value) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) return 'Please enter a valid email'
  return null
})

const passwordError = computed(() => {
  if (!formSubmitted.value) return null
  if (!password.value) return 'Password is required'
  return null
})

const isFormValid = computed(() => {
  return !emailError.value && !passwordError.value && email.value && password.value
})

const handleSubmit = async () => {
  formSubmitted.value = true
  formError.value = null
  
  if (!isFormValid.value) {
    return
  }
  
  const result = await signIn({
    email: email.value,
    password: password.value,
    rememberMe: rememberMe.value
  })
  
  if (result.success) {
    formSuccess.value = true
    // Success is handled by the router redirect in the useAuth composable
  } else {
    formError.value = result.error || 'Failed to sign in'
  }
}

const handleGoogleSignIn = async () => {
  formError.value = null
  
  const result = await signInWithGoogle()
  
  if (!result.success) {
    formError.value = result.error || 'Failed to sign in with Google'
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold">Masuk</h1>
      </div>
      
      <!-- Form error message -->
      <div v-if="formError" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
        {{ formError }}
      </div>
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Email Field -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            autocomplete="email"
            :class="[
              'appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500',
              emailError ? 'border-red-300' : 'border-gray-300'
            ]"
            placeholder="contoh@gmail.com"
          />
          <p v-if="emailError" class="mt-1 text-sm text-red-600">{{ emailError }}</p>
        </div>
        
        <!-- Password Field -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              :class="[
                'appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 pr-10',
                passwordError ? 'border-red-300' : 'border-gray-300'
              ]"
            />
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
            >
              <EyeIcon v-if="!showPassword" class="h-5 w-5" />
              <EyeOffIcon v-else class="h-5 w-5" />
            </button>
          </div>
          <p v-if="passwordError" class="mt-1 text-sm text-red-600">{{ passwordError }}</p>
        </div>
        
        <!-- Remember Me Checkbox -->
        <div class="flex items-center">
          <input
            id="remember-me"
            v-model="rememberMe"
            type="checkbox"
            class="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
          />
          <label for="remember-me" class="ml-2 block text-sm text-gray-700">
            Ingatkan saya
          </label>
        </div>
        
        <!-- Sign In Button -->
        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading">Loading...</span>
            <span v-else>Masuk</span>
          </button>
        </div>
      </form>
      
      <!-- Divider -->
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Atau</span>
          </div>
        </div>
      </div>
      
      <!-- Google Sign In Button -->
      <div class="mt-6">
        <button
          type="button"
          @click="handleGoogleSignIn"
          :disabled="isLoading"
          class="w-full flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Masuk dengan Google
        </button>
      </div>
    </div>
  </div>
</template>