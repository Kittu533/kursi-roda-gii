<script setup lang="ts">
import { useAuthForm } from '../../composables/use-auth-form';
import { useRouter } from 'vue-router'
const props = defineProps<{ type: 'signin' | 'signup' }>()
const emit = defineEmits(['submit'])
const router = useRouter()

const {
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
} = useAuthForm(props.type)

const handleSubmit = async () => {
  if (!validateForm()) return
  loading.value = true
  try {
    emit('submit', formData.value)
    await new Promise((r) => setTimeout(r, 1000))
  } finally {
    loading.value = false
  }
}

const navigateToToggle = () => {
  router.push(toggleRoute.value)
}
</script>


<template>
  <div
    class="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle class="text-2xl font-bold text-center">
          {{ title }}
        </CardTitle>
        <CardDescription class="text-center">{{ description }}</CardDescription>
      </CardHeader>

      <CardContent>
        <Alert v-if="formError" variant="destructive" class="mb-4">
          <AlertCircle class="h-4 w-4" />
          <AlertDescription>{{ formError }}</AlertDescription>
        </Alert>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Email Field -->
          <div>
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="name@example.com"
              :class="{ 'border-red-500': errors.email }"
            />
            <p v-if="errors.email" class="text-sm text-red-500 mt-1">
              {{ errors.email }}
            </p>
          </div>

          <!-- Full Name Field (Sign Up only) -->
          <div v-if="!isSignIn">
            <Label for="fullName">Full Name</Label>
            <Input
              id="fullName"
              v-model="formData.fullName"
              type="text"
              placeholder="John Doe"
              :class="{ 'border-red-500': errors.fullName }"
            />
            <p v-if="errors.fullName" class="text-sm text-red-500 mt-1">
              {{ errors.fullName }}
            </p>
          </div>

          <!-- Password Field -->
          <div>
            <Label for="password">Password</Label>
            <Input
              id="password"
              v-model="formData.password"
              type="password"
              placeholder="********"
              :class="{ 'border-red-500': errors.password }"
            />
            <p v-if="errors.password" class="text-sm text-red-500 mt-1">
              {{ errors.password }}
            </p>
          </div>

          <!-- Confirm Password Field (Sign Up only) -->
          <div v-if="!isSignIn">
            <Label for="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              v-model="formData.confirmPassword"
              type="password"
              placeholder="********"
              :class="{ 'border-red-500': errors.confirmPassword }"
            />
            <p
              v-if="errors.confirmPassword"
              class="text-sm text-red-500 mt-1"
            >
              {{ errors.confirmPassword }}
            </p>
          </div>

          <!-- Remember Me & Forgot Password (Sign In only) -->
          <div v-if="isSignIn" class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                v-model:checked="formData.rememberMe"
              />
              <Label for="rememberMe" class="text-sm">Remember me</Label>
            </div>
            <Button variant="link" class="px-0">Forgot password?</Button>
          </div>

          <!-- Submit Button -->
          <Button type="submit" class="w-full" :disabled="loading">
            <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
            {{ submitText }}
          </Button>
        </form>
      </CardContent>

      <CardFooter>
        <div class="w-full text-center">
          <p class="text-sm text-gray-600">
            {{ toggleText }}
            <Button variant="link" class="px-1 py-0" @click="navigateToToggle">
              {{ toggleAction }}
            </Button>
          </p>
        </div>
      </CardFooter>
    </Card>
  </div>
</template>
