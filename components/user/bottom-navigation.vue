<template>
  <div class="fixed bottom-0 left-0 right-0 flex justify-center z-10">
    <div class="bg-white border-t border-gray-200 flex justify-around items-center h-12 w-full max-w-[425px]">
      <NuxtLink
        to="/"
        class="flex flex-col items-center justify-center w-1/3 h-full"
        :class="{ 'text-orange-500': currentRoute === '/' }"
      >
        <span class="text-xs">Beranda</span>
      </NuxtLink>

      <NuxtLink
        to="/transaksi"
        class="flex flex-col items-center justify-center w-1/3 h-full"
        :class="{ 'text-orange-500': currentRoute === '/transaksi' }"
      >
        <span class="text-xs">Transaksi</span>
      </NuxtLink>

      <NuxtLink
        to="/akun"
        class="flex flex-col items-center justify-center w-1/3 h-full"
        :class="{ 'text-orange-500': currentRoute === '/akun' }"
      >
        <span class="text-xs">Akun</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const currentRoute = computed(() => route.path);
</script>