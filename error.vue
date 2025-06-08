<script setup lang="ts">
defineProps<{
    error: {
        statusCode: number,
        message: string,
        url?: string
    }
}>()
</script>

<template>
    <div class="min-h-screen flex flex-col justify-center items-center bg-white px-4"
        style="font-family: 'Poppins', sans-serif;">
        <!-- SVG Illustration -->
        <div class="mb-8 animate-bounce-slow">
            <svg width="160" height="160" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#FDBA74" />
                <path d="M9 10h.01M15 10h.01M9.5 16a3.5 3.5 0 0 1 5 0" stroke="#fff" stroke-width="2"
                    stroke-linecap="round" />
            </svg>
        </div>
        <h1 class="text-5xl md:text-6xl font-extrabold text-orange-500 text-center mb-2 drop-shadow">
            404
        </h1>
        <h2 class="text-2xl md:text-3xl font-bold text-orange-500 text-center mb-4">
            Halaman tidak ditemukan
        </h2>
        <p class="text-lg text-orange-500/70 text-center mb-8">
            {{ error.message || 'Maaf, halaman yang kamu cari tidak tersedia.' }}
        </p>
        <NuxtLink to="/"
            class="inline-block px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-semibold text-lg shadow-md transition-all">
            Kembali ke Beranda
        </NuxtLink>
    </div>
</template>

<style scoped>
@keyframes bounce-slow {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-20px);
    }
}

.animate-bounce-slow {
    animation: bounce-slow 2s infinite;
}
</style>
