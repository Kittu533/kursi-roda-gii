<template>
  <div class="flex flex-col items-center w-full max-w-md mx-auto px-4">
    <h1 class="text-3xl font-bold mb-4">Verifikasi OTP</h1>
    
    <div class="text-orange-500 font-medium mb-8">{{ formatTime }}</div>
    
    <div class="w-full space-y-6">
      <div class="grid grid-cols-6 gap-2">
        <input
          v-for="(digit, index) in otpDigits"
          :key="index"
          v-model="otpDigits[index]"
          type="text"
          maxlength="1"
          class="w-full aspect-square text-center text-xl font-medium border border-gray-300 rounded-md outline-none"
          :class="{'border-red-500': error}"
          @input="onDigitInput(index)"
          @keydown="onKeyDown($event, index)"
          ref="inputRefs"
        />
      </div>
      
      <p v-if="error" class="text-sm text-red-500">
        {{ error }}
      </p>
      
      <div class="text-center">
        <p class="text-sm">
          Tidak mendapatkan OTP? 
          <button @click="handleResendOtp" class="text-orange-500 font-medium">Kirim Ulang</button>
        </p>
      </div>
      
      <button 
        @click="handleVerifyOtp"
        :disabled="!isOtpComplete || isLoading"
        class="w-full py-3 bg-orange-500 text-white rounded-md font-medium transition-colors"
        :class="{'opacity-70': !isOtpComplete || isLoading}"
      >
        {{ isLoading ? 'Loading...' : 'Verifikasi' }}
      </button>
    </div>
    
    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-sm mx-4">
        <div class="flex flex-col items-center text-center">
          <div class="w-16 h-16 rounded-full border-2 border-orange-500 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          
          <h2 class="text-xl font-bold mb-2">Verifikasi berhasil!</h2>
          <p class="text-gray-600 mb-6">Anda kini dapat mengakses semua fitur aplikasi wheel care.</p>
          
          <button 
            @click="goToHome"
            class="w-full py-3 bg-orange-500 text-white rounded-md font-medium"
          >
            Masuk
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/users/use-auth'

const router = useRouter()
const { verifyOtp, resendOtp, isLoading, error: authError, otpSession } = useAuth()

const otpDigits = ref(['', '', '', '', '', ''])
const inputRefs = ref<HTMLInputElement[]>([])
const error = ref('')
const showSuccessModal = ref(false)

// Timer
const timeLeft = ref(180) // 3 minutes in seconds
const timerInterval = ref<number | null>(null)

const formatTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60
  return `${minutes.toString().padStart(2, '0')}.${seconds.toString().padStart(2, '0')}`
})

const isOtpComplete = computed(() => {
  return otpDigits.value.every(digit => digit !== '')
})

const startTimer = () => {
  clearInterval(timerInterval.value as number)
  
  timerInterval.value = window.setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      clearInterval(timerInterval.value as number)
      // Handle OTP expiration
      error.value = 'Kode OTP telah kedaluwarsa. Silakan kirim ulang.'
    }
  }, 1000)
}

onMounted(() => {
  startTimer()
  
  // Focus first input
  nextTick(() => {
    if (inputRefs.value[0]) {
      inputRefs.value[0].focus()
    }
  })
  
  // Check if there's an active OTP session
  if (!otpSession.value) {
    router.push('/auth/login')
  }
})

onBeforeUnmount(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
})

const onDigitInput = (index: number) => {
  // Ensure only one digit
  otpDigits.value[index] = otpDigits.value[index].slice(0, 1)
  
  // Auto-focus next input
  if (otpDigits.value[index] && index < 5 && inputRefs.value[index + 1]) {
    inputRefs.value[index + 1].focus()
  }
  
  error.value = ''
}

const onKeyDown = (event: KeyboardEvent, index: number) => {
  // Handle backspace
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    otpDigits.value[index - 1] = ''
    inputRefs.value[index - 1].focus()
  }
}

const handleResendOtp = async () => {
  error.value = ''
  const success = await resendOtp()
  
  if (success) {
    // Reset timer
    timeLeft.value = 180
    startTimer()
    
    // Clear current OTP
    otpDigits.value = ['', '', '', '', '', '']
    
    // Focus first input
    nextTick(() => {
      if (inputRefs.value[0]) {
        inputRefs.value[0].focus()
      }
    })
  } else {
    error.value = authError.value || 'Failed to resend OTP'
  }
}

const handleVerifyOtp = async () => {
  if (!isOtpComplete.value) return
  
  error.value = ''
  const otp = otpDigits.value.join('')
  const success = await verifyOtp(otp)
  
  if (success) {
    showSuccessModal.value = true
  } else {
    error.value = authError.value || 'Invalid OTP code'
  }
}

const goToHome = () => {
  showSuccessModal.value = false
  router.push('/')
}
</script>