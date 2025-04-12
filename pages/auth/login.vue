<template>
  <div class="min-h-screen flex flex-col justify-center py-12">
    <LoginForm />
  </div>
</template>

<script setup>
import LoginForm from "@/components/auth/login-form.vue";
definePageMeta({
  title: "Login",
  layout: "user/auth",
  meta: {
    auth: false,
  },
});
</script>
