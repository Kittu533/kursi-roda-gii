<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// Initialize auth on app load
import { onMounted } from 'vue'
import { useAuth } from '@/composables/users/use-auth'

// Only initialize auth on client-side
onMounted(() => {
  const { user } = useAuth()
  // Any client-side only initialization can go here
  console.log('User:', user.value)
})
</script>

<style>
/* Global styles jika diperlukan */
</style>
