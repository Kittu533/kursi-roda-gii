<template>
    <div class="min-h-screen flex flex-col justify-center py-12">
      <OtpVerification />
    </div>
  </template>
  
  <script setup>
  import OtpVerification from '@/components/auth/otp-verification.vue'

  definePageMeta({
  title: "Verify OTP | Kursi Roda",
  layout: "users/auth",
  meta: {
    auth: false,
  },
});
  </script>