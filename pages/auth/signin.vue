<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
// const { showToast } = useToast()
definePageMeta({
  title: 'Sign In',
  layout: false
  
})

const handleSubmit = (formData: any) => {
  console.log('Sign In form submitted:', formData)
  
  // Here you would typically handle authentication
  // For example with Supabase:
  // const { data, error } = await supabase.auth.signInWithPassword({
  //   email: formData.email,
  //   password: formData.password
  // })
  
  // Show success message
//   showToast({
//     title: 'Success',
//     message: 'You have successfully signed in!',
//     type: 'success'
//   })
  
  // Redirect to dashboard
  router.push('/')
}
</script>

<template>
  <AuthForm type="signin" @submit="handleSubmit" />
</template>