<template>
    <div class="container">
        <NuxtLink to="/auth/login" class="login-link">
            Go to Login
        </NuxtLink>
    </div>
</template>

<script setup>
// You can also use programmatic navigation if needed
// const router = useRouter()
// onMounted(() => {
//   router.push('/auth/login')
// })
definePageMeta({
    title: 'User Home',
    layout: 'users',
  });
</script>

<style scoped>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.login-link {
    padding: 12px 24px;
    background-color: #4CAF50;
    color: white;
    text-decoration: none;
    border-radius: 4px;
}

.login-link:hover {
    background-color: #45a049;
}
</style>