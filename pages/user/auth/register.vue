<template>
    <div class="min-h-screen flex flex-col justify-center py-12">
      <RegisterForm />
    </div>
  </template>
  
  <script setup>
  import RegisterForm from '@/components/auth/register-form.vue'
  definePageMeta({
  title: "Register | Kursi Roda",
  layout: "users/auth",
  meta: {
    auth: false,
  },
});
  </script>