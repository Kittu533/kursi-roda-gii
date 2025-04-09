<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
// const { showToast } = useToast()

definePageMeta({
  title: "Sign Up",
  layout: false,
});

const handleSubmit = (formData: any) => {
  console.log("Sign Up form submitted:", formData);

  // Show success message
  // showToast({
  //   title: 'Success',
  //   message: 'Your account has been created! Please check your email to verify your account.',
  //   type: 'success'
  // })

  // Redirect to sign in page
  router.push("/auth/signin");
};
</script>

<template>
  <AuthForm type="signup" @submit="handleSubmit" />
</template>
